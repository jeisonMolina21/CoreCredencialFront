import api from '../../../../core/api/axios';

const authService = {
    /**
     * Inicia sesión buscando primero en la base de datos de Compañía y luego en la de Sistema
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise} Retorna { token, user: { id, email, role, type... } }
     */
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error de conexión' };
        }
    },

    /**
     * Registra una nueva empresa y su administrador inicial
     * @param {Object} userData { fullname, company_name, email, password }
     */
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al registrarse' };
        }
    },

    /**
     * Renueva el token actual obteniendo uno nuevo con expiración extendida
     * @returns {Promise} Retorna { token }
     */
    refreshToken: async () => {
        try {
            const response = await api.get('/auth/refresh');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al renovar sesión' };
        }
    },

    checkEmail: async (email) => {
        try {
            const response = await api.get(`/auth/check-email/${email}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al verificar el correo' };
        }
    },

    getPaymentConfig: async () => {
        try {
            const response = await api.get('/auth/payment-config');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener configuración de pago' };
        }
    }
};

export default authService;
