// src/pages/DashboardAgricola/ui/DrawControl.tsx
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl } from 'react-map-gl/maplibre';

import { customDrawTheme } from '../lib/drawTheme';

// Definimos estrictamente las 4 esquinas que MapLibre soporta para evitar choques
export type ControlPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface DrawControlProps {
  position?: ControlPosition;
  onCreate?: (e: any) => void;
  onUpdate?: (e: any) => void;
  onDelete?: (e: any) => void;
}

export const DrawControl = (props: DrawControlProps) => {

  
  useControl(
    () =>
      new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true, // Activa el dibujo de polígonos para las AOI
          trash: true,   // Activa el botón de eliminar polígono
        },
        styles: customDrawTheme,
      }) as any,
    ({ map }: any) => {
      if (props.onCreate) map.on('draw.create', props.onCreate);
      if (props.onUpdate) map.on('draw.update', props.onUpdate);
      if (props.onDelete) map.on('draw.delete', props.onDelete);
    },
    ({ map }: any) => {
      if (props.onCreate) map.off('draw.create', props.onCreate);
      if (props.onUpdate) map.off('draw.update', props.onUpdate);
      if (props.onDelete) map.off('draw.delete', props.onDelete);
    },
    {
      position: props.position || 'top-right',
    }
  );

  return null;
};