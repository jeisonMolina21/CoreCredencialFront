import React, { useState, useEffect } from 'react';
import {
    Mail, Lock, User, Building, UserPlus, Eye, EyeOff, Loader2,
    Check, ChevronRight, ChevronLeft, CreditCard, Image as ImageIcon,
    Users, Layout, Calendar, MapPin, Layers, Briefcase, Zap
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';
import { planService } from '../../../system/plans';
import { companyService } from '../../../system/companies';
import BrandingPreview from '../../../../components/common/BrandingPreview';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

import { formatCurrency } from '../../../../utils/formatters';
import styles from './auth.module.css';
import logoImg from '../../../../assets/CarnetDigital.png';

const FONTS = [
    'Inter', 'Montserrat', 'Roboto', 'Outfit',
    'Sora', 'Kanit', 'Public Sans', 'Space Grotesk', 'Syne'
];

const RegisterForm = ({ onToggle }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [selectedPlanData, setSelectedPlanData] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [paymentToken, setPaymentToken] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);

    const [formData, setFormData] = useState({
        fullname: '',
        company_name: '',
        nit_id: '',
        type_id: 'CC',
        number_id: '',
        email: '',
        password: '',
        plan_id: '',
        billing_cycle: 'MONTHLY',
        // Branding
        logo: null,
        primary_color: '#0062E3',
        secondary_color: '#001F3F',
        font_family: 'Inter',
        border_radius: '12px',
        sidebar_theme: 'dark'
    });

    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        const fetchConfigAndPlans = async () => {
            try {
                // Obtener configuración de MP
                const config = await authService.getPaymentConfig();
                if (config.publicKey) {
                    initMercadoPago(config.publicKey, { locale: 'es-CO' });
                }

                // Obtener planes
                const res = await planService.getAllPlans();
                const plansList = Array.isArray(res) ? res : res.data || [];
                setPlans(plansList);

                if (plansList.length > 0) {
                    const defaultPlan = plansList.find(p => p.is_default) || plansList[0];
                    setFormData(prev => ({ ...prev, plan_id: defaultPlan.id }));
                    setSelectedPlanData(defaultPlan);
                }
            } catch (err) {
                console.error('Error initialization:', err);
            }
        };
        fetchConfigAndPlans();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, logo: file }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setErrorMessage('');


        try {
            // Usamos FormData para el envío con archivos
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'logo') {
                    if (formData.logo) data.append('logo', formData.logo);
                } else {
                    data.append(key, formData[key]);
                }
            });


            const res = await authService.register(data);

            if (res.mp_subscription_id || res.id) {
                // Guardamos el ID para el componente Wallet y el link por si acaso
                setPreferenceId(res.mp_subscription_id || res.id);
                setPaymentToken(res.payment_link);
                setSuccessMessage('¡Cuenta creada correctamente! Por favor, completa el pago para continuar.');
                return;
            }

            if (formData.plan_id !== 'free' && (!res.mp_subscription_id && !res.id)) {
                setErrorMessage('La cuenta se creó pero hubo un problema al generar el botón de pago. Por favor, intenta iniciar sesión y completar el pago desde tu panel.');
                return;
            }

            setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo al login...');

            setTimeout(() => {
                onToggle();
            }, 2500);

        } catch (error) {
            setErrorMessage(error.message || 'Ocurrió un error inesperado durante el registro.');
            setCurrentStep(1); // Volver al inicio si hay error crítico
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = async () => {
        const isValid = await validateStep();
        if (isValid) {
            // Si estamos en el paso 4 (Branding) y el plan NO es gratuito, vamos al pago (paso 5)
            // Si el plan es gratuito, enviamos el formulario directamente
            if (currentStep === 4) {
                if (selectedPlanData && selectedPlanData.price > 0) {
                    setCurrentStep(5);
                } else {
                    handleSubmit();
                }
            } else {
                setCurrentStep(prev => Math.min(prev + 1, 5));
            }
        }
    };

    const validateStep = async () => {
        setErrorMessage('');

        if (currentStep === 1) {
            if (!formData.company_name.trim()) {
                setErrorMessage('La razón social es obligatoria');
                return false;
            }
            if (!formData.nit_id.trim()) {
                setErrorMessage('El NIT es obligatorio');
                return false;
            }

            setIsLoading(true);
            try {
                const res = await companyService.checkNit(formData.nit_id);
                if (res.exists) {
                    setErrorMessage('Este NIT ya se encuentra registrado');
                    return false;
                }
            } catch {
                setErrorMessage('Error al verificar el NIT');
                return false;
            } finally {
                setIsLoading(false);
            }
        }

        if (currentStep === 2) {
            if (!formData.plan_id) {
                setErrorMessage('Debes seleccionar un plan');
                return false;
            }
        }

        if (currentStep === 3) {
            if (!formData.fullname.trim() || !formData.email.trim() || !formData.password.trim() || !formData.number_id.trim()) {
                setErrorMessage('Todos los campos del administrador son obligatorios');
                return false;
            }

            // Validar formato email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setErrorMessage('Formato de correo electrónico no válido');
                return false;
            }

            setIsLoading(true);
            try {
                const res = await authService.checkEmail(formData.email);
                if (res.exists) {
                    setErrorMessage('Este correo electrónico ya está registrado en el sistema');
                    return false;
                }
            } catch {
                setErrorMessage('Error al verificar el correo');
                return false;
            } finally {
                setIsLoading(false);
            }
        }

        return true;
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    // Renderizado de pasos
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.authForm}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.5rem' }}>Información de la Empresa</h3>
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="company_name">Razón Social</label>
                                <div className={styles.inputWrapper}>
                                    <Building className={styles.inputIcon} size={20} />
                                    <input
                                        type="text"
                                        id="company_name"
                                        placeholder="Mi Empresa S.A.S"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="nit_id">NIT</label>
                                <div className={styles.inputWrapper}>
                                    <Building className={styles.inputIcon} size={20} />
                                    <input
                                        type="text"
                                        id="nit_id"
                                        placeholder="900.123.456-7"
                                        value={formData.nit_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </Motion.div>
                );
            case 2:
                return (
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.authForm}
                    >
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.5rem' }}>Elige tu Plan</h3>

                        <div className={styles.billingToggle}>
                            <button
                                type="button"
                                className={`${styles.billingBtn} ${formData.billing_cycle === 'MONTHLY' ? styles.billingActive : ''}`}
                                onClick={() => setFormData(p => ({ ...p, billing_cycle: 'MONTHLY' }))}
                            >
                                Mensual
                            </button>
                            <button
                                type="button"
                                className={`${styles.billingBtn} ${formData.billing_cycle === 'YEARLY' ? styles.billingActive : ''}`}
                                onClick={() => setFormData(p => ({ ...p, billing_cycle: 'YEARLY' }))}
                            >
                                Anual (Ahorra 15%)
                            </button>
                        </div>

                        <div className={styles.planGrid}>
                            {plans.map(plan => (
                                <div
                                    key={plan.id}
                                    className={`${styles.planCard} ${formData.plan_id === plan.id ? styles.selectedPlan : ''}`}
                                    onClick={() => {
                                        setFormData(p => ({ ...p, plan_id: plan.id }));
                                        setSelectedPlanData(plan);
                                    }}
                                >
                                    {plan.is_default && (
                                        <div className={styles.recommendedBadge}>
                                            <Zap size={10} fill="currentColor" /> Recomendado
                                        </div>
                                    )}
                                    
                                    {formData.plan_id === plan.id && (
                                        <div className={styles.planSelectedCheck}>
                                            <Check size={14} />
                                        </div>
                                    )}

                                    <div className={styles.planHeader}>
                                        <span className={styles.planName}>{plan.name}</span>
                                        <div className={styles.planPriceWrapper}>
                                            <span className={styles.planPrice}>
                                                {formatCurrency(formData.billing_cycle === 'MONTHLY' ? plan.price : Math.round(plan.price * 12 * 0.85))}
                                            </span>
                                            <span className={styles.planPeriod}>
                                                /{formData.billing_cycle === 'MONTHLY' ? 'mes' : 'año'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.planFeatures}>
                                        <div className={styles.featureItem}>
                                            <Users size={14} />
                                            <span><strong>{plan.max_users}</strong> Usuarios</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <Layout size={14} />
                                            <span><strong>{plan.max_templates_carnets}</strong> Plantillas</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <CreditCard size={14} />
                                            <span><strong>{plan.max_carnets}</strong> Carnets</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <Calendar size={14} />
                                            <span><strong>{plan.max_events_month}</strong> Eventos/mes</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <MapPin size={14} />
                                            <span><strong>{plan.max_headquarters}</strong> Sedes</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <Layers size={14} />
                                            <span><strong>{plan.max_areas}</strong> Áreas</span>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <Briefcase size={14} />
                                            <span><strong>{plan.max_roles}</strong> Cargos</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Motion.div>
                );
            case 3:
                return (
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.authForm}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.5rem' }}>Datos del Administrador</h3>
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="fullname">Nombre Completo</label>
                                <div className={styles.inputWrapper}>
                                    <User className={styles.inputIcon} size={20} />
                                    <input
                                        type="text"
                                        id="fullname"
                                        placeholder="Juan Pérez"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="email">Correo Electrónico</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="nombre@empresa.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="password">Contraseña</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeBtn}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="type_id">Doc.</label>
                                <select id="type_id" value={formData.type_id} onChange={handleChange} style={{ height: 46, borderRadius: 12, border: '1px solid #E2E8F0', padding: '0 10px' }}>
                                    <option value="CC">C.C.</option>
                                    <option value="CE">C.E.</option>
                                    <option value="PP">PP</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="number_id">Identificación</label>
                                <div className={styles.inputWrapper}>
                                    <input type="text" id="number_id" value={formData.number_id} onChange={handleChange} placeholder="12345" style={{ paddingLeft: '1rem' }} required />
                                </div>
                            </div>
                        </div>
                    </Motion.div>
                );
            case 4:
                return (
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.authForm}
                    >
                        <div className={styles.brandingStepGrid}>
                            <div className={styles.brandingControls}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '1rem' }}>Personaliza tu Marca</h3>

                                <div className={styles.inputGroup}>
                                    <label>Logo de la Empresa</label>
                                    <div style={{ border: '2px dashed #E2E8F0', padding: '1.5rem', borderRadius: 12, textAlign: 'center', background: '#FAFCFF' }}>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" style={{ maxHeight: 60, marginBottom: '0.5rem' }} />
                                        ) : (
                                            <ImageIcon size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                                        )}
                                        <input type="file" id="logo_input" hidden onChange={handleFileChange} accept="image/*" />
                                        <label htmlFor="logo_input" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}>
                                            Subir Logo
                                        </label>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Color Primario</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: 10 }}>
                                            <input type="color" value={formData.primary_color} onChange={(e) => setFormData(p => ({ ...p, primary_color: e.target.value }))} style={{ width: 24, height: 24 }} />
                                            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{formData.primary_color}</span>
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Color Secundario</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: 10 }}>
                                            <input type="color" value={formData.secondary_color} onChange={(e) => setFormData(p => ({ ...p, secondary_color: e.target.value }))} style={{ width: 24, height: 24 }} />
                                            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{formData.secondary_color}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Tipografía</label>
                                    <select
                                        value={formData.font_family}
                                        onChange={(e) => setFormData(p => ({ ...p, font_family: e.target.value }))}
                                        style={{ height: 42, borderRadius: 10, border: '1px solid #E2E8F0', padding: '0 10px', width: '100%' }}
                                    >
                                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Radio de Borde</label>
                                        <select
                                            value={formData.border_radius}
                                            onChange={(e) => setFormData(p => ({ ...p, border_radius: e.target.value }))}
                                            style={{ height: 42, borderRadius: 10, border: '1px solid #E2E8F0', padding: '0 10px' }}
                                        >
                                            <option value="0px">Cuadrado</option>
                                            <option value="4px">Suave (4px)</option>
                                            <option value="8px">Redondeado (8px)</option>
                                            <option value="12px">Estándar (12px)</option>
                                            <option value="16px">Muy Redondo (16px)</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Tema Sidebar</label>
                                        <select
                                            value={formData.sidebar_theme}
                                            onChange={(e) => setFormData(p => ({ ...p, sidebar_theme: e.target.value }))}
                                            style={{ height: 42, borderRadius: 10, border: '1px solid #E2E8F0', padding: '0 10px' }}
                                        >
                                            <option value="dark">Oscuro</option>
                                            <option value="light">Claro</option>
                                            <option value="brand">Marca</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.brandingPreview}>
                                <BrandingPreview config={formData} />
                            </div>
                        </div>
                    </Motion.div>
                );
            case 5:
                return (
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.authForm}
                    >
                        <div className={styles.authForm} style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <CreditCard size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>Resumen de Suscripción</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Estás a un paso de activar tu cuenta</p>
                            </div>

                            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#64748b' }}>Plan seleccionado:</span>
                                    <span style={{ fontWeight: 700 }}>{selectedPlanData?.name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#64748b' }}>Ciclo de facturación:</span>
                                    <span style={{ fontWeight: 700 }}>{formData.billing_cycle === 'MONTHLY' ? 'Mensual' : 'Anual'}</span>
                                </div>
                                <div style={{ borderTop: '1px solid #E2E8F0', margin: '0.75rem 0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total a pagar:</span>
                                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                                        {formatCurrency(formData.billing_cycle === 'MONTHLY' ? selectedPlanData?.price : Math.round(selectedPlanData?.price * 12 * 0.85))}
                                    </span>
                                </div>
                            </div>

                            {preferenceId ? (
                                <div style={{ width: '100%', minHeight: '48px' }}>
                                    <Wallet 
                                        initialization={{ preferenceId: preferenceId }}
                                        customization={{ 
                                            texts: { valueProp: 'smart_option' },
                                            visual: {
                                                buttonBackground: 'default',
                                                borderRadius: '12px',
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleSubmit()}
                                    className={styles.submitBtn}
                                    disabled={isLoading}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', height: '52px' }}
                                >
                                    {isLoading ? <Loader2 className={styles.spin} size={24} /> : <UserPlus size={20} />}
                                    {isLoading ? 'Registrando empresa...' : 'Confirmar y Pagar'}
                                </button>
                            )}

                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1rem' }}>
                                {paymentToken
                                    ? 'Haz clic para ser redirigido de forma segura al portal de suscripciones.'
                                    : 'Al confirmar, se creará tu cuenta y se generará el acceso al pago.'}
                            </p>
                        </div>
                    </Motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div className={styles.authHeader}>
                <img src={logoImg} alt="Carnet Digital" className={styles.logo} />
                <h2 className={styles.title}>Crea tu cuenta</h2>
                <div className={styles.stepper}>
                    {[1, 2, 3, 4, ...(selectedPlanData?.price > 0 ? [5] : [])].map(s => (
                        <div key={s} className={`${styles.stepDot} ${currentStep === s ? styles.activeStep : ''}`} />
                    ))}
                </div>
            </div>

            {successMessage && (
                <div style={{ padding: '1rem', background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div style={{ padding: '1rem', background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FECACA', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
                <div style={{ minHeight: 340 }}>
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                <div className={styles.wizardFooter}>
                    {currentStep > 1 ? (
                        <button type="button" onClick={prevStep} className={styles.toggleBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ChevronLeft size={16} /> Atrás
                        </button>
                    ) : (
                        <button type="button" className={styles.toggleBtn} onClick={onToggle}>
                            Ya tengo cuenta
                        </button>
                    )}

                    {currentStep < 4 ? (
                        <button type="button" onClick={nextStep} className={styles.submitBtn} style={{ margin: 0, padding: '0.75rem 1.5rem' }}>
                            Siguiente <ChevronRight size={18} />
                        </button>
                    ) : currentStep === 4 ? (
                        <button type="button" onClick={nextStep} className={styles.submitBtn} disabled={isLoading} style={{ margin: 0, padding: '0.75rem 1.5rem' }}>
                            {isLoading ? <Loader2 className={styles.spin} size={20} /> : (selectedPlanData?.price > 0 ? <ChevronRight size={20} /> : <UserPlus size={20} />)}
                            {isLoading ? 'Procesando...' : (selectedPlanData?.price > 0 ? 'Ir al Pago' : 'Finalizar Registro')}
                        </button>
                    ) : null}
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
