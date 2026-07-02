// src/features/municipios/ui/MunicipioSelector.tsx
import { useEffect } from 'react';
import { useMunicipios } from '../hooks/useMunicipios';
import { Select } from '../../../shared/ui/Select';
import type { Municipio } from '../model/types';

// Define el contrato de comunicación hacia el exterior
interface MunicipioSelectorProps {
    cveEnt: string;
    onMunicipioSelect: (municipio: Municipio | null) => void;
}

export const MunicipioSelector: React.FC<MunicipioSelectorProps> = ({
    cveEnt,
    onMunicipioSelect
}) => {
    const { municipios, isLoading, error, fetchByEntidad, clearMunicipios } = useMunicipios();

    // Efecto reactivo: cuando cambia la entidad orquestadora, descargamos sus municipios
    useEffect(() => {
        if (cveEnt) {
            fetchByEntidad(cveEnt);
        } else {
            clearMunicipios();
        }
    }, [cveEnt, fetchByEntidad, clearMunicipios]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cvegeo = e.target.value;
        // Busca el objeto municipio completo dentro de nuestra memoria local
        const selected = municipios.find((m) => m.cvegeo === cvegeo) || null;

        // Emite el municipio seleccionado hacia el orquestador (Dashboard)
        onMunicipioSelect(selected);
    };

    // Mapeamos al contrato de <Select />
    const options = municipios.map((mun) => ({
        value: mun.cvegeo,
        label: `[${mun.cveMun || mun.cvegeo.substring(2)}] ${mun.nommun}`,
    }));

    // Renderizado condicional del error si falla la red
    if (error) {
        return (
            <div className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-md text-xs shadow-sm">
                Error al cargar municipios: {error}
            </div>
        );
    }
    
    // Si no hay entidad seleccionada, deshabilitamos el selector
  return (
    <Select
      label="2. Municipio"
      placeholder={isLoading ? "Descargando telemetría..." : "-- Seleccionar Polígono --"}
      options={options}
      onChange={handleSelectChange}
      disabled={isLoading || !cveEnt || municipios.length === 0}
    />
  );
};