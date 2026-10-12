import api from '../../../../core/api/axios';

const planService = {
    getAllPlans: async () => {
        try {
            const response = await api.get('/plans');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar los planes' };
        }
    },
    
    getPlanById: async (id) => {
        try {
            const response = await api.get(`/plans/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar el plan' };
        }
    },

    createPlan: async (planData) => {
        try {
            const response = await api.post('/plans', planData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear el plan' };
        }
    },

    updatePlan: async (id, planData) => {
        try {
            const response = await api.put(`/plans/${id}`, planData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar el plan' };
        }
    },

    deletePlan: async (id) => {
        try {
            const response = await api.delete(`/plans/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar el plan' };
        }
    }
};

export default planService;
