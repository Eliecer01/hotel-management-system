import axios from 'axios';

// Crear una instancia base
const api = axios.create({
  // Nota el /api al final, coincidiendo con el backend
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptor de Solicitudes (Request)
// Antes de que salga la petición, le inyectamos el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O donde guardes tu JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de Respuestas (Response)
// Si el backend nos dice "401 No Autorizado", sacamos al usuario
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // El token venció o es falso
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirigir al login
    }
    return Promise.reject(error);
  },
);

export default api;

