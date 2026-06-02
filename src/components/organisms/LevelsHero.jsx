import React from 'react';
import Icon from '../atoms/Icon';

/**
 * Componente LevelsHero (Organismo)
 * Sección Hero de bienvenida y cabecera para la página de Niveles Educativos.
 */
const LevelsHero = () => {
  return (
    <section className="group relative min-h-[500px] flex flex-col items-center justify-center text-center rounded-3xl overflow-hidden bg-surface-container-low p-8 md:p-16">
      {/* Círculo SUPERIOR IZQUIERDO (Verde) */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 bg-[#A2CE56]/45 rounded-full blur-xl pointer-events-none 
  transition-all duration-1000 ease-out 
  group-hover:translate-x-10 group-hover:translate-y-10 group-hover:scale-110"
      ></div>

      {/* Círculo INFERIOR DERECHO (Rosa) */}
      <div
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E85B9E]/65 rounded-full blur-xl pointer-events-none 
  transition-all duration-1000 ease-out 
  group-hover:-translate-x-10 group-hover:-translate-y-10 group-hover:scale-105"
      ></div>

      {/* Círculo INFERIOR IZQUIERDO (Azul) */}
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#359AD4]/40 rounded-full blur-xl pointer-events-none 
  transition-all duration-1000 ease-out 
  group-hover:translate-x-10 group-hover:-translate-y-10 group-hover:scale-110"
      ></div>

      {/* Círculo SUPERIOR DERECHO (Amarillo) */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 bg-[#F49A29]/40 rounded-full blur-xl pointer-events-none 
  transition-all duration-1000 ease-out 
  group-hover:-translate-x-10 group-hover:translate-y-10 group-hover:scale-105"
      ></div>

      <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in duration-500">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest ghost-border shadow-sm mb-4 select-none">
          <Icon
            name="star"
            filled={true}
            className="text-tertiary-container text-sm"
          />
          <span className="font-label text-label-md text-primary font-bold">
            Un Camino Continuo
          </span>
        </div>

        <h1 className="text-display-lg font-bold font-headline text-on-surface leading-tight">
          Formando{' '}
          <span className="bg-clip-text gradient-primary">líderes</span> con
          optimismo estructural.
        </h1>

        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-body">
          Desde los primeros pasos hasta la universidad, nuestro modelo
          educativo acompaña, desafía y nutre el potencial único de cada
          estudiante en un entorno vibrante y seguro.
        </p>
      </div>
    </section>
  );
};

export default LevelsHero;
