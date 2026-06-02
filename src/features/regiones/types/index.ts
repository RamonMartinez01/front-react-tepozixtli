// src/features/regiones/types/index.ts

// 1. Definimos el estándar GeoJSON para MultiPolygon
export interface GeoJSONMultiPolygon {
  type: 'MultiPolygon';
  // 4 niveles: [MultiPolygon [Polygon [Anillo [Coordenada [lon, lat] ] ] ] ]
  coordinates: number[][][][]; 
}

// 2. Alineamos la interfaz de la Región con RegionResponse de Pydantic
export interface Region {
  id: string;
  nombre_region: string;
  descripcion: string | null;
  geom: GeoJSONMultiPolygon; // <-- Cambiamos 'coordenadas' por 'geom'
  metadatos?: Record<string, any> | null; // Lo añadimos como opcional para que sea idéntico
}

// 3. Alineamos la interfaz de creación con RegionCreate de Pydantic
export interface RegionCreate {
  nombre_region: string;
  descripcion: string | null;
  geom: GeoJSONMultiPolygon; // <-- El frontend debe enviar el objeto GeoJSON completo
  metadatos?: Record<string, any> | null;
}