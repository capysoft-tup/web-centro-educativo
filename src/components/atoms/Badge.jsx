import React from 'react';
import '../../styles/atoms/Badge.css';

/**
 * Componente Badge/Píldora para etiquetas y estados
 * @param {string} text - Texto a mostrar en el badge
 * @param {string} variant - 'primary' | 'secondary' | 'tertiary' | 'outline'
 * @param {boolean} animated - Si tiene una animación de punto pulsante (para estados activos)
 * @param {string} className - Clases de CSS adicionales
 */
const Badge = ({
  text,
  variant = 'primary',
  animated = false,
  className = ''
}) => {
  return (
    <div className={`custom-badge ${variant} ${className}`}>
      {animated && <span className="badge-pulse-dot" aria-hidden="true" />}
      <span>{text}</span>
    </div>
  );
};

export default Badge;
