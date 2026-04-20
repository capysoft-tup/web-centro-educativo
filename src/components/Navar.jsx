import React from 'react';
import '../styles/Navar.css';

const Navbar = ({ title, children }) => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-content">
        <h1 className="navbar-logo">{title || "Centro Educativo"}</h1>
        <div className="navbar-actions">
          {/* Aquí se renderizarán los botones que pases como hijos */}
          {children}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
