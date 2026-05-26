import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Registration.css';

const NIVELES = [
  {
    id: 'inicial',
    icon: '😊',
    nombre: 'Nivel Inicial',
    descripcion: 'Para niños de 3 a 5 años. Un entorno lúdico y seguro.',
  },
  {
    id: 'primaria',
    icon: '📋',
    nombre: 'Primaria',
    descripcion: 'De 1º a 6º grado. Bases sólidas para el futuro.',
  },
  {
    id: 'secundaria',
    icon: '🎓',
    nombre: 'Secundaria',
    descripcion: 'Formación integral y preparación universitaria.',
  },
];

const PASOS = ['Nivel', 'Tutor', 'Alumno'];

const Registration = () => {
  const [pasoActual, setPasoActual] = useState(1);

  const [datosFormulario, setDatosFormulario] = useState({
    nivel: '',
    nombreTutor: '',
    dniTutor: '',
    correo: '',
    telefono: '',
    nombreAlumno: '',
    fechaNacimiento: '',
    dniAlumno: '',
    observaciones: '',
  });

  const siguientePaso = () => {
    if (pasoActual < 3) setPasoActual(pasoActual + 1);
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) setPasoActual(pasoActual - 1);
  };

  const handleChange = (campo, valor) => {
    setDatosFormulario({ ...datosFormulario, [campo]: valor });
  };

  return (
    <>
      <Navbar />
      <main className="registro-main">
        {/* Hero header */}
        <div className="registro-hero">
          <h1 className="registro-titulo">
            Únete a nuestra <span className="registro-titulo-acento">comunidad</span>
          </h1>
          <p className="registro-subtitulo">
            Comienza el proceso de inscripción para el nuevo ciclo lectivo. Un camino de
            descubrimiento, aprendizaje y transformación te espera.
          </p>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {PASOS.map((paso, index) => {
            const numero = index + 1;
            const activo = numero === pasoActual;
            const completado = numero < pasoActual;
            return (
              <React.Fragment key={paso}>
                <div className={`stepper-paso ${activo ? 'activo' : ''} ${completado ? 'completado' : ''}`}>
                  <div className="stepper-circulo">
                    {completado ? '✓' : numero}
                  </div>
                  <span className="stepper-etiqueta">{paso}</span>
                </div>
                {index < PASOS.length - 1 && (
                  <div className={`stepper-linea ${completado ? 'completada' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Tarjeta del formulario */}
        <div className="registro-card">

          {/* ── PASO 1: Nivel ── */}
          {pasoActual === 1 && (
            <section className="paso">
              <h2 className="paso-titulo">Paso 1: Selección de Nivel</h2>
              <div className="niveles-grid">
                {NIVELES.map((nivel) => (
                  <button
                    key={nivel.id}
                    type="button"
                    className={`nivel-card ${datosFormulario.nivel === nivel.id ? 'seleccionado' : ''}`}
                    onClick={() => handleChange('nivel', nivel.id)}
                  >
                    <span className="nivel-icon">{nivel.icon}</span>
                    <strong className="nivel-nombre">{nivel.nombre}</strong>
                    <p className="nivel-desc">{nivel.descripcion}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ── PASO 2: Tutor ── */}
          {pasoActual === 2 && (
            <section className="paso">
              <h2 className="paso-titulo">Paso 2: Datos del Tutor</h2>
              <div className="form-grid">
                <div className="form-grupo">
                  <label className="form-label">NOMBRE COMPLETO</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={datosFormulario.nombreTutor}
                    onChange={(e) => handleChange('nombreTutor', e.target.value)}
                  />
                </div>
                <div className="form-grupo">
                  <label className="form-label">DNI / PASAPORTE</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Número de documento"
                    value={datosFormulario.dniTutor}
                    onChange={(e) => handleChange('dniTutor', e.target.value)}
                  />
                </div>
                <div className="form-grupo">
                  <label className="form-label">CORREO ELECTRÓNICO</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={datosFormulario.correo}
                    onChange={(e) => handleChange('correo', e.target.value)}
                  />
                </div>
                <div className="form-grupo">
                  <label className="form-label">TELÉFONO DE CONTACTO</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+549 11 2345-6789"
                    value={datosFormulario.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── PASO 3: Alumno ── */}
          {pasoActual === 3 && (
            <section className="paso">
              <h2 className="paso-titulo">Paso 3: Datos del Alumno</h2>
              <div className="form-grid">
                <div className="form-grupo">
                  <label className="form-label">NOMBRE COMPLETO DEL ALUMNO</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Nombre y apellido"
                    value={datosFormulario.nombreAlumno}
                    onChange={(e) => handleChange('nombreAlumno', e.target.value)}
                  />
                </div>
                <div className="form-grupo">
                  <label className="form-label">DNI DEL ALUMNO</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Número de documento"
                    value={datosFormulario.dniAlumno}
                    onChange={(e) => handleChange('dniAlumno', e.target.value)}
                  />
                </div>
                <div className="form-grupo form-grupo--full">
                  <label className="form-label">FECHA DE NACIMIENTO</label>
                  <input
                    className="form-input"
                    type="date"
                    value={datosFormulario.fechaNacimiento}
                    onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                  />
                </div>
                <div className="form-grupo form-grupo--full">
                  <label className="form-label">OBSERVACIONES / NECESIDADES ESPECIALES</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Indicá cualquier información relevante..."
                    value={datosFormulario.observaciones}
                    onChange={(e) => handleChange('observaciones', e.target.value)}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Botones de navegación */}
          <div className="botones-navegacion">
            {pasoActual > 1 && (
              <button type="button" className="btn-anterior" onClick={pasoAnterior}>
                ← Paso Anterior
              </button>
            )}
            {pasoActual < 3 ? (
              <button type="button" className="btn-siguiente" onClick={siguientePaso}>
                Siguiente Paso →
              </button>
            ) : (
              <button type="button" className="btn-finalizar">
                Finalizar Inscripción ✓
              </button>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default Registration;
