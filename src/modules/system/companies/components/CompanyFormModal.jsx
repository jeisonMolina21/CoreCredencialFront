import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Building2, User, Mail, Lock, CreditCard, Palette, Image as ImageIcon, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import companyService from '../services/companyService';
import { authService } from '../../../public/auth';
import BrandingPreview from '../../../../components/common/BrandingPreview';
import { formatCurrency } from '../../../../utils/formatters';
import styles from '../pages/Companies.module.css';
import formStyles from './CompanyFormModal.module.css';

const FONT_OPTIONS = [
  { name: 'Inter', family: "'Inter', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Roboto', family: "'Roboto', sans-serif" },
  { name: 'Outfit', family: "'Outfit', sans-serif" },
  { name: 'Sora', family: "'Sora', sans-serif" },
  { name: 'Space Grotesk', family: "'Space Grotesk', sans-serif" },
  { name: 'Syne', family: "'Syne', sans-serif" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Public Sans', family: "'Public Sans', sans-serif" },
];

const EMPTY_FORM = {
  // Empresa
  company_name: '',
  nit_id: '',
  subdomain: '',
  is_active: true,
  // Suscripción
  plan_id: '',
  billing_cycle: 'MONTHLY',
  // Administrador (solo en creación)
  fullname: '',
  type_id: 'CC',
  number_id: '',
  email: '',
  password: '',
  // Branding (Nuevo)
  logo: null,
  primary_color: '#0062E3',
  secondary_color: '#001F3F',
  font_family: 'Inter',
  border_radius: '12px',
  sidebar_theme: 'dark'
};

/**
 * Modal para crear o editar una empresa.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onSaved: () => void        — callback para refrescar lista tras guardar
 *  - editingCompany: object | null   (null = modo creación)
 *  - plans: array
 */
const CompanyFormModal = ({ isOpen, onClose, onSaved, editingCompany, plans }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState(null);

  const isEditing = Boolean(editingCompany);

  // Sincronizar formulario con la empresa a editar
  useEffect(() => {
    if (editingCompany) {
      setFormData({
        ...EMPTY_FORM,
        company_name: editingCompany.name || '',
        nit_id: editingCompany.nit_id || '',
        subdomain: editingCompany.subdomain || '',
        is_active: editingCompany.is_active ?? true,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setError('');
    setShowPassword(false);
  }, [editingCompany, isOpen]);

  // Pre-seleccionar plan por defecto
  useEffect(() => {
    if (isOpen && !isEditing && plans?.length > 0 && !formData.plan_id) {
      const defaultPlan = plans.find(p => p.is_default) || plans[0];
      setFormData(prev => ({ ...prev, plan_id: defaultPlan.id }));
    }
  }, [isOpen, plans, isEditing, formData.plan_id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, logo: file }));
        setLogoPreview(URL.createObjectURL(file));
        // TODO: Aquí se podría integrar lógica de extracción de color básica
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const validateStep = async () => {
    setError('');
    
    // Validaciones Paso 1: Empresa
    if (currentStep === 1) {
      if (!formData.company_name.trim()) {
        setError('La razón social es obligatoria');
        return false;
      }
      if (!formData.nit_id.trim()) {
        setError('El NIT es obligatorio');
        return false;
      }

      // Si no estamos editando (creación), verificamos NIT único
      if (!isEditing) {
        setIsSaving(true);
        try {
          const res = await companyService.checkNit(formData.nit_id);
          if (res.exists) {
            setError('Este NIT ya se encuentra registrado');
            return false;
          }
        } catch {
          setError('Error al verificar el NIT');
          return false;
        } finally {
          setIsSaving(false);
        }
      }
    }

    // Validaciones Paso 2: Suscripción
    if (currentStep === 2) {
      if (!formData.plan_id) {
        setError('Debes seleccionar un plan de suscripción');
        return false;
      }
    }

    // Validaciones Paso 3: Administrador (Solo en creación)
    if (currentStep === 3 && !isEditing) {
      if (!formData.fullname.trim() || !formData.email.trim() || !formData.password.trim() || !formData.number_id.trim()) {
        setError('Todos los campos del administrador son obligatorios');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Formato de correo electrónico no válido');
        return false;
      }

      setIsSaving(true);
      try {
        const res = await authService.checkEmail(formData.email);
        if (res.exists) {
          setError('Este correo electrónico ya está registrado en el sistema');
          return false;
        }
      } catch {
        setError('Error al verificar el correo');
        return false;
      } finally {
        setIsSaving(false);
      }
    }

    return true;
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      if (isEditing) {
        // Edición: solo datos de empresa
        await companyService.updateCompany(editingCompany.id, {
          name: formData.company_name,
          nit_id: formData.nit_id,
          subdomain: formData.subdomain,
          is_active: formData.is_active
        });
      } else {
        // Creación: registro completo vía endpoint de sistema con FormData para el logo
        const data = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null) {
            data.append(key, formData[key]);
          }
        });
        
        await companyService.adminRegisterCompany(data);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la empresa');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <Motion.div
            className={`${styles.modalContent} ${formStyles.wideModal}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* ── Header ── */}
            <div className={styles.modalHeader}>
              <div className={formStyles.headerTitleArea}>
                <h3>{isEditing ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</h3>
                {!isEditing && (
                  <div className={formStyles.stepper}>
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className={`${formStyles.stepDot} ${currentStep >= s ? formStyles.activeStep : ''}`} />
                    ))}
                  </div>
                )}
              </div>
              <button type="button" className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <form className={formStyles.form} onSubmit={handleSubmit}>
              
              <div className={formStyles.stepContainer}>
                {/* PASO 1: INFORMACIÓN BÁSICA */}
                {(currentStep === 1 || isEditing) && (
                  <Motion.div 
                    initial={{ x: -20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    className={formStyles.stepContent}
                  >
                    <div className={formStyles.section}>
                      <div className={formStyles.sectionHeader}>
                        <Building2 size={16} />
                        <span>Información de la Empresa</span>
                      </div>
                      <div className={formStyles.grid2}>
                        <div className={formStyles.field}>
                          <label>Razón Social <span className={formStyles.req}>*</span></label>
                          <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
                        </div>
                        <div className={formStyles.field}>
                          <label>NIT de la Empresa <span className={formStyles.req}>*</span></label>
                          <input type="text" name="nit_id" value={formData.nit_id} onChange={handleChange} required />
                        </div>
                        <div className={formStyles.field}>
                          <label>Subdominio</label>
                          <input type="text" name="subdomain" value={formData.subdomain} onChange={handleChange} />
                        </div>
                        <div className={formStyles.field} style={{ justifyContent: 'flex-end' }}>
                          <label className={formStyles.checkboxLabel}>
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                            Empresa Activa
                          </label>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                )}

                {/* PASO 2: PLAN (Solo creación) */}
                {!isEditing && currentStep === 2 && (
                  <Motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    className={formStyles.stepContent}
                  >
                    <div className={formStyles.section}>
                      <div className={formStyles.sectionHeader}>
                        <CreditCard size={16} />
                        <span>Selección de Plan</span>
                      </div>
                      <div className={formStyles.grid2}>
                        <div className={formStyles.field}>
                          <label>Plan Comercial <span className={formStyles.req}>*</span></label>
                          <select name="plan_id" value={formData.plan_id} onChange={handleChange} required>
                            <option value="">Seleccione un plan...</option>
                            {plans.map(p => (
                              <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>
                            ))}
                          </select>
                        </div>
                        <div className={formStyles.field}>
                          <label>Ciclo de Facturación</label>
                          <select name="billing_cycle" value={formData.billing_cycle} onChange={handleChange}>
                            <option value="MONTHLY">Mensual</option>
                            <option value="YEARLY">Anual</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                )}

                {/* PASO 3: ADMINISTRADOR (Solo creación) */}
                {!isEditing && currentStep === 3 && (
                  <Motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    className={formStyles.stepContent}
                  >
                    <div className={formStyles.section}>
                      <div className={formStyles.sectionHeader}>
                        <User size={16} />
                        <span>Datos del Administrador</span>
                      </div>
                      <div className={formStyles.grid2}>
                        <div className={`${formStyles.field} ${formStyles.span2}`}>
                          <label>Nombre Completo <span className={formStyles.req}>*</span></label>
                          <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
                        </div>
                        <div className={formStyles.field}>
                          <label>ID Tipo</label>
                          <select name="type_id" value={formData.type_id} onChange={handleChange}>
                            <option value="CC">CC</option><option value="CE">CE</option><option value="NIT">NIT</option>
                          </select>
                        </div>
                        <div className={formStyles.field}>
                          <label>Número</label>
                          <input type="text" name="number_id" value={formData.number_id} onChange={handleChange} required />
                        </div>
                        <div className={`${formStyles.field} ${formStyles.span2}`}>
                          <label>Email</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className={`${formStyles.field} ${formStyles.span2}`}>
                          <label>Contraseña</label>
                          <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                )}

                {/* PASO 4: BRANDING (Solo creación) */}
                {!isEditing && currentStep === 4 && (
                  <Motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    className={formStyles.stepContent}
                  >
                    <div className={formStyles.brandingGrid}>
                      <div className={formStyles.brandingControls}>
                        <div className={formStyles.sectionHeader}>
                          <Palette size={16} />
                          <span>Identidad Visual</span>
                        </div>
                        
                        <div className={formStyles.field}>
                          <label>Logo de la Empresa</label>
                          <div className={formStyles.logoUploadArea}>
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo Preview" className={formStyles.previewLogoImg} />
                            ) : (
                              <ImageIcon size={32} color="#cbd5e1" />
                            )}
                            <input type="file" name="logo" accept="image/*" onChange={handleChange} id="logo-upload" hidden />
                            <label htmlFor="logo-upload" className={formStyles.uploadLabel}>
                              {logoPreview ? 'Cambiar Logo' : 'Subir Logo'}
                            </label>
                          </div>
                        </div>

                        <div className={formStyles.grid2}>
                          <div className={formStyles.field}>
                            <label>Color Primario</label>
                            <div className={formStyles.colorInputWrapper}>
                              <input type="color" name="primary_color" value={formData.primary_color} onChange={handleChange} />
                              <span>{formData.primary_color}</span>
                            </div>
                          </div>
                          <div className={formStyles.field}>
                            <label>Color Secundario</label>
                            <div className={formStyles.colorInputWrapper}>
                              <input type="color" name="secondary_color" value={formData.secondary_color} onChange={handleChange} />
                              <span>{formData.secondary_color}</span>
                            </div>
                          </div>
                        </div>

                        <div className={formStyles.field}>
                          <label>Tipografía</label>
                          <select name="font_family" value={formData.font_family} onChange={handleChange}>
                            {FONT_OPTIONS.map(f => (
                              <option key={f.name} value={f.name}>{f.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className={formStyles.field}>
                          <label>Bordes de Interfaz</label>
                          <select name="border_radius" value={formData.border_radius} onChange={handleChange}>
                            <option value="0px">Cuadrado (Corporativo)</option>
                            <option value="8px">Standard</option>
                            <option value="12px">Premium (Redondeado)</option>
                            <option value="20px">Moderno (Muy redondeado)</option>
                          </select>
                        </div>
                      </div>

                      <div className={formStyles.brandingPreviewArea}>
                        <BrandingPreview config={{ ...formData, logo: formData.logo }} />
                      </div>
                    </div>
                  </Motion.div>
                )}
              </div>

              {/* Error inline */}
              {error && (
                <div className={formStyles.errorBox}>{error}</div>
              )}

              {/* Footer */}
              <div className={formStyles.footer}>
                {!isEditing && currentStep > 1 && (
                  <button type="button" className={styles.cancelBtn} onClick={prevStep} disabled={isSaving}>
                    <ChevronLeft size={18} /> Anterior
                  </button>
                )}
                
                <div style={{ flex: 1 }} />

                <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
                  Cancelar
                </button>

                {!isEditing && currentStep < 4 ? (
                  <button type="button" className={styles.submitBtn} onClick={nextStep}>
                    Siguiente <ChevronRight size={18} />
                  </button>
                ) : (
                  <button type="submit" className={styles.submitBtn} disabled={isSaving}>
                    {isSaving
                      ? 'Guardando...'
                      : isEditing ? 'Guardar Cambios' : 'Finalizar Registro'}
                    {(!isSaving && !isEditing) && <Check size={18} style={{ marginLeft: '8px' }} />}
                  </button>
                )}
              </div>
            </form>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CompanyFormModal;
