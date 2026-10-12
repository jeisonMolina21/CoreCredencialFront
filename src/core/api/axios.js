import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {}
});

// Interceptor para incluir el token en las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas globales
api.interceptors.response.use(
    (response) => {
        // Si la respuesta viene del backend con el formato estándar { success, data }
        if (response.data && Object.prototype.hasOwnProperty.call(response.data, 'success')) {
            const { success: _success, data, message: _message, ...rest } = response.data;

            // Si hay otros campos importantes (como 'meta', 'total', etc.), devolvemos la respuesta completa
            // para que el servicio/componente decida cómo manejarlos (ej. paginación).
            if (Object.keys(rest).length > 0 || data === undefined) {
                return response;
            }

            // Si es un wrap simple de data, desempaquetamos para simplificar
            return {
                ...response,
                data: data
            };
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Podríamos limpiar localStorage aquí si el token expira
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
