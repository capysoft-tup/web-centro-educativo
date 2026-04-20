import React from 'react';
import { useNavigate } from 'react-router-dom';

const Wellness = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar>
                <Button
                    onClick={() => navigate('/')} size='small'
                >Volver al inicio</Button>
            </Navbar>
            <div style={{ padding: '2rem' }}>
                <h1>Bienestar estudiantil</h1>
                <p>En nuestro centro, el bienestar de los estudiantes es nuestra prioridad. Ofrecemos una variedad de programas y recursos para apoyar su desarrollo académico, emocional y social.</p>
            </div>
        </>
    );
};

export default Wellness;    
