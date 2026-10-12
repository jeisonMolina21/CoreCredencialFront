import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit2, Trash2, X, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import companyHeadquarterService from '../services/companyHeadquarterService';
import { usePlanStats } from '../../home/hooks/usePlanStats';
import LimitAlert from '../../../../components/common/LimitAlert';
import styles from './Headquarters.module.css';

const HeadquartersPage = () => {
    const [headquarters, setHeadquarters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHeadquarter, setEditingHeadquarter] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const { checkLimit } = usePlanStats();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        is_main: false
    });

    const loadHeadquarters = async () => {
        try {
            setIsLoading(true);
            const response = await companyHeadquarterService.getAllHeadquarters();
            setHeadquarters(response.data || response || []);
        } catch (error) {
            console.error('Error loading headquarters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadHeadquarters();
    }, []);

    const handleOpenModal = (hq = null) => {
        if (!hq) {
            const { reached } = checkLimit('headquarters');
            if (reached) {
                setIsLimitModalOpen(true);
                return;
            }
        }

        if (hq) {
            setEditingHeadquarter(hq);
            setFormData({
                name: hq.name,
                address: hq.address || '',
                city: hq.city || '',
                phone: hq.phone || '',
                is_main: hq.is_main || false
            });
        } else {
            setEditingHeadquarter(null);
            setFormData({
                name: '',
                address: '',
                city: '',
                phone: '',
                is_main: false
            });
        }
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingHeadquarter) {
                await companyHeadquarterService.updateHeadquarter(editingHeadquarter.id, formData);
            } else {
                await companyHeadquarterService.createHeadquarter(formData);
            }
            setIsModalOpen(false);
            loadHeadquarters();
        } catch (error) {
            alert(error.message || 'Error al guardar la sede');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta sede?')) {
            try {
                await companyHeadquarterService.deleteHeadquarter(id);
                loadHeadquarters();
            } catch (error) {
                alert(error.message || 'Error al eliminar la sede');
            }
        }
    };

    const filteredHQs = headquarters.filter(hq => 
        hq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hq.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Motion.div 
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestión de Sedes</h1>
                    <p className={styles.subtitle}>Administra las ubicaciones físicas de tu organización.</p>
                </div>
                <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Nueva Sede
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar sede por nombre o ciudad..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableCard}>
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando sedes...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nombre de la Sede</th>
                                <th>Ubicación</th>
                                <th>Contacto</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHQs.map((hq) => (
                                <tr key={hq.id}>
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.iconWrapper}><Building2 size={18} /></div>
                                            <div>
                                                <span>{hq.name}</span>
                                                {hq.is_main && (
                                                    <div style={{ marginTop: '0.25rem' }}>
                                                        <span className={`${styles.badge} ${styles.mainBadge}`}>Sede Principal</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                                <MapPin size={14} className={styles.iconDim} />
                                                <span>{hq.city || 'Ciudad no especificada'}</span>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hq.address}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                            <Phone size={14} className={styles.iconDim} />
                                            <span>{hq.phone || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${hq.status ? styles.mainBadge : styles.inactiveBadge}`}>
                                            {hq.status ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn} onClick={() => handleOpenModal(hq)} title="Editar">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(hq.id)} title="Eliminar">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredHQs.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No se encontraron sedes.
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
                                <h3>{editingHeadquarter ? 'Editar Sede' : 'Registrar Nueva Sede'}</h3>
                                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form className={styles.form} onSubmit={handleSave}>
                                <div className={styles.formGroup}>
                                    <label>Nombre de la Sede</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        placeholder="Ej: Sede Norte, Planta Principal" 
                                        value={formData.name}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className={styles.formGroup}>
                                        <label>Ciudad</label>
                                        <input 
                                            type="text" 
                                            name="city"
                                            placeholder="Ej: Bogotá" 
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Teléfono</label>
                                        <input 
                                            type="text" 
                                            name="phone"
                                            placeholder="Ej: 300 123 4567" 
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Dirección</label>
                                    <input 
                                        type="text" 
                                        name="address"
                                        placeholder="Ej: Calle 123 #45-67" 
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                                    <input 
                                        type="checkbox" 
                                        id="is_main"
                                        name="is_main"
                                        checked={formData.is_main}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="is_main" style={{ cursor: 'pointer', marginBottom: 0 }}>Establecer como Sede Principal</label>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                    <button type="submit" className={styles.submitBtn}>
                                        {editingHeadquarter ? 'Actualizar' : 'Guardar'}
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
                sectionName="Sedes" 
            />
        </Motion.div>
    );
};

export default HeadquartersPage;
