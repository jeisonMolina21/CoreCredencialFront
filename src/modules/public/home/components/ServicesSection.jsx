import React from 'react';
import { motion as Motion } from 'framer-motion';
import styles from '../pages/home.module.css';
import DynamicIcon from './DynamicIcon';
import { defaultServices } from '../data/servicesData';

/**
 * =============================================================================
 * COMPONENTE: ServicesSection
 * =============================================================================
 * Responsabilidad: Renderiza la cuadrícula de servicios y funcionalidades
 * de forma dinámica, adaptable y responsiva ante cualquier cantidad de items.
 * =============================================================================
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

/**
 * Cuadrícula dinámica de servicios y funcionalidades.
 *
 * ¿Qué hace?
 *   - Mapea y renderiza una cuadrícula fluida de tarjetas de servicios con animaciones framer-motion.
 *
 * ¿Qué recibe?
 *   - services (Array<object>, opcional): Colección de servicios a mostrar. Por defecto usa defaultServices.
 *
 * ¿Qué analiza/valida?
 *   - Garantiza keys únicas para React (usando service.id o fallback por índice).
 *   - Despliega etiquetas visuales (badges) si el item las contiene.
 *   - Admite contenido de texto simple o nodos JSX en la descripción.
 *
 * ¿Qué envía?
 *   - React.ReactElement: Sección responsive con encabezado y grid adaptable.
 */
const ServicesSection = ({ services = defaultServices }) => {
  // Filtra items válidos para evitar tarjetas vacías si un item está en borrador o incompleto
  const activeServices = Array.isArray(services)
    ? services.filter((service) => service && service.title && service.title.trim().length > 0)
    : [];

  return (
    <section id="servicios" className={styles.featuresSection}>
      <div className="container">
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <div className={styles.sectionHeader}>
            <Motion.h2 variants={itemVariants} className="section-title">
              Funcionalidades a su alcance
            </Motion.h2>
            <Motion.p variants={itemVariants} className="section-description">
              Potenciamos la seguridad y eficiencia de su empresa con herramientas diseñadas para el mercado moderno.
            </Motion.p>
          </div>

          <div className={styles.servicesGrid}>
            {activeServices.map((service, index) => {
              const serviceKey = service.id || `service-${index}`;
              const isHighlighted = Boolean(service.highlight);

              return (
                <Motion.div
                  key={serviceKey}
                  variants={itemVariants}
                  className={`${styles.serviceCard} glass-card ${isHighlighted ? styles.highlightedCard : ''}`}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      <DynamicIcon icon={service.icon} size={28} />
                    </div>
                    {service.badge && (
                      <span className={styles.cardBadge}>{service.badge}</span>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <div className={styles.cardText}>{service.text}</div>
                </Motion.div>
              );
            })}
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
