// src/features/municipios/ui/MunicipioSelector.tsx
import { useMunicipios } from '../hooks/useMunicipios';
import type { Municipio } from '../model/types';

// Define el contrato de comunicación hacia el exterior
interface MunicipioSelectorProps {
    onMunicipioSelect: (municipio: Municipio | null) => void;
}

export const MunicipioSelector = ({ onMunicipioSelect }: MunicipioSelectorProps) => {
    const { municipios, isLoading, error, fetchByEntidad } = useMunicipios();

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cvegeo = e.target.value;
        // Busca el objeto municipio completo dentro de nuestra memoria local
        const selected = municipios.find((m) => m.cvegeo === cvegeo) || null;

        // Emite el municipio seleccionado hacia el orquestador (Dashboard)
        onMunicipioSelect(selected);
    };

    return (
        // Panel flotante: Fondo oscuro, borde sutil, tipografía monoespaciada
        <div className="bg-[#0f0f0f]/95 backdrop-blur-md border border-slate-800 rounded-lg p-4 font-mono text-sm w-80 shadow-2xl pointer-events-auto">

            <h3 className="text-cyan-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2 text-xs font-bold">
                Título buscador
            </h3>

            <div className="flex flex-col gap-3">
                {/* Botón de prueba táctica para la entidad 02 */}
                <button
                    onClick={() => fetchByEntidad('13')}
                    disabled={isLoading}
                    className="bg-[#121212] border border-slate-700 hover:border-cyan-500 text-slate-300 py-2 px-4 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-xs"
                >
                    {isLoading ? '[ DESCARGANDO TELEMETRÍA... ]' : '[ CARGAR ENTIDAD: 13 ]'}
                </button>

                {/* Pantalla de Error */}
                {error && (
                    <div className="text-red-400 border border-red-900/50 bg-red-950/20 p-2 rounded text-xs">
                        &gt; ERROR CRÍTICO: {error}
                    </div>
                )}

                {/* Pantalla de Resultados (Solo se muestra si hay datos) */}
                {municipios.length > 0 && (
                    <div className="mt-2 animate-fade-in">
                        <label className="text-slate-500 text-[10px] uppercase mb-1 block">
                            Polígonos Detectados ({municipios.length})
                        </label>
                        <select
                            onChange={handleSelectChange}
                            className="w-full bg-[#050505] border border-slate-700 text-slate-300 rounded p-2 focus:border-cyan-500 focus:outline-none transition-colors text-xs cursor-pointer"
                        >
                            <option value="">-- Seleccionar Polígono --</option>
                            {municipios.map((mun) => (
                                <option key={mun.id} value={mun.cvegeo}>
                                    [{mun.cveMun}] {mun.nommun}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};