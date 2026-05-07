import React from 'react';
import Navbar from '../components/Navbar';
import LargeCard from '../components/LargeCard';
import '../styles/News.css';
import LittleCard from '../components/LittleCard';


const News = () => {
    return (
        <>
            <Navbar />
            <div style={{ padding: '2rem' }}>
                <h1>Noticias y Eventos</h1>
                <p>Descubre todo lo que sucede en nuestra comunidad educativa. ¡Celebramos juntos el aprendizaje!</p>
                <div className="grilla-noticias">
                    <div className="grilla-principal">
                        <LargeCard
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuBN7zn9T6w4eEkeIQYpNMznyZpax5iq8X5GMRwnO64Wd3Jwk40uc6UTkNtiEWTJPXWNHjDvMnMLWFkOJ8gPb3L568qcnba5REYQunXs1cix2txkisctwudS00dc9MUaZKdYm_MgrwDueAWfJ21UC067nPJ2kpQqEGp5FlHajDjuafnJ2mQ6iNkJuoKFkUtV8CWWGTtwNOS_URejIrf51wUMYCslu6D3kk-VE7cQU7pCUB4H58scUCqf03izDLv587LKKMtJmfJ3rBw"
                            label="Destacado"
                            title="Feria de Ciencias 2024: Innovación Estudiantil"
                            subtitle="Nuestros alumnos de secundaria presentaron proyectos increíbles sobre energías renovables y robótica aplicada. ¡Un orgullo para toda la comunidad!"
                            buttonText="Leer más"
                            onClick={() => alert("Navegando a la noticia...")}
                        />
                        <div className="proximos-eventos">
                            <LittleCard
                                title="Dia de la familia"
                                location="Parque de la democracia"
                                date="15 JUL"
                                color="#ea8518ff" />
                            <LittleCard
                                title="Dia de la familia"
                                location="Parque de la democracia"
                                date="15 JUL"
                                color="#5ae55aff" />
                            <LittleCard
                                title="Dia de la familia"
                                location="Parque de la democracia"
                                date="15 JUL"
                                color="#6696eeff" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default News;
