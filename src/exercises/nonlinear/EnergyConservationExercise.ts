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
    
    const x0_num = x0 as number;
    const y0_num = y0 as number;
    
    // Hamiltoniano del péndulo simple
    const H = (x: number, y: number) => y * y / 2 + (1 - Math.cos(x));
    const dHdx = (x: number) => Math.sin(x);
    const dHdy = (y: number) => y;
    
    const H0 = H(x0_num, y0_num);
    const T0 = y0_num * y0_num / 2;
    const V0 = 1 - Math.cos(x0_num);
    
    // Paso 1: Sistema Hamiltoniano
    steps.push({
      title: '1. Sistema Hamiltoniano - Péndulo Simple',
      formula: 'H(x,y) = T(y) + V(x) = y²/2 + (1 - cos(x))',
      substitution: `**Energía cinética:** T = y²/2 (½mv² con m=1, L=1)
**Energía potencial:** V = 1 - cos(x) = 2sin²(x/2)
**Hamiltoniano:** H(${x0}, ${y0}) = ${H0.toFixed(4)}`,
      result: `**Variables:** x = ángulo, y = velocidad angular
**Energía total:** E = ${H0.toFixed(4)} = constante`,
      explanation: `Péndulo simple sin fricción. x es el ángulo desde la vertical (x=0 es posición de equilibrio inferior). La energía potencial es mínima en x=0 (V=0) y máxima en x=±π (V=2, posición superior). La energía cinética T = y²/2 es siempre no negativa. El sistema es conservativo: dH/dt = 0.`
    });

    // Paso 2: Ecuaciones de Hamilton
    steps.push({
      title: '2. Ecuaciones de Hamilton',
      formula: 'dx/dt = ∂H/∂y,  dy/dt = -∂H/∂x',
      substitution: `dx/dt = ∂(y²/2 + 1 - cos(x))/∂y = y
dy/dt = -∂(y²/2 + 1 - cos(x))/∂x = -sin(x)`,
      result: `**Sistema:** ẋ = y, ẏ = -sin(x)
Equivalente a: ẍ + sin(x) = 0 (ecuación del péndulo)`,
      explanation: `Las ecuaciones de Hamilton son equivalentes a la ecuación de movimiento del péndulo ẍ = -sin(x). El término -sin(x) es la fuerza restauradora (para x pequeño, sin(x) ≈ x, recuperando el oscilador armónico). La estructura Hamiltoniana garantiza que dH/dt = ∂H/∂t + {H,H} = 0 (corchetes de Poisson), conservando la energía.`
    });

    // Paso 3: Puntos de equilibrio
    steps.push({
      title: '3. Puntos de Equilibrio y Estabilidad',
      formula: 'ẋ = 0, ẏ = 0  ⟹  y = 0, sin(x) = 0',
      substitution: `**P₁:** (x, y) = (0, 0) → péndulo colgando (abajo)
**P₂:** (x, y) = (π, 0) → péndulo invertido (arriba)
**P₃:** (x, y) = (-π, 0) → péndulo invertido (arriba)`,
      result: `**P₁ = (0, 0):** CENTRO estable, H = 0 (mínimo)
**P₂ = (±π, 0):** SILLA inestable, H = 2 (máximo)`,
      explanation: `En P₁ (abajo), el péndulo está en equilibrio estable: pequeñas perturbaciones resultan en oscilaciones. Es un mínimo de energía (pozo de potencial). En P₂ (arriba), el equilibrio es inestable: cualquier perturbación hace que el péndulo caiga. Es un máximo de energía (punto silla en el espacio de fase). La separatriz H = 2 conecta las sillas y separa oscilaciones de rotaciones.`
    });

    // Paso 4: Análisis por niveles de energía
    const E_separatrix = 2;
    let motionType = '';
    let motionDescription = '';
    
    if (H0 < E_separatrix - 0.001) {
      motionType = 'OSCILACIÓN (libración)';
      const amplitude = 2 * Math.asin(Math.sqrt(H0 / 2));
      motionDescription = `E < 2 ⟹ órbitas cerradas alrededor de (0,0). El péndulo oscila entre x ≈ ±${amplitude.toFixed(3)} rad (±${(amplitude * 180 / Math.PI).toFixed(1)}°). No tiene energía para alcanzar la posición superior. Periodo depende de la amplitud.`;
    } else if (H0 > E_separatrix + 0.001) {
      motionType = 'ROTACIÓN (circulación)';
      motionDescription = `E > 2 ⟹ el péndulo gira continuamente alrededor del pivote. Tiene suficiente energía para superar la posición superior (x = π). La velocidad angular mínima ocurre en x = π (arriba), y máxima en x = 0 (abajo).`;
    } else {
      motionType = 'SEPARATRIZ (caso crítico)';
      motionDescription = `E = 2 ⟹ trayectoria separatriz que conecta las sillas (±π, 0). El péndulo tiende asintóticamente a la posición invertida pero nunca la alcanza en tiempo finito. Divide órbitas de oscilación de las de rotación.`;
    }
    
    steps.push({
      title: '4. Clasificación del Movimiento por Energía',
      formula: 'Comparar E con E_sep = 2 (energía de separatriz)',
      substitution: `E₀ = ${H0.toFixed(4)}, E_sep = 2
E_cinética = ${T0.toFixed(4)}, E_potencial = ${V0.toFixed(4)}`,
      result: `**Tipo de movimiento:** ${motionType}`,
      explanation: motionDescription
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

    const H_final = H(currentX, currentY);
    const energyError = Math.abs(H_final - H0);
    const energyErrorPercent = (energyError / Math.max(H0, 0.001)) * 100;
    
    // Paso 5: Conservación y método numérico
    steps.push({
      title: '5. Conservación de Energía - Integrador Simpléctico',
      formula: 'dH/dt = ∂H/∂x·dx/dt + ∂H/∂y·dy/dt = sin(x)·y + y·(-sin(x)) = 0',
      substitution: `H(0) = ${H0.toFixed(6)}
H(${tMax}) = ${H_final.toFixed(6)}
Error absoluto: ${energyError.toFixed(8)}`,
      result: `**Error relativo: ${energyErrorPercent.toFixed(4)}%**
El integrador simpléctico preserva la estructura Hamiltoniana`,
      explanation: `El método de Euler simpléctico conserva exactamente la estructura simpléctica del sistema, resultando en excelente conservación de energía a largo plazo (error acotado, no acumulativo). Métodos estándar como RK4 acumulan error en la energía. El error pequeño ${energyErrorPercent < 0.1 ? 'confirma la conservación numérica' : 'indica discretización temporal'}.`
    });

    // Paso 6: Interpretación física
    const x_max = Math.max(...x.map(Math.abs));
    const y_max = Math.max(...y.map(Math.abs));
    
    let physicalInterpretation = '';
    if (H0 < 2 - 0.001) {
      const period_approx = 2 * Math.PI; // período lineal
      const period_actual = period_approx * (1 + H0 / 16); // corrección no lineal de primer orden
      physicalInterpretation = `Oscilación armónica no lineal. Amplitud máxima: |x| ≈ ${x_max.toFixed(3)} rad. Periodo aproximado: T ≈ ${period_actual.toFixed(2)} (aumenta con la amplitud). La velocidad máxima |y| ≈ ${y_max.toFixed(3)} ocurre al pasar por x = 0. El movimiento es periódico pero no sinusoidal para amplitudes grandes.`;
    } else if (H0 > 2 + 0.001) {
      const omega_avg = Math.sqrt(2 * (H0 - 2));
      physicalInterpretation = `Rotación continua. El péndulo da vueltas completas con velocidad angular promedio ω ≈ ${omega_avg.toFixed(3)}. La velocidad varía: mínima en x = π (arriba, y_min ≈ ${Math.sqrt(2 * (H0 - 2)).toFixed(3)}), máxima en x = 0 (abajo, y_max ≈ ${y_max.toFixed(3)}). El periodo de revolución es T = 2π/ω ≈ ${(2 * Math.PI / omega_avg).toFixed(2)}.`;
    } else {
      physicalInterpretation = `Caso crítico de separatriz. El péndulo tiende asintóticamente hacia x = π pero nunca la alcanza. Tiempo infinito para llegar a la posición invertida. En la práctica, pequeñas perturbaciones determinan si oscila o rota.`;
    }
    
    steps.push({
      title: '6. Interpretación Física del Movimiento',
      formula: 'Análisis del espacio de fase (x, y)',
      substitution: `Máxima posición: |x| ≤ ${x_max.toFixed(3)} rad
Máxima velocidad: |y| ≤ ${y_max.toFixed(3)} rad/tiempo`,
      result: `**Conservación verificada numéricamente**
Trayectoria en curva de nivel H = ${H0.toFixed(4)}`,
      explanation: physicalInterpretation
    });

    return {
      steps,
      data: [
        {
          title: 'Evolución Temporal',
          type: 'line',
          datasets: [
            {
              label: 'Posición x(t)',
              data: t.map((ti, i) => ({ x: ti, y: x[i] })),
              borderColor: '#3498db',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true
            },
            {
              label: 'Momento y(t)',
              data: t.map((ti, i) => ({ x: ti, y: y[i] })),
              borderColor: '#e74c3c',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true
            }
          ],
          xLabel: 'Tiempo',
          yLabel: 'x, y'
        },
        {
          title: 'Espacio de Fase (x, y)',
          type: 'scatter',
          datasets: [
            {
              label: 'Trayectoria',
              data: x.map((xi, i) => ({ x: xi, y: y[i] })),
              borderColor: '#9b59b6',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true,
              tension: 0
            },
            {
              label: 'Inicio',
              data: [{ x: x0 as number, y: y0 as number }],
              backgroundColor: '#2ecc71',
              borderColor: '#2ecc71',
              pointRadius: 7,
              pointStyle: 'circle',
              borderWidth: 3,
              showLine: false
            }
          ],
          xLabel: 'Posición x',
          yLabel: 'Momento y'
        },
        {
          title: 'Conservación de Energía H(t)',
          type: 'line',
          datasets: [
            {
              label: 'Energía H(t)',
              data: t.map((ti, i) => ({ x: ti, y: energy[i] })),
              borderColor: '#f39c12',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true
            },
            {
              label: `Energía Inicial H₀ = ${H0.toFixed(4)}`,
              data: [{ x: 0, y: H0 }, { x: tMax as number, y: H0 }],
              borderColor: '#2ecc71',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              showLine: true
            }
          ],
          xLabel: 'Tiempo',
          yLabel: 'Energía H'
        }
      ]
    };
  }
}
