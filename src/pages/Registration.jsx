import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navar';

const Registration = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar>
                <Button
                    onClick={() => navigate('/')} size='small'
                >Volver al inicio</Button>
            </Navbar>
            <div style={{ padding: '2rem' }}>
                <h1>Inicio</h1>
                <p>Registro.</p>
            </div>
        </>
    );
};

export default Registration;
