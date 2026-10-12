import api from '../../../../core/api/axios';

const templateService = {
    getAllTemplates: async () => {
        try {
            const response = await api.get('/company-templates');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar las plantillas' };
        }
    },
    
    getTemplateById: async (id) => {
        try {
            const response = await api.get(`/company-templates/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar la plantilla' };
        }
    },

    createTemplate: async (data) => {
        try {
            const response = await api.post('/company-templates', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear la plantilla' };
        }
    },

    updateTemplate: async (id, data) => {
        try {
            const response = await api.put(`/company-templates/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar la plantilla' };
        }
    },

    deleteTemplate: async (id) => {
        try {
            const response = await api.delete(`/company-templates/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar la plantilla' };
        }
    }
};

export default templateService;
