// src/features/municipios/ui/MunicipioSelector.tsx
import { useState } from 'react';
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

    const { municipios, isLoading, error, fetchMunicipioGeometry } = useMunicipios(cveEnt);

    // Estado local para bloquear el selector mientras descargamos el GeoJSON
    const [isFetchingGeometry, setIsFetchingGeometry] = useState(false)

   const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cvegeo = e.target.value;
    
    if (!cvegeo) {
      onMunicipioSelect(null);
      return;
    }

    setIsFetchingGeometry(true);
    // Solicitamos la carga pesada al seleccionar
    const municipioConGeometria = await fetchMunicipioGeometry(cvegeo);
    setIsFetchingGeometry(false);
    
    // Enviamos el objeto completo (ya con la propiedad geom) al Dashboard
    onMunicipioSelect(municipioConGeometria);
  };

// Map limpio solo usando el nombre del municipio (nomgeo)
  const options = municipios.map((mun) => ({
    value: mun.cvegeo,
    label: mun.nomgeo,
  }));

// Renderizado condicional del error si falla la red
if (error) {
    return (
        <div className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-md text-xs shadow-sm">
            Error al cargar municipios: {error}
        </div>
    );
}

// Textos dinámicos para informar al usuario si estamos cargando el catálogo o la geometría
  const placeholderText = isLoading 
    ? "Descargando catálogo..." 
    : isFetchingGeometry 
      ? "Descargando polígono..." 
      : "-- Seleccionar Municipio --";

// Si no hay entidad seleccionada, deshabilitamos el selector
return (
    <Select
        label="2. Municipio"
        placeholder={placeholderText}
        options={options}
        onChange={handleSelectChange}
        // Bloquea el input si esta descargando cualquiera de los dos recursos
         disabled={isLoading || isFetchingGeometry || !cveEnt || municipios.length === 0}
    />
);
};