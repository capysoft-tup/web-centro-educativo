import React from 'react';
import Icon from '../atoms/Icon';
import { images } from '../../services/imagesConfig';
import Badge from '../atoms/Badge';

/**
 * Componente HomeHero (Organismo)
 * Sección Hero de bienvenida para la página de Inicio.
 *
 * @param {Function} onStartJourney - Callback para "Comenzar el Viaje" (redirige a Inscripciones).
 * @param {Function} onLearnMore - Callback para "Saber Más" (redirige a Contacto).
 */
const HomeHero = ({ onStartJourney, onLearnMore }) => {
  return (
    <section className="relative w-full min-h-[800px] flex items-center justify-center px-6 overflow-hidden">
      {/* Imagen de fondo atenuada de la escuela */}
      <div className="absolute inset-0 z-0">
        <img
          loading="lazy"
          alt="Campus"
          className="w-full h-full object-cover opacity-15 mix-blend-multiply"
          src={images.escuela}
        />
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface"></div>
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Contenido Izquierdo */}
        <div className="flex flex-col gap-6 text-left animate-in fade-in duration-500">
          <span className="text-tertiary font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 select-none">
            <Badge
              text="Excelencia asegurada"
              variant="tertiary"
              animated={true}
              className="text-3xl"
            />
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface leading-tight font-headline">
            Educar para <br />
            <span className="text-secondary bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent">
              Transformar
            </span>
          </h1>

          <p className="text-xl text-on-surface-variant font-body max-w-lg leading-relaxed">
            Inspiramos, desafiamos y empoderamos a la próxima generación de
            líderes en un ambiente de aprendizaje vibrante y seguro.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={onStartJourney}
              className="bg-secondary text-surface-container-lowest font-headline font-bold px-8 py-4 rounded-full text-lg shadow-[0_20px_40px_rgba(42,71,0,0.15)] hover:bg-secondary-dim hover:-translate-y-1 active:translate-y-0 hover:shadow-lg hover:shadow-secondary/20 transition-all cursor-pointer"
            >
              Comenzar el Viaje
            </button>
            <button
              onClick={onLearnMore}
              className="bg-surface-container-highest text-on-surface font-headline font-semibold px-8 py-4 rounded-full text-lg hover:bg-surface-variant hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-slate-300/40"
            >
              Saber Más
            </button>
          </div>
        </div>

        {/* Logo/Gráfico de la Escuela Derecho */}
        <div className="relative hidden md:block animate-in slide-in-from-right-6 duration-700">
          <div className="w-full aspect-square bg-surface-container-lowest rounded-[3rem] shadow-[0_20px_40px_rgba(35,44,81,0.06)] flex items-center justify-center p-12 overflow-hidden relative border-4 border-secondary-container/20">
            {/* Gradientes decorativos flotantes */}

            {/* Logo Local Reutilizado */}
            <img
              loading="lazy"
              alt="Educar para Transformar Logo"
              className="w-full h-full object-cover opacity-100 transition-transform duration-600 hover:scale-125"
              src={images.logo}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
