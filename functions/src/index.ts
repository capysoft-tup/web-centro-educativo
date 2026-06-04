import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { sendEmail } from './email';

// Inicializar la SDK de Admin de Firebase
admin.initializeApp();
const db = admin.firestore();

/**
 * Helper para verificar el ID Token del llamador y retornar sus Claims decodificados.
 */
async function verifyAuth(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No autorizado: Cabecera Authorization faltante o inválida.');
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (err) {
    throw new Error('No autorizado: Token de ID inválido.');
  }
}

/**
 * Genera un ID único para estudiante en el formato EST-YYYY-XXXXX
 */
async function generateUniqueStudentIdLogin(): Promise<string> {
  const year = new Date().getFullYear();
  let unique = false;
  let studentID = '';
  
  while (!unique) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 dígitos aleatorios
    studentID = `EST-${year}-${randomDigits}`;
    
    const snapshot = await db.collection('students')
      .where('studentID_login', '==', studentID)
      .limit(1)
      .get();
      
    if (snapshot.empty) {
      unique = true;
    }
  }
  
  return studentID;
}

/**
 * 1. cf_createParentAndStudents
 * Invocada por un user_admin para crear un padre y sus hijos.
 */
export const cf_createParentAndStudents = onRequest({ cors: true }, async (req, res) => {
  try {
    // Validar autorización
    const callerClaims = await verifyAuth(req);
    if (callerClaims.role !== 'user_admin') {
       res.status(403).send({ error: 'Permisos insuficientes: Requiere rol user_admin.' });
       return;
    }

    const { parentEmail, parentName, students } = req.body;
    if (!parentEmail || !students || !Array.isArray(students)) {
       res.status(400).send({ error: 'Faltan parámetros requeridos (parentEmail, students).' });
       return;
    }

    // Crear usuario del Padre en Auth
    const parentUser = await admin.auth().createUser({
      email: parentEmail,
      emailVerified: false,
    });

    // Establecer Custom Claim para el Padre
    await admin.auth().setCustomUserClaims(parentUser.uid, { role: 'Padre' });

    const studentDocIds: string[] = [];
    const createdStudentsInfo = [];

    // Procesar cada estudiante
    for (const student of students) {
      const studentID_login = await generateUniqueStudentIdLogin();
      const activationToken = crypto.randomBytes(32).toString('hex');
      const activationTokenExpires = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 Horas
      );

      const studentRef = await db.collection('students').add({
        studentID_login,
        parentId: parentUser.uid,
        emailPadre: parentEmail,
        hashedPassword: null,
        status: 'pendingParentActivation',
        activationToken,
        activationTokenExpires,
        nombre: student.nombre || '',
        dni: student.dni || '',
        fechaNacimiento: student.fechaNacimiento || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      studentDocIds.push(studentRef.id);
      createdStudentsInfo.push({
        id: studentRef.id,
        studentID_login,
        nombre: student.nombre
      });
    }

    // Guardar los datos del Padre en Firestore
    await db.collection('users').doc(parentUser.uid).set({
      role: 'Padre',
      email: parentEmail,
      nombre: parentName || '',
      emailInvalid: false,
      studentIds: studentDocIds,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Generar enlace de verificación de email para el Padre
    const redirectUrl = process.env.REDIRECT_URL || 'http://localhost:5173/auth-action';
    const actionCodeSettings = {
      url: redirectUrl,
      handleCodeInApp: true
    };
    
    let emailSentSuccessfully = true;
    let emailLink = '';
    try {
      emailLink = await admin.auth().generateEmailVerificationLink(parentEmail, actionCodeSettings);
      
      // Enviar email
      const htmlContent = `
        <h1>Bienvenido a Educar para Transformar</h1>
        <p>Hola ${parentName || 'Tutor'},</p>
        <p>Un administrador de la institución ha iniciado su registro. Para activar su cuenta de tutor y verificar su correo, haga clic en el siguiente enlace:</p>
        <p><a href="${emailLink}">Verificar y Activar Cuenta</a></p>
        <p>Este enlace expirará pronto. Una vez verificado, podrá ayudar a sus hijos a activar sus cuentas.</p>
      `;
      await sendEmail({
        to: parentEmail,
        subject: 'Activación de Cuenta de Tutor - Educar para Transformar',
        html: htmlContent
      });
    } catch (mailError) {
      console.error('Error al enviar email de activación al Padre:', mailError);
      emailSentSuccessfully = false;
      // Actualizar a emailInvalid: true
      await db.collection('users').doc(parentUser.uid).update({ emailInvalid: true });
    }

    res.status(201).send({
      parentUid: parentUser.uid,
      emailSentSuccessfully,
      emailLink: emailSentSuccessfully ? undefined : emailLink, // Retornar el link si falló el correo para que el admin pueda copiarlo
      students: createdStudentsInfo
    });
  } catch (error: any) {
    console.error('Error en cf_createParentAndStudents:', error);
    res.status(500).send({ error: error.message || 'Error interno del servidor.' });
  }
});

/**
 * 2. cf_resendActivationLink
 * Reenvía enlace de activación (de padre o de estudiante).
 */
export const cf_resendActivationLink = onRequest({ cors: true }, async (req, res) => {
  try {
    const callerClaims = await verifyAuth(req);
    const { targetType, targetId } = req.body;

    if (!targetType || !targetId) {
      res.status(400).send({ error: 'Faltan parámetros requeridos (targetType, targetId).' });
      return;
    }

    const redirectUrl = process.env.REDIRECT_URL || 'http://localhost:5173/auth-action';

    if (targetType === 'parent') {
      // Solo el propio padre o un user_admin puede reenviar la activación del padre
      if (callerClaims.role !== 'user_admin' && callerClaims.uid !== targetId) {
        res.status(403).send({ error: 'Permisos insuficientes.' });
        return;
      }

      const parentDoc = await db.collection('users').doc(targetId).get();
      if (!parentDoc.exists) {
        res.status(404).send({ error: 'Padre no encontrado.' });
        return;
      }

      const parentData = parentDoc.data();
      const parentEmail = parentData?.email;

      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true
      };

      const emailLink = await admin.auth().generateEmailVerificationLink(parentEmail, actionCodeSettings);

      const htmlContent = `
        <h1>Verificación de Correo - Educar para Transformar</h1>
        <p>Hola ${parentData?.nombre || 'Tutor'},</p>
        <p>Recibimos una solicitud para reenviar el enlace de verificación de su cuenta. Por favor, ingrese al siguiente enlace:</p>
        <p><a href="${emailLink}">Verificar Correo</a></p>
      `;

      await sendEmail({
        to: parentEmail,
        subject: 'Enlace de Verificación de Cuenta - Educar para Transformar',
        html: htmlContent
      });

      // Si estaba marcado como inválido, limpiarlo
      if (parentData?.emailInvalid) {
        await db.collection('users').doc(targetId).update({ emailInvalid: false });
      }

      res.status(200).send({ message: 'Enlace de verificación enviado con éxito al tutor.' });

    } else if (targetType === 'student') {
      const studentDoc = await db.collection('students').doc(targetId).get();
      if (!studentDoc.exists) {
        res.status(404).send({ error: 'Estudiante no encontrado.' });
        return;
      }

      const studentData = studentDoc.data();

      // Solo user_admin o el propio padre asociado pueden reenviar el token de este estudiante
      if (callerClaims.role !== 'user_admin' && callerClaims.uid !== studentData?.parentId) {
        res.status(403).send({ error: 'Permisos insuficientes.' });
        return;
      }

      const activationToken = crypto.randomBytes(32).toString('hex');
      const activationTokenExpires = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 48 * 60 * 60 * 1000)
      );

      await db.collection('students').doc(targetId).update({
        activationToken,
        activationTokenExpires
      });

      const customLink = `${redirectUrl}?mode=activateStudent&token=${activationToken}&studentId=${targetId}`;

      const htmlContent = `
        <h1>Activación de Cuenta de Estudiante</h1>
        <p>Hola,</p>
        <p>Se ha generado un nuevo enlace para activar la cuenta del estudiante <strong>${studentData?.nombre || ''}</strong> (Usuario: ${studentData?.studentID_login}).</p>
        <p>Haga clic en el siguiente enlace para establecer su contraseña:</p>
        <p><a href="${customLink}">Establecer Contraseña del Estudiante</a></p>
        <p>Este enlace es válido por 48 horas.</p>
      `;

      await sendEmail({
        to: studentData?.emailPadre,
        subject: `Enlace de Activación para ${studentData?.nombre || 'Estudiante'} - Educar para Transformar`,
        html: htmlContent
      });

      res.status(200).send({ message: 'Enlace de activación de estudiante enviado al correo del tutor.' });
    } else {
      res.status(400).send({ error: 'targetType inválido. Debe ser parent o student.' });
    }
  } catch (error: any) {
    console.error('Error en cf_resendActivationLink:', error);
    res.status(500).send({ error: error.message || 'Error interno.' });
  }
});

/**
 * 3. cf_updateParentEmailAndResend
 * Invocada por un administrador para corregir el correo electrónico de un padre y volver a enviar la activación.
 */
export const cf_updateParentEmailAndResend = onRequest({ cors: true }, async (req, res) => {
  try {
    const callerClaims = await verifyAuth(req);
    if (callerClaims.role !== 'user_admin') {
      res.status(403).send({ error: 'Permisos insuficientes: Requiere rol user_admin.' });
      return;
    }

    const { parentUid, newEmail } = req.body;
    if (!parentUid || !newEmail) {
      res.status(400).send({ error: 'Faltan parámetros requeridos (parentUid, newEmail).' });
      return;
    }

    // 1. Actualizar en Firebase Authentication
    await admin.auth().updateUser(parentUid, {
      email: newEmail,
      emailVerified: false
    });

    // 2. Actualizar en Firestore users
    await db.collection('users').doc(parentUid).update({
      email: newEmail,
      emailInvalid: false
    });

    // 3. Buscar hijos y actualizar emailPadre
    const parentDoc = await db.collection('users').doc(parentUid).get();
    const studentIds = parentDoc.data()?.studentIds || [];
    
    if (studentIds.length > 0) {
      const batch = db.batch();
      for (const studentId of studentIds) {
        const studentRef = db.collection('students').doc(studentId);
        batch.update(studentRef, { emailPadre: newEmail });
      }
      await batch.commit();
    }

    // 4. Generar y enviar nuevo enlace de verificación
    const redirectUrl = process.env.REDIRECT_URL || 'http://localhost:5173/auth-action';
    const actionCodeSettings = {
      url: redirectUrl,
      handleCodeInApp: true
    };

    const emailLink = await admin.auth().generateEmailVerificationLink(newEmail, actionCodeSettings);

    const htmlContent = `
      <h1>Actualización de Correo y Activación de Cuenta</h1>
      <p>Hola ${parentDoc.data()?.nombre || 'Tutor'},</p>
      <p>Un administrador ha corregido su dirección de correo electrónico en nuestra plataforma. Para verificar su cuenta y activarla, por favor haga clic en el siguiente enlace:</p>
      <p><a href="${emailLink}">Activar Cuenta con nuevo Correo</a></p>
    `;

    await sendEmail({
      to: newEmail,
      subject: 'Activación de Cuenta de Tutor - Educar para Transformar',
      html: htmlContent
    });

    res.status(200).send({ message: 'Correo actualizado y nuevo enlace de activación enviado exitosamente.' });
  } catch (error: any) {
    console.error('Error en cf_updateParentEmailAndResend:', error);
    res.status(500).send({ error: error.message || 'Error interno.' });
  }
});

/**
 * 4. cf_activateStudentAccount
 * Invocada desde el frontend de React para que un estudiante establezca su contraseña. Public API.
 */
export const cf_activateStudentAccount = onRequest({ cors: true }, async (req, res) => {
  try {
    const { studentId, token, newPassword } = req.body;
    if (!studentId || !token || !newPassword) {
      res.status(400).send({ error: 'Faltan parámetros requeridos (studentId, token, newPassword).' });
      return;
    }

    const studentRef = db.collection('students').doc(studentId);
    const studentDoc = await studentRef.get();
    if (!studentDoc.exists) {
      res.status(404).send({ error: 'Estudiante no encontrado.' });
      return;
    }

    const studentData = studentDoc.data();

    // Validar token y expiración
    if (studentData?.activationToken !== token) {
      res.status(400).send({ error: 'Token de activación inválido.' });
      return;
    }

    const expires = studentData?.activationTokenExpires;
    if (!expires || expires.toDate() < new Date()) {
      res.status(400).send({ error: 'El token de activación ha expirado.' });
      return;
    }

    // Hashear la contraseña usando bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar estudiante en Firestore
    await studentRef.update({
      hashedPassword,
      status: 'active',
      activationToken: null,
      activationTokenExpires: null
    });

    res.status(200).send({ message: 'Cuenta del estudiante activada con éxito. Ya puede iniciar sesión.' });
  } catch (error: any) {
    console.error('Error en cf_activateStudentAccount:', error);
    res.status(500).send({ error: error.message || 'Error interno.' });
  }
});

/**
 * 5. cf_loginStudent
 * Permite a un estudiante iniciar sesión con su studentID_login y contraseña. Public API.
 */
export const cf_loginStudent = onRequest({ cors: true }, async (req, res) => {
  try {
    const { studentID_login, password } = req.body;
    if (!studentID_login || !password) {
      res.status(400).send({ error: 'Faltan parámetros (studentID_login, password).' });
      return;
    }

    // Buscar estudiante por su ID de inicio de sesión
    const snapshot = await db.collection('students')
      .where('studentID_login', '==', studentID_login)
      .limit(1)
      .get();

    if (snapshot.empty) {
      res.status(401).send({ error: 'ID de estudiante o contraseña incorrectos.' });
      return;
    }

    const studentDoc = snapshot.docs[0];
    const studentData = studentDoc.data();

    // Validar que la cuenta esté activa
    if (studentData.status !== 'active' || !studentData.hashedPassword) {
      res.status(400).send({ error: 'La cuenta del estudiante no ha sido activada o no tiene contraseña.' });
      return;
    }

    // Comparar contraseña con el hash guardado
    const match = await bcrypt.compare(password, studentData.hashedPassword);
    if (!match) {
      res.status(401).send({ error: 'ID de estudiante o contraseña incorrectos.' });
      return;
    }

    // Crear Custom Token de Firebase Auth. Usamos el ID del documento de Firestore como UID del Auth del estudiante.
    const customToken = await admin.auth().createCustomToken(studentDoc.id, {
      role: 'Estudiante',
      studentId: studentID_login
    });

    res.status(200).send({ customToken });
  } catch (error: any) {
    console.error('Error en cf_loginStudent:', error);
    res.status(500).send({ error: error.message || 'Error interno.' });
  }
});

/**
 * 6. cf_resetStudentPassword
 * Envía un enlace de restablecimiento de contraseña para un estudiante al correo del padre.
 */
export const cf_resetStudentPassword = onRequest({ cors: true }, async (req, res) => {
  try {
    const callerClaims = await verifyAuth(req);
    const { studentId } = req.body;

    if (!studentId) {
      res.status(400).send({ error: 'Faltan parámetros requeridos (studentId).' });
      return;
    }

    const studentRef = db.collection('students').doc(studentId);
    const studentDoc = await studentRef.get();
    if (!studentDoc.exists) {
      res.status(404).send({ error: 'Estudiante no encontrado.' });
      return;
    }

    const studentData = studentDoc.data();

    // Validar permisos: Requiere user_admin o ser el padre del estudiante
    if (callerClaims.role !== 'user_admin' && callerClaims.uid !== studentData?.parentId) {
      res.status(403).send({ error: 'Permisos insuficientes.' });
      return;
    }

    // Generar token temporal
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenExpires = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 48 * 60 * 60 * 1000)
    );

    await studentRef.update({
      activationToken,
      activationTokenExpires
    });

    const redirectUrl = process.env.REDIRECT_URL || 'http://localhost:5173/auth-action';
    const resetLink = `${redirectUrl}?mode=resetStudentPassword&token=${activationToken}&studentId=${studentId}`;

    const htmlContent = `
      <h1>Restablecimiento de Contraseña del Estudiante</h1>
      <p>Hola,</p>
      <p>Se ha solicitado restablecer la contraseña para el estudiante <strong>${studentData?.nombre || ''}</strong> (Usuario: ${studentData?.studentID_login}).</p>
      <p>Haga clic en el siguiente enlace para ingresar su nueva contraseña:</p>
      <p><a href="${resetLink}">Restablecer Contraseña</a></p>
      <p>Este enlace es válido por 48 horas.</p>
    `;

    await sendEmail({
      to: studentData?.emailPadre,
      subject: `Restablecimiento de Contraseña para ${studentData?.nombre || 'Estudiante'} - Educar para Transformar`,
      html: htmlContent
    });

    res.status(200).send({ message: 'Enlace de restablecimiento de contraseña enviado al correo del tutor.' });
  } catch (error: any) {
    console.error('Error en cf_resetStudentPassword:', error);
    res.status(500).send({ error: error.message || 'Error interno.' });
  }
});

/**
 * 7. cf_createAdministrativeUser
 * Invocada por un user_admin para crear otro administrador, staff (docente) o administrativo.
 */
export const cf_createAdministrativeUser = onRequest({ cors: true }, async (req, res) => {
  try {
    const callerClaims = await verifyAuth(req);
    if (callerClaims.role !== 'user_admin') {
      res.status(403).send({ error: 'Permisos insuficientes: Requiere rol user_admin.' });
      return;
    }

    const { email, name, role } = req.body;
    if (!email || !name || !role) {
      res.status(400).send({ error: 'Faltan parámetros requeridos (email, name, role).' });
      return;
    }

    const allowedRoles = ['user_admin', 'Staff', 'Administrativo'];
    if (!allowedRoles.includes(role)) {
      res.status(400).send({ error: 'Rol inválido. Debe ser user_admin, Staff o Administrativo.' });
      return;
    }

    // Crear el usuario en Auth
    const userRecord = await admin.auth().createUser({
      email,
      emailVerified: false,
      displayName: name
    });

    // Asignar Custom Claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // Guardar en Firestore
    await db.collection('users').doc(userRecord.uid).set({
      role,
      email,
      nombre: name,
      emailInvalid: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Enlace de activación
    const redirectUrl = process.env.REDIRECT_URL || 'http://localhost:5173/auth-action';
    const actionCodeSettings = {
      url: redirectUrl,
      handleCodeInApp: true
    };

    let emailSentSuccessfully = true;
    let emailLink = '';
    try {
      emailLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

      const htmlContent = `
        <h1>Registro de Personal - Educar para Transformar</h1>
        <p>Hola ${name},</p>
        <p>Has sido registrado en el portal administrativo con el rol de <strong>${role}</strong>.</p>
        <p>Para activar tu cuenta y verificar tu dirección de correo, por favor haz clic en el siguiente enlace:</p>
        <p><a href="${emailLink}">Activar Cuenta Administrativa</a></p>
      `;

      await sendEmail({
        to: email,
        subject: 'Activación de Cuenta de Personal - Educar para Transformar',
        html: htmlContent
      });
    } catch (mailError) {
      console.error('Error al enviar email a administrativo:', mailError);
      emailSentSuccessfully = false;
      await db.collection('users').doc(userRecord.uid).update({ emailInvalid: true });
    }

    res.status(201).send({
      uid: userRecord.uid,
      emailSentSuccessfully,
      emailLink: emailSentSuccessfully ? undefined : emailLink
    });

  } catch (error: any) {
    console.error('Error en cf_createAdministrativeUser:', error);
    res.status(500).send({ error: error.message || 'Error interno.' });
  }
});
