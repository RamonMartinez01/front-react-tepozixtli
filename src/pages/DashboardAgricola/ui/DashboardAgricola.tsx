// src/pages/DashboardAgricola/ui/DashboardAgricola.tsx
import 'maplibre-gl/dist/maplibre-gl.css'; // Sin esto, el mapa se rompe.
import Map from 'react-map-gl/maplibre';
import { useNavigate } from 'react-router-dom';
import { DrawControl } from './DrawControl';

export const DashboardAgricola = () => {
  const navigate = useNavigate();


  return (
    // Contenedor a pantalla completa (100% del viewport)
    <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden relative">
      
      {/* Motor WebGL */}
      <Map
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
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
          </button>

        </header>
        
        {/* Aquí irán lon paneles flotantes más adelante */}
      </div>
    </div>
  );
};