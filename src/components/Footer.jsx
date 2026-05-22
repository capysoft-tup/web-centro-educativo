import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="custom-footer">
            <div className="footer-content">
                <div className="footer-info">
                    <h2 className="footer-title">Educar Para Transformar</h2>
                    <p className="footer-copyright">
                        © 2026 INSTITUTO EDUCAR PARA TRANSFORMAR. RESISTENCIA, CHACO.
                    </p>
                </div>
                <div className="footer-links">
                    <Link to="/" className="footer-link">FACEBOOK</Link>
                    <Link to="/" className="footer-link">INSTAGRAM</Link>
                    <Link to="/" className="footer-link">WHATSAPP</Link>
                    <Link to="/" className="footer-link">UBICACIÓN</Link>
                    <Link to="/privacy" className="footer-link">PRIVACIDAD</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;