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
    
    // Paso 1: Mostrar la ecuación diferencial
    steps.push({
      title: 'Ecuación Diferencial',
      formula: 'dP/dt = r · P · (1 - P/K)',
      result: `dP/dt = ${r} · P · (1 - P/${K})`,
      explanation: 'Esta es la ecuación diferencial de Verhulst que modela el crecimiento logístico.'
    });

    // Paso 2: Condición inicial
    steps.push({
      title: 'Condición Inicial',
      formula: 'P(0) = P_0',
      substitution: `P(0) = ${P0}`,
      result: `P_0 = ${P0}`,
      explanation: 'Establecemos la población inicial en el tiempo t=0.'
    });

    // Paso 3: Método de solución (Euler)
    steps.push({
      title: 'Método de Euler',
      formula: 'P_(n+1) = P_n + dt · f(t_n, P_n)',
      substitution: `P_(n+1) = P_n + ${dt} · [${r} · P_n · (1 - P_n/${K})]`,
      result: `Δt = ${dt}`,
      explanation: 'Usamos el método de Euler para resolver numéricamente la ecuación diferencial.'
    });

    // Resolver numéricamente
    let currentP = P0 as number;
    let currentT = 0;

    t.push(currentT);
    P.push(currentP);

    while (currentT < (tMax as number)) {
      const dPdt = (r as number) * currentP * (1 - currentP / (K as number));
      currentP = currentP + (dt as number) * dPdt;
      currentT += dt as number;

      t.push(currentT);
      P.push(currentP);
    }

    // Paso 4: Solución analítica (opcional)
    const analyticalP = (t: number) => {
      return (K as number) / (1 + ((K as number) / (P0 as number) - 1) * Math.exp(-(r as number) * t));
    };

    steps.push({
      title: 'Solución Analítica',
      formula: 'P(t) = K / (1 + ((K/P_0) - 1) · e^(-r·t))',
      substitution: `P(t) = ${K} / (1 + ((${K}/${P0}) - 1) · e^(-${r}·t))`,
      result: `P(${tMax}) ≈ ${analyticalP(tMax as number).toFixed(4)}`,
      explanation: 'La solución analítica nos permite comparar con la solución numérica.'
    });

    // Calcular solución analítica para comparación
    const analyticalValues = t.map(time => analyticalP(time));

    return {
      steps,
      data: [
        {
          x: t,
          y: P,
          label: 'Solución Numérica (Euler)'
        },
        {
          x: t,
          y: analyticalValues,
          label: 'Solución Analítica'
        }
      ]
    };
  }
}
