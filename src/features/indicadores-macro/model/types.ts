// src/features/indicadores-macro/model/types.ts

/**
 * Contrato de Entrada (Backend API)
 * Refleja exactamente el JSON en snake_case que arroja FastAPI
 */
export interface IndicadorMacroApi {
  id: string;             // UUID convertido a string en JSON
  tipo_indicador: string;
  entidad_tipo: string;
  entidad_id: string;     // UUID convertido a string en JSON
  fecha_captura: string;  // Formato YYYY-MM-DD
  cog_url: string;
}

/**
 * Contrato Interno (Frontend)
 * Refleja el estándar camelCase para nuestra UI
 */
export interface IndicadorMacro {
  id: string;
  tipoIndicador: string;
  entidadTipo: string;
  entidadId: string;
  fechaCaptura: string;
  cogUrl: string;
}

/**
 * Envoltorios de respuesta de FastAPI
 * Útiles para manejar las respuestas que traen metadatos adicionales
 */
export interface IndicadorResponseWrapper<T> {
  status: string;
  source?: string;
  total_registros?: number;
  total_encontrados?: number;
  filtros_aplicados?: Record<string, any>;
  data: T;
}