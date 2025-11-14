import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';
import { COLORS } from '../../utils/chart-helpers';

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
    
    const alpha_num = alpha as number;
    const beta_num = beta as number;
    const delta_num = delta as number;
    const gamma_num = gamma as number;
    
    // Paso 1: Modelo Lotka-Volterra
    steps.push({
      title: '1. Modelo Lotka-Volterra de Depredador-Presa',
      formula: 'dx/dt = x(α - βy),  dy/dt = y(δx - γ)',
      substitution: `dx/dt = x(${alpha} - ${beta}y) = ${alpha}x - ${beta}xy
dy/dt = y(${delta}x - ${gamma}) = ${delta}xy - ${gamma}y`,
      result: `**Variables:** x = presas, y = depredadores (poblaciones)
**Términos:** αx (crecimiento presas), -βxy (encuentros), δxy (conversión), -γy (muerte)`,
      explanation: `Modelo clásico de dinámica poblacional. Las presas crecen exponencialmente (αx) en ausencia de depredadores. El término -βxy representa encuentros: más presas o más depredadores ⟹ más capturas. Los depredadores convierten presas en descendencia con eficiencia δ (δxy), pero mueren a tasa γ sin alimento. Es un sistema conservativo (sin disipación).`
    });

    // Paso 2: Equilibrios
    const xStar = gamma_num / delta_num;
    const yStar = alpha_num / beta_num;
    
    steps.push({
      title: '2. Puntos de Equilibrio',
      formula: 'dx/dt = 0 y dy/dt = 0',
      substitution: `x(α - βy) = 0  y  y(δx - γ) = 0
P₁: x = 0, y = 0 (extinción)
P₂: y = α/β = ${alpha}/${beta}, x = γ/δ = ${gamma}/${delta}`,
      result: `**P₁ = (0, 0):** extinción de ambas especies
**P₂ = (${xStar.toFixed(4)}, ${yStar.toFixed(4)}):** coexistencia estable`,
      explanation: `P₁ es un punto silla (inestable): si hay alguna población inicial, el sistema evoluciona. P₂ es el equilibrio de coexistencia: nivel de presas x* = γ/δ donde los depredadores ni crecen ni decrecen, y nivel de depredadores y* = α/β donde las presas se mantienen constantes. Estos valores son independientes de las condiciones iniciales.`
    });

    // Paso 3: Jacobiano en P₂
    const J11 = 0; // ∂f/∂x evaluado en (x*, y*) = α - βy* = 0
    const J12 = -beta_num * xStar; // ∂f/∂y
    const J21 = delta_num * yStar; // ∂g/∂x
    const J22 = 0; // ∂g/∂y evaluado en (x*, y*) = δx* - γ = 0
    const trace_P2 = J11 + J22;
    const det_P2 = J11 * J22 - J12 * J21;
    
    steps.push({
      title: '3. Linealización en P₂ - Jacobiano',
      formula: 'J = [[∂f/∂x, ∂f/∂y], [∂g/∂x, ∂g/∂y]]',
      substitution: `En P₂ = (${xStar.toFixed(3)}, ${yStar.toFixed(3)}):
J = [[α-βy*, -βx*], [δy*, δx*-γ]]
J = [[0, ${J12.toFixed(3)}], [${J21.toFixed(3)}, 0]]`,
      result: `**τ = tr(J) = 0**
**Δ = det(J) = ${det_P2.toFixed(4)} > 0**
**Autovalores:** λ = ±i√(αγ) = ±${Math.sqrt(alpha_num * gamma_num).toFixed(4)}i`,
      explanation: `El Jacobiano en P₂ tiene traza cero y determinante positivo ⟹ autovalores puramente imaginarios (λ = ±iω). Esto indica un CENTRO en el sistema linealizado: órbitas cerradas alrededor de P₂. Sin embargo, el equilibrio NO es hiperbólico (Re(λ) = 0), por lo que Hartman-Grobman NO aplica. Debemos verificar con análisis no lineal.`
    });

    // Paso 4: Integral primera (conservación)
    const H = (x: number, y: number) => {
      return delta_num * x - gamma_num * Math.log(x) + beta_num * y - alpha_num * Math.log(y);
    };
    
    const H0 = H(x0 as number, y0 as number);
    
    steps.push({
      title: '4. Conservación - Integral Primera',
      formula: 'H(x,y) = δx - γln(x) + βy - αln(y) = constante',
      substitution: `H = ${delta}x - ${gamma}ln(x) + ${beta}y - ${alpha}ln(y)
dH/dt = ∂H/∂x · dx/dt + ∂H/∂y · dy/dt = 0`,
      result: `**H(x₀, y₀) = ${H0.toFixed(4)}**
Las trayectorias son curvas de nivel de H (órbitas cerradas)`,
      explanation: `Esta función H es una integral primera del movimiento: se conserva a lo largo de las trayectorias. Verificación: dH/dt = (δ - γ/x)(αx - βxy) + (β - α/y)(δxy - γy) = 0. Consecuencia: las trayectorias son curvas cerradas H(x,y) = constante alrededor de P₂. El sistema es conservativo (tipo Hamiltoniano), similar a un péndulo sin fricción.`
    });

    // Paso 5: Período de oscilación
    const omega = Math.sqrt(alpha_num * gamma_num);
    const period = 2 * Math.PI / omega;
    
    steps.push({
      title: '5. Periodo de los Ciclos Poblacionales',
      formula: 'T ≈ 2π/√(αγ)  (linealización cerca de P₂)',
      substitution: `ω = √(${alpha} × ${gamma}) = ${omega.toFixed(4)} rad/tiempo
T = 2π/${omega.toFixed(4)} ≈ ${period.toFixed(3)}`,
      result: `**Periodo aproximado: T ≈ ${period.toFixed(2)} unidades de tiempo**
La amplitud afecta el periodo real (no es armónico simple)`,
      explanation: `Cerca del equilibrio P₂, las oscilaciones son aproximadamente armónicas con periodo T = 2π/√(αγ). Este periodo depende de α (crecimiento de presas) y γ (mortalidad de depredadores), pero NO de β ni δ (tasas de interacción). Para órbitas grandes (lejos de P₂), el periodo aumenta debido a la no linealidad del sistema.`
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

    // Paso 6: Interpretación ecológica
    const x_max = Math.max(...x);
    const x_min = Math.min(...x);
    const y_max = Math.max(...y);
    const y_min = Math.min(...y);
    const amplitude_x = x_max - x_min;
    const amplitude_y = y_max - y_min;
    
    steps.push({
      title: '6. Interpretación Ecológica del Ciclo',
      formula: 'Dinámica cíclica: presas↑ → depredadores↑ → presas↓ → depredadores↓ → ciclo',
      substitution: `Presas: ${x_min.toFixed(2)} ≤ x ≤ ${x_max.toFixed(2)} (amplitud ${amplitude_x.toFixed(2)})
Depredadores: ${y_min.toFixed(2)} ≤ y ≤ ${y_max.toFixed(2)} (amplitud ${amplitude_y.toFixed(2)})
Equilibrio: x* = ${xStar.toFixed(2)}, y* = ${yStar.toFixed(2)}`,
      result: `**Ciclo poblacional con periodo ~${period.toFixed(1)} unidades**
Las poblaciones oscilan desfasadas: picos de presas preceden a picos de depredadores`,
      explanation: `Secuencia del ciclo: (1) Presas abundantes → depredadores encuentran comida fácil → población de depredadores crece. (2) Muchos depredadores → caza intensiva → presas disminuyen. (3) Presas escasas → depredadores pasan hambre → población de depredadores cae. (4) Pocos depredadores → presión baja sobre presas → presas se recuperan. El desfase es ~T/4: cuando las presas están en máximo, los depredadores todavía están creciendo.`
    });

    return {
      steps,
      data: [
        // Evolución temporal
        {
          title: 'Evolución Temporal: Presas vs Depredadores',
          type: 'line',
          datasets: [
            {
              label: 'Presas (x)',
              data: t.map((ti, i) => ({ x: ti, y: x[i] })),
              borderColor: COLORS.prey,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 0,
              showLine: true
            },
            {
              label: 'Depredadores (y)',
              data: t.map((ti, i) => ({ x: ti, y: y[i] })),
              borderColor: COLORS.predator,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 0,
              showLine: true
            }
          ],
          xLabel: 'Tiempo',
          yLabel: 'Población'
        },
        // Plano de fase: Presas vs Depredadores
        {
          title: 'Fase: Presas vs Depredadores',
          type: 'scatter',
          datasets: [
            {
              label: 'Trayectoria',
              data: x.map((xi, i) => ({ x: xi, y: y[i] })),
              borderColor: COLORS.trajectory,
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true,
              tension: 0
            },
            {
              label: `Equilibrio (${xStar.toFixed(2)}, ${yStar.toFixed(2)})`,
              data: [{ x: xStar, y: yStar }],
              backgroundColor: COLORS.stable,
              borderColor: COLORS.stable,
              pointRadius: 8,
              pointStyle: 'circle',
              borderWidth: 3,
              showLine: false
            },
            {
              label: 'Condición Inicial',
              data: [{ x: x0 as number, y: y0 as number }],
              backgroundColor: '#f39c12',
              borderColor: '#f39c12',
              pointRadius: 6,
              pointStyle: 'triangle',
              borderWidth: 2,
              showLine: false
            }
          ],
          xLabel: 'Presas (x)',
          yLabel: 'Depredadores (y)'
        }
      ]
    };
  }
}
