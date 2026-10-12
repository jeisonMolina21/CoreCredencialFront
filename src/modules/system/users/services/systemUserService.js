import api from '../../../../core/api/axios';

const systemUserService = {
    getAllUsers: async ({ page = 1, limit = 20, search = '' } = {}) => {
        try {
            const params = new URLSearchParams({ page, limit, ...(search && { search }) });
            const response = await api.get(`/system-users?${params}`);
            return response.data; // { success, data, total, page, totalPages }
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar los usuarios de sistema' };
        }
    },
    
    getUserById: async (id) => {
        try {
            const response = await api.get(`/system-users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar el usuario' };
        }
    },

    createUser: async (userData) => {
        try {
            const response = await api.post('/system-users', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear usuario' };
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/system-users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar usuario' };
        }
    },

    toggleUserStatus: async (id) => {
        try {
            const response = await api.patch(`/system-users/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cambiar el estado del usuario' };
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/system-users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar usuario' };
        }
    }
};

export default systemUserService;
