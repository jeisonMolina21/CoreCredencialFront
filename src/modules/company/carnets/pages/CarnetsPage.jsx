import React, { useState, useEffect } from 'react';
import {
  CreditCard as CardIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import carnetService from '../services/carnetService';
import CarnetForm from '../components/CarnetForm';
import { usePlanStats } from '../../home/hooks/usePlanStats';
import LimitAlert from '../../../../components/common/LimitAlert';
import styles from './Carnets.module.css';

const Carnets = () => {
  const [carnets, setCarnets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarnet, setEditingCarnet] = useState(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const { checkLimit } = usePlanStats();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const carnetsRes = await carnetService.getAllCarnets();
      setCarnets(Array.isArray(carnetsRes) ? carnetsRes : carnetsRes.data || []);
    } catch (error) {
      console.error('Error loading carnets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (carnet = null) => {
    if (!carnet) {
      const { reached } = checkLimit('carnets');
      if (reached) {
        setIsLimitModalOpen(true);
        return;
      }
    }
    setEditingCarnet(carnet);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de revocar (eliminar) este carnet?')) {
      try {
        await carnetService.deleteCarnet(id);
        loadData();
      } catch (error) {
        alert(error.message || 'Error al eliminar el carnet');
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
          <h1 className={styles.title}>Gestión de Carnets</h1>
          <p className={styles.subtitle}>Emite, asigna y revoca carnets digitales corporativos.</p>
        </div>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Emitir Carnet
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Buscar por ID, nombre..." />
        </div>
      </div>

      <div className={styles.tableCard}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Carnet</th>
                <th>Plantilla</th>
                <th>Tipo</th>
                <th>Vigencia</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carnets.map((carnet) => (
                <tr key={carnet.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.iconWrapper}><CardIcon size={18} /></div>
                      <span>#{carnet.carnet_id}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>
                      {carnet.template?.template_name || 'Sin plantilla'}
                    </span>
                  </td>
                  <td>{carnet.type_carnet}</td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>
                      Vence: {new Date(carnet.valid_to).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${carnet.status === 'ACTIVE' ? styles.active : styles.inactive}`}>
                      {carnet.status === 'ACTIVE' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {carnet.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => handleOpenModal(carnet)} title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(carnet.id)} title="Revocar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {carnets.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No hay carnets emitidos</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <CarnetForm
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingCarnet={editingCarnet}
        onSaveSuccess={loadData}
      />

      <LimitAlert 
        isOpen={isLimitModalOpen} 
        onClose={() => setIsLimitModalOpen(false)} 
        sectionName="Carnets" 
      />
    </Motion.div>
  );
};

export default Carnets;
