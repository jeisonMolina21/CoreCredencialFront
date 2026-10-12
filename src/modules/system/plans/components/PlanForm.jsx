import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import styles from '../pages/Plans.module.css';

const PlanForm = ({ onClose, onSave, editingPlan }) => {
  const [formData, setFormData] = useState({
    name: editingPlan?.name || '',
    price: editingPlan?.price || 0,
    max_users: editingPlan?.max_users || 0,
    max_templates_carnets: editingPlan?.max_templates_carnets || 0,
    max_carnets: editingPlan?.max_carnets || 0,
    max_events_month: editingPlan?.max_events_month || 0,
    max_headquarters: editingPlan?.max_headquarters || 0,
    max_areas: editingPlan?.max_areas || 0,
    max_roles: editingPlan?.max_roles || 0,
    description: editingPlan?.description || '',
    is_active: editingPlan?.is_active !== undefined ? editingPlan.is_active : true,
    is_default: editingPlan?.is_default !== undefined ? editingPlan.is_default : false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format numeric fields before sending
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      max_users: parseInt(formData.max_users, 10),
      max_templates_carnets: parseInt(formData.max_templates_carnets, 10),
      max_carnets: parseInt(formData.max_carnets, 10),
      max_events_month: parseInt(formData.max_events_month, 10),
      max_headquarters: parseInt(formData.max_headquarters, 10),
      max_areas: parseInt(formData.max_areas, 10),
      max_roles: parseInt(formData.max_roles, 10)
    };
    onSave(payload);
  };

  return (
    <div className={styles.modalOverlay}>
      <Motion.div
        className={styles.modalContent}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className={styles.modalHeader}>
          <h3>{editingPlan ? 'Editar Plan' : 'Registrar Nuevo Plan'}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Nombre del Plan</label>
              <input
                type="text"
                name="name"
                placeholder="Ej: Standard"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Precio Mensual (COP)</label>
              <input
                type="number"
                name="price"
                step="1"
                placeholder="50000"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Máx. Usuarios</label>
              <input
                type="number"
                name="max_users"
                value={formData.max_users}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Máx. Plantillas</label>
              <input
                type="number"
                name="max_templates_carnets"
                value={formData.max_templates_carnets}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Máx. Carnets</label>
              <input
                type="number"
                name="max_carnets"
                value={formData.max_carnets}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Máx. Eventos/Mes</label>
              <input
                type="number"
                name="max_events_month"
                value={formData.max_events_month}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Máx. Sedes</label>
              <input
                type="number"
                name="max_headquarters"
                value={formData.max_headquarters}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Máx. Áreas</label>
              <input
                type="number"
                name="max_areas"
                value={formData.max_areas}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Máx. Cargos</label>
              <input
                type="number"
                name="max_roles"
                value={formData.max_roles}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              name="description"
              placeholder="Descripción detallada del plan..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={{ width: 'auto' }}
              />
              <label htmlFor="is_active" style={{ cursor: 'pointer', margin: 0 }}>Plan Activo</label>
            </div>

            <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="is_default"
                id="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                style={{ width: 'auto' }}
              />
              <label htmlFor="is_default" style={{ cursor: 'pointer', margin: 0 }}>Plan por Defecto</label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.submitBtn}>
              {editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

export default PlanForm;
