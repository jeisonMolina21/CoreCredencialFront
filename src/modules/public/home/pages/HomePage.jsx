import React, { useEffect, useState, useRef } from 'react';
import {
  Server,
  Globe,
  ChevronRight,
  CheckCircle2,
  MessageCircle,
  Star
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import styles from './home.module.css';
import { planService } from '../../../system/plans';
import HeroBanner from '../components/HeroBanner';
import ServicesSection from '../components/ServicesSection';

const Home = ({ previewBanners = null }) => {
  const whatsappLink = import.meta.env.VITE_WHATSAPP_LINK;
  const pricingConstraintsRef = useRef(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await planService.getAllPlans();
        if (response && response.data && Array.isArray(response.data)) {
          setPlans(response.data);
        } else if (Array.isArray(response)) {
          setPlans(response);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);


  return (
    <div className={styles.homePage}>
      <HeroBanner data={previewBanners} />
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.heroContent}>
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className={styles.heroTitle}>
                Gestión Inteligente de <span className="gradient-text">Carnets Digitales</span> y Credenciales
              </h1>
              <p className={styles.heroDescription}>
                Emite, administra y valida credenciales corporativas e institucionales en tiempo real. Diseña plantillas a la medida con nuestro creador visual, controla accesos con QR inteligente y centraliza tu organización con máxima seguridad y cumplimiento.
              </p>
              <div className={styles.heroActions} style={{ justifyContent: 'center' }}>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Empezar Ahora <ChevronRight size={20} />
                </a>
                <a href="#servicios" className="btn-outline">
                  Ver Funciones
                </a>
              </div>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Services Section (Bento Grid) */}
      <ServicesSection />

      {/* Pricing Section */}
      <section id="suscripciones" className={`section-padding ${styles.pricingSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="section-title">Planes Adaptados a su Crecimiento</h2>
            <p className="section-description">Seleccione el modelo que mejor se ajuste al volumen de su operación.</p>
          </div>

          <div className={styles.pricingSliderContainer} ref={pricingConstraintsRef}>
            <Motion.div
              className={styles.pricingSlider}
              drag="x"
              dragConstraints={pricingConstraintsRef}
              dragElastic={0.1}
            >
              {loading ? (
                <div style={{ textAlign: 'center', width: '100%', padding: '4rem' }}>Cargando planes...</div>
              ) : (
                <>
                  {plans.map((plan, index) => (
                    <Motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`${styles.priceCard} ${plan.id === 3 ? styles.featured : 'glass-card'}`}
                    >
                      <div className={styles.priceHeader}>
                        <p className={styles.priceName}>{plan.name}</p>
                        <div className={styles.priceValue}>
                          ${parseFloat(plan.price).toLocaleString('es-CO')}
                          <span className={styles.priceRef}> /mes</span>
                        </div>
                      </div>
                      <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                          <CheckCircle2 size={18} />
                          {parseInt(plan.max_users) >= 99999 ? 'Empleados ilimitados' : `${plan.max_users} Empleados`}
                        </li>
                        <li className={styles.featureItem}>
                          <CheckCircle2 size={18} />
                          {plan.max_templates_carnets} Plantillas personalizadas
                        </li>
                        <li className={styles.featureItem}><CheckCircle2 size={18} /> Soporte estándar</li>
                        {plan.id > 1 && <li className={styles.featureItem}><CheckCircle2 size={18} /> Reportes avanzados</li>}
                        {plan.id > 2 && <li className={styles.featureItem}><CheckCircle2 size={18} /> White-label branding</li>}
                      </ul>
                      <div className={styles.planButton}>
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={plan.id === 3 ? 'btn-primary' : `${styles.secondaryBtn} btn-outline`}
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          {plan.id === 1 ? 'Empezar Gratis' : 'Seleccionar Plan'}
                        </a>
                      </div>
                    </Motion.div>
                  ))}

                  {/* Expert / Custom Plan Card */}
                  <Motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: plans.length * 0.1 }}
                    className={`${styles.priceCard} ${styles.expertCard} glass-card`}
                  >
                    <div className={styles.priceHeader}>
                      <p className={styles.priceName}>Corporativo</p>
                      <div className={styles.priceValue}>
                        Enterprise
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Plan a Medida</h3>
                    <ul className={styles.featureList}>
                      <li className={styles.featureItem}>
                        <CheckCircle2 size={18} /> Usuarios y sedes ilimitadas
                      </li>
                      <li className={styles.featureItem}>
                        <CheckCircle2 size={18} /> Integración con API & Webhooks
                      </li>
                      <li className={styles.featureItem}>
                        <CheckCircle2 size={18} /> Consultoría en implementación
                      </li>
                      <li className={styles.featureItem}>
                        <CheckCircle2 size={18} /> Negociación de precios por volumen
                      </li>
                      <li className={styles.featureItem}>
                        <CheckCircle2 size={18} /> Soporte dedicado 24/7
                      </li>
                    </ul>
                    <div className={styles.planButton}>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', background: 'white', color: 'var(--secondary)' }}
                      >
                        Hablar con un Experto
                      </a>
                    </div>
                  </Motion.div>
                </>
              )}
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Deployment Section */}
      <section id="despliegue" className={`section-padding ${styles.deploymentSection}`}>
        <div className="container">
          <div className={styles.deploymentGrid}>
            <Motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.heroTitle} style={{ color: 'white' }}>
                Flexibilidad Total de <span className={styles.accentText}>Implementación</span>
              </h2>
              <p className={styles.heroDescription} style={{ color: '#94A3B8' }}>
                Entendemos que la privacidad de los datos es primordial. Ofrecemos modelos que se adaptan a su infraestructura técnica.
              </p>

              <div style={{ display: 'grid', gap: '2rem', marginTop: '3rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div className={styles.deploymentIcon}><Server size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Modelo On-Premise</h4>
                    <p style={{ color: '#94A3B8' }}>Instalación en sus propios servidores internos. Control absoluto de la base de datos y cumplimiento estricto de políticas de privacidad locales.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div className={styles.deploymentIcon}><Globe size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Modelo Gestionado (SaaS)</h4>
                    <p style={{ color: '#94A3B8' }}>Infraestructura en la nube con mantenimiento automático, copias de seguridad diarias y alta disponibilidad garantizada.</p>
                  </div>
                </div>
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-dark-card"
              style={{ padding: '3.5rem' }}
            >
              <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>¿Por qué Carnet Digital?</h3>
              <ul className={styles.featureList} style={{ marginBottom: '2.5rem' }}>
                <li className={styles.featureItem} style={{ color: '#E2E8F0' }}><Star size={20} color="var(--accent)" fill="var(--accent)" /> Seguridad criptográfica y validación QR antifraude</li>
                <li className={styles.featureItem} style={{ color: '#E2E8F0' }}><Star size={20} color="var(--accent)" fill="var(--accent)" /> Puesta en marcha express en menos de 24 horas</li>
                <li className={styles.featureItem} style={{ color: '#E2E8F0' }}><Star size={20} color="var(--accent)" fill="var(--accent)" /> Diseñador visual Drag & Drop sin conocimientos técnicos</li>
                <li className={styles.featureItem} style={{ color: '#E2E8F0' }}><Star size={20} color="var(--accent)" fill="var(--accent)" /> Soporte técnico prioritario y disponibilidad del 99.9%</li>
              </ul>
              <a href={whatsappLink} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Agendar una Demo
              </a>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`section-padding ${styles.ctaSection}`}>
        <div className="container">
          <Motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.ctaBox}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>¿Listo para digitalizar la identidad de tu equipo?</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
              Únete a las empresas e instituciones líderes que confían en Carnet Digital para modernizar sus identificaciones, proteger accesos y optimizar la gestión de talento humano.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: 'white', color: 'var(--primary)' }}>
                <MessageCircle size={20} /> Hablar con un Experto
              </a>
            </div>
          </Motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
