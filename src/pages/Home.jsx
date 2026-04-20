import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navar';
import Button from '../components/Button';

const Home = () => {

  const navigate = useNavigate()
  return (
    <>
      <Navbar>
        <Button
          onClick={() => navigate('/about')} size='small'
        >About</Button>
        <Button
          onClick={() => navigate('/contact')} size='small'
        >Contact</Button>
      </Navbar>
      <div style={{ padding: '2rem' }}>
        <h1>Inicio</h1>
        <p>Bienvenido al Centro Educativo.</p>
      </div>
    </>
  );
};

export default Home;
