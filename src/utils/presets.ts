// Presets de parámetros para diferentes ejercicios
// Cada ejercicio puede tener múltiples ejemplos que muestren diferentes comportamientos

export interface Preset {
  name: string;
  description: string;
  params: Record<string, number>;
}

export const presets: Record<string, Preset[]> = {
  // Verhulst (Crecimiento Logístico)
  'verhulst': [
    {
      name: 'Crecimiento Normal',
      description: 'Población crece hasta capacidad de carga',
      params: { P0: 10, r: 0.5, K: 100, tMax: 20, dt: 0.1 }
    },
    {
      name: 'Sobrepoblación Inicial',
      description: 'Población inicial mayor que K, decrece',
      params: { P0: 150, r: 0.5, K: 100, tMax: 20, dt: 0.1 }
    },
    {
      name: 'Crecimiento Rápido',
      description: 'Tasa de crecimiento alta',
      params: { P0: 5, r: 1.2, K: 100, tMax: 10, dt: 0.1 }
    }
  ],

  // Enfriamiento de Newton
  'newton-cooling': [
    {
      name: 'Café Caliente',
      description: 'Enfriamiento típico de una bebida',
      params: { T0: 100, Tamb: 20, k: 0.1, tMax: 50, dt: 0.5 }
    },
    {
      name: 'Enfriamiento Rápido',
      description: 'Alta tasa de transferencia de calor',
      params: { T0: 100, Tamb: 20, k: 0.3, tMax: 30, dt: 0.5 }
    },
    {
      name: 'Calentamiento',
      description: 'Objeto frío en ambiente cálido',
      params: { T0: 0, Tamb: 25, k: 0.15, tMax: 40, dt: 0.5 }
    }
  ],

  // Bifurcación 1D
  'bifurcation-1d': [
    {
      name: 'Silla-Nodo: Pre-bifurcación (r < 0)',
      description: 'Existen dos puntos fijos (uno estable, uno inestable)',
      params: { rMin: -2, rMax: 2, rSteps: 50, x0: 0, tMax: 10 }
    },
    {
      name: 'Silla-Nodo: Punto Crítico (r = 0)',
      description: 'En el punto de bifurcación silla-nodo',
      params: { rMin: -1, rMax: 1, rSteps: 40, x0: 0.5, tMax: 10 }
    },
    {
      name: 'Silla-Nodo: Post-bifurcación (r > 0)',
      description: 'No hay puntos fijos, el sistema diverge',
      params: { rMin: -0.5, rMax: 2.5, rSteps: 50, x0: 0, tMax: 5 }
    },
    {
      name: 'Rango Amplio',
      description: 'Vista completa de la bifurcación',
      params: { rMin: -3, rMax: 3, rSteps: 100, x0: 0, tMax: 15 }
    },
    {
      name: 'Zoom en Bifurcación',
      description: 'Detalles cerca de r = 0',
      params: { rMin: -0.5, rMax: 0.5, rSteps: 50, x0: 0.1, tMax: 20 }
    }
  ],

  // Sistema Lineal 2D
  'linear-2d': [
    {
      name: 'Nodo Estable (λ₁,λ₂ < 0, reales)',
      description: 'Ambos autovalores negativos reales, converge',
      params: { a: -1, b: 0, c: 0, d: -2, x0: 2, y0: 1, tMax: 10 }
    },
    {
      name: 'Nodo Inestable (λ₁,λ₂ > 0, reales)',
      description: 'Ambos autovalores positivos reales, diverge',
      params: { a: 1, b: 0, c: 0, d: 2, x0: 0.5, y0: 0.5, tMax: 5 }
    },
    {
      name: 'Punto Silla (λ₁ > 0, λ₂ < 0)',
      description: 'Autovalores con signos diferentes',
      params: { a: 1, b: 0, c: 0, d: -1, x0: 1, y0: 1, tMax: 5 }
    },
    {
      name: 'Espiral Estable (λ = α±iβ, α < 0)',
      description: 'Autovalores complejos, parte real negativa',
      params: { a: -0.5, b: 2, c: -2, d: -0.5, x0: 2, y0: 0, tMax: 15 }
    },
    {
      name: 'Espiral Inestable (λ = α±iβ, α > 0)',
      description: 'Autovalores complejos, parte real positiva',
      params: { a: 0.2, b: 2, c: -2, d: 0.2, x0: 0.5, y0: 0, tMax: 15 }
    },
    {
      name: 'Centro (λ = ±iω)',
      description: 'Autovalores puramente imaginarios, órbitas cerradas',
      params: { a: 0, b: 1, c: -1, d: 0, x0: 1, y0: 0, tMax: 20 }
    },
    {
      name: 'Nodo Estable Lento',
      description: 'Convergencia lenta al equilibrio',
      params: { a: -0.2, b: 0, c: 0, d: -0.3, x0: 3, y0: 2, tMax: 30 }
    },
    {
      name: 'Espiral Rápida',
      description: 'Oscilaciones rápidas convergiendo',
      params: { a: -1, b: 5, c: -5, d: -1, x0: 1, y0: 1, tMax: 10 }
    },
    {
      name: 'Silla con Variedades Pronunciadas',
      description: 'Punto silla con ejes bien definidos',
      params: { a: 2, b: 0, c: 0, d: -1, x0: 0.5, y0: 1, tMax: 3 }
    },
    {
      name: 'Nodo Degenerado (λ repetido)',
      description: 'Autovalor repetido, comportamiento especial',
      params: { a: -1, b: 1, c: 0, d: -1, x0: 1, y0: 1, tMax: 10 }
    }
  ],

  // Romeo y Julieta
  'romeo-juliet': [
    {
      name: 'Amor Trágico (Cautelosos)',
      description: 'Ambos son cautelosos, amor decae - Nodo estable',
      params: { a: -1, b: 1, c: -2, d: 0.5, R0: 1, J0: 0, tMax: 20 }
    },
    {
      name: 'Amor Explosivo',
      description: 'Se animan mutuamente, amor crece sin límite - Nodo inestable',
      params: { a: 0.5, b: 1, c: 1, d: 0.5, R0: 1, J0: 1, tMax: 10 }
    },
    {
      name: 'Ciclos de Amor-Odio (Centro)',
      description: 'Relación oscilante periódica',
      params: { a: 0, b: 1, c: -1, d: 0, R0: 1, J0: 0, tMax: 25 }
    },
    {
      name: 'Romeo Entusiasta, Julieta Difícil',
      description: 'Romeo se anima solo, Julieta lo rechaza',
      params: { a: 1, b: 2, c: -1, d: -0.5, R0: 0.5, J0: 0.5, tMax: 15 }
    },
    {
      name: 'Espiral Romántica Decreciente',
      description: 'Oscilaciones que convergen a indiferencia',
      params: { a: -0.3, b: 2, c: -2, d: -0.3, R0: 2, J0: 0.5, tMax: 30 }
    },
    {
      name: 'Espiral Romántica Creciente',
      description: 'Oscilaciones que divergen',
      params: { a: 0.1, b: 1.5, c: -1.5, d: 0.1, R0: 0.3, J0: 0.3, tMax: 40 }
    },
    {
      name: 'Relación Inestable (Silla)',
      description: 'Uno atrae, otro repele - comportamiento caótico',
      params: { a: 1, b: 1, c: -1, d: -1, R0: 0.5, J0: 1, tMax: 10 }
    }
  ],

  // Lotka-Volterra
  'lotka-volterra': [
    {
      name: 'Ciclos Clásicos',
      description: 'Oscilaciones depredador-presa típicas',
      params: { alpha: 1.5, beta: 1.0, delta: 0.75, gamma: 1.0, x0: 2, y0: 1, tMax: 30 }
    },
    {
      name: 'Depredadores Eficientes',
      description: 'Alta eficiencia de conversión',
      params: { alpha: 1.0, beta: 1.0, delta: 1.5, gamma: 0.5, x0: 1.5, y0: 1.5, tMax: 40 }
    },
    {
      name: 'Presas de Rápida Reproducción',
      description: 'Presas se reproducen muy rápido',
      params: { alpha: 2.5, beta: 1.0, delta: 0.5, gamma: 1.0, x0: 1, y0: 1, tMax: 25 }
    },
    {
      name: 'Cerca del Equilibrio',
      description: 'Condiciones iniciales cercanas al punto fijo',
      params: { alpha: 1.0, beta: 1.0, delta: 1.0, gamma: 1.0, x0: 1.05, y0: 1.05, tMax: 35 }
    },
    {
      name: 'Ciclos Grandes',
      description: 'Oscilaciones de gran amplitud',
      params: { alpha: 2.0, beta: 0.5, delta: 0.5, gamma: 1.5, x0: 4, y0: 0.5, tMax: 50 }
    },
    {
      name: 'Depredación Intensa',
      description: 'Alta tasa de depredación',
      params: { alpha: 1.2, beta: 2.0, delta: 1.0, gamma: 0.8, x0: 1.5, y0: 1, tMax: 30 }
    },
    {
      name: 'Ecosistema Balanceado',
      description: 'Parámetros equilibrados, ciclos suaves',
      params: { alpha: 1.0, beta: 1.0, delta: 1.0, gamma: 1.0, x0: 2, y0: 0.5, tMax: 40 }
    }
  ],

  // Conservación de Energía
  'energy-conservation': [
    {
      name: 'Oscilación Pequeña',
      description: 'Péndulo con poca energía, oscila',
      params: { x0: 0.5, y0: 0, tMax: 20 }
    },
    {
      name: 'Oscilación Grande',
      description: 'Péndulo con más energía, oscila ampliamente',
      params: { x0: 2.5, y0: 0, tMax: 20 }
    },
    {
      name: 'Rotación',
      description: 'Suficiente energía para girar completamente',
      params: { x0: 0, y0: 3, tMax: 20 }
    },
    {
      name: 'Separatriz',
      description: 'Energía crítica entre oscilación y rotación',
      params: { x0: 3.14, y0: 0, tMax: 30 }
    }
  ],

  // Bifurcación de Hopf
  'hopf-bifurcation': [
    {
      name: 'Pre-bifurcación (μ < 0): Foco Estable',
      description: 'Punto fijo estable, no hay ciclo límite',
      params: { mu: -0.5, omega: 1, r0: 0.5, theta0: 0, tMax: 50 }
    },
    {
      name: 'Punto Crítico (μ = 0): Transición',
      description: 'En el punto de bifurcación de Hopf',
      params: { mu: 0, omega: 1, r0: 0.5, theta0: 0, tMax: 50 }
    },
    {
      name: 'Post-bifurcación (μ > 0): Ciclo Límite',
      description: 'Ciclo límite estable aparece',
      params: { mu: 0.5, omega: 1, r0: 0.5, theta0: 0, tMax: 50 }
    },
    {
      name: 'Bifurcación Fuerte (μ >> 0)',
      description: 'Ciclo límite grande y estable',
      params: { mu: 1.5, omega: 1, r0: 0.2, theta0: 0, tMax: 30 }
    },
    {
      name: 'Pre-bifurcación Lejos',
      description: 'Muy estable, convergencia rápida',
      params: { mu: -1.5, omega: 1, r0: 1.5, theta0: 0, tMax: 30 }
    },
    {
      name: 'Frecuencia Alta',
      description: 'Oscilaciones rápidas en ciclo límite',
      params: { mu: 0.3, omega: 3, r0: 0.8, theta0: 0, tMax: 40 }
    },
    {
      name: 'Condición Inicial Grande',
      description: 'Inicio lejos del equilibrio',
      params: { mu: 0.5, omega: 1, r0: 2, theta0: 1.5, tMax: 50 }
    }
  ]
};

export function getPresets(exerciseId: string): Preset[] {
  return presets[exerciseId] || [];
}
