// src/pages/Home/ui/TelemetryMapPreview.tsx
import Map from 'react-map-gl/maplibre';

export const TelemetryMapPreview = () => {
  const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY;


  return (
    // Contenedor absoluto que cubre todo el botón padre. 
    // pointer-events-none asegura que el clic pase a través del mapa hacia el botón.
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-80">
      <Map
        initialViewState={{
          longitude: -99.1332, // Coordenadas base (puedes ajustarlas)
          latitude: 19.4326,
          zoom: 4
        }}
        mapStyle={`https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`}
        interactive={false} // Apaga toda interacción del mapa
        attributionControl={false} // Oculta recuadro de Contribuidores en este componente
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};