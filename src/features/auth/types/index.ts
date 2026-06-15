// src/features/auth/types/index.ts

export interface User {
  id: string;
  email: string;
  rol: 'user' | 'admin'; // El backend devolvió "admin" en minúsculas, lo dejamos estricto por seguridad
  telefono: string;
}

export interface LoginCredentials {
  nombre_usuario: string; // El ajuste clave que equilibra el backend
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: User; 
}