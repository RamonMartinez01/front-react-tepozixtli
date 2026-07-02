// src/pages/DashboardAgricola/lib/drawTheme.ts

export const customDrawTheme = [
  {
    id: 'gl-draw-polygon-fill-inactive',
    type: 'fill',
    filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': '#10b981',
      'fill-outline-color': '#10b981',
      'fill-opacity': 0.1
    }
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'trueNormally']]
  },
]