import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>Sobre Nosotros</h1>
        <p>Conoce más sobre nuestro centro y nuestros valores y misión.</p>
      </div>
    </>
  );
};

export default About;
