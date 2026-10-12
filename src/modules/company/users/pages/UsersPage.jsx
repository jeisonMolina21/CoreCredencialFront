import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, X, CheckCircle, AlertCircle, Mail, Map as MapIcon, Briefcase } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import companyUserService from '../services/companyUserService';
import companyAreaService from '../../areas/services/companyAreaService';
import companyRolService from '../../roles/services/companyRolService';
import { usePlanStats } from '../../home/hooks/usePlanStats';
import LimitAlert from '../../../../components/common/LimitAlert';
import styles from './Users.module.css';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [areas, setAreas] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const { checkLimit } = usePlanStats();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        type_id: 'CC',
        number_id: '',
        rh_type: '',
        company_email: '',
        staff_mail: '',
        staff_phone: '',
        password: '',
        company_area_id: '',
        company_rol_id: '',
        system_role: 'common',
        status: true
    });

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [usersRes, areasRes, rolesRes] = await Promise.all([
                companyUserService.getAllUsers(),
                companyAreaService.getAllAreas(),
                companyRolService.getAllRoles()
            ]);
            setUsers(usersRes.data || usersRes || []);
            setAreas(areasRes.data || areasRes || []);
            setRoles(rolesRes.data || rolesRes || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (user = null) => {
        if (!user) {
            const { reached } = checkLimit('users');
            if (reached) {
                setIsLimitModalOpen(true);
                return;
            }
        }

        if (user) {
            setEditingUser(user);
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                type_id: user.type_id || 'CC',
                number_id: user.number_id || '',
                rh_type: user.rh_type || '',
                company_email: user.company_email,
                staff_mail: user.staff_mail || '',
                staff_phone: user.staff_phone || '',
                password: '',
                company_area_id: user.company_area_id || '',
                company_rol_id: user.company_rol_id || '',
                system_role: user.system_role || 'common',
                status: user.status
            });
        } else {
            setEditingUser(null);
            setFormData({
                first_name: '',
                last_name: '',
                type_id: 'CC',
                number_id: '',
                rh_type: '',
                company_email: '',
                staff_mail: '',
                staff_phone: '',
                password: '',
                company_area_id: '',
                company_rol_id: '',
                system_role: 'common',
                status: true
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
            const payload = { ...formData };
            if (editingUser) {
                if (!payload.password) delete payload.password;
                await companyUserService.updateUser(editingUser.id, payload);
            } else {
                await companyUserService.createUser(payload);
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            alert(error.message || 'Error al guardar el colaborador');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este colaborador?')) {
            try {
                await companyUserService.deleteUser(id);
                loadData();
            } catch (error) {
                alert(error.message || 'Error al eliminar el colaborador');
            }
        }
    };

    const filteredUsers = users.filter(user => 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Motion.div 
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Colaboradores</h1>
                    <p className={styles.subtitle}>Gestiona el personal de tu empresa, asigna áreas y cargos.</p>
                </div>
                <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Nuevo Colaborador
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o correo..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableCard}>
                {isLoading ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando personal de la empresa...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Área / Cargo</th>
                                <th>Contacto</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.nameCell}>
                                            <div className={styles.iconWrapper}><Users size={18} /></div>
                                            <div>
                                                <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {user.first_name} {user.last_name}
                                                    {user.is_protected && (
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
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{user.type_id}: {user.number_id} | RH: {user.rh_type || '--'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--secondary)', fontWeight: 600 }}>
                                                <MapIcon size={14} style={{ color: 'var(--primary)' }} />
                                                {user.CompanyArea?.area_name || <span style={{ color: '#cbd5e1', fontWeight: 400 }}>Sin área</span>}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                                <Briefcase size={14} style={{ color: '#f59e0b' }} />
                                                {user.CompanyRol?.rol_name || <span style={{ color: '#cbd5e1' }}>Sin cargo</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.8125rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)' }}>
                                                <Mail size={14} style={{ color: 'var(--primary)', opacity: 0.7 }} />
                                                {user.company_email}
                                            </div>
                                            {user.staff_phone && (
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '20px' }}>
                                                    Tel: {user.staff_phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`${styles.badge} ${user.status ? styles.activeStatus : styles.inactiveStatus}`}>
                                            {user.status ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                            {user.status ? 'Activo' : 'Inactivo'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn} onClick={() => handleOpenModal(user)} title="Editar">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(user.id)} title="Eliminar">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                        No se encontraron colaboradores registrados.
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
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        >
                            <div className={styles.modalHeader}>
                                <h3>{editingUser ? 'Editar Datos del Colaborador' : 'Registrar Nuevo Colaborador'}</h3>
                                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <form className={styles.form} onSubmit={handleSave}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Nombres</label>
                                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="Nombre(s)" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Apellidos</label>
                                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Apellido(s)" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Tipo Documento</label>
                                        <select name="type_id" value={formData.type_id} onChange={handleChange} required>
                                            <option value="CC">Cédula de Ciudadanía</option>
                                            <option value="CE">Cédula de Extranjería</option>
                                            <option value="NIT">NIT</option>
                                            <option value="PP">Pasaporte</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>No. Identificación</label>
                                        <input type="text" name="number_id" value={formData.number_id} onChange={handleChange} required placeholder="Número de documento" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Tipo de Sangre (RH)</label>
                                        <select name="rh_type" value={formData.rh_type} onChange={handleChange}>
                                            <option value="">Seleccione RH...</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Celular / Teléfono</label>
                                        <input type="text" name="staff_phone" value={formData.staff_phone} onChange={handleChange} placeholder="Ej: 3001234567" />
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label>Asignar Área</label>
                                        <select name="company_area_id" value={formData.company_area_id} onChange={handleChange} required>
                                            <option value="">Seleccione un área...</option>
                                            {areas.map(a => <option key={a.id} value={a.id}>{a.area_name}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Asignar Cargo</label>
                                        <select name="company_rol_id" value={formData.company_rol_id} onChange={handleChange} required>
                                            <option value="">Seleccione un cargo...</option>
                                            {roles.map(r => <option key={r.id} value={r.id}>{r.rol_name}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Nivel de Permisos</label>
                                        <select name="system_role" value={formData.system_role} onChange={handleChange} required>
                                            <option value="common">Colaborador Estándar</option>
                                            <option value="admin">Administrador (Acceso al Portal)</option>
                                            <option value="visualizer">Solo Visualización</option>
                                            <option value="roster">Roster (Solo Lectura)</option>
                                            <option value="retired">Retirado / Inactivo</option>
                                        </select>
                                    </div>
 
                                    <div className={`${styles.formGroup} ${styles.span2}`}>
                                        <label>Correo Corporativo (Login del Sistema)</label>
                                        <input type="email" name="company_email" value={formData.company_email} onChange={handleChange} required placeholder="ejemplo@miempresa.com" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Correo Personal</label>
                                        <input type="email" name="staff_mail" value={formData.staff_mail} onChange={handleChange} placeholder="personal@correo.com" />
                                    </div>
 
                                    <div className={`${styles.formGroup} ${styles.span2}`}>
                                        <label>Contraseña {editingUser ? '(Solo si desea cambiarla)' : '(Debe tener mínimo 6 caracteres)'}</label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required={!editingUser} 
                                            placeholder="Contraseña segura"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>&nbsp;</label>
                                        <div className={styles.checkboxGroup}>
                                            <input type="checkbox" name="status" id="user_status" checked={formData.status} onChange={handleChange} />
                                            <label htmlFor="user_status">Colaborador Activo</label>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                    <button type="submit" className={styles.submitBtn}>
                                        {editingUser ? 'Guardar Cambios' : 'Registrar Colaborador'}
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
                sectionName="Colaboradores" 
            />
        </Motion.div>
    );
};

export default UsersPage;
