// src/pages/Home/ui/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { TelemetryMapPreview } from './TelemetryMapPreview';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    // Contenedor principal
    <div className="h-full w-full flex flex-col p-4 gap-4 overflow-y-auto">
      
      {/* Elemento A: 1/3 de la vertical (flex-1). Mapa mock interactivo */}
      <button
        onClick={() => navigate('/mapa')}
        className="flex-1 min-h-[180px] w-full relative rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden group hover:border-emerald-400 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center cursor-pointer"
      >
        <TelemetryMapPreview />
        
        {/* Etiqueta flotante actualizada con efecto cristal (glassmorphism) claro */}
        <div className="relative z-10 flex flex-col items-center py-2 px-4 bg-white/90 backdrop-blur-sm rounded-md border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
          <span className="text-emerald-700 text-xs uppercase tracking-widest font-bold">
            Ir al Mapa de Telemetría
          </span>
        </div>
      </button>

      {/* Contenedor central: 1/3 de la vertical (flex-1). Flexbox en fila para B y C */}
      <div className="flex-1 min-h-[180px] w-full flex flex-row gap-4">
        
        {/* Elemento B */}
        <div className="flex-1 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center p-4">
          <span className="text-slate-500 font-medium text-sm tracking-wide">Panel B (Próximamente)</span>
        </div>

        {/* Elemento C */}
        <div className="flex-1 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center p-4">
          <span className="text-slate-500 font-medium text-sm tracking-wide">Panel C (Próximamente)</span>
        </div>

      </div>

      {/* Elemento D: 1/3 de la vertical (flex-1). Panel inferior */}
      <div className="flex-1 min-h-[180px] w-full rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center p-4">
        <span className="text-slate-500 font-medium text-sm tracking-wide">Panel D (Próximamente)</span>
      </div>

    </div>
  );
};