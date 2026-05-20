// src/features/regiones/api/regiones.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/apiClient';
import type { Region, RegionCreate } from '../types';

// 1. Obtener todas las regiones (GET)
export const useRegiones = () => {
  return useQuery<Region[]>({
    queryKey: ['regiones'],
    queryFn: async () => {
      const { data } = await apiClient.get('/regiones/');
      return data;
    },
  });
};

// 2. Crear una nueva región (POST)
export const useCrearRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaRegion: RegionCreate) => {
      const { data } = await apiClient.post('/regiones/', nuevaRegion);
      return data;
    },
    onSuccess: () => {
      // Invalidamos el cache para que el mapa se actualice automáticamente
      queryClient.invalidateQueries({ queryKey: ['regiones'] });
    },
  });
};