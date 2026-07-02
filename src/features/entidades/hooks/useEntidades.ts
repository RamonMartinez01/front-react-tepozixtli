// src/features/entidades/hooks/useEntidades.ts
import { useQuery } from '@tanstack/react-query';
import { entidadesService } from '../api/entidadesService';
import type { Entidad } from '../model/types';

export const useEntidades = () => {
  return useQuery<Entidad[], Error>({
    queryKey: ['entidades'],
    queryFn: entidadesService.getAll,
    // Las entidades no cambian frecuentemente. 
    // Configuramos un tiempo de "frescura" alto (Infinity) para evitar peticiones duplicadas en la sesión.
    staleTime: Infinity, 
  });
};