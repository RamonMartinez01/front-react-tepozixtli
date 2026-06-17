// src/config/apiClient.ts

// Vite expone las variables de entorno a través de import.meta.env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData;
    try {
      // Intentamos extraer el detalle exacto del error que envía FastAPI
      errorData = await response.json();
    } catch (e) {
      errorData = { detail: response.statusText };
    }
    
    // Registro para debugging en consola de desarrollo
    console.error(`Error de Backend [${response.status}]:`, errorData);
    
    // Lanzamos el error para que los bloques try/catch en los servicios lo atrapen
    throw new Error(errorData.detail || 'Error en la petición al servidor');
  }

  // Si la petición es exitosa y no es un 204 (No Content), devuelve JSON puro
  if (response.status === 204) return null;
  return response.json();
};

/**
 * Wrapper nativo que estandariza las peticiones HTTP.
 */
export const apiClient = {
  get: async <T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
    });
    return handleResponse(response);
  },

  post: async <T>(endpoint: string, body: unknown, customHeaders?: HeadersInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  
};