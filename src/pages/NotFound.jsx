import React from 'react';
import { useNavigate } from 'react-router-dom';
import image404 from '../assets/404.png';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <>
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <img src={image404} alt="404" style={{ maxWidth: '600px', marginBottom: '20px' }} />

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Error 404</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
          Parece que te perdiste, no existe esta página...
        </p>
        <Button
          onClick={() => navigate('/')} size='small'
        >Volver al inicio</Button>
      </div>
    </>
  );
};

export default NotFound;
