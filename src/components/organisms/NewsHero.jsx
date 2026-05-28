import React from 'react';

const NewsHero = () => {
  return (
    <header className="mb-16 text-center max-w-3xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-[3.5rem] leading-tight font-extrabold text-on-surface mb-6 font-headline tracking-tight">
        Noticias y <span className="text-primary bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Eventos</span>
      </h1>
      <p className="text-lg text-on-surface-variant font-body leading-relaxed">
        Descubre todo lo que sucede en nuestra comunidad educativa. ¡Celebramos juntos el aprendizaje y el crecimiento!
      </p>
    </header>
  );
};

export default NewsHero;
