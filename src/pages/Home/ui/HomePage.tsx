// src/pages/Home/ui/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { TelemetryMapPreview } from './TelemetryMapPreview';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    // Contenedor principal: Altura total disponible, Flexbox en columna, márgenes y separación limpia
    <div className="h-full w-full flex flex-col p-4 gap-4 overflow-y-auto">
      
      {/* Elemento A: 1/3 de la vertical (flex-1). Mapa mock interactivo */}
      <button
        onClick={() => navigate('/mapa')}
        className="flex-1 min-h-[180px] w-full relative rounded border border-slate-800 bg-[#121212] overflow-hidden group hover:border-slate-600 transition-colors flex flex-col items-center justify-center cursor-pointer"
      >
        <TelemetryMapPreview />
        
        <div className="relative z-10 flex flex-col items-center p-1 bg-[#0a0a0a]/80 rounded border border-slate-800/50">
          {/*<span className="font-mono text-cyan-500 uppercase tracking-widest text-sm mb-1 drop-shadow-md">
            Módulo de Telemetría
          </span>*/}
          <span className="text-slate-400 text-xs uppercase tracking-wider">
            [ Iniciar Navegación ]
          </span>
        </div>
      </button>

      {/* Contenedor central: 1/3 de la vertical (flex-1). Flexbox en fila para B y C */}
      <div className="flex-1 min-h-[180px] w-full flex flex-row gap-4">
        
        {/* Elemento B: 50% del ancho (flex-1) */}
        <div className="flex-1 rounded border border-slate-800 bg-[#0f0f0f] flex items-center justify-center p-4">
          <span className="text-slate-600 font-mono text-sm">Panel B</span>
        </div>

        {/* Elemento C: 50% del ancho (flex-1) */}
        <div className="flex-1 rounded border border-slate-800 bg-[#0f0f0f] flex items-center justify-center p-4">
          <span className="text-slate-600 font-mono text-sm">Panel C</span>
        </div>

      </div>

      {/* Elemento D: 1/3 de la vertical (flex-1). Panel inferior */}
      <div className="flex-1 min-h-[180px] w-full rounded border border-slate-800 bg-[#0f0f0f] flex items-center justify-center p-4">
        <span className="text-slate-600 font-mono text-sm">Panel D</span>
      </div>

    </div>
  );
};