import React, { useState, useEffect, useRef } from 'react';
import {
    Palette,
    Upload,
    Type,
    Square,
    Layout,
    Save,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { companyService } from '../../../system/companies';
import styles from './CompanyParameter.module.css';

const CompanyParameter = () => {
    const { user, branding, updateBranding } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        primary_color: '#0062E3',
        secondary_color: '#001F3F',
        font_family: 'Inter',
        border_radius: '12px',
        sidebar_theme: 'brand2',
        logo: null
    });

    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        if (branding) {
            setForm({
                primary_color: branding.primary_color || '#0062E3',
                secondary_color: branding.secondary_color || '#001F3F',
                font_family: branding.font_family || 'Inter',
                border_radius: branding.border_radius || '12px',
                sidebar_theme: branding.sidebar_theme || 'brand2',
                logo: null
            });
            if (branding.logo) {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010';
                setLogoPreview(`${API_URL}${branding.logo}`);
            }
        }
    }, [branding]);

    const handleColorChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, logo: file }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (key === 'logo') {
                    if (form.logo) formData.append('logo', form.logo);
                } else {
                    formData.append(key, form[key]);
                }
            });

            const response = await companyService.updateCompanyParameters(user.company_id, formData);
            const resData = response.data || response;

            if (resData && (resData.parameters || resData.success)) {
                // Actualizar contexto global
                updateBranding({
                    ...resData.parameters,
                    logo: resData.company?.path_image || resData.path_image,
                    name: resData.company?.name || resData.name,
                    company_id: user.company_id
                });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error('Error updating parameters:', err);
            setError(err.message || 'Error al actualizar la configuración');
        } finally {
            setLoading(false);
        }
    };

    // Fonts setup
    const fonts = ['Inter', 'Roboto', 'Outfit', 'Montserrat', 'Poppins'];
    const radiusOptions = [
        { label: 'Cuadrado (0px)', value: '0px' },
        { label: 'Sutil (4px)', value: '4px' },
        { label: 'Estándar (8px)', value: '8px' },
        { label: 'Redondeado (12px)', value: '12px' },
        { label: 'Muy Redondeado (16px)', value: '16px' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Configuración Visual</h1>
                <p className={styles.subtitle}>Personaliza la identidad visual de tu plataforma corporativa.</p>
            </header>

            <form className={styles.contentGrid} onSubmit={handleSubmit}>
                <div className={styles.mainContent}>
                    <div className={styles.card}>
                        <h2 className={styles.sectionTitle}>
                            <Palette size={20} />
                            Colores y Marca
                        </h2>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Logo Corporativo</label>
                            <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <img
                                    src={logoPreview || '/placeholder-logo.png'}
                                    alt="Preview"
                                    className={styles.logoPreview}
                                />
                                <div className={styles.uploadPlaceholder}>
                                    <span className={styles.uploadText}>
                                        <Upload size={16} /> Subir nuevo logo
                                    </span>
                                    <span className={styles.uploadHint}>Recomendado: PNG con fondo transparente</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.colorGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Color Primario (Botones, Activos)</label>
                                <div className={styles.colorInputWrapper}>
                                    <input
                                        type="color"
                                        name="primary_color"
                                        value={form.primary_color}
                                        onChange={handleColorChange}
                                        className={styles.colorInput}
                                    />
                                    <span className={styles.colorHex}>{form.primary_color}</span>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Color Secundario (Barra Lateral)</label>
                                <div className={styles.colorInputWrapper}>
                                    <input
                                        type="color"
                                        name="secondary_color"
                                        value={form.secondary_color}
                                        onChange={handleColorChange}
                                        className={styles.colorInput}
                                    />
                                    <span className={styles.colorHex}>{form.secondary_color}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card} style={{ marginTop: '1.5rem' }}>
                        <h2 className={styles.sectionTitle}>
                            <Layout size={20} />
                            Interfaz y Tipografía
                        </h2>

                        <div className={styles.colorGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <Type size={16} style={{ marginRight: '5px' }} />
                                    Fuente del Sistema
                                </label>
                                <select
                                    className={styles.select}
                                    name="font_family"
                                    value={form.font_family}
                                    onChange={handleSelectChange}
                                >
                                    {fonts.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <Square size={16} style={{ marginRight: '5px' }} />
                                    Radio de Bordes
                                </label>
                                <select
                                    className={styles.select}
                                    name="border_radius"
                                    value={form.border_radius}
                                    onChange={handleSelectChange}
                                >
                                    {radiusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tema de la Barra Lateral</label>
                            <select
                                className={styles.select}
                                name="sidebar_theme"
                                value={form.sidebar_theme}
                                onChange={handleSelectChange}
                            >
                                <option value="brand2">Tema de Marca (Usa tu color secundario)</option>
                                <option value="brand">Tema de Marca (Usa tu color primario)</option>
                                <option value="light">Tema Claro (Limpio y Blanco)</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        {success && <span className={styles.successMsg}><CheckCircle2 size={18} /> Cambios guardados</span>}
                        {error && <span className={styles.errorMsg}><AlertCircle size={18} /> {error}</span>}
                        <button type="submit" className={styles.saveBtn} disabled={loading}>
                            <Save size={20} />
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>

                {/* Vista Previa Móvil/Sutil */}
                <div className={styles.previewSidebar}>
                    <span className={styles.previewLabel}>Vista Previa</span>
                    <div
                        className={styles.previewMockup}
                        style={{
                            '--mock-primary': form.primary_color,
                            '--mock-radius': form.border_radius,
                            '--mock-font': form.font_family,
                        }}
                    >
                        <div
                            className={styles.mockSidebar}
                            style={{
                                background: form.sidebar_theme === 'light' ? 'white' : (form.sidebar_theme === 'brand' ? form.primary_color : form.secondary_color)
                            }}
                        >
                            <div className={styles.mockLogo} style={logoPreview ? { backgroundImage: `url(${logoPreview})`, backgroundSize: 'cover' } : {}}></div>
                            <div className={styles.mockNavItemContainer}>
                                <div className={`${styles.mockNavItem} ${styles.active}`}></div>
                                <div className={styles.mockNavItem}></div>
                                <div className={styles.mockNavItem}></div>
                            </div>
                        </div>
                        <div className={styles.mockContent} style={{ fontFamily: form.font_family }}>
                            <div className={styles.mockBar}></div>
                            <div className={styles.mockCard}></div>
                            <div className={styles.mockCard} style={{ background: form.primary_color, height: '40px' }}></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CompanyParameter;
