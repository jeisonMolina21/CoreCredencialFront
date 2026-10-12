import React from 'react';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  LayoutDashboard 
} from 'lucide-react';
import styles from './BrandingPreview.module.css';

const BrandingPreview = ({ config }) => {
  const { 
    primary_color = '#0062E3', 
    secondary_color = '#001F3F', 
    font_family = 'Inter', 
    border_radius = '12px',
    sidebar_theme = 'dark',
    logo = null
  } = config;

  // Estilos dinámicos para la maqueta
  const sidebarStyle = {
    backgroundColor: sidebar_theme === 'brand' ? primary_color : (sidebar_theme === 'light' ? '#FFFFFF' : secondary_color),
    color: sidebar_theme === 'light' ? '#1E293B' : '#FFFFFF',
    fontFamily: font_family
  };

  const primaryBtnStyle = {
    backgroundColor: primary_color,
    borderRadius: border_radius,
    fontFamily: font_family
  };

  const previewContainerStyle = {
    fontFamily: font_family
  };

  return (
    <div className={styles.previewContainer} style={previewContainerStyle}>
      <div className={styles.mockupHeader}>
        <span>Previsualización en vivo</span>
      </div>
      
      <div className={styles.mockupBody}>
        {/* Mini Sidebar */}
        <aside className={styles.miniSidebar} style={sidebarStyle}>
          <div className={styles.miniLogo}>
            {logo ? (
              <img src={URL.createObjectURL(logo)} alt="Logo Preview" />
            ) : (
              <div className={styles.logoPlaceholder} />
            )}
          </div>
          <div className={styles.miniNav}>
            <div className={`${styles.miniNavItem} ${styles.active}`} style={primaryBtnStyle}>
              <LayoutDashboard size={10} />
            </div>
            <div className={styles.miniNavItem}><BarChart3 size={10} /></div>
            <div className={styles.miniNavItem}><Users size={10} /></div>
            <div className={styles.miniNavItem}><Settings size={10} /></div>
          </div>
        </aside>

        {/* Mini content */}
        <div className={styles.miniMain}>
          <header className={styles.miniTopbar}>
            <div className={styles.miniSearch} />
            <div className={styles.miniActions}>
              <Bell size={10} />
              <div className={styles.miniAvatar} />
            </div>
          </header>
          <div className={styles.miniContent}>
            <div className={styles.miniTitle} />
            <div className={styles.miniGrid}>
              <div className={styles.miniCard} />
              <div className={styles.miniCard} />
              <div className={styles.miniCard} />
            </div>
            <button className={styles.miniBtn} style={primaryBtnStyle}>
              Botón de Ejemplo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPreview;
