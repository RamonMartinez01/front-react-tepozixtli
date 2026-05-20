// src/features/regiones/types/index.ts

export type Coordenada = [number, number];

export interface Region {
  id: string;
  nombre_region: string;
  descripcion: string | null;
  coordenadas: Coordenada[];
}

export interface RegionCreate {
  nombre_region: string;
  descripcion: string | null;
  coordenadas: Coordenada[];
}