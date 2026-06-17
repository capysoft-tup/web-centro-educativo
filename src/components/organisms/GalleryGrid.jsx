import React from 'react';
import GalleryCard from '../molecules/GalleryCard';
import Icon from '../atoms/Icon';

// Importar recursos gráficos locales de alta resolución
import { images } from '../../services/imagesConfig';
const { pool, stadium, lab, employment } = images;

/**
 * Componente GalleryGrid (Organismo)
 * Grid tipo Bento responsivo para mostrar los espacios del colegio.
 *
 * @param {Function} onVisitClick - Callback disparado al hacer clic en "Agendar Visita".
 */
const GalleryGrid = ({ onVisitClick, onImageClick }) => {
  const spaces = [
    {
      id: 'aquatic',
      title: 'Complejo Acuático',
      image: pool,
      altText: 'Vista de la pileta olímpica techada y bien iluminada',
      badgeText: 'Deporte y Bienestar',
      spanClass: 'col-span-1 md:col-span-2 row-span-2',
    },
    {
      id: 'football',
      title: 'Canchas Profesionales',
      image: stadium,
      altText: 'Cancha de fútbol de césped sintético profesional',
      spanClass: 'col-span-1 md:col-span-2 row-span-1',
    },
    {
      id: 'lab',
      title: 'Laboratorio Maker',
      image: lab,
      altText:
        'Estudiantes trabajando con microscopios y equipamiento tecnológico moderno',
      spanClass: 'col-span-1 md:col-span-1 row-span-1',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* 1. Renderizado dinámico de tarjetas de imagen mediante .map con imágenes locales */}
      {spaces.map((space, index) => (
        <GalleryCard
          key={space.id}
          title={space.title}
          image={space.image}
          altText={space.altText}
          badgeText={space.badgeText}
          spanClass={space.spanClass}
          onClick={() => onImageClick && onImageClick(index)}
        />
      ))}

      {/* 2. Tarjeta Informativa Especial ("Ver más espacios") usando Children */}
      <GalleryCard 
        spanClass="col-span-1 md:col-span-1 row-span-1"
        onClick={() => onImageClick && onImageClick(3)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary to-tertiary-container flex flex-col justify-center items-center text-center p-6 text-on-tertiary">
          <Icon
            name="photo_library"
            filled={true}
            className="text-on-tertiary text-5xl mb-4"
          />
          <h2 className="font-headline text-xl font-bold text-on-tertiary mb-2">
            Ver más espacios
          </h2>
          <p className="font-body text-sm text-on-tertiary/90">
            Explora las instalaciones
          </p>
        </div>
      </GalleryCard>

      {/* 3. Banner CTA Largo Inferior (Cierra el Bento Grid de 4 columnas) con imagen local */}
      <div className="col-span-1 md:col-span-4 row-span-1 relative rounded-xl overflow-hidden group bg-surface-container-high border border-surface-container-highest flex items-center justify-between p-8 md:p-12 text-left">
        <div className="z-10 max-w-xl">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-4">
            ¿Quieres conocer las instalaciones en persona?
          </h2>
          <p className="font-body text-sm md:text-base text-on-surface-variant mb-6">
            Agenda una visita guiada y siente la energía de nuestro campus.
          </p>
          <button
            onClick={onVisitClick}
            className="bg-secondary text-surface-container-lowest font-bold py-3.5 px-8 rounded-xl hover:bg-secondary-dim hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-secondary/20"
          >
            Agendar Visita
          </button>
        </div>

        {/* Imagen del lateral derecho con recurso local */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3">
          <img
            loading="lazy"
            alt="Estudiantes sonriendo compartiendo en el campus"
            className="w-full h-full object-cover rounded-l-[4rem] transform hover:scale-102 transition-transform duration-500"
            src={employment}
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryGrid;
