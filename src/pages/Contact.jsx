import React from 'react';
import Navbar from '../components/Navbar';
import ContactInfoCard from '../components/organisms/ContactInfoCard';
import MapCard from '../components/molecules/MapCard';
import ContactForm from '../components/organisms/ContactForm';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact-page-container">
      <Navbar />
      
      <main className="contact-main-content">
        <div className="contact-header">
          <h1 className="contact-title">Estamos aquí para ayudarte</h1>
          <p className="contact-subtitle">
            Conéctate con nosotros para cualquier consulta, inscripción o simplemente para conocer más sobre nuestro enfoque educativo vibrante en Resistencia.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-left-col">
            <ContactInfoCard />
            <MapCard />
          </div>

          <div className="contact-right-col">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;

