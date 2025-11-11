import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class Bifurcation1DExercise extends ExerciseBase {
  getTitle(): string {
    return 'Bifurcación en Sistemas 1D';
  }

  getDescription(): string {
    return 'Análisis de bifurcación para el sistema dx/dt = r + x². Este sistema exhibe una bifurcación silla-nodo en r = 0, donde cambia cualitativamente el comportamiento del sistema.';
  }

  getInputFields() {
    return [
      { name: 'rMin', label: 'r mínimo', defaultValue: -2, step: 0.1 },
      { name: 'rMax', label: 'r máximo', defaultValue: 2, step: 0.1 },
      { name: 'rSteps', label: 'Número de valores de r', defaultValue: 50, step: 1 },
      { name: 'x0', label: 'Condición inicial (x₀)', defaultValue: 0, step: 0.1 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 10, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { rMin, rMax, rSteps, x0, tMax } = params;
    
    const steps: SimulationResult['steps'] = [];
    
    // Paso 1: Ecuación diferencial
    steps.push({
      title: 'Ecuación Diferencial',
      formula: 'dx/dt = r + x²',
      result: 'Sistema con parámetro r',
      explanation: 'Estudiamos cómo el comportamiento del sistema cambia con el parámetro r.'
    });

    // Paso 2: Encontrar puntos fijos
    steps.push({
      title: 'Puntos Fijos',
      formula: 'dx/dt = 0  ⟹  r + x² = 0',
      substitution: 'x² = -r',
      result: 'x* = ±√(-r) si r < 0, no hay puntos fijos si r > 0',
      explanation: 'Los puntos fijos existen solo cuando r < 0.'
    });

    // Paso 3: Análisis de estabilidad
    steps.push({
      title: 'Análisis de Estabilidad',
      formula: 'f\'(x*) = d/dx(r + x²)|_x* = 2x*',
      result: 'x* = √(-r) es inestable (f\' > 0), x* = -√(-r) es estable (f\' < 0) para r < 0',
      explanation: 'La estabilidad se determina con la derivada en el punto fijo.'
    });

    // Paso 4: Bifurcación
    steps.push({
      title: 'Punto de Bifurcación',
      formula: 'r_c = 0',
      result: 'Bifurcación silla-nodo en r = 0',
      explanation: 'En r = 0, dos puntos fijos (uno estable y uno inestable) se encuentran y desaparecen.'
    });

    // Calcular diagrama de bifurcación
    const rValues: number[] = [];
    const xStable: number[] = [];
    const xUnstable: number[] = [];
    
    const dr = ((rMax as number) - (rMin as number)) / (rSteps as number);
    
    for (let i = 0; i <= (rSteps as number); i++) {
      const r = (rMin as number) + i * dr;
      rValues.push(r);
      
      if (r < 0) {
        xStable.push(-Math.sqrt(-r));
        xUnstable.push(Math.sqrt(-r));
      } else {
        xStable.push(NaN);
        xUnstable.push(NaN);
      }
    }

    // Calcular trayectorias para diferentes valores de r
    const trajectories: { x: number[], y: number[], label: string }[] = [];
    const selectedRValues = [-1, 0, 1];
    
    selectedRValues.forEach(r => {
      const t: number[] = [];
      const x: number[] = [];
      const dt = 0.01;
      let currentX = x0 as number;
      let currentT = 0;
      
      // Integrar usando Euler
      while (currentT <= (tMax as number) && Math.abs(currentX) < 100) {
        t.push(currentT);
        x.push(currentX);
        
        const dxdt = r + currentX * currentX;
        currentX = currentX + dt * dxdt;
        currentT += dt;
      }
      
      trajectories.push({
        x: t,
        y: x,
        label: `r = ${r}, x₀ = ${x0}`
      });
    });

    return {
      steps,
      data: [
        {
          x: rValues,
          y: xStable,
          label: 'Puntos fijos estables'
        },
        {
          x: rValues,
          y: xUnstable,
          label: 'Puntos fijos inestables'
        }
      ],
      additionalInfo: {
        trajectories
      }
    };
  }
}
