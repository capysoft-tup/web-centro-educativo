import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Inicio</h1>
      <p>Niveles educativos.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/about">Sobre Nosotros</Link>
        <Link to="/contact">Contacto</Link>
      </div>
    </div>
  );
};

export default Home;
