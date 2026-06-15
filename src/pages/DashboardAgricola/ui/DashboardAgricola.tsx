// src/pages/DashboardAgricola/ui/DashboardAgricola.tsx
import 'maplibre-gl/dist/maplibre-gl.css'; // Sin esto, el mapa se rompe.
import Map from 'react-map-gl/maplibre'

export const DashboardAgricola = () => {
  return (
    // Contenedor a pantalla completa (100% del viewport), fondo oscuro por defecto
    <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden relative">
      
      {/* Nuestro Motor WebGL */}
      <Map
        initialViewState={{
          longitude: -99.1332, // Centro aproximado de México
          latitude: 19.4326,
          zoom: 5
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Aquí inyectaremos los polígonos y datos en el Issue 2 y 3 */}
      </Map>

      {/* Capa de interfaz gráfica (UI) superpuesta al mapa */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6">
        <header className="pointer-events-auto">
          <h1 className="text-cyan-400 font-bold text-2xl tracking-widest uppercase drop-shadow-md">
            Proyecto Hñäki
          </h1>
          <p className="text-slate-400 text-sm">Consola de Diagnóstico Satelital</p>
        </header>
        
        {/* Aquí irán nuestros paneles flotantes más adelante */}
      </div>
    </div>
  );
};