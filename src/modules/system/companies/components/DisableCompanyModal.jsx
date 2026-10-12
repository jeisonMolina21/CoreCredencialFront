import React, { useState } from 'react';
import {
  AlertTriangle,
  PowerOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import companyService from '../services/companyService';
import styles from '../pages/Companies.module.css';

/**
 * Modal de confirmación para deshabilitar una empresa.
 *
 * Props:
 *  - isOpen: boolean
 *  - company: object | null  — empresa a deshabilitar
 *  - onClose: () => void     — cierra y refresca la lista
 */
const DisableCompanyModal = ({ isOpen, company, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, message, data }

  const handleClose = () => {
    setResult(null);
    setLoading(false);
    onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await companyService.disableCompany(company.id);
      setResult({ success: true, message: res.message, data: res.data });
    } catch (err) {
      setResult({ success: false, message: err.message || 'Error al deshabilitar la empresa' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <Motion.div
            className={`${styles.modalContent} ${styles.disableModalContent}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {!result ? (
              /* ── Estado: Confirmación ── */
              <>
                <div className={styles.disableModalIcon}>
                  <AlertTriangle size={36} />
                </div>
                <div className={styles.disableModalBody}>
                  <h3 className={styles.disableModalTitle}>Deshabilitar Empresa</h3>
                  <p className={styles.disableModalCompanyName}>{company?.name}</p>
                  <p className={styles.disableModalDesc}>Esta acción realizará lo siguiente:</p>
                  <ul className={styles.disableModalList}>
                    <li>🚫 La renovación automática y manual de la suscripción quedará bloqueada</li>
                    <li>✅ Si la suscripción está vigente, los usuarios <strong>mantienen su acceso</strong> hasta la fecha de vencimiento</li>
                    <li>🔒 Al vencer el período actual, los usuarios perderán el acceso automáticamente</li>
                    <li>🏢 Si no hay suscripción activa, la empresa y sus usuarios se bloquean de inmediato</li>
                  </ul>
                  <p className={styles.disableModalWarning}>
                    Esta operación puede revertirse usando el botón de reactivación.
                  </p>
                </div>
                <div className={styles.disableModalFooter}>
                  <button className={styles.cancelBtn} onClick={handleClose} disabled={loading}>
                    Cancelar
                  </button>
                  <button className={styles.disableConfirmBtn} onClick={handleConfirm} disabled={loading}>
                    {loading
                      ? <><span className={styles.spinner} /> Procesando...</>
                      : <><PowerOff size={16} /> Confirmar deshabilitación</>
                    }
                  </button>
                </div>
              </>
            ) : (
              /* ── Estado: Resultado ── */
              <>
                <div className={`${styles.disableModalIcon} ${result.success ? styles.successIcon : styles.errorIcon}`}>
                  {result.success ? <CheckCircle size={36} /> : <AlertCircle size={36} />}
                </div>
                <div className={styles.disableModalBody}>
                  <h3 className={styles.disableModalTitle}>
                    {result.success ? 'Empresa deshabilitada' : 'Error en la operación'}
                  </h3>
                  <p className={styles.disableModalDesc}>{result.message}</p>

                  {result.success && result.data?.deferred && (
                    <div className={styles.disableDeferred}>
                      <AlertCircle size={14} />
                      Los usuarios conservan su acceso hasta el{' '}
                      <strong>
                        {new Date(result.data.subscription_expires).toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </strong>
                      . Después de esa fecha, perderán el acceso automáticamente y la empresa quedará inactiva.
                    </div>
                  )}
                </div>
                <div className={styles.disableModalFooter}>
                  <button className={styles.submitBtn} onClick={handleClose}>
                    Entendido
                  </button>
                </div>
              </>
            )}
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DisableCompanyModal;
