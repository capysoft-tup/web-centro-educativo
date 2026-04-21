import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navar';
import Button from '../components/Button';

const News = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar>
                <Button
                    onClick={() => navigate('/')} size='small'
                >Volver al inicio</Button>
            </Navbar>
            <div style={{ padding: '2rem' }}>
                <h1>Novedades</h1>
                <p>Noticias del Centro Educativo.</p>
            </div>
        </>
    );
};

export default News;
