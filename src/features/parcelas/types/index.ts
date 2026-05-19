// src/features/parcelas/types/index.ts

/**
 * Tupla que representa un punto geográfico.
 * ATENCIÓN: El backend y PostGIS esperan estrictamente el orden [Longitud, Latitud].
 * Formato WGS 84 (EPSG:4326).
 */
export type Coordenada = [number, number];

/**
 * Contrato de respuesta del Backend (GET /parcelas/)
 * Representa una parcela ya guardada en la base de datos.
 */
export interface Parcela {
  id: string;
  owner_id: string;
  nombre_parcela: string;
  coordenadas: Coordenada[];
}

/**
 * Contrato de envío hacia el Backend (POST /parcelas/)
 * Representa los datos necesarios para crear una nueva parcela.
 * Nota: El arreglo de 'coordenadas' debe tener al menos 4 puntos,
 * siendo el último idéntico al primero para cerrar el polígono.
 */
export interface ParcelaCreatePayload {
  nombre_parcela: string;
  coordenadas: Coordenada[];
}