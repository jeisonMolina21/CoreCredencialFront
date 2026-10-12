import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import systemRolService from '../services/systemRolService';
import styles from './SystemRols.module.css';

const SystemRols = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await systemRolService.getAllRoles();
      setRoles(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name || '',
        description: role.description || ''
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      if (editingRole) {
        await systemRolService.updateRole(editingRole.id, payload);
      } else {
        await systemRolService.createRole(payload);
      }
      
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert(error.message || 'Error al guardar el rol');
    }
  };

  const handleDeleteRole = async (id) => {
      // Basic core protection (System admin role id 1 and common id 2 usually shouldn't be deleted)
      if (id === 1 || id === 2) {
          return alert("Los roles del núcleo no pueden ser eliminados.");
      }
      if (window.confirm('¿Está seguro de eliminar este rol del sistema?')) {
          try {
              await systemRolService.deleteRole(id);
              loadData();
          } catch (error) {
              alert(error.message || 'Error al eliminar el rol');
          }
      }
  };

  return (
    <Motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Roles del Sistema</h1>
          <p className={styles.subtitle}>Gestión de autorizaciones generales de acceso.</p>
        </div>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Nuevo Rol
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Buscar permisos..." />
        </div>
      </div>

      {/* Rols Table */}
      <div className={styles.tableCard}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando roles...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código Autorización (Nombre)</th>
                <th>Descripción Referencial</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>
                    <div className={styles.planNameCell}>
                      <div className={styles.planIcon}><ShieldCheck size={18} /></div>
                      <span>{role.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)' }}>{role.description}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => handleOpenModal(role)} title="Editar Rol">
                        <Edit2 size={16} />
                      </button>
                      <button 
                         className={`${styles.actionBtn} ${styles.delete}`} 
                         onClick={() => handleDeleteRole(role.id)} 
                         title="Eliminar"
                         disabled={role.id === 1 || role.id === 2}
                         style={{ opacity: (role.id === 1 || role.id === 2) ? 0.3 : 1, cursor: (role.id === 1 || role.id === 2) ? 'not-allowed' : 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                 <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No hay roles registrados</td>
                 </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Add/Edit */}
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
                <h3>{editingRole ? 'Modificar Permisos de Rol' : 'Crear Nuevo Rol'}</h3>
                <button type="button" className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <form className={styles.form} onSubmit={handleSaveRole}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Código Interno / Nombre</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Ej: common" 
                      value={formData.name}
                      onChange={handleChange}
                      disabled={editingRole?.id === 1 || editingRole?.id === 2}
                      required 
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Descripción Funcional</label>
                    <textarea 
                      name="description"
                      placeholder="¿Qué acceso confiere este rol?"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button type="submit" className={styles.submitBtn}>
                    {editingRole ? 'Guardar Cambios' : 'Generar Rol'}
                  </button>
                </div>
              </form>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default SystemRols;
