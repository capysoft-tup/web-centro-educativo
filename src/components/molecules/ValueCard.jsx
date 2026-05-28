import React from 'react';
import Icon from '../atoms/Icon';

/**
 * Componente ValueCard (Molécula)
 * Representa una tarjeta de valores transversales con micro-animaciones y sombras personalizadas.
 * 
 * @param {string} title - Título del valor (ej. Bienestar Integral).
 * @param {string} description - Explicación detallada del valor.
 * @param {string} icon - Nombre del icono de Material Symbols (ej. 'favorite', 'psychology', 'handshake').
 * @param {string} iconBgClass - Clase de fondo Tailwind para el icono (ej. 'bg-primary-container/20').
 * @param {string} iconColorClass - Clase de color de texto Tailwind para el icono (ej. 'text-primary').
 * @param {string} shadowClass - Clase de sombra ambiental (ej. 'ambient-shadow-primary').
 */
const ValueCard = ({
  title,
  description,
  icon,
  iconBgClass = 'bg-primary-container/20',
  iconColorClass = 'text-primary',
  shadowClass = 'ambient-shadow-primary'
}) => {
  return (
    <div className={`bg-surface-container-lowest p-8 rounded-[2rem] ghost-border hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ${shadowClass} group cursor-pointer text-left`}>
      <div className={`w-14 h-14 rounded-2xl ${iconBgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
        <Icon name={icon} filled={true} className={`text-3xl ${iconColorClass}`} />
      </div>
      <h3 className="text-headline-md font-bold text-on-surface mb-4 font-headline">
        {title}
      </h3>
      <p className="text-on-surface-variant font-body leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  );
};

export default ValueCard;
