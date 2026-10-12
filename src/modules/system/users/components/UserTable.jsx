import React from 'react';
import {
  Users,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Shield,
  Lock,
  Unlock
} from 'lucide-react';
import styles from '../pages/SystemUsers.module.css';

/**
 * Tabla de usuarios del sistema con acciones por fila.
 *
 * Props:
 *  - users: array
 *  - isLoading: boolean
 *  - search: string (para mensaje de vacío contextual)
 *  - onEdit: (user) => void
 *  - onDelete: (userId) => void
 *  - onToggleStatus: (userId) => void
 */
const UserTable = ({ users, isLoading, search, onEdit, onDelete, onToggleStatus }) => {
  if (isLoading) {
    return (
      <div className={styles.tableCard}>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Cargando usuarios...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>E-Mail (Acceso)</th>
            <th>Rol Asignado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.planNameCell}>
                  <div className={styles.planIcon}><Users size={18} /></div>
                  <span>{user.name}</span>
                </div>
              </td>
              <td><span>{user.email}</span></td>
              <td>
                {(() => {
                  // Prioridad: objeto rol de la relación FK → columna system_role (fallback)
                  const hasRol    = user.rol != null;
                  const isAdmin   = user.system_role === 'admin';
                  const rolName   = hasRol ? user.rol.name : (isAdmin ? 'Administrador' : user.system_role);
                  const badgeClass = isAdmin && !hasRol ? styles.roleAdmin : styles.roleCommon;
                  const icon       = isAdmin && !hasRol ? <ShieldAlert size={14} /> : <Shield size={14} />;

                  return (
                    <span className={`${styles.badge} ${badgeClass}`}>
                      {icon}
                      {rolName}
                    </span>
                  );
                })()}
              </td>
              <td>
                <span className={`${styles.badge} ${user.status ? styles.active : styles.inactive}`}>
                  {user.status ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {user.status ? 'Activo' : 'Suspendido'}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onEdit(user)}
                    title="Editar usuario"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className={`${styles.actionBtn} ${user.status ? styles.lock : styles.unlock}`}
                    onClick={() => onToggleStatus(user.id)}
                    title={user.status ? "Desactivar usuario" : "Activar usuario"}
                    disabled={user.id === 1}
                    style={{
                      opacity: user.id === 1 ? 0.3 : 1,
                      cursor: user.id === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {user.status ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.delete}`}
                    onClick={() => onDelete(user.id)}
                    title="Eliminar usuario"
                    disabled={user.id === 1}
                    style={{
                      opacity: user.id === 1 ? 0.3 : 1,
                      cursor: user.id === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                {search
                  ? `No se encontraron usuarios para "${search}"`
                  : 'No hay usuarios registrados'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
