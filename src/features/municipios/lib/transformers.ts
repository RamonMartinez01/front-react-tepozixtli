// src/features/municipios/lib/transformers.ts
import type { MunicipioApi, Municipio } from '../model/types'

/**
 * Transforma un solo objeto Municipio de snake_case a camelCase.
 */
export const transformMunicipio = (data: MunicipioApi): Municipio => {
  return {
    cvegeo: data.cvegeo,
    cveEnt: data.cve_ent,
    nomgeo: data.nomgeo,
    cveMun: data.cve_mun,
    geom: data.geom,
  };
};

/**
 * Transforma un array completo de Municipios.
 * Ideal para las respuestas de listas paginadas o búsquedas por entidad.
 */
export const transformMunicipiosList = (data: MunicipioApi[]): Municipio[] => {
  // Utilizamos map para pasar cada elemento por nuestro transformador individual
  return data.map(transformMunicipio);
};