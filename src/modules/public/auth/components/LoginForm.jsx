import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../core/contexts/AuthContext';
import authService from '../services/authService';
import styles from './auth.module.css';
import logo from '../../../../assets/CarnetDigital.png';

const LoginForm = ({ onToggle }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Llama al login unificado
            const data = await authService.login(email, password);
            
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas o error de conexión');
            }
            // Si el login es exitoso, actualizamos el contexto
            login(data.user, data.token);
            
            // Redirigimos dependiendo de a dónde pertenezca
            if (data.user.type === 'company') {
                navigate('/company/home');
            } else {
                navigate('/system/home');
            }
        } catch (err) {
            console.error('Login error:', error);
            setError(err.message || 'Credenciales inválidas o error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className={styles.authHeader}>
                <img src={logo} alt="Carnet Digital" className={styles.logo} />
                <h2 className={styles.title}>Bienvenido</h2>
                <p className={styles.subtitle}>Accede a tu plataforma de Carnet Digital</p>
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            <form className={styles.authForm} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Correo Electrónico</label>
                    <div className={styles.inputWrapper}>
                        <Mail className={styles.inputIcon} size={20} />
                        <input
                            type="email"
                            id="email"
                            placeholder="nombre@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <div className={styles.labelRow}>
                        <label htmlFor="password">Contraseña</label>
                        <a href="#" className={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
                    </div>
                    <div className={styles.inputWrapper}>
                        <Lock className={styles.inputIcon} size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className={styles.rememberRow}>
                    <label className={styles.checkboxContainer}>
                        <input type="checkbox" />
                        <span className={styles.checkmark}></span>
                        Recordarme en este dispositivo
                    </label>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? (
                        <Loader2 className={styles.spinIcon} size={20} />
                    ) : (
                        <LogIn size={20} />
                    )}
                    {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                </button>
            </form>

            <div className={styles.authFooter}>
                <p>
                    ¿No tienes una cuenta?{' '}
                    <button className={styles.toggleBtn} onClick={onToggle}>
                        Regístrate aquí
                    </button>
                </p>
            </div>
        </Motion.div>
    );
};

export default LoginForm;
