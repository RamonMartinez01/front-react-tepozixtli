// src/features/entidades/ui/EntidadSelector.tsx
import React from 'react';
import { useEntidades } from '../hooks/useEntidades';
import { Select } from '../../../shared/ui/Select';
import type { Entidad } from '../model/types';

interface EntidadSelectorProps {
  onEntidadSelect: (entidad: Entidad | null) => void;
  selectedCveEnt?: string;
}

export const EntidadSelector: React.FC<EntidadSelectorProps> = ({ 
  onEntidadSelect, 
  selectedCveEnt = '' 
}) => {
  const { data: entidades = [], isLoading, isError } = useEntidades();

  // Mapeamos el modelo del backend al contrato visual de nuestro Select genérico
  const options = entidades.map((entidad: Entidad) => ({
    value: entidad.cve_ent,
    label: entidad.nomgeo,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cve = e.target.value;
    // Busca el objeto completo que coincida con el valor seleccionado
    const selected = entidades.find((ent) => ent.cve_ent === cve) || null;
    
    // Emite el objeto hacia el Dashboard
    onEntidadSelect(selected);
  };

  if (isError) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-md text-xs shadow-sm">
        No se pudo cargar el catálogo de entidades.
      </div>
    );
  }

  return (
    <Select
      label="1. Entidad Federativa"
      placeholder={isLoading ? "Cargando catálogo..." : "Seleccione un estado"}
      options={options}
      value={selectedCveEnt}
      onChange={handleChange}
      disabled={isLoading}
      // Le damos un ancho fijo o un mínimo para mantener consistencia en el panel
      className="min-w-[240px] pointer-events-auto shadow-sm"
    />
  );
};