import React, { useEffect, useState, useRef } from 'react';
import { CreditCard, Calendar, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../../modules/public/auth';
import { formatCurrency } from '../../utils/formatters';
import styles from '../../modules/public/auth/components/auth.module.css';

const CONTAINER_IDS = {
    card: "mp-card-number-container",
    exp: "mp-expiration-container",
    cvv: "mp-cvv-container"
};

const MercadoPagoCheckout = ({ plan, billingCycle, onPaymentSuccess, onError, identificationType, identificationNumber, email }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [config, setConfig] = useState(null);
    const [cardholderName, setCardholderName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    
    const mpRef = useRef(null);
    const fieldsRef = useRef(null);

    // 1. Obtener configuración dinámica
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await authService.getPaymentConfig();
                if (res.success) {
                    console.log('--- DIAGNÓSTICO MERCADO PAGO (FRONTEND) ---');
                    console.log('Public Key recibida:', res.publicKey);
                    console.log('Modo:', res.mode);
                    console.log('-------------------------------------------');
                    setConfig(res);
                } else {
                    setErrorMsg('No se pudo cargar la configuración de pago.');
                }
            } catch (err) {
                console.error('Error fetching MP config:', err);
                setErrorMsg('Error de conexión con la pasarela.');
            }
        };
        fetchConfig();
    }, []);

    // 2. Cargar Script e Inicializar
    useEffect(() => {
        if (!config || !config.publicKey) return;

        let isMounted = true;
        const SCRIPT_URL = "https://sdk.mercadopago.com/js/v2";

        const initializeFields = () => {
            if (!isMounted || !window.MercadoPago) return;
            
            try {
                const mp = new window.MercadoPago(config.publicKey, { locale: 'es-CO' });
                mpRef.current = mp;

                // Estilos CSS válidos según Mercado Pago
                const style = {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    color: '#1e293b'
                };

                let fields;
                if (mp.fields && typeof mp.fields.create === 'function') {
                    fields = mp.fields;
                } else if (typeof mp.cardFields === 'function') {
                    fields = mp.cardFields({ style });
                } else if (typeof mp.fields === 'function') {
                    fields = mp.fields({ style });
                } else {
                    throw new Error("No se pudo detectar el controlador de campos.");
                }
                
                fieldsRef.current = fields;

                // Montar campos con placeholders fuera del objeto style
                const card = fields.create('cardNumber', { placeholder: "0000 0000 0000 0000", style }).mount(CONTAINER_IDS.card);
                fields.create('expirationDate', { placeholder: "MM/YY", style }).mount(CONTAINER_IDS.exp);
                fields.create('securityCode', { placeholder: "CVV", style }).mount(CONTAINER_IDS.cvv);

                card.on('ready', () => {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                });

                // Fallback: si el evento ready tarda demasiado pero los campos están ahí
                setTimeout(() => {
                    if (isMounted) setIsLoading(false);
                }, 3000);

                card.on('error', (err) => {
                    console.error("Error MP:", err);
                    if (isMounted) setErrorMsg("Error en la pasarela. Revisa tus credenciales.");
                });

            } catch (err) {
                console.error('CRITICAL ERROR MP:', err);
                if (isMounted) setErrorMsg('Error de montaje: ' + err.message);
                setIsLoading(false);
            }
        };

        const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);
        if (existingScript) {
            if (window.MercadoPago) {
                setTimeout(initializeFields, 200);
            } else {
                existingScript.addEventListener('load', initializeFields);
            }
        } else {
            const script = document.createElement('script');
            script.src = SCRIPT_URL;
            script.async = true;
            script.onload = () => setTimeout(initializeFields, 200);
            script.onerror = () => setErrorMsg('Error al cargar SDK de Mercado Pago.');
            document.head.appendChild(script);
        }

        return () => {
            isMounted = false;
        };
    }, [config]);

    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        
        if (!cardholderName) {
            setErrorMsg("Por favor ingresa el nombre del titular.");
            return;
        }

        setIsLoading(true);

        try {
            const tokenResponse = await fieldsRef.current.createCardToken({
                cardholderName: cardholderName,
                identificationType: identificationType,
                identificationNumber: identificationNumber,
                email: email // El email es vital para poder guardar la tarjeta en el cliente después
            });
            
            if (tokenResponse && tokenResponse.id) {
                onPaymentSuccess(tokenResponse.id);
            } else {
                throw new Error("No se pudo generar el token de seguridad.");
            }
        } catch (error) {
            console.error('Error generating token:', error);
            const msg = 'Los datos de la tarjeta no son válidos.';
            setErrorMsg(msg);
            if (onError) onError(msg);
            setIsLoading(false);
        }
    };

    const price = billingCycle === 'MONTHLY' ? plan.price : Math.round(plan.price * 12 * 0.85);

    return (
        <div className={styles.authForm}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>Información de Pago</h3>
                    {config?.mode === 'SANDBOX' && (
                        <span style={{ fontSize: '10px', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, height: 'fit-content' }}>
                            MODO PRUEBA
                        </span>
                    )}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Suscripción al <strong>{plan.name}</strong> ({billingCycle === 'MONTHLY' ? 'Mensual' : 'Anual'})
                </p>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>
                    {formatCurrency(price)}
                </div>
            </div>

            {errorMsg && (
                <div style={{ padding: '0.75rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
                    {errorMsg}
                </div>
            )}

            <div className={styles.inputGroup}>
                <label>Nombre en la tarjeta</label>
                <div className={styles.inputWrapper}>
                    <User className={styles.inputIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Como aparece en la tarjeta"
                        value={cardholderName}
                        onChange={(e) => {
                            setCardholderName(e.target.value);
                            if (errorMsg) setErrorMsg('');
                        }}
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>Número de Tarjeta</label>
                <div className={styles.inputWrapper} style={{ height: '46px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0 1rem 0 3rem' }}>
                    <CreditCard className={styles.inputIcon} size={20} />
                    <div id={CONTAINER_IDS.card} style={{ width: '100%', height: '100%' }}></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.inputGroup}>
                    <label>Expiración</label>
                    <div className={styles.inputWrapper} style={{ height: '46px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0 1rem 0 3rem' }}>
                        <Calendar className={styles.inputIcon} size={20} />
                        <div id={CONTAINER_IDS.exp} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label>CVV</label>
                    <div className={styles.inputWrapper} style={{ height: '46px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0 1rem 0 3rem' }}>
                        <Lock className={styles.inputIcon} size={20} />
                        <div id={CONTAINER_IDS.cvv} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                </div>
            </div>

            <button 
                type="button" 
                onClick={handlePayment} 
                className={styles.submitBtn}
                disabled={isLoading || !config}
                style={{ width: '100%', marginTop: '1.5rem' }}
            >
                {isLoading ? <Loader2 className={styles.spin} size={20} /> : <Lock size={20} />}
                {isLoading ? 'Cargando Pasarela...' : `Pagar ${formatCurrency(price)}`}
            </button>
            
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
                Cobro recurrente automático. Puedes cancelar en cualquier momento.
            </p>
        </div>
    );
};

export default MercadoPagoCheckout;
