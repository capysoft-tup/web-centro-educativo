import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import Button from './Button';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="custom-navbar">
      <div className="navbar-content">
        <div className="navbar-logo" role="none" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="navbar-logo-icon" onError={(e) => e.target.style.display = 'none'} />
          <span>Educar para Transformar</span>
        </div>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Inicio</NavLink>
          <NavLink to="/wellness" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Bienestar</NavLink>
          <NavLink to="/news" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Noticias</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Galería</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contacto</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Inscripciones</NavLink>
          <NavLink to="/employment-request" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Empleo</NavLink>
        </div>

        <div className="navbar-actions">
          {isLoggedIn && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex pl-3 pr-3 items-center gap-2.5 px-4.5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-label font-bold text-sm shadow-md hover:from-orange-600 hover:to-amber-600 transition-all duration-200 cursor-pointer focus:outline-none"
              >
                <span className="material-symbols-outlined text-lg flex items-center justify-center" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_circle
                </span>
                <span>Hola, {user.username}</span>
                <span className="material-symbols-outlined text-sm flex items-center justify-center transition-transform duration-200" style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-200 rounded-xl shadow-[0px_10px_25px_rgba(0,0,0,0.08)] py-2 space-y-1 z-30 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  <button
                    onClick={() => {
                      alert("Esta sección de perfil aún no está disponible.");
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-semibold cursor-pointer text-left focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-slate-400 text-lg">
                      person
                    </span>
                    Ver Perfil
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold cursor-pointer text-left focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-red-400 text-lg">
                      logout
                    </span>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="primary" onClick={() => navigate('/login')}>Acceso Usuario</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
