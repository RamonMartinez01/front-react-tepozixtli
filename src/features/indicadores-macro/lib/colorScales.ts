// src/features/indicadores-macro/lib/colorScales.ts

/**
 * Convierte un valor NDVI (-1.0 a 1.0) en un array de color RGBA [R, G, B, A].
 */
export const getNdviColor = (value: number): [number, number, number, number] => {
  // 1. Filtrado de anomalías (nubes, errores de sensor)
  if (value < -1.0 || value > 1.0 || isNaN(value)) return [0, 0, 0, 0];

  // 2. Cuerpos de agua o nieve (Valores negativos) -> Azules oscuros
  if (value < 0) return [10, 30, 80, 255]; 
  
  // 3. Suelo desnudo / Área urbana (0 a 0.15) -> Tonos tierra/marrones
  if (value >= 0 && value < 0.15) {
    return [160, 100, 50, 255]; 
  }
  
  // 4. Vegetación (0.15 a 1.0) -> Transición dinámica hacia el verde oscuro
  // Normalizamos el valor restante (0.85 de rango) a un porcentaje de 0 a 1
  const pct = (value - 0.15) / 0.85;
  
  const r = Math.floor(160 * (1 - pct));       // El rojo se apaga
  const g = Math.floor(100 + (100 * pct));     // El verde domina e ilumina
  const b = Math.floor(50 * (1 - pct));        // El azul desaparece

  return [r, g, b, 255];
};

/**
 * Convierte un valor LST (Land Surface Temperature en °C) a RGBA.
 * Utiliza una rampa térmica que asume un rango típico de 10°C a 50°C.
 */
export const getLstColor = (rawValue: number): [number, number, number, number] => {
  // 1. Filtrado inmediato del NoData (El rectángulo azul desaparece aquí)
  if (isNaN(rawValue)) return [0, 0, 0, 0];

  // 2. Detección y conversión termodinámica (Kelvin a Celsius)
  // Si el valor es mayor a 100, es seguro asumir que el satélite habla en Kelvin
  const celsius = rawValue > 100 ? rawValue - 273.15 : rawValue;

  const minT = 0;  // 0°C (Azul/Frío)
  const maxT = 45; // 45°C (Rojo/Calor Extremo)
  
  // Normalizamos la temperatura a un coeficiente entre 0 y 1
  let pct = (celsius - minT) / (maxT - minT);
  if (pct < 0) pct = 0;
  if (pct > 1) pct = 1;

  // Rampa Térmica Bipolar: Azul (frío) -> Amarillo (templado) -> Rojo (calor extremo)
  let r = 0, g = 0, b = 0;

  if (pct < 0.5) {
    // Transición de Azul a Amarillo
    const subPct = pct * 2; 
    r = Math.floor(255 * subPct);
    g = Math.floor(255 * subPct);
    b = Math.floor(255 * (1 - subPct));
  } else {
    // Transición de Amarillo a Rojo
    const subPct = (pct - 0.5) * 2; 
    r = 255;
    g = Math.floor(255 * (1 - subPct));
    b = 0;
  }

  return [r, g, b, 255];
};