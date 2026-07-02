// src/features/municipios/model/types.ts

/**
 * Contrato de Entrada (Backend API)
 * la respuesta de FastAPI/PostGIS en snake_case
 */
export interface MunicipioApi {
  cvegeo: string;
  cve_ent: string;
  nomgeo: string;
  cve_mun: string;
  geom: Record<string, any>; // Usamos Record estandarizado para el GeoJSON nativo
}

/**
 * Contrato Interno (Frontend)
 * Estándar de la industria en camelCase
 */
export interface Municipio {
  cvegeo: string;
  cveEnt: string; 
  nomgeo: string;
  cveMun: string;    
  geom: Record<string, any>;
}