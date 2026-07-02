// src/features/entidades/api/entidadesService.ts
import { apiClient } from '../../../config/apiClient';
import type { Entidad } from '../model/types';

export const entidadesService = {
  /**
   * Obtiene el catálogo ligero de las 32 entidades federativas.
   */
  getAll: async (): Promise<Entidad[]> => {
    return await apiClient.get<Entidad[]>('/entidades/');
  },
};