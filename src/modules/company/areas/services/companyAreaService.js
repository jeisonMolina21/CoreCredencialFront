import api from '../../../../core/api/axios';

const companyAreaService = {
    getAllAreas: async () => {
        try {
            const response = await api.get('/company-areas');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener las áreas' };
        }
    },

    getAreaById: async (id) => {
        try {
            const response = await api.get(`/company-areas/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Área no encontrada' };
        }
    },

    createArea: async (areaData) => {
        try {
            const response = await api.post('/company-areas', areaData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear el área' };
        }
    },

    updateArea: async (id, areaData) => {
        try {
            const response = await api.put(`/company-areas/${id}`, areaData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar el área' };
        }
    },

    deleteArea: async (id) => {
        try {
            const response = await api.delete(`/company-areas/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar el área' };
        }
    }
};

export default companyAreaService;
