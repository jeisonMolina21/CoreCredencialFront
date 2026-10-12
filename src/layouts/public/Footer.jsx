import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <h3 className={styles.title}>Carnet Digital</h3>
            <p className={styles.mutedText}>
              Lideramos la emisión, validación y gestión inteligente de credenciales y carnets digitales corporativos con la más alta seguridad, control de acceso QR y personalización de marca.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}><Instagram size={20} /></a>
              <a href="#" className={styles.socialLink}><Linkedin size={20} /></a>
              <a href="#" className={styles.socialLink}><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>Servicios</h4>
            <ul className={styles.list}>
              <li>Gestión de Empleados</li>
              <li>Carnetización Digital Inteligente</li>
              <li>Control de Asistencia & QR</li>
              <li>Soporte Técnico Especializado</li>
            </ul>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>Contacto</h4>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <Phone size={18} /> +57 300 000 0000
              </li>
              <li className={styles.listItem}>
                <Mail size={18} /> contacto@carnetdigital.com
              </li>
              <li className={styles.listItem}>
                <MapPin size={18} /> Bogotá, Colombia
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Carnet Digital. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
