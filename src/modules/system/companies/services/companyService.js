import api from '../../../../core/api/axios';

const companyService = {
    getAllCompanies: async ({ page = 1, limit = 20, search = '' } = {}) => {
        try {
            const params = new URLSearchParams({ page, limit, ...(search && { search }) });
            const response = await api.get(`/companies?${params}`);
            return response.data; // { success, data, total, page, totalPages }
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar las empresas' };
        }
    },
    
    getCompanyById: async (id) => {
        try {
            const response = await api.get(`/companies/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar la empresa' };
        }
    },

    createCompany: async (companyData) => {
        try {
            const response = await api.post('/companies', companyData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear la empresa' };
        }
    },

    updateCompany: async (id, companyData) => {
        try {
            const response = await api.put(`/companies/${id}`, companyData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar la empresa' };
        }
    },

    deleteCompany: async (id) => {
        try {
            const response = await api.delete(`/companies/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar la empresa' };
        }
    },

    disableCompany: async (id) => {
        try {
            const response = await api.patch(`/companies/${id}/disable`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al deshabilitar la empresa' };
        }
    },

    reactivateCompany: async (id) => {
        try {
            const response = await api.patch(`/companies/${id}/reactivate`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al reactivar la empresa' };
        }
    },

    impersonateCompany: async (id) => {
        try {
            const response = await api.post(`/companies/${id}/impersonate`);
            return response.data; // { success, message, data: { token, user } }
        } catch (error) {
            throw error.response?.data || { message: 'Error al solicitar acceso a la empresa' };
        }
    },

    /**
     * Registro completo desde el panel de sistema:
     * crea empresa + suscripción (plan elegido) + rol Admin + usuario admin.
     * Endpoint: POST /api/companies/register
     */
    adminRegisterCompany: async (data) => {
        try {
            const response = await api.post('/companies/register', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al registrar la empresa' };
        }
    },

    checkNit: async (nit) => {
        try {
            const response = await api.get(`/companies/check-nit/${nit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al verificar el NIT' };
        }
    },

    updateCompanyParameters: async (id, data) => {
        try {
            const response = await api.patch(`/companies/${id}/parameters`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar los parámetros de la empresa' };
        }
    }
};

export default companyService;
