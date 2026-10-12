import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import companyRolService from '../services/companyRolService';
import { usePlanStats } from '../../home/hooks/usePlanStats';
import LimitAlert from '../../../../components/common/LimitAlert';
import styles from '../../areas/pages/Areas.module.css'; // Reusing the same styles

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const { checkLimit } = usePlanStats();

    const [formData, setFormData] = useState({
        rol_name: ''
    });

    const loadRoles = async () => {
        try {
            setIsLoading(true);
            const response = await companyRolService.getAllRoles();
            setRoles(response.data || response || []);
        } catch (error) {
            console.error('Error loading roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const handleOpenModal = (role = null) => {
        if (!role) {
            const { reached } = checkLimit('roles');
            if (reached) {
                setIsLimitModalOpen(true);
                return;
            }
        }

        if (role) {
            setEditingRole(role);
            setFormData({ rol_name: role.rol_name });
        } else {
            setEditingRole(null);
            setFormData({ rol_name: '' });
        }
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await companyRolService.updateRole(editingRole.id, formData);
            } else {
                await companyRolService.createRole(formData);
            }
            setIsModalOpen(false);
            loadRoles();
        } catch (error) {
            alert(error.message || 'Error al guardar el cargo');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cargo?')) {
            try {
                await companyRolService.deleteRole(id);
                loadRoles();
            } catch (error) {
                alert(error.message || 'Error al eliminar el cargo');
            }
        }
    };

    const filteredRoles = roles.filter(role => 
        role.rol_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Motion.div 
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestión de Cargos</h1>
                    <p className={styles.subtitle}>Define las posiciones y perfiles laborales dentro de tu organización.</p>
                </div>
                <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Nuevo Cargo
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por cargo..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableCard}>
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando cargos...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nombre del Cargo</th>
                                <th>Fecha de Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoles.map((role) => (
                                <tr key={role.id}>
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.iconWrapper}><Briefcase size={18} /></div>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {role.rol_name}
                                                {role.is_protected && (
                                                    <span style={{ 
                                                        fontSize: '0.65rem', 
                                                        background: '#F1F5F9', 
                                                        color: '#64748B', 
                                                        padding: '2px 6px', 
                                                        borderRadius: '4px',
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase'
                                                    }}>Sistema</span>
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(role.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn} onClick={() => handleOpenModal(role)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(role.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRoles.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No se encontraron cargos.
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
                                <h3>{editingRole ? 'Editar Cargo' : 'Registrar Nuevo Cargo'}</h3>
                                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form className={styles.form} onSubmit={handleSave}>
                                <div className={styles.formGroup}>
                                    <label>Nombre del Cargo</label>
                                    <input 
                                        type="text" 
                                        name="rol_name"
                                        placeholder="Ej: Gerente, Analista, Coordinador" 
                                        value={formData.rol_name}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                    <button type="submit" className={styles.submitBtn}>
                                        {editingRole ? 'Actualizar' : 'Guardar'}
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
                sectionName="Cargos" 
            />
        </Motion.div>
    );
};

export default Roles;
