import api from '../../../../core/api/axios';

const systemRolService = {
    getAllRoles: async () => {
        try {
            const response = await api.get('/system-rols');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar los roles de sistema' };
        }
    },
    
    getRoleById: async (id) => {
        try {
            const response = await api.get(`/system-rols/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar el rol' };
        }
    },

    createRole: async (roleData) => {
        try {
            const response = await api.post('/system-rols', roleData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear rol' };
        }
    },

    updateRole: async (id, roleData) => {
        try {
            const response = await api.put(`/system-rols/${id}`, roleData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar rol' };
        }
    },

    deleteRole: async (id) => {
        try {
            const response = await api.delete(`/system-rols/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar rol' };
        }
    }
};

export default systemRolService;
