import api from '../../../../core/api/axios';

const companyRolService = {
    getAllRoles: async () => {
        try {
            const response = await api.get('/company-rols');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener los cargos' };
        }
    },

    getRoleById: async (id) => {
        try {
            const response = await api.get(`/company-rols/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Cargo no encontrado' };
        }
    },

    createRole: async (roleData) => {
        try {
            const response = await api.post('/company-rols', roleData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear el cargo' };
        }
    },

    updateRole: async (id, roleData) => {
        try {
            const response = await api.put(`/company-rols/${id}`, roleData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar el cargo' };
        }
    },

    deleteRole: async (id) => {
        try {
            const response = await api.delete(`/company-rols/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar el cargo' };
        }
    }
};

export default companyRolService;
