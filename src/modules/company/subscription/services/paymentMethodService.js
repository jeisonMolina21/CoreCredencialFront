import api from '../../../../core/api/axios';

const paymentMethodService = {
    getMyMethods: async () => {
        try {
            const response = await api.get('/payment-methods');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar los métodos de pago' };
        }
    },

    addMethod: async (data) => {
        try {
            const response = await api.post('/payment-methods', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al agregar el método de pago' };
        }
    },

    setPrimary: async (id) => {
        try {
            const response = await api.put(`/payment-methods/${id}/set-primary`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al establecer el método principal' };
        }
    },

    removeMethod: async (id) => {
        try {
            const response = await api.delete(`/payment-methods/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar el método de pago' };
        }
    }
};

export default paymentMethodService;
