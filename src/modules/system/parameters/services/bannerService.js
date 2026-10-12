import api from '../../../../core/api/axios';

const bannerService = {
    // Obtener todos los banners activos (Public)
    getActiveBanners: async () => {
        try {
            const response = await api.get('/banners/active');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar los banners' };
        }
    },

    // Obtener todos los banners (Admin)
    getAllBanners: async () => {
        try {
            const response = await api.get('/banners');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cargar la lista de banners' };
        }
    },

    // Crear un nuevo banner (Admin)
    createBanner: async (bannerData) => {
        try {
            // bannerData debe ser un FormData para soportar el archivo
            const response = await api.post('/banners', bannerData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear el banner' };
        }
    },

    // Eliminar un banner (Admin)
    deleteBanner: async (id) => {
        try {
            const response = await api.delete(`/banners/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar el banner' };
        }
    },

    // Alternar estado (Admin)
    toggleBannerStatus: async (id) => {
        try {
            const response = await api.patch(`/banners/${id}/toggle`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar el estado del banner' };
        }
    }
};

export default bannerService;
