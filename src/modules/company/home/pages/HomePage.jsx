import React, { useState, useEffect } from 'react';
import {
  Users,
  CreditCard as CardIcon,
  FileText,
  Clock,
  Briefcase,
  Building2,
  LayoutTemplate
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import styles from './home.module.css';
import dashboardService from '../services/dashboardService';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompanyHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalEmployees: 0,
      totalAreas: 0,
      totalRoles: 0,
      totalTemplates: 0,
      totalCarnets: 0,
      totalHeadquarters: 0
    },
    subscription: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await dashboardService.getStats();
        // El interceptor de axios ya desempaqueta el campo 'data', 
        // por lo que result ya contiene { stats, subscription }
        if (result && result.stats) {
          setData(result);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    { label: 'Empleados', value: data.stats.totalEmployees, icon: <Users />, color: '#0062E3' },
    { label: 'Sedes', value: data.stats.totalHeadquarters, icon: <Building2 />, color: '#8B5CF6' },
    { label: 'Áreas', value: data.stats.totalAreas, icon: <Building2 />, color: '#10B981' },
    { label: 'Cargos', value: data.stats.totalRoles, icon: <Briefcase />, color: '#F59E0B' },
    { label: 'Plantillas', value: data.stats.totalTemplates, icon: <LayoutTemplate />, color: '#6366F1' },
    { label: 'Carnets', value: data.stats.totalCarnets, icon: <CardIcon />, color: '#EC4899' },
  ];

  const planInfo = data.subscription ? {
    name: data.subscription.planName,
    renewalDate: new Date(data.subscription.renewalDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
    limits: [
      { label: 'Usuarios', current: data.stats.totalEmployees, max: data.subscription.limits.maxUsers },
      { label: 'Plantillas', current: data.stats.totalTemplates, max: data.subscription.limits.maxTemplates },
      { label: 'Carnets', current: data.stats.totalCarnets, max: data.subscription.limits.maxCarnets },
      { label: 'Sedes', current: data.stats.totalHeadquarters, max: data.subscription.limits.maxHeadquarters },
      { label: 'Áreas', current: data.stats.totalAreas, max: data.subscription.limits.maxAreas },
      { label: 'Cargos', current: data.stats.totalRoles, max: data.subscription.limits.maxRoles },
    ]
  } : null;

  // Calcular porcentaje de uso basado en empleados vs limite de usuarios
  const usagePercentage = planInfo && planInfo.limits[0].max > 0
    ? Math.round((planInfo.limits[0].current / planInfo.limits[0].max) * 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando dashboard...</div>;
  }

  return (
    <Motion.div
      className={styles.dashboard}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Info */}
      <div className={styles.welcomeHeader}>
        <div>
          <h1 className={styles.welcomeTitle}>¡Hola, {user?.name || 'Administrador'}! 👋</h1>
          <p className={styles.welcomeSubtitle}>Aquí tienes un resumen de la operación de **{user?.company_name || 'tu empresa'}** hoy.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statsCards.map((stat, index) => (
          <Motion.div key={index} className={styles.statCard} variants={itemVariants}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div className={styles.statBody}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </Motion.div>
        ))}
      </div>

      <div className={styles.contentGrid}>
        {/* Left Col: Main Operations */}
        <div className={styles.mainContent}>
          <Motion.div className={styles.sectionCard} variants={itemVariants}>
            <div className={styles.cardHeader}>
              <h3>Accesos Rápidos</h3>
            </div>
            <div className={styles.twoColGrid}>
              <div className={styles.shortcutBtn} onClick={() => navigate('/company/users')}>
                <Users size={24} />
                <span>Gestionar Personal</span>
              </div>
              <div className={styles.shortcutBtn} onClick={() => navigate('/company/headquarters')}>
                <Building2 size={24} />
                <span>Gestionar Sedes</span>
              </div>
              <div className={styles.shortcutBtn} onClick={() => navigate('/company/templates')}>
                <FileText size={24} />
                <span>Configurar Plantillas</span>
              </div>
            </div>
          </Motion.div>

          <Motion.div className={styles.sectionCard} variants={itemVariants}>
            <div className={styles.cardHeader}>
              <h3>Actividad Reciente</h3>
            </div>
            <p className={styles.emptyState}>No hay actividad reciente para mostrar.</p>
          </Motion.div>
        </div>

        {/* Right Col: Subscription & Info */}
        <aside className={styles.sidebarContent}>
          {planInfo && (
            <Motion.div className={`${styles.sectionCard} ${styles.planCard}`} variants={itemVariants}>
              <div className={styles.planHeader}>
                <CardIcon size={32} />
                <div>
                  <h4>{planInfo.name}</h4>
                  <span>Próximo pago: {planInfo.renewalDate}</span>
                </div>
              </div>

              <div className={styles.usageContainer}>
                <div className={styles.usageLabels}>
                  <span>Capacidad de Usuarios</span>
                  <span>{usagePercentage}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${usagePercentage}%` }} />
                </div>
              </div>

              <ul className={styles.limitList}>
                {planInfo.limits.map((limit, i) => (
                  <li key={i}>
                    <span className={styles.limitLabel}>{limit.label}</span>
                    <span className={styles.limitValue}>{limit.current} / {limit.max === 0 ? '∞' : limit.max}</span>
                  </li>
                ))}
              </ul>
            </Motion.div>
          )}

          <Motion.div className={styles.helpCard} variants={itemVariants}>
            <Clock size={32} />
            <h4>Soporte Técnico</h4>
            <p>¿Necesitas ayuda con las plantillas o la sincronización?</p>
            <button>Contactar Soporte</button>
          </Motion.div>
        </aside>
      </div>
    </Motion.div>
  );
};

export default CompanyHome;
