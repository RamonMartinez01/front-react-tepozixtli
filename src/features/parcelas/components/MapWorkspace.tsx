// src/features/parcelas/components/MapWorkspace.tsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
// Importamos el motor moderno y sus estilos
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import { useGetParcelas } from '../api/getParcelas';
import { usePostParcela } from '../api/postParcela';
import type { Coordenada, Parcela } from '../types';

// ============================================================================
// COMPONENTE HIJO 1: El Controlador de Dibujo Moderno (leaflet-geoman)
// ============================================================================
const GeomanControls = ({ onPolygonCreated }: { onPolygonCreated: (coords: any[], layer: any) => void }) => {
  const map = useMap();

  useEffect(() => {
    // 1. Configura el idioma a español y agregamos los botones
    map.pm.setLang('es');
    map.pm.addControls({
      position: 'topright',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      drawText: false,
      drawPolygon: true, // ¡Solo habilitamos la creación de parcelas (Polígonos)!
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
    });

    // 2. Intercepta el evento de Geoman cuando el usuario termina de dibujar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.on('pm:create', (e: any) => {
      if (e.shape === 'Polygon') {
        // Le pasamos las coordenadas del anillo exterior y la capa visual
        onPolygonCreated(e.layer.getLatLngs()[0], e.layer);
      }
    });

    // Limpieza al desmontar el componente
    return () => {
      map.pm.removeControls();
      map.off('pm:create');
    };
  }, [map, onPolygonCreated]);

  return null;
};

// ============================================================================
// COMPONENTE HIJO 2: El Director de Cámara (Auto-Enfoque)
// ============================================================================
const MapBoundsFitter = ({ parcelas }: { parcelas: Parcela[] | undefined }) => {
  const map = useMap();

  useEffect(() => {
    // Si no hay parcelas, no movemos la cámara (se queda en el default)
    if (!parcelas || parcelas.length === 0) return;

    // 1. Recolectamos absolutamente todos los puntos de todas las parcelas
    const allPoints: [number, number][] = [];
    parcelas.forEach((parcela) => {
      parcela.coordenadas.forEach((coord) => {
        // Recordar invertir de [Lng, Lat] a [Lat, Lng] para Leaflet
        allPoints.push([coord[1], coord[0]]);
      });
    });

    // 2. Le pedimos al mapa que calcule la caja delimitadora (Bounding Box)
    // y haga un vuelo animado hacia ella dejando un pequeño margen (padding)
    if (allPoints.length > 0) {
      map.fitBounds(allPoints, { padding: [50, 50], duration: 1.5 });
    }
  }, [parcelas, map]); // Se vuelve a ejecutar si el usuario añade una nueva parcela

  return null;
};


// ============================================================================
// COMPONENTE PRINCIPAL: El Visor Espacial
// ============================================================================
export const MapWorkspace = () => {
  const { data: parcelas, isLoading } = useGetParcelas();
  const { mutate: guardarParcela, isPending } = usePostParcela();

  // Función traductora: PostGIS [Lng, Lat] -> Leaflet [Lat, Lng]
  const fromBackendToLeaflet = (coords: Coordenada[]): [number, number][] => {
    return coords.map((c) => [c[1], c[0]]);
  };

  // La función que recibe los datos de Geoman y los envía a tu Backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePolygonCreated = (latlngs: any[], layer: any) => {
    // Traducimos de {lat, lng} hacia nuestro estándar [Lng, Lat]
    const coordenadasNuevas: Coordenada[] = latlngs.map((punto: any) => [
      punto.lng,
      punto.lat,
    ]);

    // ¡REGLA DE ORO DE POSTGIS! El polígono debe cerrarse
    coordenadasNuevas.push([...coordenadasNuevas[0]]);

    const nombre = window.prompt('Ingresa el nombre de tu nueva parcela:', 'Lote Nuevo');
    
    if (nombre) {
      guardarParcela({
        nombre_parcela: nombre,
        coordenadas: coordenadasNuevas,
      });
    }

    // Borramos el dibujo temporal (React Query descargará y pintará el definitivo en verde)
    layer.remove();
  };

  return (
    <div className="w-full h-full min-h-[600px] border border-slate-300 rounded-lg overflow-hidden shadow-sm relative">
      
      {(isLoading || isPending) && (
        <div className="absolute inset-0 bg-white/50 z-[1000] flex items-center justify-center backdrop-blur-sm">
          <span className="text-indigo-700 font-bold bg-white px-4 py-2 rounded shadow">
            Sincronizando satélites...
          </span>
        </div>
      )}

    <MapContainer 
        center={[31.865, -116.620]} // Default (Ensenada) por si no hay parcelas aún
        zoom={14} 
        style={{ height: '600px', width: '100%', zIndex: 1 }}
      >
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <GeomanControls onPolygonCreated={handlePolygonCreated} />
        
        {/* INYECTA la ubicacipon de la parcela (primera en el registro del usuario) */}
        <MapBoundsFitter parcelas={parcelas} />

        {parcelas?.map((parcela) => (
          <Polygon 
            key={parcela.id} 
            positions={fromBackendToLeaflet(parcela.coordenadas)}
            pathOptions={{ color: '#16a34a', fillColor: '#22c55e', fillOpacity: 0.4 }}
          >
            <Popup>
              <div className="font-semibold text-slate-800">{parcela.nombre_parcela}</div>
              <div className="text-xs text-slate-500 mt-1">Dueño ID: {parcela.owner_id.substring(0, 8)}...</div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>

      
    </div>
  );
};