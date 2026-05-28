import React from 'react';

/**
 * Componente GalleryHero (Organismo)
 * Encapsula la sección de bienvenida y cabecera de la galería.
 */
const GalleryHero = () => {
  return (
    <div className="mb-16 text-center max-w-3xl mx-auto animate-in fade-in duration-500">
      <h1 className="font-headline text-[3.5rem] leading-tight font-extrabold text-on-surface mb-6">
        Nuestros Espacios <span className="text-primary bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Inspiradores</span>
      </h1>
      <p className="font-body text-lg text-on-surface-variant leading-relaxed">
        Descubre un entorno diseñado para estimular la curiosidad, el bienestar y el aprendizaje activo. Desde laboratorios modernos hasta amplias áreas recreativas.
      </p>
    </div>
  );
};

export default GalleryHero;
