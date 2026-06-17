// src/features/municipios/hooks/useMunicipios.ts
import { useState, useCallback } from 'react';
import type { Municipio } from '../model/types';
import { municipiosService } from '../api/municipiosService';

export const useMunicipios = () => {
  // Estado local encapsulado
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene los municipios de una entidad federativa específica.
   * Utiliza useCallback para evitar re-renderizados innecesarios 
   * si este hook se pasa a través de múltiples componentes.
   */
  const fetchByEntidad = useCallback(async (cveEnt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Llama al servicio tipado
      const data = await municipiosService.getMunicipiosByEntidad(cveEnt);
      setMunicipios(data);
    } catch (err: any) {
      // Captura el error formateado desde la aduana (apiClient)
      setError(err.message || 'Error de telemetría al cargar los municipios');
      setMunicipios([]); // Purga datos corruptos o antiguos
    } finally {
      setIsLoading(false); // Apaga el indicador de carga sin importar el resultado
    }
  }, []);

  /**
   * Purgado manual de memoria.
   * Útil si el usuario "limpia" su selección en la interfaz gráfica.
   */
  const clearMunicipios = useCallback(() => {
    setMunicipios([]);
    setError(null);
  }, []);

  // Expone el estado y las funciones hacia los componentes UI
  return {
    municipios,
    isLoading,
    error,
    fetchByEntidad,
    clearMunicipios,
  };
};