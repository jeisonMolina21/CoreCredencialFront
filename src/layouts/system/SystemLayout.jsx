import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users2,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Package,
  CreditCard
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/contexts/AuthContext';
import styles from './SystemLayout.module.css';
import logo from '../../assets/CarnetDigital.png';

const SystemLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/system/home' },
    { icon: <Building2 size={22} />, label: 'Empresas', path: '/system/companies' },
    { icon: <Package size={22} />, label: 'Planes', path: '/system/plans' },
    { icon: <CreditCard size={22} />, label: 'Suscripciones', path: '/system/subscriptions' },
    { icon: <Users2 size={22} />, label: 'Usuarios', path: '/system/users' },
    { icon: <ShieldCheck size={22} />, label: 'Roles', path: '/system/roles' },
    { icon: <Settings size={22} />, label: 'Parámetros', path: '/system/parameters' },
  ];

  return (
    <div className={styles.layoutWrapper}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <img src={logo} alt="Carnet Digital" className={styles.logo} />
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
            {!isCollapsed && <span>Cerrar Sesión</span>}
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
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h2 className={styles.pageTitle}>
              {menuItems.find(item => item.path === location.pathname)?.label || 'Sistema'}
            </h2>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.notificationBadge} />
            </button>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.name || 'Administrador'}</span>
                <span className={styles.userRole}>{user?.system_role === 'admin' ? 'Super Admin' : 'Admin'}</span>
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

export default SystemLayout;
