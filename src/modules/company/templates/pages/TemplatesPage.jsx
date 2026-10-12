import React, { useState, useEffect } from 'react';
import {
  Palette,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import templateService from '../services/templateService';
import TemplateForm from '../components/TemplateForm';
import { usePlanStats } from '../../home/hooks/usePlanStats';
import LimitAlert from '../../../../components/common/LimitAlert';
import styles from './Templates.module.css';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const { checkLimit } = usePlanStats();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await templateService.getAllTemplates();
      setTemplates(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (template = null) => {
    if (!template) {
      const { reached } = checkLimit('templates');
      if (reached) {
        setIsLimitModalOpen(true);
        return;
      }
    }
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta plantilla?')) {
      try {
        await templateService.deleteTemplate(id);
        loadData();
      } catch (error) {
        alert(error.message || 'Error al eliminar la plantilla');
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
          <h1 className={styles.title}>Diseño de Plantillas</h1>
          <p className={styles.subtitle}>Crea y personaliza los diseños para los carnets corporativos.</p>
        </div>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Crear Plantilla
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Buscar plantillas..." />
        </div>
      </div>

      <div className={styles.tableCard}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl) => (
                <tr key={tpl.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.iconWrapper}><Palette size={18} /></div>
                      <span>{tpl.template_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${tpl.is_active ? styles.active : styles.inactive}`}>
                      {tpl.is_active ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {tpl.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => handleOpenModal(tpl)} title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(tpl.id)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No hay plantillas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <TemplateForm 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingTemplate={editingTemplate}
        onSaveSuccess={loadData}
      />

      <LimitAlert 
        isOpen={isLimitModalOpen} 
        onClose={() => setIsLimitModalOpen(false)} 
        sectionName="Plantillas" 
      />
    </Motion.div>
  );
};

export default Templates;
