import React from 'react';
import Navbar from '../components/Navar';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate()
  return (
    <>
      <Navbar>
        <Button
          onClick={() => navigate('/')} size='small'
        >Volver al inicio</Button>
      </Navbar>
      <div style={{ padding: '2rem' }}>
        <h1>Contacto</h1>
        <p>Ponte en contacto con nosotros enviando un mensaje directo.</p>
      </div>
    </>
  );
};

export default Contact;
