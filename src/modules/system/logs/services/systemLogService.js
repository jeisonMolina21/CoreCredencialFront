import api from '../../../../core/api/axios';

const systemLogService = {
    getRecentLogs: async (limit = 20) => {
        try {
            const response = await api.get(`/system-logs?limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al traer la actividad reciente del sistema' };
        }
    }
};

export default systemLogService;
