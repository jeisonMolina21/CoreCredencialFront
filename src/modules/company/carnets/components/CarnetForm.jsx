import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import carnetService from '../services/carnetService';
import templateService from '../../templates/services/templateService';
import companyUserService from '../../users/services/companyUserService';
import styles from '../pages/Carnets.module.css';

const CarnetForm = ({ isModalOpen, setIsModalOpen, editingCarnet, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    carnet_id: '',
    template_id: '',
    type_carnet: 'EMPLEADO',
    status: 'ACTIVE',
    valid_from: '',
    valid_to: ''
  });
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const loadInitialData = async () => {
    try {
      const [templatesRes, usersRes] = await Promise.all([
        templateService.getAllTemplates(),
        companyUserService.getAllUsers().catch(() => []) // Fallback in case of error
      ]);
      setTemplates(Array.isArray(templatesRes) ? templatesRes : templatesRes.data || []);
      setUsers(Array.isArray(usersRes) ? usersRes : usersRes.data || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  useEffect(() => {
    let active = true;
    
    const initModal = async () => {
      if (isModalOpen) {
        await loadInitialData(); // Fetch templates and users asynchronously
        
        if (!active) return; // Prevent state update if unmounted

        if (editingCarnet) {
          // Set predefined state including display name
          setFormData({
            carnet_id: editingCarnet.carnet_id || '',
            template_id: editingCarnet.template_id || '',
            type_carnet: editingCarnet.type_carnet || 'EMPLEADO',
            status: editingCarnet.status || 'ACTIVE',
            valid_from: editingCarnet.valid_from ? editingCarnet.valid_from.split('T')[0] : '',
            valid_to: editingCarnet.valid_to ? editingCarnet.valid_to.split('T')[0] : ''
          });
          setUserSearchTerm(editingCarnet.carnet_id ? String(editingCarnet.carnet_id) : '');
        } else {
          const today = new Date().toISOString().split('T')[0];
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          
          setFormData({
            carnet_id: '',
            template_id: '',
            type_carnet: 'EMPLEADO',
            status: 'ACTIVE',
            valid_from: today,
            valid_to: nextYear.toISOString().split('T')[0]
          });
          setUserSearchTerm('');
        }
      }
    };

    initModal();

    return () => {
      active = false;
    };
  }, [isModalOpen, editingCarnet]);


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
      const payload = { ...formData };
      if (!payload.carnet_id) delete payload.carnet_id; // Let backend auto-generate if empty

      if (editingCarnet) {
        await carnetService.updateCarnet(editingCarnet.id, payload);
      } else {
        await carnetService.createCarnet(payload);
      }
      setIsModalOpen(false);
      if (onSaveSuccess) onSaveSuccess();
    } catch (error) {
      alert(error.message || 'Error al guardar el carnet');
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <Motion.div
            className={styles.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className={styles.modalHeader}>
              <h3>{editingCarnet ? 'Editar Carnet' : 'Emitir Nuevo Carnet'}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSave}>
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ position: 'relative' }}>
                  <label>Funcionario <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    placeholder="Buscar por Nombre o Identificación..."
                    value={userSearchTerm}
                    onChange={(e) => {
                      setUserSearchTerm(e.target.value);
                      setIsUserDropdownOpen(true);
                      // Require re-selection if they start typing manually again
                      if (formData.carnet_id && e.target.value !== formData.carnet_id) {
                         setFormData(prev => ({...prev, carnet_id: ''}));
                      }
                    }}
                    onFocus={() => setIsUserDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)} // delay to allow click on option
                    required
                  />
                  {isUserDropdownOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', 
                      maxHeight: '200px', overflowY: 'auto', zIndex: 100,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '4px'
                    }}>
                      {users.filter(u => 
                          `${u.first_name || ''} ${u.last_name || ''} ${u.number_id || ''}`.toLowerCase().includes(userSearchTerm.toLowerCase())
                      ).map(u => (
                        <div 
                          key={u.id} 
                          style={{ padding: '0.65rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          onMouseDown={(e) => {
                             e.preventDefault(); // Prevents blur event
                             // It looks like carnet_id holds the user's ID or Number ID
                             setFormData(prev => ({ ...prev, carnet_id: u.number_id })); 
                             setUserSearchTerm(`${u.first_name} ${u.last_name} (${u.number_id})`);
                             setIsUserDropdownOpen(false);
                          }}
                        >
                          <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>{u.first_name} {u.last_name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Identificación: {u.number_id}</div>
                        </div>
                      ))}
                      {users.filter(u => `${u.first_name || ''} ${u.last_name || ''} ${u.number_id || ''}`.toLowerCase().includes(userSearchTerm.toLowerCase())).length === 0 && (
                        <div style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.9rem' }}>No se encontraron coincidencias</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Plantilla de Diseño <span style={{ color: 'red' }}>*</span></label>
                  <select
                      name="template_id"
                      value={formData.template_id}
                      onChange={handleChange}
                      required
                  >
                      <option value="">Seleccione una plantilla...</option>
                      {templates.map(tpl => (
                          <option key={tpl.id} value={tpl.id}>{tpl.template_name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tipo de Carnet <span style={{ color: 'red' }}>*</span></label>
                    <select
                        name="type_carnet"
                        value={formData.type_carnet}
                        onChange={handleChange}
                        required
                    >
                        <option value="EMPLEADO">Empleado Fijo</option>
                        <option value="CONTRATISTA">Contratista</option>
                        <option value="VISITANTE">Visitante</option>
                        <option value="ESTUDIANTE">Estudiante / Pasante</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Estado Inicial</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="ACTIVE">Activo</option>
                        <option value="INACTIVE">Inactivo (Provisional)</option>
                        <option value="REVOKED">Revocado / Perdido</option>
                    </select>
                  </div>
              </div>

              <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                      <label>Válido Desde <span style={{ color: 'red' }}>*</span></label>
                      <input
                          type="date"
                          name="valid_from"
                          value={formData.valid_from}
                          onChange={handleChange}
                          required
                      />
                  </div>
                  <div className={styles.formGroup}>
                      <label>Válido Hasta <span style={{ color: 'red' }}>*</span></label>
                      <input
                          type="date"
                          name="valid_to"
                          value={formData.valid_to}
                          onChange={handleChange}
                          required
                      />
                  </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>
                  {editingCarnet ? 'Guardar Cambios' : 'Emitir Carnet'}
                </button>
              </div>
            </form>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CarnetForm;
