// src/features/municipios/model/types.ts

/**
 * Contrato de Entrada (Backend API)
 * la respuesta de FastAPI/PostGIS en snake_case
 */
export interface MunicipioApi {
  id: number;
  cvegeo: string;
  cve_ent: string;
  nomgeo: string;
  cve_mun: string;
  nommun: string;
  cov: number;
  cov_id: number;
  geom: Record<string, any>; // Usamos Record estandarizado para el GeoJSON nativo
}

/**
 * Contrato Interno (Frontend)
 * Estándar de la industria en camelCase
 */
export interface Municipio {
  id: number;
  cvegeo: string;
  cveEnt: string; 
  nomgeo: string;
  cveMun: string;  
  nommun: string;
  cov: number;
  covId: number;   
  geom: Record<string, any>;
}