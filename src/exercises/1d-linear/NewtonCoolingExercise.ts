import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class NewtonCoolingExercise extends ExerciseBase {
  getTitle(): string {
    return 'Ley de Enfriamiento de Newton';
  }

  getDescription(): string {
    return 'La ley de enfriamiento de Newton establece que la tasa de cambio de temperatura de un objeto es proporcional a la diferencia entre su temperatura y la temperatura ambiente. Ecuación: dT/dt = -k·(T - T_amb)';
  }

  getInputFields() {
    return [
      { name: 'T0', label: 'Temperatura inicial (T₀) °C', defaultValue: 100 },
      { name: 'Tamb', label: 'Temperatura ambiente (T_amb) °C', defaultValue: 20 },
      { name: 'k', label: 'Constante de enfriamiento (k)', defaultValue: 0.1, step: 0.01 },
      { name: 'tMax', label: 'Tiempo máximo (minutos)', defaultValue: 50, step: 1 },
      { name: 'dt', label: 'Paso de tiempo (Δt)', defaultValue: 0.5, step: 0.1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { T0, Tamb, k, tMax, dt } = params;
    
    const steps: SimulationResult['steps'] = [];
    const t: number[] = [];
    const T: number[] = [];
    
    // Paso 1: Ecuación diferencial
    steps.push({
      title: 'Ecuación Diferencial',
      formula: 'dT/dt = -k · (T - T_amb)',
      result: `dT/dt = -${k} · (T - ${Tamb})`,
      explanation: 'Ley de enfriamiento de Newton: la tasa de cambio de temperatura es proporcional a la diferencia con la temperatura ambiente.'
    });

    // Paso 2: Condición inicial
    steps.push({
      title: 'Condición Inicial',
      formula: 'T(0) = T_0',
      substitution: `T(0) = ${T0}`,
      result: `T_0 = ${T0}°C`,
      explanation: 'La temperatura inicial del objeto en t=0.'
    });

    // Paso 3: Solución analítica
    const diff = (T0 as number) - (Tamb as number);
    steps.push({
      title: 'Solución Analítica',
      formula: 'T(t) = T_amb + (T_0 - T_amb) · e^(-k·t)',
      substitution: `T(t) = ${Tamb} + (${T0} - ${Tamb}) · e^(-${k}·t)`,
      result: `T(t) = ${Tamb} + ${diff} · e^(-${k}·t)`,
      explanation: 'Solución de la ecuación diferencial separando variables e integrando.'
    });

    // Resolver analíticamente
    let currentT = 0;
    
    const analyticalT = (time: number) => {
      return (Tamb as number) + ((T0 as number) - (Tamb as number)) * Math.exp(-(k as number) * time);
    };

    while (currentT <= (tMax as number)) {
      t.push(currentT);
      T.push(analyticalT(currentT));
      currentT += dt as number;
    }

    // Paso 4: Temperatura en tiempo específico
    const tHalf = Math.log(2) / (k as number);
    const THalf = analyticalT(tHalf);
    
    steps.push({
      title: 'Tiempo de Medio Enfriamiento',
      formula: 't_1/2 = ln(2) / k',
      substitution: `t_1/2 = ln(2) / ${k}`,
      result: `t_1/2 ≈ ${tHalf.toFixed(2)} minutos, T(t_1/2) ≈ ${THalf.toFixed(2)}°C`,
      explanation: 'Tiempo en el que la diferencia de temperatura con el ambiente se reduce a la mitad.'
    });

    // Paso 5: Temperatura final
    steps.push({
      title: 'Temperatura Final',
      formula: `T(${tMax})`,
      substitution: `T(${tMax}) = ${Tamb} + ${diff} · e^(-${k}·${tMax})`,
      result: `T(${tMax}) ≈ ${T[T.length - 1].toFixed(2)}°C`,
      explanation: `La temperatura del objeto después de ${tMax} minutos.`
    });

    return {
      steps,
      data: [
        {
          x: t,
          y: T,
          label: 'Temperatura T(t)'
        },
        {
          x: t,
          y: Array(t.length).fill(Tamb as number),
          label: 'Temperatura Ambiente'
        }
      ]
    };
  }
}
