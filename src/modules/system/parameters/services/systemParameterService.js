import api from '../../../../core/api/axios';

const systemParameterService = {
    getParameters: async () => {
        try {
            const response = await api.get('/system-parameters');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar los parámetros del sistema' };
        }
    },

    updateParameters: async (parameterData) => {
        try {
            const response = await api.put('/system-parameters', parameterData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar los parámetros globales' };
        }
    }
};

export default systemParameterService;
