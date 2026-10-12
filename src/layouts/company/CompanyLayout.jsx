import React from 'react';
import {
  BarChart3,
  Users,
  Briefcase,
  CreditCard as CardIcon,
  Calendar,
  Repeat,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Map as MapIcon,
  Palette,
  ShieldAlert,
  ArrowLeft,
  Building2
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/contexts/AuthContext';
import { companyService } from '../../modules/system/companies';
import styles from './CompanyLayout.module.css';
import logo from '../../assets/CarnetDigital.png';

const CompanyLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, branding, updateBranding, logout, stopImpersonating } = useAuth();

  React.useEffect(() => {
    const fetchBranding = async () => {
      try {
        if (user?.company_id && !branding) {
          const response = await companyService.getCompanyById(user.company_id);
          const data = response.data || response;
          
          if (data && data.parameters) {
            updateBranding({
              ...data.parameters,
              logo: data.path_image,
              name: data.name,
              company_id: user.company_id // Guardamos para saber si el branding coincide
            });
          }
        }
      } catch (error) {
        console.error('Error loading branding:', error);
      }
    };
    fetchBranding();
  }, [user?.company_id, branding, updateBranding]);

  // Si cambiamos de empresa (impersonación), debemos forzar la recarga del branding si no coincide
  React.useEffect(() => {
    if (user?.company_id && branding && branding.company_id !== user.company_id) {
        updateBranding(null); // Esto disparará el fetch anterior
    }
  }, [user?.company_id, branding, updateBranding]);

  const dynamicStyles = branding ? {
    '--primary': branding.primary_color,
    '--secondary': branding.secondary_color,
    '--border-radius': branding.border_radius,
    '--font-family': branding.font_family + ', sans-serif'
  } : {};

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReturnToSystem = () => {
    const restored = stopImpersonating();
    if (restored) {
      navigate('/system/companies');
    } else {
      // En caso de que se pierda el backup, al menos cerramos sesión
      logout();
      navigate('/');
    }
  };

  const menuItems = [
    { icon: <BarChart3 size={22} />, label: 'Dashboard', path: '/company/home' },
    { icon: <Building2 size={22} />, label: 'Sedes', path: '/company/headquarters' },
    { icon: <MapIcon size={22} />, label: 'Áreas', path: '/company/areas' },
    { icon: <Briefcase size={22} />, label: 'Cargos', path: '/company/cargos' },
    { icon: <Users size={22} />, label: 'Colaboradores', path: '/company/users' },
    { icon: <Palette size={22} />, label: 'Plantillas', path: '/company/templates' },
    { icon: <CardIcon size={22} />, label: 'Carnetización', path: '/company/carnets' },
    { icon: <Calendar size={22} />, label: 'Eventos', path: '/company/events' },
    { icon: <Repeat size={22} />, label: 'Suscripción', path: '/company/subscription' },
    { icon: <Settings size={22} />, label: 'Configuración', path: '/company/parameter' },
  ];

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <div className={styles.layoutWrapper} style={dynamicStyles}>
      {/* Sidebar */}
      <aside className={`
        ${styles.sidebar} 
        ${isCollapsed ? styles.collapsed : ''} 
        ${branding?.sidebar_theme === 'light' ? styles.lightSidebar : ''}
        ${branding?.sidebar_theme === 'brand' ? styles.brandSidebar : ''}
      `}>
        <div className={styles.sidebarHeader}>
          <img
            src={branding?.logo ? `${API_URL}${branding.logo}` : logo}
            alt="Carnet Digital"
            className={styles.logo}
            style={(!branding?.logo && branding?.sidebar_theme !== 'light') ? { filter: 'brightness(0) invert(1)' } : {}}
          />
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
              {location.pathname === item.path && <div className={styles.activeIndicator} />}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={22} />
            {!isCollapsed && <span>Salir al Inicio</span>}
          </button>
          <button
            className={styles.toggleBtn}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainArea}>
        {user?.is_proxy && (
          <div className={styles.proxyBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldAlert size={18} />
              <span>MODO ADMINISTRADOR DE SISTEMA — Gestionando: {user?.company_name || 'Empresa'}</span>
            </div>
            <button className={styles.returnBtn} onClick={handleReturnToSystem}>
              <ArrowLeft size={16} />
              Volver al Panel
            </button>
          </div>
        )}

        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Buscar empleados, carnets..." />
            </div>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.notificationBadge} />
            </button>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {user?.name?.substring(0, 2).toUpperCase() ||
                  (user?.first_name ? user.first_name[0] : '') + (user?.last_name ? user.last_name[0] : '') || 'US'}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Usuario'}
                </span>
                <span className={styles.userRole}>
                  {user?.is_proxy ? 'Soporte Sistema' : (user?.role || 'Personal')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
