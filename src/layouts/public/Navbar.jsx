import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Menu, X, LogIn, ChevronRight } from 'lucide-react';
import styles from './Navbar.module.css';
import logo from '../../assets/CarnetDigital.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappLink = import.meta.env.VITE_WHATSAPP_LINK;

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.container}`}>
        <Link to="/" className={styles.logoLink}>
          <img
            src={logo}
            alt="Carnet Digital"
            className={styles.logoImg}
          />
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <a href="/#servicios" className={styles.navLink}>Servicios</a>
          <a href="/#suscripciones" className={styles.navLink}>Suscripciones</a>
          <a href="/#despliegue" className={styles.navLink}>Despliegue</a>
          <Link to="/blog" className={styles.navLink}>Blog</Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
          >
            <MessageCircle size={18} />
            Contacto
          </a>
          <a href="/login" className="btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
            <LogIn size={18} />
            Entrar
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={styles.mobileMenu}>
            <a href="/#servicios" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Servicios</a>
            <a href="/#suscripciones" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Suscripciones</a>
            <a href="/#despliegue" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Despliegue</a>
            <Link to="/blog" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Blog</Link>
            <div className={styles.mobileActions}>
              <a href={whatsappLink} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Contacto
              </a>
              <a href="/login" className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                Iniciar Sesión
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
