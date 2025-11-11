import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class LotkaVolterraExercise extends ExerciseBase {
  getTitle(): string {
    return 'Sistema Lotka-Volterra (Depredador-Presa)';
  }

  getDescription(): string {
    return 'Modelo de interacción entre dos especies: presas (x) y depredadores (y). dx/dt = αx - βxy (presas), dy/dt = δxy - γy (depredadores). Describe ciclos de población en ecosistemas.';
  }

  getInputFields() {
    return [
      { name: 'alpha', label: 'α (tasa de crecimiento de presas)', defaultValue: 1.5, step: 0.1 },
      { name: 'beta', label: 'β (tasa de depredación)', defaultValue: 1.0, step: 0.1 },
      { name: 'delta', label: 'δ (eficiencia de depredadores)', defaultValue: 0.75, step: 0.1 },
      { name: 'gamma', label: 'γ (tasa de mortalidad de depredadores)', defaultValue: 1.0, step: 0.1 },
      { name: 'x0', label: 'Población inicial de presas (x₀)', defaultValue: 2, step: 0.1 },
      { name: 'y0', label: 'Población inicial de depredadores (y₀)', defaultValue: 1, step: 0.1 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 30, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { alpha, beta, delta, gamma, x0, y0, tMax } = params;
    
    const steps: SimulationResult['steps'] = [];
    
    // Paso 1: Sistema de ecuaciones
    steps.push({
      title: 'Sistema de Ecuaciones de Lotka-Volterra',
      formula: 'dx/dt = αx - βxy\\ndy/dt = δxy - γy',
      substitution: `dx/dt = ${alpha}x - ${beta}xy\\ndy/dt = ${delta}xy - ${gamma}y`,
      result: 'Sistema no lineal de depredador-presa',
      explanation: 'x = presas, y = depredadores. α: crecimiento de presas, β: depredación, δ: eficiencia de conversión, γ: mortalidad de depredadores.'
    });

    // Paso 2: Puntos fijos
    const xStar = (gamma as number) / (delta as number);
    const yStar = (alpha as number) / (beta as number);
    
    steps.push({
      title: 'Puntos de Equilibrio',
      formula: 'P₁ = (0, 0), P₂ = (γ/δ, α/β)',
      substitution: `P₁ = (0, 0), P₂ = (${gamma}/${delta}, ${alpha}/${beta})`,
      result: `P₁ = (0, 0) trivial, P₂ = (${xStar.toFixed(3)}, ${yStar.toFixed(3)}) coexistencia`,
      explanation: 'P₁: extinción de ambas especies. P₂: equilibrio de coexistencia.'
    });

    // Paso 3: Conservación (integral primera)
    const H = (x: number, y: number) => {
      return (delta as number) * x - (gamma as number) * Math.log(x) + (beta as number) * y - (alpha as number) * Math.log(y);
    };
    
    const H0 = H(x0 as number, y0 as number);
    
    steps.push({
      title: 'Integral Primera (Conservación)',
      formula: 'H(x,y) = δx - γln(x) + βy - αln(y)',
      substitution: `H(x,y) = ${delta}x - ${gamma}ln(x) + ${beta}y - ${alpha}ln(y)`,
      result: `H(x₀,y₀) = ${H0.toFixed(4)} (constante en órbitas cerradas)`,
      explanation: 'Esta cantidad se conserva a lo largo de las trayectorias (órbitas cerradas).'
    });

    // Paso 4: Período aproximado
    const period = 2 * Math.PI / Math.sqrt((alpha as number) * (gamma as number));
    
    steps.push({
      title: 'Período de Oscilación (aproximado)',
      formula: 'T ≈ 2π / √(αγ)',
      substitution: `T ≈ 2π / √(${alpha} × ${gamma})`,
      result: `T ≈ ${period.toFixed(2)} unidades de tiempo`,
      explanation: 'Período aproximado de los ciclos de población cerca del equilibrio.'
    });

    // Resolver numéricamente
    const dt = 0.01;
    const t: number[] = [];
    const x: number[] = [];
    const y: number[] = [];
    
    let currentX = x0 as number;
    let currentY = y0 as number;
    let currentT = 0;
    
    while (currentT <= (tMax as number) && currentX > 0.001 && currentY > 0.001 && currentX < 1000 && currentY < 1000) {
      t.push(currentT);
      x.push(currentX);
      y.push(currentY);
      
      // RK4
      const f = (x: number, y: number) => (alpha as number) * x - (beta as number) * x * y;
      const g = (x: number, y: number) => (delta as number) * x * y - (gamma as number) * y;
      
      const k1x = f(currentX, currentY);
      const k1y = g(currentX, currentY);
      
      const k2x = f(currentX + dt * k1x / 2, currentY + dt * k1y / 2);
      const k2y = g(currentX + dt * k1x / 2, currentY + dt * k1y / 2);
      
      const k3x = f(currentX + dt * k2x / 2, currentY + dt * k2y / 2);
      const k3y = g(currentX + dt * k2x / 2, currentY + dt * k2y / 2);
      
      const k4x = f(currentX + dt * k3x, currentY + dt * k3y);
      const k4y = g(currentX + dt * k3x, currentY + dt * k3y);
      
      currentX = currentX + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
      currentY = currentY + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
      currentT += dt;
    }

    steps.push({
      title: 'Simulación Numérica',
      formula: 'Runge-Kutta 4° orden',
      result: `Simulado hasta t = ${t[t.length - 1].toFixed(2)}`,
      explanation: 'Trayectoria calculada mostrando ciclos de población.'
    });

    return {
      steps,
      data: [
        {
          x: t,
          y: x,
          label: 'Población de Presas'
        },
        {
          x: t,
          y: y,
          label: 'Población de Depredadores'
        }
      ]
    };
  }
}
