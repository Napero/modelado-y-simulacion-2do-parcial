import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class HopfBifurcationExercise extends ExerciseBase {
  getTitle(): string {
    return 'Bifurcación de Hopf';
  }

  getDescription(): string {
    return 'Sistema que exhibe una bifurcación de Hopf: un punto fijo estable se vuelve inestable y da lugar a un ciclo límite. Forma normal: dr/dt = μr + r³, dθ/dt = ω + br²';
  }

  getInputFields() {
    return [
      { name: 'mu', label: 'μ (parámetro de bifurcación)', defaultValue: -0.5, step: 0.1 },
      { name: 'omega', label: 'ω (frecuencia angular)', defaultValue: 1, step: 0.1 },
      { name: 'r0', label: 'Radio inicial (r₀)', defaultValue: 0.5, step: 0.1 },
      { name: 'theta0', label: 'Ángulo inicial (θ₀)', defaultValue: 0, step: 0.1 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 50, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { mu, omega, r0, theta0, tMax } = params;
    
    const steps: SimulationResult['steps'] = [];
    
    steps.push({
      title: 'Sistema en Coordenadas Polares',
      formula: 'dr/dt = μr - r³\\ndθ/dt = ω',
      substitution: `dr/dt = ${mu}r - r³\\ndθ/dt = ${omega}`,
      result: 'Forma normal de bifurcación de Hopf supercrítica',
      explanation: 'En coordenadas polares, el sistema se separa en ecuaciones para radio y ángulo.'
    });

    const muNum = mu as number;
    const rEq = muNum > 0 ? Math.sqrt(muNum) : 0;
    
    steps.push({
      title: 'Radio de Equilibrio',
      formula: 'r* = √μ para μ > 0, r* = 0 para μ ≤ 0',
      result: `r* = ${rEq.toFixed(4)}`,
      explanation: muNum > 0 ? 'Bifurcación ocurrida: existe ciclo límite estable' : 'Pre-bifurcación: solo punto fijo estable en el origen'
    });

    // Resolver
    const dt = 0.01;
    const t: number[] = [];
    const r: number[] = [];
    const theta: number[] = [];
    const x: number[] = [];
    const y: number[] = [];
    
    let currentR = r0 as number;
    let currentTheta = theta0 as number;
    let currentT = 0;
    
    while (currentT <= (tMax as number)) {
      t.push(currentT);
      r.push(currentR);
      theta.push(currentTheta);
      x.push(currentR * Math.cos(currentTheta));
      y.push(currentR * Math.sin(currentTheta));
      
      const drdt = (mu as number) * currentR - currentR * currentR * currentR;
      const dthetadt = omega as number;
      
      currentR += dt * drdt;
      currentTheta += dt * dthetadt;
      currentT += dt;
      
      if (currentR < 0) currentR = 0;
    }

    steps.push({
      title: 'Comportamiento Asintótico',
      formula: 't → ∞',
      result: `r(∞) → ${rEq.toFixed(4)}`,
      explanation: muNum > 0 ? 'El radio converge al ciclo límite' : 'El radio converge a cero'
    });

    return {
      steps,
      data: [
        {
          x: t,
          y: x,
          label: 'x(t)'
        },
        {
          x: t,
          y: y,
          label: 'y(t)'
        },
        {
          x: t,
          y: r,
          label: 'r(t)'
        }
      ]
    };
  }
}
