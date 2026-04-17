import React from 'react';
import { Link } from 'react-router-dom';
import image404 from '../assets/404.png';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <img src={image404} alt="404" style={{ maxWidth: '600px', marginBottom: '20px' }} />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Error 404</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
        Parece que te perdiste, no existe esta página...
      </p>

      <Link 
        to="/" 
        style={{ 
          padding: '0.8rem 1.5rem', 
          backgroundColor: '#0056b3', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;
