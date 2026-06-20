// src/features/indicadores-macro/api/indicadoresMacroService.ts
import { apiClient } from '../../../config/apiClient';
import type { IndicadorMacroApi, IndicadorMacro, IndicadorResponseWrapper } from '../model/types';
import { transformIndicador, transformIndicadoresList } from '../lib/transformers';

// Prefijo base indexado en el enrutador de FastAPI
const BASE_PATH = '/indicadores-macro';

export const indicadoresMacroService = {
  /**
   * Obtiene el historial (últimos 5) o un mapa específico por fecha exacta.
   * Desempaqueta la respuesta estructurada del backend.
   */
  getIndicador: async (
    entidadTipo: string,
    entidadId: string,
    tipoIndicador: string,
    fechaCaptura?: string
  ): Promise<IndicadorMacro | IndicadorMacro[]> => {
    // Construimos los parámetros de consulta (Query Params)
    let url = `${BASE_PATH}/${entidadTipo}/${entidadId}?tipo_indicador=${tipoIndicador}`;
    if (fechaCaptura) {
      url += `&fecha_captura=${fechaCaptura}`;
    }

    // El backend responde con un objeto wrapper. Soportamos tanto un objeto único como un array.
    const response = await apiClient.get<IndicadorResponseWrapper<IndicadorMacroApi | IndicadorMacroApi[]>>(url);
    
    if (Array.isArray(response.data)) {
      return transformIndicadoresList(response.data);
    }
    
    return transformIndicador(response.data);
  },

  /**
   * Obtiene la serie cronológica completa para alimentar gráficos (ej. Recharts).
   * Siempre garantiza el retorno de un Array limpio.
   */
  getSerieTiempo: async (
    entidadTipo: string,
    entidadId: string,
    tipoIndicador: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<IndicadorMacro[]> => {
    const url = `${BASE_PATH}/${entidadTipo}/${entidadId}/serie-tiempo?tipo_indicador=${tipoIndicador}&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
    
    const response = await apiClient.get<IndicadorResponseWrapper<IndicadorMacroApi[]>>(url);
    return transformIndicadoresList(response.data);
  },

  /**
   * Panel de control interno y auditoría técnica.
   * Permite realizar diagnósticos cruzados y conteos en la base de datos.
   */
  auditarRegistros: async (filtros: {
    entidadTipo?: string;
    entidadId?: string;
    tipoIndicador?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }): Promise<IndicadorResponseWrapper<IndicadorMacroApi[]>> => {
    const params = new URLSearchParams();
    if (filtros.entidadTipo) params.append('entidad_tipo', filtros.entidadTipo);
    if (filtros.entidadId) params.append('entidad_id', filtros.entidadId);
    if (filtros.tipoIndicador) params.append('tipo_indicador', filtros.tipoIndicador);
    if (filtros.fechaInicio) params.append('fecha_inicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fecha_fin', filtros.fechaFin);

    // En este caso, devolvemos el wrapper completo porque la UI de administración 
    // necesitará leer metadatos como "total_encontrados"
    return apiClient.get<IndicadorResponseWrapper<IndicadorMacroApi[]>>(`${BASE_PATH}/admin/auditoria?${params.toString()}`);
  }
};