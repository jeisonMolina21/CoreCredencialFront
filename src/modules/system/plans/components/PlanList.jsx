import React from 'react';
import { Package, Search, Edit2, Trash2, CheckCircle, AlertCircle, Users, Layout, CreditCard, Calendar, MapPin, Layers, Briefcase } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import styles from '../pages/Plans.module.css';

const PlanList = ({ plans, isLoading, onEdit, onDelete }) => {
  return (
    <div className={styles.tableCard}>
      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando planes...</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre del Plan</th>
              <th>Precio</th>
              <th>Límites del Plan</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>
                  <div className={styles.planNameCell}>
                    <div className={styles.planIcon}><Package size={18} /></div>
                    <span>{plan.name}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.price}>{formatCurrency(plan.price)}</span>
                  <span className={styles.interval}>/mes</span>
                </td>
                <td>
                  <div className={styles.minimalLimits}>
                    <div className={styles.minimalLimitItem}>
                      <span className={styles.minimalLimitLabel}><Users size={12} /> Usuarios</span>
                      <span className={styles.minimalLimitValue}>{plan.max_users}</span>
                    </div>
                    <div className={styles.minimalLimitItem}>
                      <span className={styles.minimalLimitLabel}><Layout size={12} /> Plantillas</span>
                      <span className={styles.minimalLimitValue}>{plan.max_templates_carnets}</span>
                    </div>
                    <div className={styles.minimalLimitItem}>
                      <span className={styles.minimalLimitLabel}><CreditCard size={12} /> Carnets</span>
                      <span className={styles.minimalLimitValue}>{plan.max_carnets}</span>
                    </div>
                    <div className={styles.minimalLimitItem}>
                      <span className={styles.minimalLimitLabel}><Calendar size={12} /> Eventos</span>
                      <span className={styles.minimalLimitValue}>{plan.max_events_month}</span>
                    </div>
                    <div className={styles.minimalLimitItem}>
                      <span className={styles.minimalLimitLabel}><MapPin size={12} /> Sedes</span>
                      <span className={styles.minimalLimitValue}>{plan.max_headquarters}</span>
                    </div>
                    <div className={styles.minimalLimitItem}>
                      <span className={styles.minimalLimitLabel}><Layers size={12} /> Áreas</span>
                      <span className={styles.minimalLimitValue}>{plan.max_areas}</span>
                    </div>
                    <div className={styles.minimalLimitItem}>
                      <span className={styles.minimalLimitLabel}><Briefcase size={12} /> Cargos</span>
                      <span className={styles.minimalLimitValue}>{plan.max_roles}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className={`${styles.badge} ${plan.is_active ? styles.active : styles.inactive}`}>
                      {plan.is_active ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {plan.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                    {plan.is_default && (
                      <span className={`${styles.badge} ${styles.defaultBadge}`} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        Por Defecto
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={() => onEdit(plan)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => onDelete(plan.id)} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hay planes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlanList;
