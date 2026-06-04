import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Icon from '../components/atoms/Icon';
import SuccessModal from '../components/molecules/SuccessModal';
import GalleryHero from '../components/organisms/GalleryHero';
import GalleryGrid from '../components/organisms/GalleryGrid';

const Gallery = () => {
  // Modal state for booking a visit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    level: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Submit visit booking
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre completo es requerido.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Introduce un correo válido.';
    }
    if (!formData.date) {
      newErrors.date = 'Debes seleccionar una fecha para la visita.';
    }
    if (!formData.level) {
      newErrors.level = 'Selecciona el nivel educativo de interés.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Simulate scheduling delay with loader
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', date: '', level: '' });
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setSubmitSuccess(false);
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-surface text-on-surface">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-10 pb-24 px-6 max-w-7xl mx-auto">
        {/* Gallery Hero Component (Organism) */}
        <GalleryHero />

        {/* Gallery Grid Component (Organism) */}
        <GalleryGrid onVisitClick={() => setIsModalOpen(true)} />
      </main>

      {/* 1. Modal de Reserva de Visita (Glassmorphism booking overlay) */}
      {isModalOpen && !submitSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 max-w-md w-full rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl relative text-left animate-in zoom-in-95 duration-300">
            
            {/* Botón cerrar */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <Icon name="close" className="text-xl" />
            </button>

            <div className="mb-6 flex flex-col gap-2">
              <h3 className="font-headline text-2xl font-bold text-slate-800 dark:text-slate-100">Agendar Visita</h3>
              <p className="font-body text-sm text-slate-500 dark:text-slate-400">
                Completa tus datos y selecciona la fecha para tu visita guiada al campus de Resistencia.
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant">Nombre Completo</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-surface-container focus:bg-surface-container-lowest border border-transparent ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-primary/30'} rounded-xl px-4 py-3 font-body text-on-surface text-sm transition-all outline-none`} 
                  placeholder="Ej. Carlos Mendoza"
                />
                {errors.name && <span className="text-xs text-red-500 font-semibold">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant">Correo de Contacto</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-surface-container focus:bg-surface-container-lowest border border-transparent ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-primary/30'} rounded-xl px-4 py-3 font-body text-on-surface text-sm transition-all outline-none`} 
                  placeholder="carlos@ejemplo.com"
                />
                {errors.email && <span className="text-xs text-red-500 font-semibold">{errors.email}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Fecha */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant">Fecha</label>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full bg-surface-container focus:bg-surface-container-lowest border border-transparent ${errors.date ? 'border-red-500 focus:border-red-500' : 'focus:border-primary/30'} rounded-xl px-4 py-3 font-body text-on-surface text-sm transition-all outline-none`} 
                  />
                  {errors.date && <span className="text-xs text-red-500 font-semibold">{errors.date}</span>}
                </div>

                {/* Nivel */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant">Nivel</label>
                  <select 
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className={`w-full bg-surface-container focus:bg-surface-container-lowest border border-transparent ${errors.level ? 'border-red-500 focus:border-red-500' : 'focus:border-primary/30'} rounded-xl px-4 py-3 font-body text-on-surface text-sm transition-all outline-none`} 
                  >
                    <option value="">Nivel...</option>
                    <option value="inicial">Inicial</option>
                    <option value="primario">Primario</option>
                    <option value="secundario">Secundario</option>
                  </select>
                  {errors.level && <span className="text-xs text-red-500 font-semibold">{errors.level}</span>}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-4 bg-gradient-to-br from-secondary to-secondary-dim text-white py-4 rounded-full font-bold text-base hover:shadow-xl hover:shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Agendando...</span>
                  </>
                ) : (
                  <>
                    <Icon name="event" className="text-lg" />
                    <span>Confirmar Visita</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal de Éxito al Agendar */}
      <SuccessModal 
        isOpen={submitSuccess}
        onClose={handleCloseSuccess}
        title="¡Visita Agendada!"
        message="Hemos registrado tu reserva para la visita guiada con éxito. Te hemos enviado un correo de confirmación con los horarios y los detalles de acceso al campus."
        buttonText="Excelente"
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />

    </div>
  );
};

export default Gallery;
