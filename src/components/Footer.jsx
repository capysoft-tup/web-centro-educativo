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
                    <a href="#" className="footer-link">FACEBOOK</a>
                    <a href="#" className="footer-link">INSTAGRAM</a>
                    <a href="#" className="footer-link">WHATSAPP</a>
                    <a href="#" className="footer-link">UBICACIÓN</a>
                    <Link to="/privacy" className="footer-link">PRIVACIDAD</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;