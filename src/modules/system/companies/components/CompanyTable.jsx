import React from 'react';
import {
  Building2,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  PowerOff,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import styles from '../pages/Companies.module.css';

/**
 * Tabla de empresas con acciones por fila.
 *
 * Props:
 *  - companies: array
 *  - isLoading: boolean
 *  - onEdit: (company) => void
 *  - onDisable: (company) => void
 *  - onReactivate: (companyId) => void
 *  - onDelete: (companyId) => void
 *  - onImpersonate: (companyId) => void
 */
const CompanyTable = ({ companies, isLoading, onEdit, onDisable, onReactivate, onDelete, onImpersonate }) => {
  if (isLoading) {
    return (
      <div className={styles.tableCard}>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Cargando datos...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Razón Social</th>
            <th>NIT</th>
            <th>Subdominio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>
                <div className={styles.planNameCell}>
                  <div className={styles.planIcon}><Building2 size={18} /></div>
                  <span>{company.name}</span>
                </div>
              </td>
              <td>
                <span className={styles.price}>{company.nit_id || 'N/A'}</span>
              </td>
              <td>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {company.subdomain || 'N/A'}
                </span>
              </td>
              <td>
                <span className={`${styles.badge} ${company.is_active ? styles.active : styles.inactive}`}>
                  {company.is_active ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {company.is_active ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  {company.is_active && (
                    <button
                      className={`${styles.actionBtn} ${styles.manageBtn}`}
                      onClick={() => onImpersonate(company.id)}
                      title="Gestionar como Admin"
                    >
                      <LayoutDashboard size={16} />
                    </button>
                  )}

                  <button
                    className={styles.actionBtn}
                    onClick={() => onEdit(company)}
                    title="Editar empresa"
                  >
                    <Edit2 size={16} />
                  </button>

                  {company.is_active ? (
                    <button
                      className={`${styles.actionBtn} ${styles.disableBtn}`}
                      onClick={() => onDisable(company)}
                      title="Deshabilitar empresa"
                    >
                      <PowerOff size={16} />
                    </button>
                  ) : (
                    <button
                      className={`${styles.actionBtn} ${styles.reactivateBtn}`}
                      onClick={() => onReactivate(company.id)}
                      title="Reactivar empresa"
                    >
                      <RefreshCw size={16} />
                    </button>
                  )}

                  <button
                    className={`${styles.actionBtn} ${styles.delete}`}
                    onClick={() => onDelete(company.id)}
                    title="Eliminar permanentemente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {companies.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                No hay empresas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;
