// src/features/indicadores-macro/ui/IndicadorControlPanel.tsx
import { useState } from 'react';
import { useIndicadoresMacro } from '../hooks/useIndicadoresMacro';
import type { Municipio } from '../../municipios/model/types';

interface IndicadorControlPanelProps {
  municipio: Municipio;
  // Emitimos los datos del raster hacia el mapa principal
  onRasterReady: (cogUrl: string, tipo: string) => void; 
}

export const IndicadorControlPanel = ({ municipio, onRasterReady }: IndicadorControlPanelProps) => {
  const { fetchIndicador, isLoading, error } = useIndicadoresMacro();

  //estado para controlar la visibilidad de los botones (inicia expandido)
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFetch = async (tipo: string) => {
    // Llamamos al backend solicitando el historial del municipio
    const result = await fetchIndicador('municipio', String(municipio.cvegeo), tipo);
    
    if (result) {
      // Tomamos el mapa más reciente (índice 0)
      const data = Array.isArray(result) ? result[0] : result;

      if (data && data.cogUrl) {
        onRasterReady(data.cogUrl, data.tipoIndicador);
      }
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg w-80 shadow-xl pointer-events-auto mt-2 transition-all duration-300 ease-in-out">
      {/* Encabezado interactivo */}
      <div 
        className="py-1.5 px-4 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 rounded-lg transition-colors border-b border-transparent data-[expanded=true]:border-slate-200 data-[expanded=true]:rounded-b-none"
        data-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-slate-500 uppercase tracking-wider text-xs font-semibold flex flex-col gap-1">
          <span>Análisis Satelital</span>
          <span className="text-emerald-600 font-bold">{municipio.nomgeo}</span>
        </h3>
        
        {/* Ícono dinámico que rota según el estado */}
        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" height="20" 
            viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Cuerpo del panel: Solo se renderiza si isExpanded es true */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 flex flex-col gap-3 animate-fade-in">
          <button
            onClick={() => handleFetch('NDVI')}
            disabled={isLoading}
            className="bg-emerald-50 border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100 text-emerald-700 py-2.5 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-xs font-medium flex justify-between items-center shadow-sm"
          >
            <span>{isLoading ? 'Analizando...' : 'Índice Vegetativo (NDVI)'}</span>
            {!isLoading && <span className="text-emerald-700/40 text-[10px]">COPERNICUS</span>}
          </button>

          <button
            onClick={() => handleFetch('LST')}
            disabled={isLoading}
            className="bg-orange-50 border border-orange-200 hover:border-orange-400 hover:bg-orange-100 text-orange-700 py-2.5 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-xs font-medium flex justify-between items-center shadow-sm"
          >
            <span>{isLoading ? 'Analizando...' : 'Temp. Superficial (LST)'}</span>
            {!isLoading && <span className="text-orange-700/40 text-[10px]">COPERNICUS</span>}
          </button>

          {error && (
            <div className="text-red-600 border border-red-200 bg-red-50 p-2.5 rounded-md text-xs mt-1 shadow-sm">
              Error de telemetría: {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};