import React from 'react';
import Icon from '../atoms/Icon';
import '../../styles/Contact.css';

/**
 * Molécula MapCard
 * Renderiza la vista previa estática de un mapa con máscara hoverable y un enlace de Google Maps.
 */
const MapCard = ({
  imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBjOvDyAkDqc4cH-4kIshiMColNBJBTsr5oSQZfVMJQe8LQFKMmSiC4sIDF-4aXV5DkqoocrYhcYWHsfCWbpAkgTB6otXYTGa0N9qmrWTflywV2sAPbZfJtvP5XB-RRHoU8Or5dzqdKaWha5X2RDkUuv27xnrvnsLGnKJkpq1N8utidQaZzTcG70DucuADj1m6047lJ13EcmNrj9R7drdfKSbz_Nc_ajoPGxZRlFVC7mMt_yW6_x-LYGnWQk4GaF8u-uACJ2VGgdBM",
  locationName = "Av. Sarmiento 1234, Resistencia, Chaco",
  mapsUrl = "https://maps.google.com/?q=Av.+Sarmiento+1234,+Resistencia,+Chaco"
}) => {
  return (
    <a 
      href={mapsUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="contact-map-card group"
      aria-label={`Ver ubicación de ${locationName} en Google Maps`}
    >
      <img 
        src={imageUrl} 
        alt={`Mapa que muestra la ubicación en ${locationName}`} 
        className="contact-map-image"
      />
      <div className="contact-map-overlay" />
      <div className="contact-map-badge">
        <Icon name="map" className="text-sm" />
        <span className="contact-map-badge-text">Ver en Google Maps</span>
      </div>
    </a>
  );
};

export default MapCard;
