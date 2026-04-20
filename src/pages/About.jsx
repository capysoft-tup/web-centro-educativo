import React from 'react';
import Navbar from '../components/Navar';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate()
  return (
    <>
    <Navbar>
      <Button
        onClick={() => navigate('/')} size='small'
      >Volver al inicio</Button>
    </Navbar>
    <div style={{ padding: '2rem' }}>
      <h1>Sobre Nosotros</h1>
      <p>Conoce más sobre nuestro centro y nuestros valores y misión.</p>
    </div>
    </>
  );
};

export default About;
