// src/config/axios.ts
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  // Ajustamos la URL para que apunte directamente a la matriz de FastAPI
  baseURL: 'http://localhost:8000/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
  // ELIMINADO: withCredentials: true (Ya no lo necesitamos para Bearer Tokens)
});

// Aduana de Salida (Interceptores de Petición)
apiClient.interceptors.request.use(
  (config) => {
    // ZUSTAND: Con esto leemos el store fuera del ciclo de vida de React
    // getState() nos da acceso a las variables en tiempo real
    const token = useAuthStore.getState().token;

    // Si el usuario tiene un pase de abordar, lo sellamos en la cabecera
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Aduana de Entrada (Interceptores de Respuesta)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si FastAPI nos dice "No Autorizado" (Ej. el token expiró o fue alterado)
    if (error.response?.status === 401) {
      // IMPORTANTE: Solo disparamos logout si NO estamos en las rutas públicas
      // Evita un bucle infinito si la página de inicio/login hace una petición fallida
      const path = window.location.pathname;
      if (path !== '/' && path !== '/login') {
        useAuthStore.getState().logout();
        
        // Redirección de emergencia para sacar al usuario de la zona privada
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;