import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class CombatModelExercise extends ExerciseBase {
  getTitle(): string {
    return 'Modelo de Combate de Lanchester';
  }

  getDescription(): string {
    return 'Modela el combate entre dos ejércitos. dA/dt = -βB (pérdidas del ejército A), dB/dt = -αA (pérdidas del ejército B). α, β son las tasas de efectividad de combate.';
  }

  getInputFields() {
    return [
      { name: 'A0', label: 'Tropas iniciales A', defaultValue: 100, step: 1 },
      { name: 'B0', label: 'Tropas iniciales B', defaultValue: 80, step: 1 },
      { name: 'alpha', label: 'α (efectividad de A)', defaultValue: 0.05, step: 0.01 },
      { name: 'beta', label: 'β (efectividad de B)', defaultValue: 0.04, step: 0.01 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 50, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { A0, B0, alpha, beta, tMax } = params;
    
    const steps: SimulationResult['steps'] = [];
    
    steps.push({
      title: 'Ecuaciones de Lanchester (Ley Cuadrática)',
      formula: 'dA/dt = -βB\\ndB/dt = -αA',
      substitution: `dA/dt = -${beta}B\\ndB/dt = -${alpha}A`,
      result: 'Modelo de combate directo',
      explanation: 'Cada unidad de un ejército puede atacar a cualquier unidad del otro (combate moderno).'
    });

    steps.push({
      title: 'Condiciones Iniciales',
      formula: 'A(0) = A_0, B(0) = B_0',
      substitution: `A(0) = ${A0}, B(0) = ${B0}`,
      result: 'Fuerzas iniciales de ambos bandos',
      explanation: 'Número de tropas al inicio del combate.'
    });

    // Solución analítica
    const C = (alpha as number) * (A0 as number) ** 2 - (beta as number) * (B0 as number) ** 2;
    
    steps.push({
      title: 'Ley de Lanchester (Invariante)',
      formula: 'αA² - βB² = constante',
      substitution: `${alpha}A² - ${beta}B² = ${alpha}(${A0})² - ${beta}(${B0})²`,
      result: `C = ${C.toFixed(2)}`,
      explanation: 'Esta cantidad se conserva durante el combate.'
    });

    let winnerForce: number;
    
    if (C > 0) {
      winnerForce = Math.sqrt(C / (alpha as number));
    } else if (C < 0) {
      winnerForce = Math.sqrt(-C / (beta as number));
    } else {
      winnerForce = 0;
    }
    
    steps.push({
      title: 'Predicción del Resultado',
      formula: 'Basado en C = αA₀² - βB₀²',
      result: C > 0 ? `Gana A con ${winnerForce.toFixed(1)} tropas restantes` :
              C < 0 ? `Gana B con ${winnerForce.toFixed(1)} tropas restantes` :
              'Empate: ambos bandos se aniquilan',
      explanation: 'El resultado se puede predecir antes de la batalla.'
    });

    // Resolver numéricamente
    const dt = 0.1;
    const t: number[] = [];
    const A: number[] = [];
    const B: number[] = [];
    
    let currentA = A0 as number;
    let currentB = B0 as number;
    let currentT = 0;
    
    while (currentT <= (tMax as number) && currentA > 0.1 && currentB > 0.1) {
      t.push(currentT);
      A.push(currentA);
      B.push(currentB);
      
      const dAdt = -(beta as number) * currentB;
      const dBdt = -(alpha as number) * currentA;
      
      currentA += dt * dAdt;
      currentB += dt * dBdt;
      currentT += dt;
      
      if (currentA < 0) currentA = 0;
      if (currentB < 0) currentB = 0;
    }

    const battleEnd = t[t.length - 1];
    
    steps.push({
      title: 'Duración de la Batalla',
      formula: 'Tiempo hasta que un bando llega a 0',
      result: `t_final ≈ ${battleEnd.toFixed(1)} unidades de tiempo`,
      explanation: `Batalla termina cuando ${currentA < 0.1 ? 'A' : 'B'} es eliminado.`
    });

    return {
      steps,
      data: [
        {
          x: t,
          y: A,
          label: 'Ejército A'
        },
        {
          x: t,
          y: B,
          label: 'Ejército B'
        }
      ]
    };
  }
}
