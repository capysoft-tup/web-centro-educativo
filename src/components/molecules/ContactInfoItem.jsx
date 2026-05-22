import React from 'react';
import Icon from '../atoms/Icon';
import '../../styles/Contact.css'; // Compartirá los estilos generales de Contact

/**
 * Molécula ContactInfoItem
 * Renderiza una fila de datos de contacto con un icono circular a la izquierda.
 */
const ContactInfoItem = ({
  icon,
  iconVariant = 'primary',
  label,
  value
}) => {
  return (
    <div className="contact-info-item">
      <div className={`contact-info-icon-wrapper ${iconVariant}`}>
        <Icon name={icon} filled={true} className="text-2xl" />
      </div>
      <div className="contact-info-text-container">
        <h3 className="contact-info-label">{label}</h3>
        <div className="contact-info-value">{value}</div>
      </div>
    </div>
  );
};

export default ContactInfoItem;
