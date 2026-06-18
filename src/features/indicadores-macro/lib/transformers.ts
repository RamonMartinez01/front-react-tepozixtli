// src/features/indicadores-macro/lib/transformers.ts
import type { IndicadorMacroApi, IndicadorMacro } from '../model/types';

/**
 * Transforma un solo objeto IndicadorMacro de snake_case a camelCase.
 */
export const transformIndicador = (data: IndicadorMacroApi): IndicadorMacro => {
  return {
    id: data.id,
    tipoIndicador: data.tipo_indicador,
    entidadTipo: data.entidad_tipo,
    entidadId: data.entidad_id,
    fechaCaptura: data.fecha_captura,
    cogUrl: data.cog_url,
  };
};

/**
 * Transforma un array completo de Indicadores.
 */
export const transformIndicadoresList = (data: IndicadorMacroApi[]): IndicadorMacro[] => {
  return data.map(transformIndicador);
};