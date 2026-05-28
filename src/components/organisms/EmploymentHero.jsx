import React from 'react';
import Icon from '../atoms/Icon';

// Importar recurso local
import employment from '../../assets/employment.png';

/**
 * Componente EmploymentHero (Organismo)
 * Sección Hero inicial para la página de empleo.
 * 
 * @param {Function} onVerVacantesClick - Callback para desplazarse a las vacantes.
 * @param {Function} onCargarCvClick - Callback para desplazarse al formulario de CV.
 */
const EmploymentHero = ({ onVerVacantesClick, onCargarCvClick }) => {
  return (
    <section className="relative bg-surface-container-low rounded-[2rem] p-8 md:p-16 overflow-hidden flex flex-col md:flex-row items-center gap-12 border border-surface-container-highest">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex-1 flex flex-col gap-6 relative z-10 text-left">
        <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full w-max">
          <Icon name="rocket_launch" filled={true} className="text-sm" />
          <span className="font-label text-xs uppercase tracking-widest font-bold">Únete al equipo</span>
        </div>
        
        <h1 className="font-headline text-[3rem] md:text-[3.5rem] leading-tight font-extrabold text-on-surface">
          Construye el futuro, <br />
          <span className="text-primary bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">inspira hoy.</span>
        </h1>
        
        <p className="font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
          Buscamos mentes creativas y apasionadas por la educación. Si crees en el poder transformador del aprendizaje, hay un lugar para ti en Educar.
        </p>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <button 
            onClick={onVerVacantesClick}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Ver Vacantes
          </button>
          <button 
            onClick={onCargarCvClick}
            className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-bold text-lg border border-primary/10 hover:bg-surface-container-high hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Cargar CV
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10">
        <img 
          alt="Profesores colaborando alegremente" 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
          src={employment}
        />
      </div>
    </section>
  );
};

export default EmploymentHero;
