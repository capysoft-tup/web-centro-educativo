# Guía de Integración de Firebase y Cloud Functions

Esta guía detalla cómo integrar el SDK de cliente de Firebase en tu aplicación React (Vite) y cómo realizar llamadas seguras a las 6 Cloud Functions de backend.

---

## 1. Inicialización del SDK de Firebase en React

Primero, instala los módulos cliente en el frontend:
```bash
npm install firebase
```

Luego, crea un archivo de configuración en `src/services/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithCustomToken,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Funciones Helper de Autenticación
export const loginConEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const loginConCustomToken = (token) => signInWithCustomToken(auth, token);
export const cerrarSesion = () => signOut(auth);

/**
 * Helper para obtener las cabeceras de autorización con el ID Token del usuario autenticado.
 */
export async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay un usuario autenticado.");
  const token = await user.getIdToken(true); // Forzar refresco para obtener claims actualizados
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}
```

---

## 2. Cliente de Servicios para Invocar Cloud Functions

Crea un archivo `src/services/apiService.js` para centralizar las peticiones HTTP a las Cloud Functions v2:

```javascript
import { getAuthHeaders } from './firebase';

const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || 'http://127.0.0.1:5001/centro-educativo-f5cc5/us-central1';

/**
 * 1. Crear Padre y Alumnos (user_admin)
 */
export async function createParentAndStudents(parentEmail, parentName, students) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${FUNCTIONS_BASE_URL}/cf_createParentAndStudents`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ parentEmail, parentName, students })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al crear el tutor y los alumnos.');
  }
  return res.json();
}

/**
 * 2. Reenviar Enlace de Activación (user_admin o Padre)
 */
export async function resendActivationLink(targetType, targetId) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${FUNCTIONS_BASE_URL}/cf_resendActivationLink`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ targetType, targetId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al reenviar el enlace.');
  }
  return res.json();
}

/**
 * 3. Corregir Email del Padre y Reenviar (user_admin)
 */
export async function updateParentEmailAndResend(parentUid, newEmail) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${FUNCTIONS_BASE_URL}/cf_updateParentEmailAndResend`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ parentUid, newEmail })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al actualizar el correo.');
  }
  return res.json();
}

/**
 * 4. Activar Cuenta de Estudiante (Público)
 */
export async function activateStudentAccount(studentId, token, newPassword) {
  const res = await fetch(`${FUNCTIONS_BASE_URL}/cf_activateStudentAccount`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, token, newPassword })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al activar la cuenta del estudiante.');
  }
  return res.json();
}

/**
 * 5. Login de Estudiante (Público)
 */
export async function loginStudent(studentID_login, password) {
  const res = await fetch(`${FUNCTIONS_BASE_URL}/cf_loginStudent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentID_login, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Credenciales de estudiante incorrectas.');
  }
  return res.json(); // Retorna { customToken }
}

/**
 * 6. Solicitar Restablecer Contraseña del Estudiante (user_admin o Padre)
 */
export async function resetStudentPassword(studentId) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${FUNCTIONS_BASE_URL}/cf_resetStudentPassword`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ studentId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al solicitar el restablecimiento.');
  }
  return res.json();
}
```

---

## 3. Ejemplo de Flujos y Componentes React

### A. Login de Administrador (`user_admin`)

```jsx
import React, { useState } from 'react';
import { loginConEmail } from '../services/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await loginConEmail(email, password);
      // Opcional: Validar que el token decodificado contenga el claim 'user_admin'
      const tokenResult = await userCredential.user.getIdTokenResult();
      if (tokenResult.claims.role !== 'user_admin') {
         setError('Acceso denegado: No tienes el rol de administrador.');
         return;
      }
      // Redirigir al panel de administración
    } catch (err) {
      setError('Credenciales inválidas.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <p>{error}</p>}
      <button type="submit">Ingresar como Administrador</button>
    </form>
  );
}
```

### B. Login de Estudiantes (con Custom Token)

```jsx
import React, { useState } from 'react';
import { loginStudent } from '../services/apiService';
import { loginConCustomToken } from '../services/firebase';

export default function StudentLogin() {
  const [username, setUsername] = useState(''); // EST-2026-XXXXX
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Invocar Cloud Function para validar credenciales y obtener custom token
      const { customToken } = await loginStudent(username, password);
      // 2. Autenticar en el cliente de Firebase con el Custom Token
      await loginConCustomToken(customToken);
      // Redirigir al dashboard del estudiante
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="EST-YYYY-XXXXX" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <p>{error}</p>}
      <button type="submit">Ingresar Estudiante</button>
    </form>
  );
}
```

### C. Manejador Único de Acciones `/auth-action`

Este componente captura tanto los enlaces por defecto de Firebase Auth (verificar correo, resetear password) como los personalizados para Alumnos (activación, reseteo).

```jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../services/firebase';
import { activateStudentAccount } from '../services/apiService';

export default function AuthActionHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando acción...');
  const [error, setError] = useState('');
  
  const mode = searchParams.get('mode'); // o 'apiKey' si es Firebase nativo
  const oobCode = searchParams.get('oobCode'); // token nativo de Firebase
  const token = searchParams.get('token'); // token personalizado (estudiante)
  const studentId = searchParams.get('studentId');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (mode === 'verifyEmail' && oobCode) {
      // Enlace de activación del Padre (Firebase nativo)
      applyActionCode(auth, oobCode)
        .then(() => {
          setStatus('¡Correo verificado con éxito!');
          setTimeout(() => navigate('/login'), 3000);
        })
        .catch(err => setError('El enlace de verificación ha expirado o es inválido.'));
    }
  }, [mode, oobCode]);

  const handleStudentActivation = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      setStatus('Activando cuenta...');
      await activateStudentAccount(studentId, token, password);
      setStatus('¡Cuenta activada con éxito! Ya puedes iniciar sesión.');
      setTimeout(() => navigate('/student-login'), 3000);
    } catch (err) {
      setError(err.message || 'Error al activar la cuenta. El enlace podría haber expirado.');
    }
  };

  // Renderizar formulario si se trata de activación de estudiante
  if (mode === 'activateStudent' || mode === 'resetStudentPassword') {
    return (
      <div>
        <h2>Establecer Contraseña de Estudiante</h2>
        <p>Configura una contraseña para acceder a la plataforma.</p>
        <form onSubmit={handleStudentActivation}>
          <input type="password" placeholder="Nueva Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <button type="submit">Activar Cuenta</button>
        </form>
        {status && <p>{status}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>Acción de Autenticación</h2>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <p>{status}</p>}
    </div>
  );
}
```

---

## 4. Instrucciones de Configuración y Despliegue

### Paso 1: Configurar el Plan Blaze
Ingresa a la consola de Firebase del proyecto `centro-educativo-f5cc5`, ve a la esquina inferior izquierda y presiona **Upgrade**. Selecciona el **Plan Blaze (Pay-As-You-Go)**. 

### Paso 2: Configurar las variables de entorno de producción
Para que nodemailer envíe correos electrónicos en producción, debes definir las variables del servidor SMTP en las funciones de Firebase. En Firebase v2, puedes configurar variables de entorno o Secretos de Google Cloud.

Para definir variables simples usando el archivo `.env` dentro de la carpeta `functions/`:

Crea un archivo `/functions/.env` (no lo subas a git si contiene contraseñas reales):
```env
SMTP_HOST=smtp.tuservidor.com
SMTP_PORT=587
SMTP_USER=miusuario@tuservidor.com
SMTP_PASS=contraseñasegura
REDIRECT_URL=https://tu-dominio-vercel.app/auth-action
```

### Paso 3: Compilar y Desplegar
Desde la carpeta raíz del proyecto, ejecuta el despliegue de las Cloud Functions y las reglas de Firestore:

```bash
# Instalar dependencias en el root
npm install

# Compilar funciones y desplegar todo a producción
npx -y firebase-tools@latest deploy --only functions,firestore
```
