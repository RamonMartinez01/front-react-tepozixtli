// src/features/indicadores-macro/ui/RasterLayerManager.tsx
import { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { processCogUrl } from '../lib/cogProcessor';
import type { ProcessedCog } from '../lib/cogProcessor';

interface RasterLayerManagerProps {
  cogUrl: string | null;
  tipoIndicador: string;
}

export const RasterLayerManager = ({ cogUrl, tipoIndicador }: RasterLayerManagerProps) => {
  const [processedData, setProcessedData] = useState<ProcessedCog | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Efecto secundario: Cada vez que cambia la URL del COG, disparamos el procesador
  useEffect(() => {
    // Si no hay URL, limpiamos el mapa
    if (!cogUrl) {
      setProcessedData(null);
      return;
    }

    // Limpiamos la imagen anterior inmediatamente para evitar "flashes" visuales
    setProcessedData(null);
    // Bandera de seguridad para evitar fugas de memoria si el usuario cierra el mapa 
    // antes de que el archivo .tif termine de procesarse.
    let isMounted = true; 

    const processRaster = async () => {
      setError(null);
      try {
        const result = await processCogUrl(cogUrl, tipoIndicador);
        if (isMounted) {
          setProcessedData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error en la inyección del raster.');
          console.error(err);
        }
      }
    };

    processRaster();

    // Fase de limpieza del hook
    return () => {
      isMounted = false;
    };
  }, [cogUrl, tipoIndicador]);

  // Si hubo un error catastrófico con el CORS o el archivo, abortamos el renderizado
  if (error) {
    console.warn(`[Control Espacial] RasterLayerManager: ${error}`);
    return null; 
  }

  // Mientras procesa, no pintamos nada (el motor WebGL sigue su curso)
  if (!processedData) return null;

  return (
    // Inyectamos la imagen procesada directamente en las coordenadas matemáticas
    <Source
      // Usamos IDs estáticos. MapLibre actualizará la 'url' (la imagen) sin quejarse
      id="source-raster-macro-activo"
      type="image"
      url={processedData.dataUrl}
      coordinates={processedData.coordinates}
    >
      <Layer
        id="layer-raster-macro-activo"
        type="raster"
        paint={{
          'raster-opacity': 0.75,       // 75% de opacidad para no ocultar la topografía base
          'raster-fade-duration': 600,  // Transición suave de 600ms al aparecer
        }}
      />
    </Source>
  );
};