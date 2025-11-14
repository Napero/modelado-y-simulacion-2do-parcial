import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class VerhulstExercise extends ExerciseBase {
  getTitle(): string {
    return 'Modelo de Verhulst (Crecimiento Logístico)';
  }

  getDescription(): string {
    return 'El modelo de Verhulst describe el crecimiento de una población con recursos limitados. La ecuación diferencial es: dP/dt = r·P·(1 - P/K), donde P es la población, r es la tasa de crecimiento y K es la capacidad de carga.';
  }

  getInputFields() {
    return [
      { name: 'P0', label: 'Población inicial (P₀)', defaultValue: 10 },
      { name: 'r', label: 'Tasa de crecimiento (r)', defaultValue: 0.5, step: 0.01 },
      { name: 'K', label: 'Capacidad de carga (K)', defaultValue: 100 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 20, step: 1 },
      { name: 'dt', label: 'Paso de tiempo (Δt)', defaultValue: 0.1, step: 0.01 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { P0, r, K, tMax, dt } = params;
    
    // Resolver usando el método de Euler
    const steps: SimulationResult['steps'] = [];
    const t: number[] = [];
    const P: number[] = [];
    
    // Paso 1: Definición del Sistema
    steps.push({
      title: '1. Definición del Sistema - Modelo de Verhulst',
      formula: 'dP/dt = r·P·(1 - P/K)',
      substitution: `dP/dt = ${r}·P·(1 - P/${K})`,
      result: `**Parámetros:** r = ${r} (tasa de crecimiento), K = ${K} (capacidad de carga)`,
      explanation: `El modelo logístico de Verhulst describe el crecimiento poblacional con recursos limitados. El término r·P representa el crecimiento exponencial, mientras que el factor (1 - P/K) introduce la limitación de recursos: cuando P se acerca a K, el crecimiento se frena. Este modelo es fundamental en ecología y dinámica poblacional.`
    });

    // Paso 2: Encontrar puntos de equilibrio
    steps.push({
      title: '2. Puntos de Equilibrio',
      formula: 'dP/dt = 0  ⟹  r·P·(1 - P/K) = 0',
      substitution: `${r}·P·(1 - P/${K}) = 0  ⟹  P = 0  o  P = ${K}`,
      result: `**Equilibrios:** P₁* = 0 (trivial), P₂* = ${K} (no trivial)`,
      explanation: `Los equilibrios ocurren cuando la derivada es cero. P* = 0 representa la extinción (sin individuos, no hay crecimiento). P* = K es la capacidad de carga, donde la población se estabiliza porque los recursos son exactamente suficientes para mantenerla sin crecer ni decrecer.`
    });

    // Paso 3: Análisis de estabilidad lineal
    const K_num = K as number;
    const r_num = r as number;
    const df_dP_at_0 = r_num;
    const df_dP_at_K = -r_num;
    
    steps.push({
      title: '3. Análisis de Estabilidad Lineal',
      formula: 'f(P) = r·P·(1 - P/K)  ⟹  f\'(P) = r·(1 - 2P/K)',
      substitution: `f\'(0) = ${r}·(1 - 0) = ${df_dP_at_0}
f\'(${K}) = ${r}·(1 - 2·${K}/${K}) = ${r}·(-1) = ${df_dP_at_K}`,
      result: `**P* = 0:** f\'(0) = ${df_dP_at_0} > 0 → INESTABLE (repulsor)
**P* = ${K}:** f\'(${K}) = ${df_dP_at_K} < 0 → ESTABLE (atractor)`,
      explanation: `Criterio de estabilidad lineal en 1D: si f\'(P*) < 0, el equilibrio es estable (las perturbaciones decrecen); si f\'(P*) > 0, es inestable (las perturbaciones crecen). El equilibrio P = 0 es inestable: cualquier población pequeña introducida crecerá. El equilibrio P = K es estable: poblaciones cercanas a K convergen hacia este valor.`
    });

    // Paso 4: Solución analítica
    const analyticalP = (t: number) => {
      return K_num / (1 + (K_num / (P0 as number) - 1) * Math.exp(-r_num * t));
    };
    
    const ratio = (K_num / (P0 as number) - 1).toFixed(4);
    steps.push({
      title: '4. Solución Analítica',
      formula: 'P(t) = K / [1 + ((K/P₀) - 1)·e^(-r·t)]',
      substitution: `P(t) = ${K} / [1 + ((${K}/${P0}) - 1)·e^(-${r}·t)]
P(t) = ${K} / [1 + ${ratio}·e^(-${r}·t)]`,
      result: `**P(0) = ${P0}** (verifica condición inicial)
**lim(t→∞) P(t) = ${K}** (converge al equilibrio estable)`,
      explanation: `La ecuación de Verhulst es separable y se puede resolver analíticamente. Esta solución muestra que: (1) la población tiende asintóticamente a K independientemente de P₀ > 0, (2) el crecimiento es rápido inicialmente y se desacelera cerca de K, formando la característica curva sigmoidea (forma de S).`
    });

    // Paso 5: Interpretación biológica
    const halfK = K_num / 2;
    steps.push({
      title: '5. Interpretación Biológica',
      formula: 'Fases del crecimiento logístico',
      substitution: `P < ${halfK}: crecimiento casi exponencial (recursos abundantes)
P ≈ ${halfK}: máxima tasa de crecimiento (punto de inflexión)
P > ${halfK}: crecimiento se desacelera (recursos escasos)`,
      result: `**Capacidad de carga K = ${K}:** población máxima sostenible
**Tasa intrínseca r = ${r}:** velocidad del crecimiento sin limitaciones`,
      explanation: `En poblaciones reales, K representa el límite impuesto por recursos (alimento, espacio, etc.). La tasa r refleja la reproducción sin competencia. Cuando P ≪ K, hay crecimiento casi exponencial. El punto P = K/2 es crucial: ahí la tasa de crecimiento absoluta dP/dt es máxima, pero la tasa relativa (1/P)·dP/dt ya está disminuyendo.`
    });

    // Resolver numéricamente
    let currentP = P0 as number;
    let currentT = 0;

    t.push(currentT);
    P.push(currentP);

    while (currentT < (tMax as number)) {
      const dPdt = r_num * currentP * (1 - currentP / K_num);
      currentP = currentP + (dt as number) * dPdt;
      currentT += dt as number;

      t.push(currentT);
      P.push(currentP);
    }

    // Paso 6: Comparación Numérica vs Analítica
    const P_numeric_final = P[P.length - 1];
    const P_analytic_final = analyticalP(tMax as number);
    const error = Math.abs(P_numeric_final - P_analytic_final);
    const errorPercent = (error / P_analytic_final * 100).toFixed(4);
    
    steps.push({
      title: '6. Comparación: Solución Numérica vs Analítica',
      formula: 'Error = |P_numérica - P_analítica|',
      substitution: `P_numérica(${tMax}) = ${P_numeric_final.toFixed(6)}
P_analítica(${tMax}) = ${P_analytic_final.toFixed(6)}
Error = ${error.toFixed(6)}`,
      result: `**Error relativo = ${errorPercent}%**
**Convergencia:** ambas soluciones tienden a K = ${K}`,
      explanation: `El método de Euler con paso Δt = ${dt} proporciona una buena aproximación de la solución analítica. El pequeño error se debe a la discretización del tiempo. Para mayor precisión, se podría usar un paso temporal menor o métodos de orden superior (Runge-Kutta). Ambas soluciones confirman que la población converge a la capacidad de carga K.`
    });

    // Calcular solución analítica para comparación
    const analyticalValues = t.map(time => analyticalP(time));

    return {
      steps,
      data: [
        {
          title: 'Crecimiento de la Población',
          type: 'line',
          datasets: [
            {
              label: 'Solución Numérica (Euler)',
              data: t.map((ti, i) => ({ x: ti, y: P[i] })),
              borderColor: '#3498db',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true
            },
            {
              label: 'Solución Analítica',
              data: t.map((ti, i) => ({ x: ti, y: analyticalValues[i] })),
              borderColor: '#e74c3c',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              showLine: true
            },
            {
              label: `Capacidad de Carga K = ${K}`,
              data: [{ x: 0, y: K as number }, { x: tMax as number, y: K as number }],
              borderColor: '#2ecc71',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [10, 5],
              pointRadius: 0,
              showLine: true
            }
          ],
          xLabel: 'Tiempo',
          yLabel: 'Población P(t)'
        }
      ]
    };
  }
}
