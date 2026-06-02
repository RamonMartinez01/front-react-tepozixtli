// src/features/regiones/components/RegionManager.tsx
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet'; // 1. IMPORTAMOS GeoJSON
import { useGeoman } from '../../../shared/hooks/useGeoman';
import { useRegiones, useCrearRegion } from '../api/regiones';
// Ya no necesitamos 'Coordenada', usamos los tipos globales que definimos antes.
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const GeomanBridge = ({ onCreate }: { onCreate: (layer: any) => void }) => {
  useGeoman({ onPolygonCreated: onCreate });
  return null;
};

export const RegionManager = () => {
  const { data: regiones, isLoading } = useRegiones(); 
  const crearRegion = useCrearRegion();

  const handleCreate = (layer: any) => {
    // =========================================================
    // EL ENFOQUE GIS DE CLASE MUNDIAL
    // =========================================================
    // 1. Dejamos que Leaflet convierta la capa dibujada a GeoJSON estándar
    const geojsonFeature = layer.toGeoJSON();
    const geometry = geojsonFeature.geometry;

    // 2. Nuestro contrato estricto de Backend espera un MultiPolygon.
    // Geoman suele devolver un Polygon simple. Hacemos el "Upgrade" envolviendo
    // las coordenadas en un nivel extra de arreglo [ ].
    let geomValidado;
    if (geometry.type === 'Polygon') {
      geomValidado = {
        type: 'MultiPolygon',
        coordinates: [geometry.coordinates]
      };
    } else if (geometry.type === 'MultiPolygon') {
      geomValidado = geometry;
    } else {
      console.warn("Geometría no soportada por el momento.");
      return;
    }

    const nombre = prompt("Nombre de la nueva región (Sentinel Track):");
    
    if (nombre) {
      // 3. Enviamos el payload compatible con Pydantic (usando 'geom')
      crearRegion.mutate({ 
        nombre_region: nombre, 
        descripcion: "Trazado desde consola de mando (Frontend)", 
        geom: geomValidado 
      });

      // Buena práctica: remover la capa temporal que dibujó el usuario,
      // porque React Query invalidará el caché, traerá el dato real de la DB,
      // y el componente <GeoJSON> de abajo lo dibujará de forma permanente y oficial.
      layer.remove(); 
    } else {
      // Si el usuario cancela, limpiamos el mapa
      layer.remove();
    }
  };

  if (isLoading) return (
    <div className="flex h-[600px] items-center justify-center bg-slate-900 text-cyan-400 rounded-xl">
      Cargando malla espacial de Copérnico...
    </div>
  );

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl shadow-cyan-900/20">
      <MapContainer center={[23.0, -102.0]} zoom={5} className="h-full">
        {/* Usamos un mapa base oscuro para esa vibra "High-Tech Orbit" que definimos antes */}
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <GeomanBridge onCreate={handleCreate} />
        
        <FeatureGroup>
          {/* ========================================================= */}
          {/* RENDERIZADO REACTIVO DE REGIONES                          */}
          {/* ========================================================= */}
          {regiones?.map((region) => (
            <GeoJSON 
              key={region.id} // Clave vital para que React renderice eficientemente
              data={region.geom} // ¡Inyectamos el GeoJSON directo del Backend!
              pathOptions={{ 
                color: '#06b6d4', // Cyan vibrante para los bordes
                weight: 2, 
                fillColor: '#3b82f6', // Azul espacial para el relleno
                fillOpacity: 0.3 
              }} 
            />
          ))}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};