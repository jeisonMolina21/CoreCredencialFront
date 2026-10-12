import api from '../../../../core/api/axios';

const companyUserService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/company-users');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener los colaboradores' };
        }
    },

    getUserById: async (id) => {
        try {
            const response = await api.get(`/company-users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Colaborador no encontrado' };
        }
    },

    createUser: async (userData) => {
        try {
            const response = await api.post('/company-users', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear el colaborador' };
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/company-users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar el colaborador' };
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/company-users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar el colaborador' };
        }
    }
};

export default companyUserService;
