import React from 'react';
import { useNavigate } from 'react-router-dom';
import { images } from '../services/imagesConfig';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <img
          loading="lazy"
          src={images.notFound404}
          alt="404"
          style={{ maxWidth: '600px', display: 'block', margin: '0 auto 20px' }}
        />

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Error 404</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
          Parece que te perdiste, no existe esta página
        </p>
        <Button onClick={() => navigate('/')} size="large">
          Volver al inicio
        </Button>
      </div>
    </>
  );
};

export default NotFound;
