import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navar from '../components/Navbar';
import Button from '../components/Button';

const News = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navar>
                <Button
                    onClick={() => navigate('/')} size='small'
                >Volver al inicio</Button>
            </Navar>
            <div style={{ padding: '2rem' }}>
                <h1>Novedades</h1>
                <p>Noticias del Centro Educativo.</p>
            </div>
        </>
    );
};

export default News;
