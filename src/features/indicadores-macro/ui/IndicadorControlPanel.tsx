// src/features/indicadores-macro/ui/IndicadorControlPanel.tsx
import { useIndicadoresMacro } from '../hooks/useIndicadoresMacro';
import type { Municipio } from '../../municipios/model/types';

interface IndicadorControlPanelProps {
  municipio: Municipio;
  // Emitimos los datos del raster hacia el mapa principal
  onRasterReady: (cogUrl: string, tipo: string) => void; 
}

export const IndicadorControlPanel = ({ municipio, onRasterReady }: IndicadorControlPanelProps) => {
  const { fetchIndicador, isLoading, error } = useIndicadoresMacro();

  const handleFetch = async (tipo: string) => {
    // Llamamos a tu backend solicitando el historial (sin fecha exacta por ahora para asegurar que traiga el último disponible)
    const result = await fetchIndicador('municipio', String(municipio.id), tipo);
    
    if (result) {
      // Como tu backend devuelve un historial (Array) si no hay fecha, tomamos el mapa más reciente (índice 0)
      const data = Array.isArray(result) ? result[0] : result;
/*
      // ---> Check data <---
console.log(`[Telemetría Backend] Indicador: ${tipo}`);
console.log(`[Telemetría Backend] Fecha de Captura:`, data?.fechaCaptura);
console.log(`[Telemetría Backend] URL del COG:`, data?.cogUrl);
*/
      if (data && data.cogUrl) {
        onRasterReady(data.cogUrl, data.tipoIndicador);
      }
    }
  };

  return (
    <div className="bg-[#0f0f0f]/95 backdrop-blur-md border border-slate-800 rounded-lg p-4 font-mono text-sm w-80 shadow-2xl pointer-events-auto mt-4 animate-fade-in">
      <h3 className="text-emerald-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2 text-xs font-bold">
        Escáner Satelital // {municipio.nommun}
      </h3>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleFetch('NDVI')}
          disabled={isLoading}
          className="bg-emerald-950/30 border border-emerald-900 hover:border-emerald-500 text-emerald-400 py-2 px-4 rounded transition-all disabled:opacity-50 active:scale-[0.98] text-xs"
        >
          {isLoading ? '[ ANALIZANDO... ]' : '[ ÍNDICE VEGETATIVO (NDVI) ]'}
        </button>

        <button
          onClick={() => handleFetch('LST')}
          disabled={isLoading}
          className="bg-orange-950/30 border border-orange-900 hover:border-orange-500 text-orange-400 py-2 px-4 rounded transition-all disabled:opacity-50 active:scale-[0.98] text-xs"
        >
          {isLoading ? '[ ANALIZANDO... ]' : '[ TEMPERATURA SUPERFICIAL (LST) ]'}
        </button>

        {error && (
          <div className="text-red-400 border border-red-900/50 bg-red-950/20 p-2 rounded text-[10px] mt-2">
            &gt; FALLO DE TELEMETRÍA: {error}
          </div>
        )}
      </div>
    </div>
  );
};