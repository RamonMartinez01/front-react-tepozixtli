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

export const DashboardAgricola = () => {
  const navigate = useNavigate();
  // Referencia maestra para interactuar directamente con la API de MapLibre
  const mapRef = useRef<MapRef>(null);

  // Estado para almacenar el objeto geográfico activo
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);

  /**
   * Orquestador de la maniobra de vuelo y renderizado
   */
  const handleMunicipioSelect = (municipio: Municipio | null) => {
    setSelectedMunicipio(municipio);

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

        {/* MOTOR DE RENDERIZADO VECTORIAL EN CALIENTE */}
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
            
            {/* Capa 1: El relleno sólido del polígono agrícola */}
            <Layer
              id="municipio-layer-fill"
              type="fill"
              paint={{
                'fill-color': '#06b6d4',     
                'fill-opacity': 0.15,        
              }}
            />
            
            {/* Capa 2: El borde perimetral de alta definición */}
            <Layer
              id="municipio-layer-outline"
              type="line"
              paint={{
                'line-color': '#22d3ee',     
                'line-width': 1.5,           
              }}
            />
            
          </Source>
        )}

      </Map>

      {/* Capa de interfaz gráfica (UI) superpuesta al mapa */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6">
        <header className="pointer-events-auto flex items-start gap-4">


          {/* Botón de retroceso flotante (Enterprise UI) */}
          <button
            onClick={() => navigate('/')}
            className="mt-1 bg-[#121212] border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 p-2 rounded-xl transition-all cursor-pointer shadow-lg group"
            title="Regresar al HomePage"
          >
            {/* SVG nativo para mantener el bundle ligero */}
            <svg xmlns="http://www.w0.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>

           {/* Acopla prop de escucha al selector */}
          <div className="pointer-events-auto">
            <MunicipioSelector onMunicipioSelect={handleMunicipioSelect} />
          </div>
        </header>

       
      </div>
    </div>
  );
};