import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const SuccessRegistration = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '6rem 2rem', minHeight: 'calc(100svh - 64px)', background: '#f0f4f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', padding: '3rem 2rem', borderRadius: '1.25rem', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)', maxWidth: '500px', width: '100%' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', lineHeight: '1.2' }}>¡Inscripción Exitosa!</h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Hemos recibido tus datos correctamente. Nos pondremos en contacto contigo a la brevedad para continuar con el proceso.
          </p>
          <Button onClick={() => navigate('/')} size="large">
            Volver al inicio
          </Button>
        </div>
      </div>
    </>
  );
};

export default SuccessRegistration;
