// src/features/municipios/hooks/useMunicipios.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Municipio } from '../model/types';
import { municipiosService } from '../api/municipiosService';

export const useMunicipios = (cveEnt: string) => {
  const queryClient = useQueryClient();

  /**
   * Obtiene los municipios de una entidad federativa específica.
   * Utiliza useCallback para evitar re-renderizados innecesarios 
   * si este hook se pasa a través de múltiples componentes.
   */
  // 1. Carga ligera reactiva: Catálogo de municipios por entidad
  const {
    data: municipios = [],
    isLoading,
    error
  } = useQuery<Municipio[], Error>({
    queryKey: ['municipios', cveEnt],
    queryFn: () => municipiosService.getMunicipiosByEntidad(cveEnt),
    enabled: !!cveEnt, // La petición solo se ejecuta si cveEnt no está vacío
    staleTime: Infinity, // Los municipios no cambian, se cachean para toda la sesión
  });

  // 2. Carga pesada diferida (Lazy Fetch)
  const fetchMunicipioGeometry = async (cvegeo: string): Promise<Municipio | null> => {
    try {
      // fetchQuery revisa si ya tenemos la geometría en caché antes de ir a la red
      return await queryClient.fetchQuery({
        queryKey: ['municipioDetalle', cvegeo],
        queryFn: () => municipiosService.getMunicipioByCvegeo(cvegeo),
        staleTime: Infinity,
      });
    } catch (err) {
      console.error("Error al descargar la geometría:", err);
      return null;
    }
  };

  // Expone el estado y las funciones hacia los componentes UI
  return {
    municipios,
    isLoading,
    error: error?.message || null,
    fetchMunicipioGeometry,
  };
};