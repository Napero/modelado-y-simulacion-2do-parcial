import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class ParametrizedSolutionExercise extends ExerciseBase {
  getTitle(): string {
    return 'Solución Parametrizada';
  }

  getDescription(): string {
    return 'Curvas paramétricas en el plano: x(t) = f(t), y(t) = g(t). Ejemplo: espirales, curvas de Lissajous, y trayectorias complejas.';
  }

  getInputFields() {
    return [
      { name: 'A', label: 'Amplitud A (para x)', defaultValue: 1, step: 0.1 },
      { name: 'B', label: 'Amplitud B (para y)', defaultValue: 1, step: 0.1 },
      { name: 'omegaX', label: 'ω_x (frecuencia en x)', defaultValue: 2, step: 0.1 },
      { name: 'omegaY', label: 'ω_y (frecuencia en y)', defaultValue: 3, step: 0.1 },
      { name: 'phi', label: 'φ (desfase)', defaultValue: 0, step: 0.1 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 10, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { A, B, omegaX, omegaY, phi, tMax } = params;
    
    const steps: SimulationResult['steps'] = [];
    
    steps.push({
      title: 'Curva de Lissajous',
      formula: 'x(t) = A·sin(ω_x·t)\\ny(t) = B·sin(ω_y·t + φ)',
      substitution: `x(t) = ${A}·sin(${omegaX}·t)\\ny(t) = ${B}·sin(${omegaY}·t + ${phi})`,
      result: 'Parametrización armónica',
      explanation: 'Curva generada por dos oscilaciones sinusoidales con diferentes frecuencias.'
    });

    steps.push({
      title: 'Relación de Frecuencias',
      formula: 'ratio = ω_x / ω_y',
      substitution: `ratio = ${omegaX} / ${omegaY}`,
      result: `ratio = ${((omegaX as number) / (omegaY as number)).toFixed(4)}`,
      explanation: 'Si la relación es racional (m/n), la curva se cierra después de n ciclos en x y m ciclos en y.'
    });

    const gcd = (a: number, b: number): number => {
      a = Math.abs(Math.round(a * 100));
      b = Math.abs(Math.round(b * 100));
      while (b) {
        const temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    };
    
    const wx = Math.round((omegaX as number) * 100);
    const wy = Math.round((omegaY as number) * 100);
    const divisor = gcd(wx, wy);
    const simplifiedX = wx / divisor;
    const simplifiedY = wy / divisor;
    
    steps.push({
      title: 'Forma Simplificada',
      formula: 'ω_x : ω_y',
      result: `${simplifiedX/100} : ${simplifiedY/100}`,
      explanation: 'Relación simplificada de las frecuencias.'
    });

    // Calcular la curva
    const dt = 0.01;
    const t: number[] = [];
    const x: number[] = [];
    const y: number[] = [];
    
    let currentT = 0;
    
    while (currentT <= (tMax as number)) {
      t.push(currentT);
      x.push((A as number) * Math.sin((omegaX as number) * currentT));
      y.push((B as number) * Math.sin((omegaY as number) * currentT + (phi as number)));
      currentT += dt;
    }

    steps.push({
      title: 'Características de la Curva',
      formula: 'Amplitudes y fase',
      result: `A_x = ${A}, A_y = ${B}, φ = ${phi}`,
      explanation: 'Las amplitudes determinan el tamaño y el desfase determina la orientación de la curva.'
    });

    steps.push({
      title: 'Aplicaciones',
      formula: 'Uso práctico',
      result: 'Osciladores acoplados, figuras de Lissajous en osciloscopios, análisis armónico',
      explanation: 'Estas curvas aparecen en física, ingeniería eléctrica y procesamiento de señales.'
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
        }
      ]
    };
  }
}
