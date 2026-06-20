// src/features/indicadores-macro/hooks/useIndicadoresMacro.ts
import { useState, useCallback } from 'react';
import type { IndicadorMacro } from '../model/types';
import { indicadoresMacroService } from '../api/indicadoresMacroService';

export const useIndicadoresMacro = () => {
  // Estados de memoria aislados para cada tipo de consulta
  const [indicadorData, setIndicadorData] = useState<IndicadorMacro | IndicadorMacro[] | null>(null);
  const [serieTiempoData, setSerieTiempoData] = useState<IndicadorMacro[]>([]);
  
  // Estados de control de la nave
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga el historial reciente o un mapa específico.
   */
  const fetchIndicador = useCallback(async (
    entidadTipo: string,
    entidadId: string,
    tipoIndicador: string,
    fechaCaptura?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await indicadoresMacroService.getIndicador(
        entidadTipo, 
        entidadId, 
        tipoIndicador, 
        fechaCaptura
      );
      setIndicadorData(data);
      return data; // Devolvemos el dato por si la UI necesita reaccionar inmediatamente
    } catch (err: any) {
      setError(err.message || 'Anomalía detectada al cargar el indicador satelital.');
      setIndicadorData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Descarga la serie cronológica completa para alimentar los motores de graficación.
   */
  const fetchSerieTiempo = useCallback(async (
    entidadTipo: string,
    entidadId: string,
    tipoIndicador: string,
    fechaInicio: string,
    fechaFin: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await indicadoresMacroService.getSerieTiempo(
        entidadTipo, 
        entidadId, 
        tipoIndicador, 
        fechaInicio, 
        fechaFin
      );
      setSerieTiempoData(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Interferencia al descargar la serie de tiempo.');
      setSerieTiempoData([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Purgado de memoria de los escáneres.
   */
  const clearData = useCallback(() => {
    setIndicadorData(null);
    setSerieTiempoData([]);
    setError(null);
  }, []);

  return {
    indicadorData,
    serieTiempoData,
    isLoading,
    error,
    fetchIndicador,
    fetchSerieTiempo,
    clearData
  };
};