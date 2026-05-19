// src/features/parcelas/api/getParcelas.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/apiClient';
import type { Parcela } from '../types';

/**
 * 1. La función de red pura.
 * Extrae los datos usando nuestro cliente de Axios ya configurado con el token.
 */
export const getParcelas = async (): Promise<Parcela[]> => {
  // Axios inyectará automáticamente el encabezado de autorización
  const response = await apiClient.get<Parcela[]>('/parcelas/');
  return response.data;
};

/**
 * 2. El Custom Hook de React Query.
 * Este es el que importaremos en nuestros componentes de UI.
 */
export const useGetParcelas = () => {
  return useQuery({
    // queryKey es como el identificador único en la caché de React Query
    queryKey: ['parcelas'],
    queryFn: getParcelas,
    //recomendado: cuánto tiempo consideramos los datos "frescos"
    staleTime: 1000 * 60 * 5, // 10 minutos
  });
};