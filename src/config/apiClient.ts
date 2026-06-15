// src/config/axios.ts
import axios from 'axios';

const apiClient = axios.create({
  // URL apuntando directamente a la matriz de FastAPI
  baseURL: 'http://localhost:8000/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aduana de Salida (Interceptores de Petición)
apiClient.interceptors.request.use(
  (config) => {
    // Ya no inyectamos tokens, el request pasa directo al backend
    return config;
  },
  (error) => Promise.reject(error)
);

// Aduana de Entrada (Interceptores de Respuesta)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Eliminamos la redirección forzada a login.
    // Solo registramos el error para facilitar el debugging con FastAPI.
    if (error.response) {
      console.error(`Error de Backend [${error.response.status}]:`, error.response.data);
    } else {
      console.error("Error de Red o Servidor inalcanzable:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;