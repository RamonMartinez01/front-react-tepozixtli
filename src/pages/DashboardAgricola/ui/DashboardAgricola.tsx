// src/pages/DashboardAgricola/ui/DashboardAgricola.tsx
import 'maplibre-gl/dist/maplibre-gl.css'; // Sin esto, el mapa se rompe.
import { useRef, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre'
import { useNavigate } from 'react-router-dom';
import { DrawControl } from './DrawControl';
import { MunicipioSelector } from '../../../features/municipios/ui/MunicipioSelector';
import type { Municipio } from '../../../features/municipios/model/types';
import { getPolygonCentroid } from '../../../features/municipios/lib/geoUtils';
import { IndicadorControlPanel } from '../../../features/indicadores-macro/ui/IndicadorControlPanel'
import { RasterLayerManager } from '../../../features/indicadores-macro/ui/RasterLayerManager';

export const DashboardAgricola = () => {
  const navigate = useNavigate();
  // Referencia maestra para interactuar directamente con la API de MapLibre
  const mapRef = useRef<MapRef>(null);

  // Estado para almacenar el objeto geográfico activo
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);

  // Para controlar la memoria del raster activo
  const [activeRaster, setActiveRaster] = useState<{ url: string; tipo: string } | null>(null);

  /**
   * Orquestador del renderizado de municipios
   */
  const handleMunicipioSelect = (municipio: Municipio | null) => {
    setSelectedMunicipio(municipio);
    setActiveRaster(null); // Limpia el raster si el usuario cambia de municipio

    if (municipio && municipio.geom) {
      // 1. Calcula el centro geográfico del polígono PostGIS
      const [lng, lat] = getPolygonCentroid(municipio.geom);

      // 2. Ordena a la cámara WebGL ejecutar un vuelo inercial suave
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 9.5,         // Zoom óptimo para apreciar el municipio completo
        essential: true,   // Esta directiva asegura que el vuelo ocurra incluso si el usuario tiene animaciones reducidas en su OS
        duration: 2500     // 2.5 segundos de transición cinematográfica
      });
    }
  };

  const handleRasterReady = (cogUrl: string, tipo: string) => {
    setActiveRaster({ url: cogUrl, tipo });
  };


  return (
    // Contenedor a pantalla completa (100% del viewport)
    <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden relative">

      {/* Motor WebGL */}
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -99.1332, // Centro aproximado de México
          latitude: 19.4326,
          zoom: 5
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >

        {/* Herramienta de trazado inyectada nativamente */}
        <DrawControl />

        {/* Capa Raster: Inyectamos los píxeles procesados del COG */}
        {activeRaster && (
          <RasterLayerManager cogUrl={activeRaster.url} tipoIndicador={activeRaster.tipo} />
        )}

        {/* Capa Vectorial: Borde del Municipio (Siempre va sobre el Raster para delimitar) */}
        {selectedMunicipio && selectedMunicipio.geom && (
          <Source
            type="geojson"
            // Envolvemos la geometría cruda en un 'Feature' estándar de la industria.
            // Usamos 'as any' para sobreescribir la restricción estricta de TypeScript 
            // sobre nuestro Record<string, any> sin perder el tipado en el resto de la app.
            data={{
              type: 'Feature',
              properties: {
                cvegeo: selectedMunicipio.cvegeo,
                nombre: selectedMunicipio.nommun
              },
              geometry: selectedMunicipio.geom
            } as any}
          >

            {/* Solo pintamos el borde. Removemos el relleno (fill) para no tapar los colores del GeoTIFF */}
            <Layer
              id="municipio-layer-outline"
              type="line"
              paint={{
                'line-color': '#22d3ee',
                'line-width': 2,
              }}
            />
          </Source>
        )}
      </Map>

     {/* Capa UI (Consolas Flotantes) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6">
        <div className="flex justify-between items-start w-full">
          
          <header className="pointer-events-auto flex items-start gap-4">
            <button
              onClick={() => navigate('/')}
              className="mt-1 bg-[#121212] border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 p-2 rounded-lg transition-all cursor-pointer shadow-lg group"
              title="Regresar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
            </button>
          </header>

          <div className="pointer-events-auto flex flex-col items-end">
            <MunicipioSelector onMunicipioSelect={handleMunicipioSelect} />
            
            {/* Si hay un municipio seleccionado, desplegamos las opciones satelitales */}
            {selectedMunicipio && (
              <IndicadorControlPanel 
                municipio={selectedMunicipio} 
                onRasterReady={handleRasterReady} 
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};