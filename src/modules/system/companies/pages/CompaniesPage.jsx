import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../core/contexts/AuthContext';

import companyService from '../services/companyService';
import { planService } from '../../plans';

import CompanyTable from '../components/CompanyTable';
import CompanyFormModal from '../components/CompanyFormModal';
import DisableCompanyModal from '../components/DisableCompanyModal';
import Pagination from '../../../../components/common/Pagination/Pagination';

import styles from './Companies.module.css';

const PAGE_LIMIT = 20;

/**
 * Página principal de gestión de empresas.
 * Orquesta: carga paginada, búsqueda con debounce, modales de formulario y deshabilitación.
 */
const Companies = () => {
  // ── Datos ────────────────────────────────────────────────────────────────────
  const navigate = useNavigate();
  const { impersonate } = useAuth();
  
  const [companies, setCompanies]   = useState([]);
  const [plans, setPlans]           = useState([]);
  const [isLoading, setIsLoading]   = useState(true);

  // ── Paginación y búsqueda ─────────────────────────────────────────────────
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [searchInput, setSearchInput] = useState('');  // valor del input (inmediato)
  const [search, setSearch]           = useState('');  // valor debounced (enviado al backend)

  // ── Modales ───────────────────────────────────────────────────────────────
  const [formModal, setFormModal]       = useState({ open: false, company: null });
  const [disableModal, setDisableModal] = useState({ open: false, company: null });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openFormModal  = (company = null) => setFormModal({ open: true, company });
  const closeFormModal = () => setFormModal({ open: false, company: null });

  const openDisableModal  = (company) => setDisableModal({ open: true, company });
  const closeDisableModal = () => {
    setDisableModal({ open: false, company: null });
    loadCompanies();
  };

  // ── Impersonación (Gestión como Admin) ────────────────────────────────────
  const handleImpersonate = async (id) => {
    try {
      const res = await companyService.impersonateCompany(id);
      // Guardar sesión principal y cargar la de empresa
      const authData = res.data || res;
      impersonate(authData.user, authData.token);
      
      // Redirigir al dashboard de la compañía
      navigate('/company/home');
    } catch (error) {
      alert(error.message || 'No se pudo acceder a la gestión de la empresa');
    }
  };

  // ── Debounce del buscador (400ms) ─────────────────────────────────────────
  const debounceRef = useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1); // Volver a la primera página al buscar
    }, 400);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  // ── Carga de datos ────────────────────────────────────────────────────────
  const loadCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await companyService.getAllCompanies({ page, limit: PAGE_LIMIT, search });
      setCompanies(res.data || []);
      setTotal(res.meta?.total || res.total || 0);
      setTotalPages(res.meta?.totalPages || res.totalPages || 1);
    } catch (error) {
      console.error('Error cargando empresas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  const loadPlans = async () => {
    try {
      const res = await planService.getAllPlans();
      setPlans(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('Error cargando planes:', error);
    }
  };

  useEffect(() => { loadPlans(); }, []);
  useEffect(() => { loadCompanies(); }, [loadCompanies]);


  // ── Reactivar ────────────────────────────────────────────────────────────
  const handleReactivate = async (id) => {
    if (!window.confirm('¿Reactivar esta empresa y su administrador principal?')) return;
    try {
      const result = await companyService.reactivateCompany(id);
      alert(result.message || 'Empresa reactivada exitosamente.');
      loadCompanies();
    } catch (error) {
      alert(error.message || 'Error al reactivar la empresa');
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de desactivar esta empresa de forma permanente?')) return;
    try {
      await companyService.deleteCompany(id);
      // Si era la última de la página, ir a la anterior
      if (companies.length === 1 && page > 1) setPage(p => p - 1);
      else loadCompanies();
    } catch (error) {
      alert(error.message || 'Error al eliminar la empresa');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
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
          <h1 className={styles.title}>Gestión de Empresas</h1>
          <p className={styles.subtitle}>
            Supervisa los clientes y entidades registradas en el sistema principal.
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => openFormModal()}>
          <Plus size={20} />
          Nueva Empresa
        </button>
      </div>

      {/* Toolbar: búsqueda */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o NIT..."
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
              : `${total} resultado${total !== 1 ? 's' : ''} para "${search}"`
            }
          </span>
        )}
      </div>

      {/* Tabla de empresas */}
      <CompanyTable
        companies={companies}
        isLoading={isLoading}
        onEdit={openFormModal}
        onDisable={openDisableModal}
        onReactivate={handleReactivate}
        onDelete={handleDelete}
        onImpersonate={handleImpersonate}
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

      {/* Modal: Crear / Editar empresa */}
      <CompanyFormModal
        isOpen={formModal.open}
        editingCompany={formModal.company}
        plans={plans}
        onClose={closeFormModal}
        onSaved={loadCompanies}
      />

      {/* Modal: Deshabilitar empresa */}
      <DisableCompanyModal
        isOpen={disableModal.open}
        company={disableModal.company}
        onClose={closeDisableModal}
      />
    </Motion.div>
  );
};

export default Companies;
