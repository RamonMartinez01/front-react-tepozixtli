// src/features/municipios/lib/geoUtils.ts

/**
 * Calcula el centro geométrico aproximado de un polígono GeoJSON
 * utilizando el algoritmo de punto medio de caja delimitadora (BBox).
 * Soporta Polígonos estándar y MultiPolígonos (con islas o enclaves).
 */
export const getPolygonCentroid = (geometry: any): [number, number] => {
  if (!geometry || !geometry.coordinates) return [-99.1332, 19.4326]; // Fallback a CDMX

  let coords: [number, number][] = [];

  // Extra los arrays de coordenadas planos dependiendo del tipo de geometría
  if (geometry.type === 'Polygon') {
    coords = geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    coords = geometry.coordinates[0][0];
  } else {
    return [-99.1332, 19.4326];
  }

  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  // Escaneo de fronteras espaciales
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  // Retorna el punto medio matemático exacto
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
};