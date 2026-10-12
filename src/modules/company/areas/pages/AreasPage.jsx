import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import companyAreaService from '../services/companyAreaService';
import { usePlanStats } from '../../home/hooks/usePlanStats';
import LimitAlert from '../../../../components/common/LimitAlert';
import styles from './Areas.module.css';

const Areas = () => {
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const { checkLimit } = usePlanStats();

    const [formData, setFormData] = useState({
        area_name: ''
    });

    const loadAreas = async () => {
        try {
            setIsLoading(true);
            const response = await companyAreaService.getAllAreas();
            setAreas(response.data || response || []);
        } catch (error) {
            console.error('Error loading areas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAreas();
    }, []);

    const handleOpenModal = (area = null) => {
        if (!area) {
            const { reached } = checkLimit('areas');
            if (reached) {
                setIsLimitModalOpen(true);
                return;
            }
        }

        if (area) {
            setEditingArea(area);
            setFormData({ area_name: area.area_name });
        } else {
            setEditingArea(null);
            setFormData({ area_name: '' });
        }
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingArea) {
                await companyAreaService.updateArea(editingArea.id, formData);
            } else {
                await companyAreaService.createArea(formData);
            }
            setIsModalOpen(false);
            loadAreas();
        } catch (error) {
            alert(error.message || 'Error al guardar el área');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta área?')) {
            try {
                await companyAreaService.deleteArea(id);
                loadAreas();
            } catch (error) {
                alert(error.message || 'Error al eliminar el área');
            }
        }
    };

    const filteredAreas = areas.filter(area => 
        area.area_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Motion.div 
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestión de Áreas</h1>
                    <p className={styles.subtitle}>Define los departamentos y unidades organizativas de tu empresa.</p>
                </div>
                <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Nueva Área
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar área por nombre..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableCard}>
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando áreas...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nombre del Área</th>
                                <th>Fecha de Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAreas.map((area) => (
                                <tr key={area.id}>
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.iconWrapper}><MapIcon size={18} /></div>
                                            <span>{area.area_name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(area.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn} onClick={() => handleOpenModal(area)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(area.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAreas.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No se encontraron áreas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

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
                                <h3>{editingArea ? 'Editar Área' : 'Registrar Nueva Área'}</h3>
                                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form className={styles.form} onSubmit={handleSave}>
                                <div className={styles.formGroup}>
                                    <label>Nombre del Área</label>
                                    <input 
                                        type="text" 
                                        name="area_name"
                                        placeholder="Ej: Contabilidad, IT, RR.HH" 
                                        value={formData.area_name}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                    <button type="submit" className={styles.submitBtn}>
                                        {editingArea ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            <LimitAlert 
                isOpen={isLimitModalOpen} 
                onClose={() => setIsLimitModalOpen(false)} 
                sectionName="Áreas" 
            />
        </Motion.div>
    );
};

export default Areas;
