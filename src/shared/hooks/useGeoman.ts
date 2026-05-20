import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free'; // Asegúrate de importar el JS de Geoman

interface UseGeomanProps {
  onPolygonCreated: (layer: any) => void;
}

export const useGeoman = ({ onPolygonCreated }: UseGeomanProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.pm.setLang('es');
    map.pm.addControls({
      position: 'topright',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      drawText: false,
      drawPolygon: true,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
    });

    map.on('pm:create', (e: any) => {
      if (e.shape === 'Polygon') {
        onPolygonCreated(e.layer);
      }
    });

    return () => {
      map.pm.removeControls();
      map.off('pm:create');
    };
  }, [map, onPolygonCreated]);
};