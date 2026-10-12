import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Check,
  XCircle,
  Clock,
  ArrowRight,
  Plus,
  Star,
  Trash2,
  Lock
} from 'lucide-react';
import { subscriptionService } from '../../../system/subscriptions';
import { planService } from '../../../system/plans';
import paymentMethodService from '../services/paymentMethodService';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { formatCurrency } from '../../../../utils/formatters';
import styles from './Subscription.module.css';

const Subscription = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('subscription');
  const [subscription, setSubscription] = useState(null);
  const [methods, setMethods] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulario para nueva tarjeta (Mock)
  const [newCard, setNewCard] = useState({
    card_number: '',
    card_holder: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargamos por separado para que si uno falla (ej. no hay suscripción) no bloquee los demás
      const loadSubscription = async () => {
        try {
          const res = await subscriptionService.getMySubscription();
          const data = res?.data || res;
          setSubscription(data);
        } catch (err) {
          console.warn('No active subscription found or error:', err);
          // Si no hay suscripción (404), no es un error fatal, simplemente no se muestra el panel actual
          if (err.status === 404) {
            setSubscription(null);
          }
        }
      };

      const loadPlans = async () => {
        try {
          const res = await planService.getAllPlans();
          const data = res?.data || res?.plans || res;
          setPlans(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error loading plans:', err);
        }
      };

      const loadMethods = async () => {
        try {
          const res = await paymentMethodService.getMyMethods();
          const data = res?.data || res;
          setMethods(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error loading payment methods:', err);
        }
      };

      await Promise.all([loadSubscription(), loadPlans(), loadMethods()]);
    } catch (err) {
      console.error('General error in Subscription fetchData:', err);
      setError('Ocurrió un error al cargar la información comercial.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;
    setActionLoading(true);
    try {
      const newStatus = !subscription.auto_renew;
      await subscriptionService.updateMySubscription({ auto_renew: newStatus });
      await fetchData();
    } catch (err) {
      alert(err.message || 'Error al cambiar la renovación automática');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePlan = async (planId) => {
    if (confirm('¿Estás seguro de que deseas cambiar tu plan? Esto podría afectar tu facturación.')) {
      setActionLoading(true);
      try {
        await subscriptionService.updateMySubscription({ plan_id: planId });
        await fetchData();
      } catch (err) {
        alert(err.message || 'Error al cambiar el plan');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSetPrimaryMethod = async (id) => {
    setActionLoading(true);
    try {
      await paymentMethodService.setPrimary(id);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Error al cambiar el método principal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMethod = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      setActionLoading(true);
      try {
        await paymentMethodService.removeMethod(id);
        await fetchData();
      } catch (err) {
        alert(err.message || 'Error al eliminar el método de pago');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // Mock de fragmentación para la DB
      const lastFour = newCard.card_number.slice(-4);
      const brand = newCard.card_number.startsWith('4') ? 'Visa' : 'Mastercard';

      await paymentMethodService.addMethod({
        gateway_name: 'mock_gateway',
        token: `tok_mock_${Date.now()}`,
        last_four: lastFour,
        brand: brand,
        expiry_date: newCard.expiry
      });

      setShowAddModal(false);
      setNewCard({ card_number: '', card_holder: '', expiry: '', cvc: '' });
      await fetchData();
    } catch (err) {
      alert(err.message || 'Error al agregar la tarjeta');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.loader} size={48} />
        <p>Cargando información comercial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorCard}>
        <AlertCircle size={48} color="#ef4444" />
        <p>{error}</p>
        <button onClick={fetchData} className={styles.retryBtn}>Reintentar</button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const labels = {
      ACTIVE: 'Activa',
      EXPIRED: 'Expirada',
      CANCELLED: 'Cancelada',
      TRIAL: 'Prueba'
    };
    const classNames = {
      ACTIVE: styles.active,
      EXPIRED: styles.expired,
      CANCELLED: styles.cancelled,
      TRIAL: styles.active
    };
    return <span className={`${styles.badge} ${classNames[status]}`}>{labels[status] || status}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mi Suscripción</h1>
        <p className={styles.subtitle}>Gestiona tus pagos, planes y ciclo de facturación.</p>
      </header>

      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === 'subscription' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('subscription')}
        >
          Suscripción
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'payments' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Métodos de Pago
        </div>
      </div>

      {activeTab === 'subscription' ? (
        <>
          {subscription && (
            <section className={styles.currentSubSection}>
              <div className={styles.subCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.planNameWrapper}>
                    <CreditCard size={24} color="var(--primary)" />
                    <h2 className={styles.value}>{subscription.plan?.name}</h2>
                    {getStatusBadge(subscription.status)}
                  </div>
                  <div className={styles.price}>
                    {formatCurrency(subscription.plan?.price)}
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {subscription.billing_cycle === 'YEARLY' ? ' / año' : ' / mes'}
                    </span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Próximo Cobro</span>
                    <div className={styles.value}>
                      <Calendar size={18} style={{ marginRight: '8px' }} />
                      {formatDate(subscription.next_payment_date)}
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Inicio de Periodo</span>
                    <div className={styles.value}>
                      <Clock size={18} style={{ marginRight: '8px' }} />
                      {formatDate(subscription.start_date)}
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Ciclo</span>
                    <span className={styles.value}>
                      {subscription.billing_cycle === 'MONTHLY' ? 'Mensual' :
                        subscription.billing_cycle === 'YEARLY' ? 'Anual' :
                          subscription.billing_cycle}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Estado Renovación</span>
                    <span className={styles.value}>
                      {subscription.auto_renew ? (
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Check size={16} /> Automática
                        </span>
                      ) : (
                        <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <XCircle size={16} /> Manual
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.footerHint}>
                    <AlertCircle size={16} />
                    {subscription.auto_renew
                      ? 'Tu suscripción se renovará automáticamente usando tu medio de pago predeterminado.'
                      : 'Tu suscripción finalizará al terminar el periodo actual. Deberás renovar manualmente.'}
                  </div>
                  <div className={styles.footerActions}>
                    {subscription.auto_renew ? (
                      <button
                        className={styles.cancelBtn}
                        onClick={handleToggleAutoRenew}
                        disabled={actionLoading}
                      >
                        Desactivar Renovación
                      </button>
                    ) : (
                      <button
                        className={styles.reactivateBtn}
                        onClick={handleToggleAutoRenew}
                        disabled={actionLoading}
                      >
                        Activar Renovación
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className={styles.plansSection}>
            <h3 className={styles.plansTitle}>Cambiar Plan de Suscripción</h3>
            <div className={styles.planGrid}>
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`${styles.planCard} ${subscription?.plan_id === plan.id ? styles.currentPlanCard : ''}`}
                >
                  {subscription?.plan_id === plan.id && (
                    <div className={styles.currentBadge}>Tu Plan Actual</div>
                  )}
                  <div className={styles.planCardHeader}>
                    <h4 className={styles.planCardName}>{plan.name}</h4>
                    <div className={styles.planCardPrice}>
                      {formatCurrency(plan.price)}
                      <span>{subscription?.billing_cycle === 'YEARLY' ? '/ año' : '/ mes'}</span>
                    </div>
                  </div>
                  <ul className={styles.featureList}>
                    <li className={styles.featureItem}><CheckCircle2 size={16} color="#10b981" /> {plan.max_users} Usuarios</li>
                    <li className={styles.featureItem}><CheckCircle2 size={16} color="#10b981" /> {plan.max_templates_carnets} Plantillas</li>
                    <li className={styles.featureItem}><CheckCircle2 size={16} color="#10b981" /> {plan.max_carnets} Carnets</li>
                    <li className={styles.featureItem}><CheckCircle2 size={16} color="#10b981" /> {plan.max_events_month} Eventos/Mes</li>
                  </ul>
                  <button
                    className={styles.selectPlanBtn}
                    disabled={subscription?.plan_id === plan.id || actionLoading}
                    onClick={() => handleChangePlan(plan.id)}
                  >
                    {subscription?.plan_id === plan.id ? 'Plan Actual' : 'Seleccionar Plan'}
                    {subscription?.plan_id !== plan.id && <ArrowRight size={18} style={{ marginLeft: '8px' }} />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className={styles.paymentsSection}>
          <div className={styles.methodsGrid}>
            {methods.map(method => (
              <div key={method.id} className={`${styles.paymentCard} ${method.is_default ? styles.cardPrimary : ''}`}>
                <div className={styles.cardVendor}>
                  <span>{method.brand}</span>
                  <div className={styles.cardChip}></div>
                </div>
                <div className={styles.cardNumber}>
                  **** **** **** {method.last_four}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.infoBox}>
                    <span className={styles.cardLabel}>Titular</span>
                    <span className={styles.cardValue}>{user?.name}</span>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.cardLabel}>Expira</span>
                    <span className={styles.cardValue}>{method.expiry_date || 'MM/AA'}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {!method.is_default && (
                    <button className={styles.cardBtn} title="Marcar como principal" onClick={() => handleSetPrimaryMethod(method.id)}>
                      <Star size={16} />
                    </button>
                  )}
                  <button className={styles.cardBtn} title="Eliminar" onClick={() => handleRemoveMethod(method.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>

                {method.is_default && (
                  <div className={styles.cardPrimaryBadge}>PRINCIPAL</div>
                )}
              </div>
            ))}

            <button className={styles.addMethodBtn} onClick={() => setShowAddModal(true)}>
              <Plus size={32} />
              <span>Agregar Tarjeta</span>
            </button>
          </div>

          {showAddModal && (
            <div className={styles.modal}>
              <form className={styles.modalContent} onSubmit={handleAddCard}>
                <h3 className={styles.modalTitle}>Nueva Tarjeta</h3>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Número de Tarjeta</label>
                  <input
                    className={styles.input}
                    placeholder="0000 0000 0000 0000"
                    maxLength="16"
                    required
                    value={newCard.card_number}
                    onChange={e => setNewCard({ ...newCard, card_number: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Titular de la Tarjeta</label>
                  <input
                    className={styles.input}
                    placeholder="Nombre como aparece en la tarjeta"
                    required
                    value={newCard.card_holder}
                    onChange={e => setNewCard({ ...newCard, card_holder: e.target.value })}
                  />
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Vencimiento</label>
                    <input
                      className={styles.input}
                      placeholder="MM/AA"
                      required
                      value={newCard.expiry}
                      onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>CVC</label>
                    <input
                      className={styles.input}
                      placeholder="123"
                      maxLength="4"
                      required
                      value={newCard.cvc}
                      onChange={e => setNewCard({ ...newCard, cvc: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelModalBtn} onClick={() => setShowAddModal(false)}>Cancelar</button>
                  <button type="submit" className={styles.confirmBtn} disabled={actionLoading}>
                    {actionLoading ? 'Guardando...' : 'Guardar Tarjeta'}
                  </button>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem' }}>
                  <Lock size={12} />
                  Tus datos bancarios están cifrados y seguros.
                </div>
              </form>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Subscription;

