import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import systemUserService from '../services/systemUserService';
import styles from '../pages/SystemUsers.module.css';
import formStyles from './UserFormModal.module.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  system_role: '',
  status: true
};

/**
 * Modal para crear o editar un usuario de sistema.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onSaved: () => void        — refresca la lista tras guardar
 *  - editingUser: object | null  (null = modo creación)
 *  - roles: array
 */
const UserFormModal = ({ isOpen, onClose, onSaved, editingUser, roles }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isEditing = Boolean(editingUser);

  // Sincronizar formulario cuando cambia el usuario a editar
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: '',
        system_role: editingUser.system_role || '',
        status: editingUser.status ?? true
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setError('');
    setShowPassword(false);
  }, [editingUser, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = { ...formData };

    if (isEditing) {
      if (!payload.password) delete payload.password;
    } else {
      if (!payload.password) {
        setError('Debe ingresar una contraseña para el nuevo usuario.');
        return;
      }
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        await systemUserService.updateUser(editingUser.id, payload);
      } else {
        await systemUserService.createUser(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <Motion.div
            className={styles.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className={styles.modalHeader}>
              <h3>{isEditing ? 'Editar Cuenta' : 'Registrar Nuevo Usuario'}</h3>
              <button type="button" className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Fila 1: Nombre y Email */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ej: Juan Pérez"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ej: admin@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Fila 2: Contraseña y Rol */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Contraseña {isEditing && <small style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Opcional)</small>}
                  </label>
                  <div className={formStyles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder={isEditing ? 'Dejar en blanco para no cambiar...' : 'Su clave secreta'}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className={formStyles.eyeBtn}
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Nivel de Accesos</label>
                  <select
                    name="system_role"
                    value={formData.system_role}
                    onChange={handleChange}
                    disabled={editingUser?.id === 1}
                    style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    required
                  >
                    <option value="">Seleccione un rol...</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>{r.name} — {r.description}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fila 3: Estado */}
              <div className={styles.formRow}>
                <div
                  className={styles.formGroup}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                >
                  <input
                    type="checkbox"
                    name="status"
                    id="status"
                    checked={formData.status}
                    onChange={handleChange}
                    disabled={editingUser?.id === 1}
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="status" style={{ cursor: 'pointer', margin: 0 }}>
                    Usuario Activo
                  </label>
                </div>
              </div>

              {/* Error inline */}
              {error && (
                <p style={{
                  color: '#B91C1C',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  {error}
                </p>
              )}

              {/* Footer */}
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn} disabled={isSaving}>
                  {isSaving ? 'Guardando...' : isEditing ? 'Actualizar Cuenta' : 'Registrar Cuenta'}
                </button>
              </div>
            </form>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;
