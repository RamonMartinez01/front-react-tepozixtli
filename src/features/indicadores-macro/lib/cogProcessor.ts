// src/features/indicadores-macro/lib/cogProcessor.ts
import { fromUrl } from 'geotiff';
import { getNdviColor, getLstColor } from './colorScales';

// Contrato de salida: Lo que el motor de MapLibre necesita para pintar la capa.
export interface ProcessedCog {
  dataUrl: string; // La imagen PNG procesada en formato Base64
  coordinates: [
    [number, number], // Top-Left
    [number, number], // Top-Right
    [number, number], // Bottom-Right
    [number, number]  // Bottom-Left
  ];
}

/**
 * Motor de renderizado del lado del cliente.
 * Transforma un GeoTIFF remoto en una imagen renderizable con coordenadas.
 */
export const processCogUrl = async (url: string, indicatorType: string): Promise<ProcessedCog> => {
  try {
    // 1. Conexión Parcial: El superpoder de los COGs (No descarga todo el archivo de golpe)
    const tiff = await fromUrl(url);
    const image = await tiff.getImage(); 

    // 2. Extracción de Metadatos Espaciales
    const bbox = image.getBoundingBox();
    const width = image.getWidth();
    const height = image.getHeight();

    // geotiff devuelve el BBox como [minX, minY, maxX, maxY] (Longitud y Latitud)
    const minLng = bbox[0]; // Oeste
    const minLat = bbox[1]; // Sur
    const maxLng = bbox[2]; // Este
    const maxLat = bbox[3]; // Norte

    // MapLibre exige las 4 esquinas exactas en sentido horario para la inyección de la fuente de imagen
    const coordinates: ProcessedCog['coordinates'] = [
      [minLng, maxLat], // Esquina Superior Izquierda (Top-Left)
      [maxLng, maxLat], // Esquina Superior Derecha (Top-Right)
      [maxLng, minLat], // Esquina Inferior Derecha (Bottom-Right)
      [minLng, minLat], // Esquina Inferior Izquierda (Bottom-Left)
    ];

    // 3. Lectura de la Matriz de Píxeles Crudos (Raster)
    const rasters = await image.readRasters();
    // Asumimos que la banda 1 contiene nuestro índice (NDVI o LST)
    const data = rasters[0] as Float32Array; 

    // ---> INYECTAR ESTA SONDA <---
    // Tomamos 10 píxeles justo del medio de la matriz de la imagen
    /* const midPoint = Math.floor(data.length / 2);
    console.log(`[Raster Scanner] Total de píxeles: ${data.length}`);
    console.log(`[Raster Scanner] Muestra de valores crudos:`, data.slice(midPoint, midPoint + 10));*/

    // ---> SONDA 3: ESCÁNER PROFUNDO <---
    /*let minVal = Infinity;
    let maxVal = -Infinity;
    let validPixels = 0;

    for (let i = 0; i < data.length; i++) {
      const val = data[i];
      // Ignoramos el 0 (NoData) y los Not-a-Number
      if (val !== 0 && !isNaN(val)) {
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
        validPixels++;
      }
    }
    
    console.log(`[Raster Scanner] Píxeles con datos biológicos/térmicos: ${validPixels} de ${data.length}`);
    console.log(`[Raster Scanner] Rango Termodinámico Real: MIN = ${minVal} | MAX = ${maxVal}`);
    */

    // 4. El Laboratorio: Creación del lienzo (Canvas) en la memoria RAM
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('El navegador no pudo inicializar el motor de renderizado 2D.');

    const imageData = ctx.createImageData(width, height);

    // 5. Transformación Matemática -> Píxeles Visuales
    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      const pixelIndex = i * 4;

      // OPTIMIZACIÓN: Si es NoData (0), lo dejamos transparente y saltamos al siguiente píxel
      // Esto ahorra miles de ciclos de procesamiento de CPU
      if (value === 0 || isNaN(value)) {
        imageData.data[pixelIndex + 3] = 0; // Alpha = 0 (Transparente)
        continue;
      }

      let color: [number, number, number, number] = [0, 0, 0, 0];

      // Inyección a través de las rampas de color
      if (indicatorType.toUpperCase() === 'NDVI') {
        color = getNdviColor(value);
      } else if (indicatorType.toUpperCase() === 'LST') {
        color = getLstColor(value);
      }

      // Mapeo RGBA lineal: Un pixel en ImageData ocupa 4 espacios secuenciales en el array
    
      imageData.data[pixelIndex] = color[0];     // Red
      imageData.data[pixelIndex + 1] = color[1]; // Green
      imageData.data[pixelIndex + 2] = color[2]; // Blue
      imageData.data[pixelIndex + 3] = color[3]; // Alpha (Transparencia)
    }

    // 6. Volcado de datos al lienzo y exportación a un formato de imagen nativo
    ctx.putImageData(imageData, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');

    // Limpieza manual de memoria para evitar saturación del navegador con rasters pesados
    canvas.width = 0;
    canvas.height = 0;

    return {
      dataUrl,
      coordinates
    };

  } catch (error) {
    console.error('Error crítico al procesar el COG en el cliente:', error);
    throw new Error('Fallo en el motor de renderizado raster. Verifica que la URL del Object Storage tenga configurado el acceso CORS.');
  }
};