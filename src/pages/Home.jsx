import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>Inicio</h1>
        <p>Bienvenido al Centro Educativo.</p>
      </div>
    </>
  );
};

export default Home;
