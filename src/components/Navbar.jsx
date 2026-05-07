import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navar.css';
import Button from './Button';
import logo from '../assets/logo.png'

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="custom-navbar">
      <div className="navbar-content">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="navbar-logo-icon" onError={(e) => e.target.style.display = 'none'} />
          <span>Educar para Transformar</span>
        </div>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Inicio</NavLink>
          <NavLink to="/wellness" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Bienestar</NavLink>
          <NavLink to="/news" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Noticias</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Galería</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contacto</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Inscripciones</NavLink>
          <NavLink to="/employment-request" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Empleo</NavLink>
        </div>

        <div className="navbar-actions">
          <Button variant="primary" onClick={() => navigate('/login')}>Acceso Usuario</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
