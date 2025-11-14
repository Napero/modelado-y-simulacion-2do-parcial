import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';
import { COLORS } from '../../utils/chart-helpers';

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
    
    const mu_num = mu as number;
    const omega_num = omega as number;
    
    // Paso 1: Forma normal de Hopf
    steps.push({
      title: '1. Forma Normal de Bifurcación de Hopf Supercrítica',
      formula: 'dr/dt = μr - r³,  dθ/dt = ω',
      substitution: `dr/dt = ${mu}r - r³
dθ/dt = ${omega}
En cartesianas: ẋ = μx - y - x(x²+y²), ẏ = x + μy - y(x²+y²)`,
      result: `**Parámetro de bifurcación:** μ = ${mu}
**Frecuencia angular:** ω = ${omega}`,
      explanation: `La forma normal de Hopf en coordenadas polares separa la dinámica radial (r) de la angular (θ). El término μr controla el crecimiento/decrecimiento lineal del radio, mientras que -r³ es la no linealidad cúbica que estabiliza. Supercrítica significa que el ciclo límite nace estable para μ > 0. El parámetro μ controla la transición: μ < 0 (foco estable), μ = 0 (bifurcación), μ > 0 (foco inestable + ciclo límite).`
    });

    // Paso 2: Equilibrio y estabilidad
    const rEq = mu_num > 0 ? Math.sqrt(mu_num) : 0;
    
    steps.push({
      title: '2. Equilibrio del Origen y su Estabilidad',
      formula: 'Equilibrio: r* = 0 (origen)',
      substitution: `dr/dt|_{r=0} = ${mu}·0 - 0³ = 0
Linealización: dr/dt ≈ μr  ⟹  r(t) ~ e^(μt)`,
      result: `**μ = ${mu}:** ${mu_num < 0 ? 'origen ESTABLE (atractor)' : mu_num > 0 ? 'origen INESTABLE (repulsor)' : 'caso crítico de bifurcación'}`,
      explanation: `Para r pequeño, el término -r³ es despreciable comparado con μr. La dinámica lineal es r(t) ≈ r₀·e^(μt). Si μ < 0, las trayectorias convergen al origen (espiral estable con frecuencia ω). Si μ > 0, las trayectorias divergen del origen (espiral inestable). En μ = 0 ocurre la bifurcación: el autovalor cruza el eje imaginario.`
    });

    // Paso 3: Condiciones de Hopf
    steps.push({
      title: '3. Verificación de las Condiciones de Hopf',
      formula: 'Jacobiano en el origen con parámetro μ',
      substitution: `J(μ) = [[μ, -ω], [ω, μ]]
Autovalores: λ(μ) = μ ± iω
λ(${mu}) = ${mu} ± ${omega}i`,
      result: `✓ **Autovalores complejos conjugados:** Re(λ) = μ, Im(λ) = ±ω
✓ **Cruce transversal:** d(Re(λ))/dμ = 1 > 0 en μ = 0
✓ **Frecuencia no nula:** ω = ${omega} ≠ 0`,
      explanation: `Las tres condiciones de Hopf se cumplen: (1) En μ_c = 0, los autovalores son puramente imaginarios λ = ±iω. (2) La parte real cruza cero transversalmente: d(Re(λ))/dμ|_{μ=0} = 1 ≠ 0. (3) La frecuencia Im(λ) = ω ≠ 0 garantiza rotación. Estas condiciones implican que en μ_c nace/muere un ciclo límite.`
    });

    // Paso 4: Ciclo límite
    steps.push({
      title: '4. Ciclo Límite y Tipo de Bifurcación',
      formula: 'Para μ > 0: dr/dt = 0 ⟹ μr - r³ = 0 ⟹ r*(μ) = √μ',
      substitution: mu_num > 0 ? 
        `r* = √${mu} = ${rEq.toFixed(4)}
Estabilidad: d(dr/dt)/dr|_{r=r*} = μ - 3r*² = ${mu} - 3(${mu}) = -2μ < 0` :
        `μ ≤ 0: no existe ciclo límite (r* = 0 es único equilibrio)`,
      result: mu_num > 0 ?
        `**Ciclo límite ESTABLE:** r* = ${rEq.toFixed(4)}
**Radio crece como:** r* ~ √μ cerca de μ = 0` :
        `**No hay ciclo límite**
Solo origen ${mu_num < 0 ? '(estable)' : '(crítico)'}`,
      explanation: mu_num > 0 ?
        `Para μ > 0, existe un ciclo límite periódico de radio r* = √μ. Es ESTABLE: trayectorias desde r < r* crecen hacia él, desde r > r* decrecen hacia él. Esto es bifurcación supercrítica: el ciclo límite nace estable cuando el equilibrio se desestabiliza. El radio crece continuamente desde cero, sin saltos (soft bifurcation).` :
        `Para μ ≤ 0, solo existe el origen. Todas las trayectorias espiralan hacia r = 0. La bifurcación aún no ha ocurrido: estamos en la rama estable del diagrama de bifurcación.`
    });

    // Paso 5: Periodo del ciclo
    const period = 2 * Math.PI / omega_num;
    steps.push({
      title: '5. Periodo del Ciclo Límite',
      formula: 'T = 2π/ω',
      substitution: `T = 2π/${omega} = ${period.toFixed(4)}`,
      result: mu_num > 0 ?
        `**Periodo: T ≈ ${period.toFixed(2)} unidades**
El ciclo límite es periódico con frecuencia ω` :
        `No aplicable (sin ciclo límite)`,
      explanation: `En coordenadas polares, dθ/dt = ω es constante, por lo que el periodo es T = 2π/ω independientemente de μ (cerca de μ = 0). ${mu_num > 0 ? 'El ciclo límite se recorre en tiempo T = ' + period.toFixed(2) + '. En coordenadas cartesianas, esto corresponde a una órbita periódica cerrada.' : 'Cuando exista el ciclo (μ > 0), este será el periodo.'}`
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

    // Paso 6: Comportamiento asintótico
    steps.push({
      title: '6. Comportamiento Asintótico de la Simulación',
      formula: 'lim(t→∞) r(t)',
      substitution: `Desde r₀ = ${r0}, θ₀ = ${theta0}
Después de t = ${tMax} unidades`,
      result: mu_num > 0 ?
        `**r(t) → ${rEq.toFixed(4)}** (ciclo límite)
Todas las trayectorias convergen al ciclo desde dentro y fuera` :
        `**r(t) → 0** (origen)
Trayectorias espiralan hacia el punto fijo estable`,
      explanation: mu_num > 0 ?
        `Independientemente de la condición inicial r₀ > 0, el radio converge exponencialmente al ciclo límite r* = √μ = ${rEq.toFixed(4)}. Trayectorias con r₀ < r* crecen hacia el ciclo, trayectorias con r₀ > r* decrecen. La convergencia es exponencial con tasa |μ - 3r*²| = 2μ. En el plano (x,y), esto se ve como espirales que convergen a un círculo de radio ${rEq.toFixed(4)}.` :
        `Para μ < 0, el origen es globalmente atractor: todas las trayectorias con r₀ > 0 espiralan hacia (0,0) con decaimiento exponencial e^(μt). La frecuencia de rotación es ω = ${omega}. No existe ciclo límite: la bifurcación aún no ha ocurrido.`
    });

    // Generar múltiples trayectorias para diferentes condiciones iniciales
    const trajectories: any[] = [];
    const initialConditions = [
      { r: 0.2, theta: 0, color: '#e74c3c' },
      { r: 0.5, theta: Math.PI/4, color: '#3498db' },
      { r: 1.0, theta: Math.PI/2, color: '#2ecc71' },
      { r: 1.5, theta: 3*Math.PI/4, color: '#f39c12' }
    ];

    initialConditions.forEach((ic, idx) => {
      const traj = { t: [0], r: [ic.r], theta: [ic.theta], x: [ic.r * Math.cos(ic.theta)], y: [ic.r * Math.sin(ic.theta)] };
      let currR = ic.r;
      let currTheta = ic.theta;
      let currT = 0;
      
      while (currT < (tMax as number)) {
        const drdt = (mu as number) * currR - currR ** 3;
        const dthetadt = omega as number;
        
        currR += dt * drdt;
        currTheta += dt * dthetadt;
        currT += dt;
        
        if (currR < 0) currR = 0;
        
        traj.t.push(currT);
        traj.r.push(currR);
        traj.theta.push(currTheta);
        traj.x.push(currR * Math.cos(currTheta));
        traj.y.push(currR * Math.sin(currTheta));
      }
      
      trajectories.push({
        ...traj,
        label: `IC ${idx + 1}: r₀=${ic.r.toFixed(1)}`,
        color: ic.color
      });
    });

    // Calcular ciclo límite teórico
    const limitCyclePoints: {x: number, y: number}[] = [];
    if (mu_num > 0) {
      for (let angle = 0; angle <= 2 * Math.PI; angle += 0.1) {
        limitCyclePoints.push({
          x: rEq * Math.cos(angle),
          y: rEq * Math.sin(angle)
        });
      }
    }

    return {
      steps,
      data: [
        // Plano de fase con múltiples trayectorias
        {
          title: `Bifurcación de Hopf: Plano de fase para μ = ${mu_num.toFixed(2)}`,
          type: 'scatter',
          datasets: [
            ...trajectories.map(traj => ({
              label: traj.label,
              data: traj.x.map((xi: number, i: number) => ({ x: xi, y: traj.y[i] })),
              borderColor: traj.color,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 0,
              showLine: true,
              tension: 0
            })),
            ...(mu_num > 0 ? [{
              label: `Ciclo Límite (r = √μ = ${rEq.toFixed(3)})`,
              data: limitCyclePoints,
              borderColor: '#9b59b6',
              backgroundColor: 'transparent',
              borderWidth: 3,
              borderDash: [10, 5],
              pointRadius: 0,
              showLine: true
            }] : []),
            {
              label: 'Punto Fijo (0,0)',
              data: [{ x: 0, y: 0 }],
              backgroundColor: mu_num > 0 ? COLORS.unstable : COLORS.stable,
              borderColor: mu_num > 0 ? COLORS.unstable : COLORS.stable,
              pointRadius: 8,
              pointStyle: 'circle',
              borderWidth: 3,
              showLine: false
            }
          ],
          xLabel: 'x',
          yLabel: 'y'
        },
        // Evolución temporal del radio
        {
          title: 'Evolución Temporal del Radio r(t)',
          type: 'line',
          datasets: trajectories.map(traj => ({
            label: traj.label,
            data: traj.t.map((ti: number, i: number) => ({ x: ti, y: traj.r[i] })),
            borderColor: traj.color,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            showLine: true
          })),
          xLabel: 't',
          yLabel: 'r(t)'
        },
        // Evolución temporal x(t) y y(t)
        {
          title: 'Evolución Temporal de x(t) e y(t)',
          type: 'line',
          datasets: [
            {
              label: 'x(t)',
              data: x.map((xi, i) => ({ x: t[i], y: xi })),
              borderColor: COLORS.stable,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 0,
              showLine: true
            },
            {
              label: 'y(t)',
              data: y.map((yi, i) => ({ x: t[i], y: yi })),
              borderColor: COLORS.unstable,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 0,
              showLine: true
            }
          ],
          xLabel: 't',
          yLabel: 'x, y'
        }
      ]
    };
  }
}
