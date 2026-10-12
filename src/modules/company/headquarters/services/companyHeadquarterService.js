import api from '../../../../core/api/axios';

const companyHeadquarterService = {
    getAllHeadquarters: async () => {
        try {
            const response = await api.get('/company-headquarters');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener las sedes' };
        }
    },

    getHeadquarterById: async (id) => {
        try {
            const response = await api.get(`/company-headquarters/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Sede no encontrada' };
        }
    },

    createHeadquarter: async (headquarterData) => {
        try {
            const response = await api.post('/company-headquarters', headquarterData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear la sede' };
        }
    },

    updateHeadquarter: async (id, headquarterData) => {
        try {
            const response = await api.put(`/company-headquarters/${id}`, headquarterData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar la sede' };
        }
    },

    deleteHeadquarter: async (id) => {
        try {
            const response = await api.delete(`/company-headquarters/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar la sede' };
        }
    }
};

export default companyHeadquarterService;
