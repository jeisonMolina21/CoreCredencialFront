import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

import systemUserService from '../services/systemUserService';
import { systemRolService } from '../../roles';

import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import Pagination from '../../../../components/common/Pagination/Pagination';

import styles from './SystemUsers.module.css';

const PAGE_LIMIT = 20;

/**
 * Página principal de gestión de usuarios del sistema.
 * Orquesta: carga paginada, búsqueda con debounce, modal de formulario.
 *
 * Sub-componentes:
 *  - UserTable       → tabla con acciones por fila
 *  - UserFormModal   → modal crear/editar usuario
 *  - Pagination      → controles de paginación (reutilizado de companies)
 */
const SystemUsers = () => {
  // ── Datos ───────────────────────────────────────────────────────────────────
  const [users, setUsers]   = useState([]);
  const [roles, setRoles]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Paginación y búsqueda ──────────────────────────────────────────────────
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]           = useState('');

  // ── Modal ──────────────────────────────────────────────────────────────────
  const [formModal, setFormModal] = useState({ open: false, user: null });

  // ── Debounce búsqueda (400ms) ──────────────────────────────────────────────
  const debounceRef = useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  // ── Carga de datos ─────────────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await systemUserService.getAllUsers({ page, limit: PAGE_LIMIT, search });
      setUsers(res.data || []);
      setTotal(res.meta?.total || res.total || 0);
      setTotalPages(res.meta?.totalPages || res.totalPages || 1);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  const loadRoles = async () => {
    try {
      const res = await systemRolService.getAllRoles();
      setRoles(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('Error cargando roles:', error);
    }
  };

  useEffect(() => { loadRoles(); }, []);
  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ── Handlers del modal ─────────────────────────────────────────────────────
  const openFormModal  = (user = null) => setFormModal({ open: true, user });
  const closeFormModal = () => setFormModal({ open: false, user: null });

  // ── Bloquear/Activar ───────────────────────────────────────────────────────
  const handleToggleStatus = async (id) => {
    if (id === 1) return alert('El Usuario Administrador principal no puede desactivarse.');
    try {
      await systemUserService.toggleUserStatus(id);
      loadUsers();
    } catch (error) {
      alert(error.message || 'Error al cambiar el estado del usuario');
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (id === 1) {
      return alert('El Usuario Administrador principal no puede eliminarse.');
    }
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
    try {
      await systemUserService.deleteUser(id);
      if (users.length === 1 && page > 1) setPage(p => p - 1);
      else loadUsers();
    } catch (error) {
      alert(error.message || 'Error al eliminar el usuario');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Cabecera */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Usuarios de Sistema</h1>
          <p className={styles.subtitle}>
            Supervisa los administradores y operadores que tienen acceso a la consola global.
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => openFormModal()}>
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Buscador */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchInput}
            onChange={handleSearchChange}
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)', padding: '2px' }}
              title="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {search && (
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            {total === 0
              ? 'Sin resultados'
              : `${total} resultado${total !== 1 ? 's' : ''} para "${search}"`}
          </span>
        )}
      </div>

      {/* Tabla de usuarios */}
      <UserTable
        users={users}
        isLoading={isLoading}
        search={search}
        onEdit={openFormModal}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* Paginación */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={PAGE_LIMIT}
          onPageChange={setPage}
        />
      )}

      {/* Modal: Crear / Editar usuario */}
      <UserFormModal
        isOpen={formModal.open}
        editingUser={formModal.user}
        roles={roles}
        onClose={closeFormModal}
        onSaved={loadUsers}
      />
    </Motion.div>
  );
};

export default SystemUsers;
