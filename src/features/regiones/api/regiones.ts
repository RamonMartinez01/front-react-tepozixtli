// src/features/regiones/api/regiones.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../config/apiClient';
import type { Region, RegionCreate } from '../types';

// 1. Obtener todas las regiones (GET)
export const useRegiones = () => {
  return useQuery<Region[]>({
    queryKey: ['regiones'],
    queryFn: async () => {
      return await apiClient.get('/regiones/');

    },
  });
};

// 2. Crear una nueva región (POST)
export const useCrearRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaRegion: RegionCreate) => {
      return await apiClient.post('/regiones/', nuevaRegion);
    },
    onSuccess: () => {
      // Invalidamos el cache para que el mapa se actualice automáticamente
      queryClient.invalidateQueries({ queryKey: ['regiones'] });
    },
  });
};