import api from '../../../../core/api/axios';

const subscriptionService = {
    getAllSubscriptions: async ({ page = 1, limit = 20, search = '' } = {}) => {
        try {
            const response = await api.get('/subscriptions', {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar las suscripciones' };
        }
    },
    
    getSubscriptionById: async (id) => {
        try {
            const response = await api.get(`/subscriptions/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar la suscripción' };
        }
    },

    getMySubscription: async () => {
        try {
            const response = await api.get('/subscriptions/my-subscription');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar tu suscripción' };
        }
    },

    updateMySubscription: async (data) => {
        try {
            const response = await api.patch('/subscriptions/my-subscription', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar la suscripción' };
        }
    }
};

export default subscriptionService;
