import React from 'react';
import '../styles/Button.css';

/**
 * Componente Button reutilizable.
 * @param {string} variant - 'primary' | 'secondary' | 'ghost'
 * @param {string} size - 'small' | 'medium' | 'large'
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  type = 'button',
  className = '',
  disabled = false
}) => {
  return (
    <button
      type={type}
      className={`custom-button ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
