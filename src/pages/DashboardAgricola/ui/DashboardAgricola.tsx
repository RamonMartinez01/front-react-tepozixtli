// src/pages/DashboardAgricola/ui/DashboardAgricola.tsx
import 'maplibre-gl/dist/maplibre-gl.css'; // Sin esto, el mapa se rompe.
import { useRef, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre'
import { DrawControl } from './DrawControl';
import { EntidadSelector } from '../../../features/entidades/ui/EntidadSelector'
import type { Entidad } from '../../../features/entidades/model/types';
import { MunicipioSelector } from '../../../features/municipios/ui/MunicipioSelector';
import type { Municipio } from '../../../features/municipios/model/types';
import { getPolygonCentroid } from '../../../features/municipios/lib/geoUtils';
import { IndicadorControlPanel } from '../../../features/indicadores-macro/ui/IndicadorControlPanel'
import { RasterLayerManager } from '../../../features/indicadores-macro/ui/RasterLayerManager';

export const DashboardAgricola = () => {
  const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY;
  // Referencia maestra para interactuar directamente con la API de MapLibre
  const mapRef = useRef<MapRef>(null);

  // Estadosd de orquestación
  const [selectedEntidad, setSelectedEntidad] = useState<Entidad | null>(null);
  const [isSelectorsExpanded, setIsSelectorsExpanded] = useState(true);
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);

  // Para controlar la memoria del raster activo
  const [activeRaster, setActiveRaster] = useState<{ url: string; tipo: string } | null>(null);

  // Manejador en cascada: Cuando cambia el estado (Entidad Federativa), reseteamos el municipio y el raster
  const handleEntidadSelect = (entidad: Entidad | null) => {
    setSelectedEntidad(entidad);
    setSelectedMunicipio(null);
    setActiveRaster(null);
  };

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
        mapStyle={`https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`}
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
                nombre: selectedMunicipio.nomgeo
              },
              geometry: selectedMunicipio.geom
            } as any}
          >

            {/* Solo pintamos el borde. Removemos el relleno (fill) para no tapar los colores del GeoTIFF */}
            <Layer
              id="municipio-layer-outline"
              type="line"
              paint={{
                'line-color': '#10b981',
                'line-width': 2,
              }}
            />
          </Source>
        )}
      </Map>

      {/* Capa UI (Consolas Flotantes) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6">
        <div className="flex justify-between items-start w-full">

          <div className="pointer-events-auto flex flex-col items-end gap-1">
            {/* 4. Nuevo panel unificado y colapsable para los selectores geográficos */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg w-80 shadow-xl flex flex-col transition-all duration-300 ease-in-out">

              {/* Encabezado interactivo */}
              <div
                className="py-2 px-4 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 rounded-lg transition-colors border-b border-transparent data-[expanded=true]:border-slate-200 data-[expanded=true]:rounded-b-none"
                data-expanded={isSelectorsExpanded}
                onClick={() => setIsSelectorsExpanded(!isSelectorsExpanded)}
              >

                <h3 className="text-slate-500 uppercase tracking-wider text-xs font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {/* Lógica solicitada: Si está colapsado y hay entidad, mostramos su nombre. Si no, un texto genérico. */}
                  <span className={selectedEntidad && !isSelectorsExpanded ? 'text-emerald-600 font-bold' : ''}>
                    {selectedEntidad && !isSelectorsExpanded ? selectedEntidad.nomgeo : 'Filtros Geográficos'}
                  </span>
                </h3>

                <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" height="20"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`transition-transform duration-300 ${isSelectorsExpanded ? 'rotate-180' : 'rotate-0'}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>

              {/* Cuerpo del panel: Selectores */}
              {isSelectorsExpanded && (
                <div className="px-4 pb-4 pt-2 flex flex-col gap-4 animate-fade-in">
                   <EntidadSelector 
                    onEntidadSelect={handleEntidadSelect} 
                    selectedCveEnt={selectedEntidad?.cve_ent || ''} 
                  />

                  <MunicipioSelector 
                    cveEnt={selectedEntidad?.cve_ent || ''}
                    selectedCvegeo={selectedMunicipio?.cvegeo}
                    onMunicipioSelect={handleMunicipioSelect} 
                  />
                </div>
              )}
              
            </div>

            {/* Panel satelital (Mantenemos su estilo oscuro por ahora, hasta su propio refactor) */}
            {selectedMunicipio && (
              <IndicadorControlPanel
                municipio={selectedMunicipio}
                onRasterReady={handleRasterReady}
              />
            )}
          </div>

        </div>
      </div>
    </div >
  );
};