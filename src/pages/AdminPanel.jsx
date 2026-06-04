import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Icon from '../components/atoms/Icon';
import SuccessModal from '../components/molecules/SuccessModal';
import { db, auth } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'create'

  // Creation Type State ('parent_student' or 'administrative')
  const [creationType, setCreationType] = useState('parent_student');

  // Form State for creating Parent & Students
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [students, setStudents] = useState([
    { nombre: '', dni: '', fechaNacimiento: '', nivel: 'inicial' }
  ]);

  // Form State for creating Administrative/Staff User
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState('Staff');

  // Loading, Errors, and Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState({ title: '', message: '' });
  const [formError, setFormError] = useState('');

  // Auto-switch tab if user is not admin
  useEffect(() => {
    if (activeTab === 'create' && user && user.role !== 'user_admin') {
      setActiveTab('dashboard');
    }
  }, [activeTab, user]);

  // Dashboard Data State
  const [parentsList, setParentsList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  // Filters State
  const [searchFilter, setSearchFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('todos');

  // Check Auth & Role on mount
  useEffect(() => {
    const checkAdminAuth = async () => {
      // 1. Check local mock/real context
      const savedUser = localStorage.getItem('school_user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      
      if (currentUser && (currentUser.role === 'user_admin' || currentUser.role === 'Staff' || currentUser.role === 'Administrativo')) {
        return;
      }

      // 2. Check real Firebase Auth
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const role = idTokenResult.claims.role;
        if (role === 'user_admin' || role === 'Staff' || role === 'Administrativo') {
          return;
        }
      }

      // If not allowed, redirect to login
      console.warn("Acceso denegado al Panel de Administración.");
      navigate('/login');
    };
    checkAdminAuth();
  }, [navigate]);

  // Fetch Firestore users and students on mount & when dashboard tab is active
  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    setDataError('');
    try {
      // In v2 / emulator, or real environment
      const parentsSnap = await getDocs(collection(db, 'users'));
      const studentsSnap = await getDocs(collection(db, 'students'));

      const parents = parentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setParentsList(parents);
      setStudentsList(students);
    } catch (err) {
      console.error("Error cargando datos de Firestore:", err);
      setDataError("No se pudieron cargar datos reales de Firestore. Mostrando datos simulados.");
      
      // Fallback a datos simulados premium para visualización en local
      setParentsList([
        { id: 'parent-1', nombre: 'Eduardo Gómez', email: 'eduardo@ejemplo.com', emailInvalid: false, studentIds: ['student-1', 'student-2'] },
        { id: 'parent-2', nombre: 'María Rodríguez', email: 'maria.invalid@gmail.com', emailInvalid: true, studentIds: ['student-3'] }
      ]);
      setStudentsList([
        { id: 'student-1', studentID_login: 'EST-2026-88123', parentId: 'parent-1', emailPadre: 'eduardo@ejemplo.com', nombre: 'Lucía Gómez', dni: '48123456', nivel: 'inicial', status: 'active' },
        { id: 'student-2', studentID_login: 'EST-2026-90412', parentId: 'parent-1', emailPadre: 'eduardo@ejemplo.com', nombre: 'Mateo Gómez', dni: '45123987', nivel: 'primaria', status: 'pendingParentActivation' },
        { id: 'student-3', studentID_login: 'EST-2026-10492', parentId: 'parent-2', emailPadre: 'maria.invalid@gmail.com', nombre: 'Sofía Rodríguez', dni: '42987123', nivel: 'secundaria', status: 'pendingParentActivation' }
      ]);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  // Handler to call api cf_createParentAndStudents
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!parentEmail.trim() || !parentName.trim()) {
      setFormError('Por favor, completa los datos del tutor.');
      return;
    }

    // Validate students list
    for (const std of students) {
      if (!std.nombre.trim() || !std.dni.trim() || !std.fechaNacimiento) {
        setFormError('Por favor, completa todos los datos de los estudiantes.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || 'http://127.0.0.1:5001/centro-educativo-f5cc5/us-central1';
      
      // Intentar obtener token real de Firebase Auth si existe
      let token = 'mock-admin-token';
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const response = await fetch(`${FUNCTIONS_BASE_URL}/cf_createParentAndStudents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          parentEmail,
          parentName,
          students
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error en la petición.');
      }

      const result = await response.json();

      setSuccessModalData({
        title: '¡Tutor y Alumnos Creados!',
        message: `Se ha registrado a ${parentName}. Cuenta de tutor creada e hijos vinculados. ${
          result.emailSentSuccessfully 
            ? 'Se envió el correo de activación.' 
            : 'Fallo al enviar correo. Copia el enlace de activación manualmente.'
        }`
      });
      setSuccessModalOpen(true);

      // Reset Form
      setParentEmail('');
      setParentName('');
      setStudents([{ nombre: '', dni: '', fechaNacimiento: '', nivel: 'inicial' }]);

    } catch (err) {
      console.error(err);
      setFormError(`Fallo al registrar: ${err.message || 'Error de conexión.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!adminEmail.trim() || !adminName.trim() || !adminRole) {
      setFormError('Por favor, completa todos los campos del formulario.');
      return;
    }

    setIsSubmitting(true);
    try {
      const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || 'http://127.0.0.1:5001/centro-educativo-f5cc5/us-central1';
      
      let token = 'mock-admin-token';
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const response = await fetch(`${FUNCTIONS_BASE_URL}/cf_createAdministrativeUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: adminEmail.trim(),
          name: adminName.trim(),
          role: adminRole
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error en la petición.');
      }

      const result = await response.json();

      setSuccessModalData({
        title: '¡Usuario Creado!',
        message: `Se ha registrado a ${adminName} con el rol de ${adminRole}. ${
          result.emailSentSuccessfully 
            ? 'Se envió el correo de activación.' 
            : 'Fallo al enviar correo. Copia el enlace de activación manualmente.'
        }`
      });
      setSuccessModalOpen(true);

      // Reset Form
      setAdminEmail('');
      setAdminName('');
      setAdminRole('Staff');

    } catch (err) {
      console.error(err);
      setFormError(`Fallo al registrar: ${err.message || 'Error de conexión.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper dynamic fields addition/removal for students
  const handleStudentChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const addStudentField = () => {
    setStudents([...students, { nombre: '', dni: '', fechaNacimiento: '', nivel: 'inicial' }]);
  };

  const removeStudentField = (index) => {
    if (students.length === 1) return;
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  // Call API cf_resendActivationLink
  const handleResendActivation = async (targetType, targetId) => {
    try {
      const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || 'http://127.0.0.1:5001/centro-educativo-f5cc5/us-central1';
      let token = 'mock-admin-token';
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const response = await fetch(`${FUNCTIONS_BASE_URL}/cf_resendActivationLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetType, targetId })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Fallo de API.');
      }

      alert('Enlace de activación reenviado con éxito.');
      fetchDashboardData();
    } catch (err) {
      alert(`Error al reenviar enlace: ${err.message}`);
    }
  };

  // Call API cf_updateParentEmailAndResend
  const handleUpdateEmail = async (parentUid) => {
    const newEmail = prompt('Ingresa el nuevo correo electrónico del tutor:');
    if (!newEmail) return;

    try {
      const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || 'http://127.0.0.1:5001/centro-educativo-f5cc5/us-central1';
      let token = 'mock-admin-token';
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const response = await fetch(`${FUNCTIONS_BASE_URL}/cf_updateParentEmailAndResend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ parentUid, newEmail })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Fallo de API.');
      }

      alert('Correo actualizado e invitación reenviada.');
      fetchDashboardData();
    } catch (err) {
      alert(`Error al actualizar correo: ${err.message}`);
    }
  };

  // Filter logic on the dashboard list
  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = 
      student.nombre.toLowerCase().includes(searchFilter.toLowerCase()) ||
      student.studentID_login.toLowerCase().includes(searchFilter.toLowerCase()) ||
      student.emailPadre.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesLevel = levelFilter === 'todos' || student.nivel === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 font-body">
      <Navbar noButtons={true} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-headline text-4xl font-extrabold text-slate-800 tracking-tight">Panel de Administración</h1>
            <p className="font-body text-slate-500 mt-2">Gestión de tutores, estudiantes y activación de credenciales.</p>
          </div>

          {/* Tab Selection buttons */}
          <div className="flex bg-slate-200/60 p-1.5 rounded-full border border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2.5 rounded-full font-label font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="dashboard" className="text-lg" />
                <span>Dashboard de Usuarios</span>
              </div>
            </button>
            {user?.role === 'user_admin' && (
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-2.5 rounded-full font-label font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="person_add" className="text-lg" />
                  <span>Crear Usuarios</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="relative w-full md:w-96">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Icon name="search" />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por alumno, email del tutor o ID..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <label className="text-sm font-semibold text-slate-500 whitespace-nowrap">Nivel Educativo:</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full md:w-48 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-sm appearance-none"
                >
                  <option value="todos">Todos los niveles</option>
                  <option value="inicial">Nivel Inicial</option>
                  <option value="primaria">Primaria</option>
                  <option value="secundaria">Secundaria</option>
                </select>
              </div>
            </div>

            {/* Warn message if Firestore failed and mock data is shown */}
            {dataError && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-center gap-3 text-amber-800">
                <Icon name="warning" className="text-amber-500 text-2xl" />
                <p className="text-sm font-medium">{dataError}</p>
              </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                {isLoadingData ? (
                  <div className="p-12 text-center text-slate-500">
                    <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="font-semibold">Cargando base de datos...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-16 text-center text-slate-500">
                    <Icon name="person_off" className="text-5xl text-slate-300 mb-4" />
                    <p className="font-bold text-lg">No se encontraron estudiantes creados</p>
                    <p className="text-sm mt-1">Prueba con otros criterios de búsqueda o añade nuevos usuarios.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-label font-bold text-xs uppercase tracking-wider">
                        <th className="py-4 px-6">Estudiante / ID</th>
                        <th className="py-4 px-6">Nivel</th>
                        <th className="py-4 px-6">Tutor / Contacto</th>
                        <th className="py-4 px-6">Estado</th>
                        <th className="py-4 px-6 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-body text-sm text-slate-700">
                      {filteredStudents.map((student) => {
                        const parent = parentsList.find(p => p.id === student.parentId) || { nombre: 'Cargando...', emailInvalid: false };
                        return (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-slate-800">{student.nombre}</span>
                                <span className="text-xs text-slate-400 font-mono">{student.studentID_login} (DNI: {student.dni})</span>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                student.nivel === 'inicial' ? 'bg-secondary-container/20 text-secondary' :
                                student.nivel === 'primaria' ? 'bg-primary-container/20 text-primary' :
                                'bg-tertiary-container/20 text-tertiary-dim'
                              }`}>
                                {student.nivel.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-5 px-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-semibold text-slate-700">{parent.nombre}</span>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                  <span>{student.emailPadre}</span>
                                  {parent.emailInvalid && (
                                    <span className="flex items-center gap-0.5 text-red-500 font-bold uppercase tracking-wider text-[9px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                      <Icon name="error" className="text-[10px]" />
                                      Email Inválido
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                student.status === 'active' 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                <span className={`h-2 w-2 rounded-full ${student.status === 'active' ? 'bg-green-600' : 'bg-amber-500 animate-pulse'}`} />
                                {student.status === 'active' ? 'Activo' : 'Pendiente'}
                              </span>
                            </td>
                            <td className="py-5 px-6">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => handleResendActivation('student', student.id)}
                                  title="Reenviar activación del estudiante"
                                  className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
                                >
                                  <Icon name="sync" className="text-base" />
                                </button>
                                <button
                                  onClick={() => handleResendActivation('parent', student.parentId)}
                                  title="Reenviar verificación del tutor"
                                  className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                                >
                                  <Icon name="mail" className="text-base" />
                                </button>
                                {parent.emailInvalid && (
                                  <button
                                    onClick={() => handleUpdateEmail(student.parentId)}
                                    title="Modificar Email y Reenviar"
                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                  >
                                    <Icon name="edit" className="text-base" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Creation Tab Content */}
        {activeTab === 'create' && user?.role === 'user_admin' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl max-w-4xl mx-auto">
            <h2 className="font-headline text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Icon name="person_add" className="text-orange-500" />
              <span>
                {creationType === 'parent_student'
                  ? 'Registrar Tutor y Estudiantes'
                  : 'Registrar Personal / Administrativo'}
              </span>
            </h2>

            {/* Sub-selector for creation type */}
            <div className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200 mb-8 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  setCreationType('parent_student');
                  setFormError('');
                }}
                className={`flex-1 py-2 rounded-full font-label font-bold text-xs transition-all cursor-pointer border-none ${
                  creationType === 'parent_student'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Tutor y Estudiantes
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreationType('administrative');
                  setFormError('');
                }}
                className={`flex-1 py-2 rounded-full font-label font-bold text-xs transition-all cursor-pointer border-none ${
                  creationType === 'administrative'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Personal / Administrativo
              </button>
            </div>

            {creationType === 'parent_student' ? (
              <form onSubmit={handleCreateSubmit} className="space-y-8">
                {/* Tutor Section */}
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 space-y-4 text-left">
                  <h3 className="font-label font-bold text-xs uppercase tracking-widest text-slate-500">Datos del Padre/Tutor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-600">Nombre Completo del Tutor</label>
                      <input
                        type="text"
                        placeholder="Ej. Andrés Martínez"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-sm"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-600">Correo Electrónico</label>
                      <input
                        type="email"
                        placeholder="tutor@ejemplo.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Hijos Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-label font-bold text-xs uppercase tracking-widest text-slate-500">Estudiantes Vinculados</h3>
                    <button
                      type="button"
                      onClick={addStudentField}
                      className="flex items-center gap-1.5 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold text-xs rounded-full transition-all cursor-pointer border-none"
                    >
                      <Icon name="add" className="text-sm" />
                      <span>Añadir Hijo</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {students.map((student, idx) => (
                      <div key={idx} className="relative border border-slate-100 p-6 rounded-2xl bg-white shadow-sm space-y-4 text-left">
                        {students.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStudentField(idx)}
                            className="absolute right-4 top-4 text-slate-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                          >
                            <Icon name="delete" />
                          </button>
                        )}
                        
                        <h4 className="font-label font-bold text-xs text-orange-600">Estudiante #{idx + 1}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-600">Nombre Completo</label>
                            <input
                              type="text"
                              placeholder="Ej. Lucas Martínez"
                              value={student.nombre}
                              onChange={(e) => handleStudentChange(idx, 'nombre', e.target.value)}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-xs"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-600">DNI</label>
                            <input
                              type="text"
                              placeholder="Número de DNI"
                              value={student.dni}
                              onChange={(e) => handleStudentChange(idx, 'dni', e.target.value.replace(/\D/g, ''))}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-xs"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-600">Fecha de Nacimiento</label>
                            <input
                              type="date"
                              value={student.fechaNacimiento}
                              onChange={(e) => handleStudentChange(idx, 'fechaNacimiento', e.target.value)}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-xs"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-600">Nivel Educativo</label>
                            <select
                              value={student.nivel}
                              onChange={(e) => handleStudentChange(idx, 'nivel', e.target.value)}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-xs appearance-none"
                              required
                            >
                              <option value="inicial">Nivel Inicial</option>
                              <option value="primaria">Primaria</option>
                              <option value="secundaria">Secundaria</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formError && (
                  <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 p-3.5 rounded-xl text-center">{formError}</p>
                )}

                {/* Submit Buttons */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-base rounded-full shadow-lg shadow-orange-600/10 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creando Cuentas y Vinculando...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="person_add" className="mr-2" />
                      <span>Crear Cuentas y Enviar Activación</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateAdminSubmit} className="space-y-8">
                {/* Personal Section */}
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 space-y-4 text-left">
                  <h3 className="font-label font-bold text-xs uppercase tracking-widest text-slate-500">Datos del Personal / Administrativo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-600">Nombre Completo</label>
                      <input
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-sm"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-600">Correo Electrónico</label>
                      <input
                        type="email"
                        placeholder="juan.perez@ejemplo.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-sm"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-600">Rol Institucional</label>
                      <select
                        value={adminRole}
                        onChange={(e) => setAdminRole(e.target.value)}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-sm appearance-none"
                        required
                      >
                        <option value="Staff">Docente / Staff</option>
                        <option value="Administrativo">Administrativo</option>
                        <option value="user_admin">Administrador General</option>
                      </select>
                    </div>
                  </div>
                </div>

                {formError && (
                  <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 p-3.5 rounded-xl text-center">{formError}</p>
                )}

                {/* Submit Buttons */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-base rounded-full shadow-lg shadow-orange-600/10 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creando Cuenta...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="person_add" className="mr-2" />
                      <span>Crear Cuenta de Personal</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Success Reusable Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          setActiveTab('dashboard');
        }}
        title={successModalData.title}
        message={successModalData.message}
        buttonText="Excelente"
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
    </div>
  );
};

export default AdminPanel;
