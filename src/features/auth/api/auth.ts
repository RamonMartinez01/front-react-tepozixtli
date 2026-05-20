// src/features/auth/api/auth.ts
import apiClient from '../../../config/apiClient';
import type { LoginCredentials, LoginResponse } from '../types';

/**
 * Envía las credenciales al backend para iniciar sesión.
 * @param credentials El nombre_usuario y password del usuario.
 * @returns El token de acceso y el objeto del usuario completo.
 */
export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return data;
};