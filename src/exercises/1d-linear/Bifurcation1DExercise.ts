import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';
import { COLORS } from '../../utils/chart-helpers';

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
      title: '1. Ecuación Diferencial del Sistema',
      formula: 'dx/dt = r + x²',
      result: 'Sistema autónomo 1D parametrizado por r',
      explanation: 'Este es un sistema dinámico de primer orden donde r es un parámetro de control. Vamos a estudiar cómo el comportamiento cualitativo del sistema cambia cuando variamos r.'
    });

    // Paso 2: Encontrar puntos fijos
    steps.push({
      title: '2. Cálculo de Puntos de Equilibrio',
      formula: 'Condición de equilibrio: dx/dt = 0',
      substitution: 'r + x² = 0  ⟹  x² = -r',
      result: `Para r < 0: x* = ±√(-r) (dos equilibrios)
Para r = 0: x* = 0 (un equilibrio)
Para r > 0: No hay equilibrios reales`,
      explanation: 'Los puntos de equilibrio son las soluciones constantes del sistema. Su número y posición dependen del valor de r.'
    });

    // Paso 3: Análisis de estabilidad lineal
    steps.push({
      title: '3. Estabilidad Lineal de los Equilibrios',
      formula: 'f(x) = r + x²  ⟹  f\'(x) = 2x',
      substitution: `En x* = √(-r): f\'(√(-r)) = 2√(-r) > 0
En x* = -√(-r): f\'(-√(-r)) = -2√(-r) < 0`,
      result: `x₊* = √(-r) es INESTABLE (repulsor)
x₋* = -√(-r) es ESTABLE (atractor)`,
      explanation: 'Criterio: Si f\'(x*) < 0 → estable, si f\'(x*) > 0 → inestable. El equilibrio positivo repele trayectorias, el negativo las atrae.'
    });

    // Paso 4: Identificación de la bifurcación
    steps.push({
      title: '4. Identificación del Tipo de Bifurcación',
      formula: 'Punto crítico: r_c = 0',
      substitution: 'En r = 0: x* = 0 con f\'(0) = 0',
      result: 'BIFURCACIÓN SILLA-NODO',
      explanation: 'Cuando r cruza 0, dos equilibrios (uno estable y uno inestable) colisionan y desaparecen. Este es el comportamiento característico de una bifurcación silla-nodo.'
    });

    // Paso 5: Comportamiento en cada región
    steps.push({
      title: '5. Análisis Cualitativo por Regiones',
      formula: 'Comportamiento según el valor de r',
      result: `r < 0: Dos equilibrios, trayectorias convergen a x₋*
r = 0: Un equilibrio no hiperbólico en origen
r > 0: Sin equilibrios, todas las trayectorias divergen a +∞`,
      explanation: 'La bifurcación divide el espacio de parámetros en tres regiones con dinámicas cualitativamente diferentes.'
    });

    // Paso 6: Interpretación geométrica
    const rTest = -1;
    const xStableTest = -Math.sqrt(-rTest);
    const xUnstableTest = Math.sqrt(-rTest);
    
    steps.push({
      title: '6. Ejemplo Numérico',
      formula: `Para r = ${rTest}`,
      substitution: `x₊* = √(${-rTest}) = ${xUnstableTest.toFixed(3)}
x₋* = -√(${-rTest}) = ${xStableTest.toFixed(3)}`,
      result: `Equilibrio estable en x = ${xStableTest.toFixed(3)}
Equilibrio inestable en x = ${xUnstableTest.toFixed(3)}`,
      explanation: `Si x₀ está entre los dos equilibrios, la trayectoria converge al estable. Si x₀ > ${xUnstableTest.toFixed(3)}, diverge a +∞.`
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
        // Diagrama de bifurcación
        {
          title: 'Diagrama de Bifurcación de dx/dt = r + x²',
          type: 'scatter',
          datasets: [
            {
              label: 'Equilibrio Estable (para r < 0)',
              data: rValues.map((r, i) => ({ x: r, y: xStable[i] })).filter(p => !isNaN(p.y)),
              borderColor: COLORS.stable,
              backgroundColor: COLORS.stable,
              borderWidth: 3,
              pointRadius: 2,
              showLine: true
            },
            {
              label: 'Equilibrio Inestable (para r < 0)',
              data: rValues.map((r, i) => ({ x: r, y: xUnstable[i] })).filter(p => !isNaN(p.y)),
              borderColor: COLORS.unstable,
              backgroundColor: COLORS.unstable,
              borderWidth: 3,
              borderDash: [5, 5],
              pointRadius: 2,
              showLine: true
            },
            {
              label: 'Silla-Nodo (r = 0)',
              data: [{ x: 0, y: 0 }],
              backgroundColor: '#f39c12',
              borderColor: '#f39c12',
              pointRadius: 8,
              pointStyle: 'star',
              showLine: false
            }
          ],
          xLabel: 'Parámetro r',
          yLabel: 'Posición de Equilibrio x*'
        },
        // Campo vectorial para diferentes r
        {
          title: 'Campo Vectorial para r < 0',
          type: 'line',
          datasets: [{
            label: 'dx/dt (r = -1)',
            data: Array.from({ length: 50 }, (_, i) => {
              const x = -3 + i * 6/49;
              const r = -1;
              return { x: x, y: r + x*x };
            }),
            borderColor: COLORS.stable,
            borderWidth: 2,
            pointRadius: 0,
            showLine: true
          }],
          xLabel: 'x',
          yLabel: 'dx/dt'
        },
        {
          title: 'Campo Vectorial para r = 0 (Bifurcación)',
          type: 'line',
          datasets: [{
            label: 'dx/dt (r = 0)',
            data: Array.from({ length: 50 }, (_, i) => {
              const x = -3 + i * 6/49;
              const r = 0;
              return { x: x, y: r + x*x };
            }),
            borderColor: '#f39c12',
            borderWidth: 2,
            pointRadius: 0,
            showLine: true
          }],
          xLabel: 'x',
          yLabel: 'dx/dt'
        },
        {
          title: 'Campo Vectorial para r > 0',
          type: 'line',
          datasets: [{
            label: 'dx/dt (r = 1)',
            data: Array.from({ length: 50 }, (_, i) => {
              const x = -3 + i * 6/49;
              const r = 1;
              return { x: x, y: r + x*x };
            }),
            borderColor: COLORS.unstable,
            borderWidth: 2,
            pointRadius: 0,
            showLine: true
          }],
          xLabel: 'x',
          yLabel: 'dx/dt'
        }
      ]
    };
  }
}
