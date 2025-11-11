import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class EnergyConservationExercise extends ExerciseBase {
  getTitle(): string {
    return 'Sistema con Conservación de Energía';
  }

  getDescription(): string {
    return 'Sistema Hamiltoniano: dx/dt = ∂H/∂y, dy/dt = -∂H/∂x. Ejemplo: péndulo simple con H = y²/2 + (1-cos(x)). La energía total se conserva.';
  }

  getInputFields() {
    return [
      { name: 'x0', label: 'Posición inicial (x₀)', defaultValue: 0.5, step: 0.1 },
      { name: 'y0', label: 'Momento inicial (y₀)', defaultValue: 0, step: 0.1 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 20, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { x0, y0, tMax } = params;
    
    const steps: SimulationResult['steps'] = [];
    
    // Hamiltoniano del péndulo simple
    const H = (x: number, y: number) => y * y / 2 + (1 - Math.cos(x));
    const dHdx = (x: number) => Math.sin(x);
    const dHdy = (y: number) => y;
    
    const H0 = H(x0 as number, y0 as number);
    
    steps.push({
      title: 'Hamiltoniano del Sistema',
      formula: 'H(x,y) = y²/2 + (1 - cos(x))',
      result: 'Energía total del péndulo simple',
      explanation: 'x = ángulo, y = velocidad angular. El primer término es energía cinética, el segundo es potencial.'
    });

    steps.push({
      title: 'Ecuaciones de Hamilton',
      formula: 'dx/dt = ∂H/∂y = y\\ndy/dt = -∂H/∂x = -sin(x)',
      result: 'Sistema conservativo',
      explanation: 'Las ecuaciones de Hamilton garantizan la conservación de energía.'
    });

    steps.push({
      title: 'Energía Inicial',
      formula: `H(x₀, y₀)`,
      substitution: `H(${x0}, ${y0}) = ${y0}²/2 + (1 - cos(${x0}))`,
      result: `E = ${H0.toFixed(4)}`,
      explanation: 'Esta energía se mantendrá constante durante toda la evolución.'
    });

    // Resolver numéricamente
    const dt = 0.01;
    const t: number[] = [];
    const x: number[] = [];
    const y: number[] = [];
    const energy: number[] = [];
    
    let currentX = x0 as number;
    let currentY = y0 as number;
    let currentT = 0;
    
    while (currentT <= (tMax as number)) {
      t.push(currentT);
      x.push(currentX);
      y.push(currentY);
      energy.push(H(currentX, currentY));
      
      // Método simpléctico (Euler simpléctico)
      const yNew = currentY - dt * dHdx(currentX);
      const xNew = currentX + dt * dHdy(yNew);
      
      currentX = xNew;
      currentY = yNew;
      currentT += dt;
    }

    const energyError = Math.abs(H(currentX, currentY) - H0);
    
    steps.push({
      title: 'Verificación de Conservación',
      formula: '|H(t) - H(0)|',
      result: `Error de energía: ${energyError.toFixed(6)}`,
      explanation: 'El error debe ser muy pequeño en un integrador simpléctico.'
    });

    steps.push({
      title: 'Tipo de Movimiento',
      formula: 'Basado en E',
      result: H0 < 2 ? 'Oscilación (energía baja)' : 'Rotación (energía alta)',
      explanation: H0 < 2 ? 'El péndulo oscila sin dar vueltas completas.' : 'El péndulo tiene suficiente energía para girar completamente.'
    });

    return {
      steps,
      data: [
        {
          x: t,
          y: x,
          label: 'Posición x(t)'
        },
        {
          x: t,
          y: y,
          label: 'Momento y(t)'
        },
        {
          x: t,
          y: energy,
          label: 'Energía H(t)'
        }
      ]
    };
  }
}
