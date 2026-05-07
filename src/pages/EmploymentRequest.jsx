import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const EmploymentRequest = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar>
                <Button
                    onClick={() => navigate('/')} size='small'
                >Volver al inicio</Button>
            </Navbar>
            <div style={{ padding: '2rem' }}>
                <h1>Solicitud de empleo</h1>
                <p>Formulario de solicitud de empleo.</p>
            </div>
        </>
    );
};

export default EmploymentRequest;
