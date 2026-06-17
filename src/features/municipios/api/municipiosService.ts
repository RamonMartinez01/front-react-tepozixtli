// src/features/municipios/api/municipiosService.ts
import { apiClient } from '../../../config/apiClient';
import type { MunicipioApi, Municipio } from '../model/types';
import { transformMunicipio, transformMunicipiosList } from '../lib/transformers';

// Centraliza la ruta base de este dominio para facilitar mantenimiento
const BASE_PATH = '/municipios';

export const municipiosService = {
  /**
   * Obtiene una lista paginada de todos los municipios.
   * Ideal para cargas iniciales controladas.
   */
  getMunicipios: async (skip: number = 0, limit: number = 20): Promise<Municipio[]> => {
    // 1. Extrae los datos crudos (snake_case) a través del core de red
    const rawData = await apiClient.get<MunicipioApi[]>(`${BASE_PATH}/?skip=${skip}&limit=${limit}`);
    
    // 2. Los pasa por la aduana hacia nuestro ecosistema seguro (camelCase)
    return transformMunicipiosList(rawData);
  },

  /**
   * Obtiene todos los municipios pertenecientes a una entidad específica.
   * Útil para cuando el usuario seleccione un estado/entidad.
   */
  getMunicipiosByEntidad: async (cveEnt: string): Promise<Municipio[]> => {
    const rawData = await apiClient.get<MunicipioApi[]>(`${BASE_PATH}/entidad/${cveEnt}`);
    return transformMunicipiosList(rawData);
  },

  /**
   * Obtiene la geometría y datos de un municipio específico por su clave geoestadística.
   * Vital para seleccionar un polígono exacto en el motor WebGL.
   */
  getMunicipioByCvegeo: async (cvegeo: string): Promise<Municipio> => {
    const rawData = await apiClient.get<MunicipioApi>(`${BASE_PATH}/${cvegeo}`);
    return transformMunicipio(rawData);
  }
};