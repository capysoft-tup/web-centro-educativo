import React from 'react';
import Navbar from '../components/Navbar';

const News = () => {
    return (
        <>
            <Navbar />
            <div style={{ padding: '2rem' }}>
                <h1>Novedades</h1>
                <p>Noticias del Centro Educativo.</p>
            </div>
        </>
    );
};

export default News;
