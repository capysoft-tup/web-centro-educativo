import React from 'react';
import Navbar from '../components/Navar';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Levels = () => {
  const navigate = useNavigate()
  return (
    <>
      <Navbar>
        <Button onClick={() => navigate('/')} size="small">
          Volver al inicio
        </Button>
      </Navbar>
      <div style={{ padding: '2rem' }}>
      <h1>Niveles</h1>
      <p>Niveles educativos.</p>
    </div>
    </>
  );
};

export default Levels;
