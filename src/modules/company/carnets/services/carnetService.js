import api from '../../../../core/api/axios';

const carnetService = {
    getAllCarnets: async () => {
        try {
            const response = await api.get('/company-carnets');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar los carnets' };
        }
    },
    
    getCarnetById: async (id) => {
        try {
            const response = await api.get(`/company-carnets/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar el carnet' };
        }
    },

    createCarnet: async (data) => {
        try {
            const response = await api.post('/company-carnets', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear el carnet' };
        }
    },

    updateCarnet: async (id, data) => {
        try {
            const response = await api.put(`/company-carnets/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar el carnet' };
        }
    },

    deleteCarnet: async (id) => {
        try {
            const response = await api.delete(`/company-carnets/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar el carnet' };
        }
    }
};

export default carnetService;
