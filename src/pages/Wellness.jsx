import React from 'react';
import Navbar from '../components/Navbar';
import WellnessHero from '../components/organisms/WellnessHero';
import ServicesBento from '../components/organisms/ServicesBento';
import '../styles/Wellness.css';

const Wellness = () => {
  return (
    <div className="wellness-page-container">
      <Navbar />
      <main className="wellness-main-content">
        <WellnessHero 
          onScheduleClick={() => alert('¡Redireccionando al sistema de turnos de Bienestar!')}
          onEmergencyClick={() => alert('Llamando a la línea de emergencias médicas del campus: +54 362 4XXXXXX')}
        />

        <ServicesBento />
      </main>
    </div>
  );
};

export default Wellness;

