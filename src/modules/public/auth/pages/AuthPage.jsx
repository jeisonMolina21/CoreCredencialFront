import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import styles from '../components/auth.module.css';

const Auth = () => {
    const [isLogin, setIsLogin] = React.useState(true);

    return (
        <div className={styles.authWrapper}>
            {/* Decorative Background Elements */}
            <div className={styles.bgCircle1}></div>
            <div className={styles.bgCircle2}></div>

            <Motion.div
                className={`${styles.authCard} ${!isLogin ? styles.wideCard : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Link to="/" className={styles.backLink}>
                    <ChevronLeft size={18} /> Volver al Inicio
                </Link>

                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <LoginForm key="login" onToggle={() => setIsLogin(false)} />
                    ) : (
                        <RegisterForm key="register" onToggle={() => setIsLogin(true)} />
                    )}
                </AnimatePresence>
            </Motion.div>
        </div>
    );
};

export default Auth;
