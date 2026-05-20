import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { useGeoman } from '../../../shared/hooks/useGeoman'; // Un hook personalizado que encapsula Geoman
import { useRegiones, useCrearRegion } from '../api/regiones';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

//  CREAMOS Un COMPONENTE PUENTE
// Este componente vive DENTRO del MapContainer, por lo que tiene acceso al contexto del mapa
const GeomanBridge = ({ onCreate }: { onCreate: (layer: any) => void }) => {
  useGeoman({ onPolygonCreated: onCreate });
  return null; // No renderiza nada visual, solo inyecta la lógica
};

export const RegionManager = () => {
  const { data: regiones, isLoading } = useRegiones(); 
  const crearRegion = useCrearRegion();

  // Esta función es el corazón: toma el polígono dibujado y lo envía a FastAPI
  const handleCreate = (layer: any) => {
    const latlngs = layer.getLatLngs()[0]; // Obtenemos los puntos
    const coordenadas = latlngs.map((p: any) => [p.lng, p.lat]);
    
    // =========================================================
    // EL ARREGLO GIS: Asegurarnos de que el anillo se cierre
    // =========================================================
    if (coordenadas.length > 0) {
      const primerPunto = coordenadas[0];
      const ultimoPunto = coordenadas[coordenadas.length - 1];
      
      // Si el inicio y el fin no son exactamente iguales, empujamos el primero al final
      if (primerPunto[0] !== ultimoPunto[0] || primerPunto[1] !== ultimoPunto[1]) {
        coordenadas.push([...primerPunto]);
      }
    }

    const nombre = prompt("Nombre de la nueva región:");
    if (nombre) {
      crearRegion.mutate({ nombre_region: nombre, descripcion: "", coordenadas });
    }
  };

  if (isLoading) return <div>Cargando atlas...</div>;

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-300">
      <MapContainer center={[23.0, -102.0]} zoom={5} className="h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* INYECTAMOS EL PUENTE AQUÍ, DENTRO DEL MAPA */}
        <GeomanBridge onCreate={handleCreate} />

        <FeatureGroup>
          {/* Aquí renderizaremos tus regiones existentes más adelante */}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};