// src/features/parcelas/api/postParcela.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/apiClient';
import type { ParcelaCreatePayload, Parcela } from '../types';

/**
 * 1. La función de red pura.
 * Envía el payload (nombre y coordenadas) hacia nuestro backend FastAPI.
 */
export const postParcela = async (payload: ParcelaCreatePayload): Promise<Parcela> => {
  const response = await apiClient.post<Parcela>('/parcelas/', payload);
  return response.data;
};

/**
 * 2. El Custom Hook de Mutación.
 * Maneja el ciclo de vida de la petición (cargando, éxito, error).
 */
export const usePostParcela = () => {
  // Obtenemos acceso al controlador global de la caché de React Query
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postParcela,
    
    // Si la llamada a FastAPI responde con un 200/201 (Éxito)
    onSuccess: () => {
      // Magia de React Query: Invalidamos la llave 'parcelas'.
      // Esto fuerza a que cualquier componente que use `useGetParcelas` 
      // vuelva a pedir los datos actualizados a la base de datos automáticamente.
      queryClient.invalidateQueries({ queryKey: ['parcelas'] });
    },
    
    onError: (error) => {
      // Aquí podríamos agregar una alerta global en el futuro (ej. react-hot-toast)
      console.error("Error al guardar la parcela:", error);
    }
  });
};