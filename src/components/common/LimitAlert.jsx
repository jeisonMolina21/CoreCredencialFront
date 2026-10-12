import React from 'react';
import { ShieldAlert, Zap, X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const LimitAlert = ({ isOpen, onClose, sectionName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 31, 63, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <Motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            background: 'white',
            width: '100%',
            maxWidth: '450px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}
        >
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#FEF3C7',
              color: '#D97706',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                Límite de Plan Alcanzado
              </h3>
              <p style={{ color: '#64748B', lineHeight: '1.5', fontSize: '1rem' }}>
                Has llegado al límite de <strong>{sectionName}</strong> permitido en tu plan actual. 
                Para continuar agregando más, puedes actualizar tu suscripción o deshabilitar elementos existentes.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              <button 
                onClick={() => window.location.href = '/company/subscription'}
                style={{
                  background: 'linear-gradient(135deg, #0062E3, #0046A1)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Zap size={18} fill="currentColor" /> Actualizar mi Plan
              </button>
              
              <button 
                onClick={onClose}
                style={{
                  background: 'transparent',
                  color: '#64748B',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer'
                }}
              >
                Entendido
              </button>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: '#94A3B8',
              padding: '0.5rem',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LimitAlert;
