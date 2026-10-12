import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  CreditCard, 
  Search, 
  ExternalLink, 
  RotateCw, 
  ArrowRightLeft,
  Calendar,
  Building2,
  Filter,
  X
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import subscriptionService from '../services/subscriptionService';
import Pagination from '../../../../components/common/Pagination/Pagination';
import { formatCurrency } from '../../../../utils/formatters';
import styles from './Subscriptions.module.css';

const PAGE_LIMIT = 20;

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Paginación y búsqueda ─────────────────────────────────────────────────
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [searchInput, setSearchInput] = useState('');  // valor del input (inmediato)
  const [search, setSearch]           = useState('');  // valor debounced (enviado al backend)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await subscriptionService.getAllSubscriptions({ 
        page, 
        limit: PAGE_LIMIT, 
        search 
      });
      setSubscriptions(res.data || []);
      setTotal(res.meta?.total || res.total || 0);
      setTotalPages(res.meta?.totalPages || res.totalPages || 1);
    } catch (error) {
      console.error("Error cargando suscripciones:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  // Calculos Dinámicos
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let activeCount = 0;
    let pendingCount = 0;

    subscriptions.forEach(sub => {
      if (sub.status === 'ACTIVE') {
        activeCount++;
        // Asumiendo que el campo precio vive dentro del plan relacionado
        if (sub.plan && sub.plan.price) {
          totalRevenue += parseFloat(sub.plan.price);
        }
      } else if (sub.status === 'EXPIRED' || sub.status === 'CANCELLED') {
        pendingCount++;
      }
    });

    return {
      revenue: formatCurrency(totalRevenue),
      active: activeCount,
      pending: pendingCount
    };
  }, [subscriptions]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'ACTIVE': return { label: 'Activa', class: styles.active };
      case 'TRIAL': return { label: 'De Prueba', class: styles.warningBadge };
      case 'EXPIRED': return { label: 'Vencida', class: styles.dangerBadge };
      case 'CANCELLED': return { label: 'Cancelada', class: styles.dangerBadge };
      default: return { label: status, class: '' };
    }
  };

  return (
    <Motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Suscripciones de Empresas</h1>
          <p className={styles.subtitle}>Supervisa y gestiona los ciclos de facturación y planes contratados.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <span className={styles.ovLabel}>Recaudación Mensual (Aprox)</span>
          <h3 className={styles.ovValue}>{stats.revenue}</h3>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.ovLabel}>Suscripciones Activas</span>
          <h3 className={styles.ovValue}>{stats.active}</h3>
        </div>
        <div className={styles.overviewCard}>
          <span className={styles.ovLabel}>Pendientes / Vencidas</span>
          <h3 className={`${styles.ovValue} ${stats.pending > 0 ? styles.warning : ''}`}>{stats.pending}</h3>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por empresa..." 
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

        <button className={styles.filterBtn}>
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* Subscriptions Table */}
      <div className={styles.tableCard}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Plan Actual</th>
                <th>Próximo Cobro</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => {
                const statusMeta = getStatusDisplay(sub.status);
                const planName = sub.plan ? sub.plan.name : 'Desconocido';
                const companyName = sub.Company ? sub.Company.name : 'Sin Nombre';
                const planPrice = sub.plan ? formatCurrency(sub.plan.price) : formatCurrency(0);

                return (
                  <tr key={sub.id}>
                    <td>
                      <div className={styles.companyCell}>
                        <Building2 size={16} />
                        <span>{companyName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.planLabel}>{planName}</span>
                    </td>
                    <td>
                      <div className={styles.dateCell}>
                        <Calendar size={14} />
                        {formatDate(sub.next_payment_date)}
                      </div>
                    </td>
                    <td><span className={styles.amount}>{planPrice}</span></td>
                    <td>
                      <span className={`${styles.statusBadge} ${statusMeta.class}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="Cambiar Plan">
                          <ArrowRightLeft size={16} />
                        </button>
                        <button className={styles.actionBtn} title="Renovar">
                          <RotateCw size={16} />
                        </button>
                        <button className={styles.actionBtn} title="Detalles">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No hay suscripciones registradas aún.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

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
    </Motion.div>
  );
};

export default Subscriptions;
