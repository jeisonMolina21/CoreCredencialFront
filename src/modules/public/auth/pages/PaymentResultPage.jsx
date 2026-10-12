import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import logoImg from '../../../../assets/CarnetDigital.png';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, failure, pending

    useEffect(() => {
        const mpStatus = searchParams.get('status');
        if (mpStatus === 'approved') {
            setStatus('success');
        } else if (mpStatus === 'pending' || mpStatus === 'in_process') {
            setStatus('pending');
        } else {
            setStatus('failure');
        }
    }, [searchParams]);

    const renderContent = () => {
        switch (status) {
            case 'success':
                return (
                    <div className="result-card success">
                        <CheckCircle2 size={64} color="#10B981" />
                        <h1>¡Pago Exitoso!</h1>
                        <p>Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión y comenzar a gestionar tus carnets.</p>
                        <button onClick={() => navigate('/login')} className="action-btn success">
                            Ir al Login <ArrowRight size={18} />
                        </button>
                    </div>
                );
            case 'pending':
                return (
                    <div className="result-card pending">
                        <Clock size={64} color="#F59E0B" />
                        <h1>Pago en Proceso</h1>
                        <p>Estamos esperando la confirmación de Mercado Pago. Esto puede tardar unos minutos. Te avisaremos por correo una vez se complete.</p>
                        <button onClick={() => navigate('/login')} className="action-btn pending">
                            Volver al Inicio
                        </button>
                    </div>
                );
            case 'failure':
                return (
                    <div className="result-card failure">
                        <XCircle size={64} color="#EF4444" />
                        <h1>Pago Fallido</h1>
                        <p>Hubo un problema al procesar tu pago. No te preocupes, puedes intentar nuevamente desde tu panel de control o contactar a soporte.</p>
                        <button onClick={() => navigate('/login')} className="action-btn failure">
                            Intentar nuevamente
                        </button>
                    </div>
                );
            default:
                return (
                    <div className="result-card loading">
                        <Loader2 size={64} className="spin" color="#0062E3" />
                        <p>Verificando estado del pago...</p>
                    </div>
                );
        }
    };

    return (
        <div className="payment-result-container">
            <style>{`
                .payment-result-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #F1F5F9;
                    font-family: 'Inter', sans-serif;
                    padding: 20px;
                }
                .result-card {
                    background: white;
                    padding: 40px;
                    border-radius: 24px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .logo {
                    height: 40px;
                    marginBottom: 20px;
                }
                h1 {
                    font-size: 24px;
                    font-weight: 800;
                    color: #1E293B;
                    margin: 0;
                }
                p {
                    color: #64748B;
                    line-height: 1.6;
                    margin: 0;
                }
                .action-btn {
                    width: 100%;
                    padding: 14px;
                    border-radius: 12px;
                    border: none;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-btn.success { background: #0062E3; color: white; }
                .action-btn.pending { background: #F59E0B; color: white; }
                .action-btn.failure { background: #1E293B; color: white; }
                .action-btn:hover { transform: translateY(-2px); opacity: 0.9; }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
            
            <Motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img src={logoImg} alt="Carnet Digital" style={{ height: '40px' }} />
                </div>
                {renderContent()}
            </Motion.div>
        </div>
    );
};

export default PaymentResultPage;
