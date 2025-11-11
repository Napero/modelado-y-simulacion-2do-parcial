import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class Linear2DExercise extends ExerciseBase {
  getTitle(): string {
    return 'Sistema Lineal 2D: {x\'=ax+by, y\'=cx+dy}';
  }

  getDescription(): string {
    return 'Análisis de un sistema lineal bidimensional de la forma dx/dt = ax + by, dy/dt = cx + dy. Estudiamos los puntos fijos, autovalores y el retrato de fase.';
  }

  getInputFields() {
    return [
      { name: 'a', label: 'Coeficiente a', defaultValue: -1, step: 0.1 },
      { name: 'b', label: 'Coeficiente b', defaultValue: 1, step: 0.1 },
      { name: 'c', label: 'Coeficiente c', defaultValue: -1, step: 0.1 },
      { name: 'd', label: 'Coeficiente d', defaultValue: -1, step: 0.1 },
      { name: 'x0', label: 'x inicial (x₀)', defaultValue: 2, step: 0.1 },
      { name: 'y0', label: 'y inicial (y₀)', defaultValue: 1, step: 0.1 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 10, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { a, b, c, d, x0, y0, tMax } = params;
    
    const steps: SimulationResult['steps'] = [];
    
    // Paso 1: Sistema de ecuaciones
    steps.push({
      title: 'Sistema de Ecuaciones',
      formula: 'dx/dt = ax + by\\ndy/dt = cx + dy',
      substitution: `dx/dt = ${a}x + ${b}y\\ndy/dt = ${c}x + ${d}y`,
      result: 'Sistema lineal 2×2',
      explanation: 'Sistema lineal de dos ecuaciones diferenciales acopladas.'
    });

    // Paso 2: Matriz del sistema
    steps.push({
      title: 'Matriz del Sistema',
      formula: 'A = [[a, b], [c, d]]',
      substitution: `A = [[${a}, ${b}], [${c}, ${d}]]`,
      result: `Matriz de coeficientes definida`,
      explanation: 'Representamos el sistema en forma matricial.'
    });

    // Paso 3: Calcular autovalores
    const trace = (a as number) + (d as number);
    const det = (a as number) * (d as number) - (b as number) * (c as number);
    const discriminant = trace * trace - 4 * det;
    
    let lambda1: number, lambda2: number;
    let eigenvaluesStr: string;
    
    if (discriminant >= 0) {
      lambda1 = (trace + Math.sqrt(discriminant)) / 2;
      lambda2 = (trace - Math.sqrt(discriminant)) / 2;
      eigenvaluesStr = `λ₁ = ${lambda1.toFixed(4)}, λ₂ = ${lambda2.toFixed(4)}`;
    } else {
      const realPart = trace / 2;
      const imagPart = Math.sqrt(-discriminant) / 2;
      eigenvaluesStr = `λ = ${realPart.toFixed(4)} ± ${imagPart.toFixed(4)}i`;
      lambda1 = realPart;
      lambda2 = realPart;
    }
    
    steps.push({
      title: 'Autovalores',
      formula: 'λ² - tr(A)·λ + det(A) = 0',
      substitution: `λ² - ${trace}·λ + ${det} = 0`,
      result: eigenvaluesStr,
      explanation: 'Los autovalores determinan el comportamiento del sistema.'
    });

    // Paso 4: Clasificar el punto fijo
    let classification: string;
    if (discriminant > 0) {
      if (lambda1 > 0 && lambda2 > 0) {
        classification = 'Nodo inestable (repulsor)';
      } else if (lambda1 < 0 && lambda2 < 0) {
        classification = 'Nodo estable (atractor)';
      } else {
        classification = 'Punto silla (inestable)';
      }
    } else if (discriminant < 0) {
      if (lambda1 > 0) {
        classification = 'Espiral inestable';
      } else if (lambda1 < 0) {
        classification = 'Espiral estable';
      } else {
        classification = 'Centro (órbitas cerradas)';
      }
    } else {
      classification = 'Nodo degenerado';
    }
    
    steps.push({
      title: 'Clasificación del Punto Fijo',
      formula: 'Basado en tr(A) y det(A)',
      result: classification,
      explanation: `Traza = ${trace.toFixed(4)}, Determinante = ${det.toFixed(4)}, Discriminante = ${discriminant.toFixed(4)}`
    });

    // Resolver numéricamente usando Runge-Kutta 4
    const dt = 0.01;
    const t: number[] = [];
    const x: number[] = [];
    const y: number[] = [];
    
    let currentX = x0 as number;
    let currentY = y0 as number;
    let currentT = 0;
    
    t.push(currentT);
    x.push(currentX);
    y.push(currentY);
    
    while (currentT < (tMax as number)) {
      // RK4
      const k1x = (a as number) * currentX + (b as number) * currentY;
      const k1y = (c as number) * currentX + (d as number) * currentY;
      
      const k2x = (a as number) * (currentX + dt * k1x / 2) + (b as number) * (currentY + dt * k1y / 2);
      const k2y = (c as number) * (currentX + dt * k1x / 2) + (d as number) * (currentY + dt * k1y / 2);
      
      const k3x = (a as number) * (currentX + dt * k2x / 2) + (b as number) * (currentY + dt * k2y / 2);
      const k3y = (c as number) * (currentX + dt * k2x / 2) + (d as number) * (currentY + dt * k2y / 2);
      
      const k4x = (a as number) * (currentX + dt * k3x) + (b as number) * (currentY + dt * k3y);
      const k4y = (c as number) * (currentX + dt * k3x) + (d as number) * (currentY + dt * k3y);
      
      currentX = currentX + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
      currentY = currentY + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
      currentT += dt;
      
      t.push(currentT);
      x.push(currentX);
      y.push(currentY);
    }

    steps.push({
      title: 'Solución Numérica',
      formula: 'Método Runge-Kutta de 4° orden',
      result: `x(${tMax}) ≈ ${x[x.length - 1].toFixed(4)}, y(${tMax}) ≈ ${y[y.length - 1].toFixed(4)}`,
      explanation: 'Trayectoria calculada numéricamente desde las condiciones iniciales.'
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
