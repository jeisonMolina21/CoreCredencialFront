import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Image as ImageIcon,
  KeyRound,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import systemParameterService from '../services/systemParameterService';
import bannerService from '../services/bannerService';
import { HomePage as Home } from '../../../public/home';
import Navbar from '../../../../layouts/public/Navbar';
import Footer from '../../../../layouts/public/Footer';
import { Plus, Trash2, Eye, Layout as LayoutIcon, Laptop, Monitor, Smartphone, RefreshCw, Lock } from 'lucide-react';
import styles from './SystemParameters.module.css';

const SystemParameters = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    login: true,
    maintenance: false,
    path_image_system: ''
  });

  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    link_url: '',
    file: null,
    previewUrl: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [viewportWidth, setViewportWidth] = useState('desktop'); // 'desktop', 'mobile'

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await systemParameterService.getParameters();
      const params = data.data || data;
      setFormData({
        login: Boolean(params.login),
        maintenance: Boolean(params.maintenance),
        path_image_system: params.path_image_system || ''
      });
    } catch (error) {
      console.error('Error loading parameters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBanners = async () => {
    try {
      const data = await bannerService.getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  };

  useEffect(() => {
    loadData();
    loadBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await systemParameterService.updateParameters(formData);
      alert('Parámetros guardados correctamente.');
    } catch (error) {
      alert(error.message || 'Error al guardar los ajustes');
    } finally {
      setIsSaving(false);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (newBanner.previewUrl) URL.revokeObjectURL(newBanner.previewUrl);
      setNewBanner({
        ...newBanner,
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleBannerUpload = async (e) => {
    e.preventDefault();
    if (!newBanner.file) return alert('Selecciona una imagen');

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', newBanner.file);
      formData.append('title', newBanner.title);
      formData.append('subtitle', newBanner.subtitle);
      formData.append('link_url', newBanner.link_url);

      await bannerService.createBanner(formData);

      if (newBanner.previewUrl) URL.revokeObjectURL(newBanner.previewUrl);
      setNewBanner({ title: '', subtitle: '', link_url: '', file: null, previewUrl: null });

      loadBanners();
      alert('Banner añadido correctamente');
    } catch (error) {
      alert(error.message || 'Error al subir el banner');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('¿Eliminar este banner?')) return;
    try {
      await bannerService.deleteBanner(id);
      loadBanners();
    } catch (error) {
      alert(error.message || 'Error al eliminar');
    }
  };

  const handleToggleBanner = async (id) => {
    try {
      await bannerService.toggleBannerStatus(id);
      loadBanners();
    } catch (error) {
      alert(error.message || 'Error al cambiar estado');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <p>Cargando configuraciones globales...</p>
      </div>
    );
  }

  return (
    <Motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Parámetros Generales</h1>
          <p className={styles.subtitle}>Configuración maestra del núcleo del sistema.</p>
        </div>
      </div>

      <form className={styles.configCard} onSubmit={handleSave}>

        {/* URL Logotipo Global */}
        <div className={styles.formGroup}>
          <label>
            <ImageIcon size={18} />
            Ruta del Logotipo de Plataforma
          </label>
          <input
            type="url"
            name="path_image_system"
            placeholder="https://midominio.com/logo.png o ruta relativa /assets/logo.png"
            value={formData.path_image_system}
            onChange={handleChange}
          />
          <small style={{ color: 'var(--text-muted)' }}>Esta URL definirá el logo principal en todo el backoffice.</small>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Restricciones de Plataforma</h3>

        {/* Login Switch */}
        <div className={styles.switchContainer}>
          <div className={styles.switchText}>
            <span className={styles.switchTitle}>
              <KeyRound size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} />
              Habilitar Logueo
            </span>
            <span className={styles.switchDesc}>Permite a los usuarios y administradores iniciar sesión.</span>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              name="login"
              checked={formData.login}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {/* Maintenance Switch (Danger) */}
        <div className={styles.switchContainer}>
          <div className={styles.switchText}>
            <span className={styles.switchTitle} style={{ color: '#EF4444' }}>
              <AlertTriangle size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} />
              Modo Mantenimiento
            </span>
            <span className={styles.switchDesc}>Apaga el acceso al sistema público temporalmente mostrando una pantalla de error.</span>
          </div>
          <label className={`${styles.switch} ${styles.dangerSwitch}`}>
            <input
              type="checkbox"
              name="maintenance"
              checked={formData.maintenance}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {/* Footer actions */}
        {/* Footer actions */}
        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {isSaving ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
            {isSaving ? 'Guardando...' : 'Aplicar Configuraciones'}
          </button>
        </div>
      </form>

      {/* Banner Management Section */}
      <div className={styles.bannerSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionInfo}>
            <h3 className={styles.sectionTitle}>
              <LayoutIcon size={20} />
              Gestión de Banners de Inicio
            </h3>
            <p className={styles.sectionDesc}>Optimiza el impacto visual de tu landing page.</p>
          </div>
          <button
            className={`${styles.previewToggle} ${isPreviewVisible ? styles.active : ''}`}
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
          >
            <Eye size={18} />
            {isPreviewVisible ? 'Ocultar Previsualización' : 'Ver Previsualización'}
          </button>
        </div>

        {/* Live Preview Area - Mock Browser */}
        {isPreviewVisible && (
          <Motion.div
            className={styles.browserMock}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            {/* Browser Header */}
            <div className={styles.browserHeader}>
              <div className={styles.browserDots}>
                <span className={styles.dotRed}></span>
                <span className={styles.dotYellow}></span>
                <span className={styles.dotGreen}></span>
              </div>
              <div className={styles.browserAddressBar}>
                <Lock size={12} />
                <span>carnetdigital.com/incognito</span>
                <RefreshCw size={12} className={styles.refreshIcon} />
              </div>
              <div className={styles.viewportControls}>
                <button
                  className={viewportWidth === 'desktop' ? styles.active : ''}
                  onClick={() => setViewportWidth('desktop')}
                >
                  <Monitor size={16} />
                </button>
                <button
                  className={viewportWidth === 'mobile' ? styles.active : ''}
                  onClick={() => setViewportWidth('mobile')}
                >
                  <Smartphone size={16} />
                </button>
              </div>
            </div>

            {/* Browser Content */}
            <div className={`${styles.browserContent} ${styles[viewportWidth]}`}>
              <div className={styles.scaleWrapper}>
                <div className={styles.nonInteractive}>
                  <Navbar />
                </div>
                <Home
                  previewBanners={newBanner.file ? [
                    ...banners.filter(b => b.is_active),
                    {
                      id: 'temp',
                      image_url: newBanner.previewUrl,
                      title: newBanner.title || 'Previsualización',
                      link_url: newBanner.link_url,
                      is_active: true
                    }
                  ] : banners.filter(b => b.is_active)}
                />
                <div className={styles.nonInteractive}>
                  <Footer />
                </div>
              </div>
            </div>

            <div className={styles.previewFooter}>
              <Eye size={12} />
              PÁGINA DE INICIO - VISTA PREVIA ADMINISTRATIVA
            </div>
          </Motion.div>
        )}

        <div className={styles.managerGrid}>
          {/* Upload Form */}
          <div className={styles.uploadCard}>
            <h4 className={styles.cardTitle}>NUEVO BANNER</h4>
            <form onSubmit={handleBannerUpload} className={styles.uploadForm}>
              <div className={styles.uploadField}>
                <label>Imagen del Banner</label>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    id="banner-file"
                  />
                  <label htmlFor="banner-file" className={styles.fileLabel}>
                    <ImageIcon size={20} />
                    {newBanner.file ? newBanner.file.name : 'Seleccionar Imagen'}
                  </label>
                </div>
                <small className={styles.helpText}>Relación sugerida 16:5 (Ej: 1920x600px)</small>
              </div>

              <div className={styles.uploadField}>
                <label>Título (Referencia)</label>
                <input
                  type="text"
                  placeholder="Ej: Promo Verano"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                />
              </div>

              <div className={styles.uploadField}>
                <label>Enlace Externo (URL)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newBanner.link_url}
                  onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                />
              </div>

              <button type="submit" className={styles.addBtn} disabled={isUploading || !newBanner.file}>
                {isUploading ? <Loader size={18} className="spin" /> : <Plus size={18} />}
                Subir y Activar
              </button>
            </form>
          </div>

          {/* Banners List */}
          <div className={styles.listCard}>
            <h4 className={styles.cardTitle}>BANNERS INSTALADOS ({banners.length})</h4>
            <div className={styles.bannersScrollList}>
              {banners.map((banner) => (
                <div key={banner.id} className={`${styles.bannerItemRow} ${!banner.is_active ? styles.inactive : ''}`}>
                  <div className={styles.bannerMetaThumb}>
                    <img src={banner.image_url?.startsWith('blob:') ? banner.image_url : `${import.meta.env.VITE_API_URL}${banner.image_url}`} alt="" />
                  </div>
                  <div className={styles.bannerRowInfo}>
                    <span className={styles.rowTitle}>{banner.title || 'Sin Título'}</span>
                    <div className={styles.rowActions}>
                      <button
                        onClick={() => handleToggleBanner(banner.id)}
                        className={`${styles.rowToggle} ${banner.is_active ? styles.active : ''}`}
                        title={banner.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {banner.is_active ? 'Activo' : 'Oculto'}
                      </button>
                      <button onClick={() => handleDeleteBanner(banner.id)} className={styles.rowDelete}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {banners.length === 0 && (
                <div className={styles.emptyRowState}>
                  <AlertTriangle size={24} />
                  <p>Sin banners activos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default SystemParameters;
