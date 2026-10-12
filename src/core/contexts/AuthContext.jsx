/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../modules/public/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [branding, setBranding] = useState(() => {
        const savedBranding = localStorage.getItem('branding');
        return savedBranding ? JSON.parse(savedBranding) : null;
    });

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const updateBranding = (brandingData) => {
        setBranding(brandingData);
        localStorage.setItem('branding', JSON.stringify(brandingData));
    };

    /**
     * Inicia modo impersonación: respalda sesión original y carga la de empresa
     */
    const impersonate = (userData, userToken) => {
        // Respaldar sesión actual (Sistema) si no hay un respaldo ya
        if (!localStorage.getItem('backup_token')) {
            localStorage.setItem('backup_token', token);
            localStorage.setItem('backup_user', JSON.stringify(user));
            localStorage.setItem('backup_branding', JSON.stringify(branding));
        }

        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    /**
     * Finaliza modo impersonación: restaura la sesión de sistema respaldada
     */
    const stopImpersonating = () => {
        const backupToken = localStorage.getItem('backup_token');
        const backupUser  = localStorage.getItem('backup_user');

        if (backupToken && backupUser) {
            const userData = JSON.parse(backupUser);
            const brandingData = localStorage.getItem('backup_branding') ? JSON.parse(localStorage.getItem('backup_branding')) : null;
            
            setUser(userData);
            setToken(backupToken);
            setBranding(brandingData);
            
            localStorage.setItem('token', backupToken);
            localStorage.setItem('user', backupUser);
            if (brandingData) {
                localStorage.setItem('branding', JSON.stringify(brandingData));
            } else {
                localStorage.removeItem('branding');
            }

            // Limpiar respaldo
            localStorage.removeItem('backup_token');
            localStorage.removeItem('backup_user');
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setBranding(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('branding');
        localStorage.removeItem('backup_token');
        localStorage.removeItem('backup_user');
        localStorage.removeItem('backup_branding');
    };

    useEffect(() => {
        // Si hay token, configuramos un intervalo para renovarlo cada 45 minutos (2700000 ms)
        let intervalId;
        
        if (token) {
            intervalId = setInterval(async () => {
                try {
                    const data = await authService.refreshToken();
                    setToken(data.token);
                    localStorage.setItem('token', data.token);
                    console.log('Token renovado exitosamente');
                } catch (error) {
                    console.error('Error al renovar el token, cerrando sesión...', error);
                    logout();
                }
            }, 45 * 60 * 1000); 
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [token]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            branding,
            login, 
            updateBranding,
            impersonate,
            stopImpersonating,
            logout, 
            isAuthenticated: !!token,
            loading: false
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
