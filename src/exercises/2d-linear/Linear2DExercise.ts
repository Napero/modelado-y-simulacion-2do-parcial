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
    
    const a_num = a as number;
    const b_num = b as number;
    const c_num = c as number;
    const d_num = d as number;
    
    // Paso 1: Definición del sistema lineal 2D
    steps.push({
      title: '1. Sistema Lineal 2D - Forma Matricial',
      formula: 'd/dt [x, y]ᵀ = A·[x, y]ᵀ,  donde A = [[a, b], [c, d]]',
      substitution: `dx/dt = ${a}x + ${b}y
dy/dt = ${c}x + ${d}y
Matriz: A = [[${a}, ${b}], [${c}, ${d}]]`,
      result: `**Sistema lineal autónomo** en ℝ²
**Equilibrio:** (x*, y*) = (0, 0)`,
      explanation: `Un sistema lineal 2D homogéneo siempre tiene el origen como único equilibrio. La dinámica completa está determinada por la matriz A de coeficientes. El comportamiento cerca del origen (estabilidad, tipo de trayectorias) depende exclusivamente de los autovalores de A.`
    });

    // Paso 2: Traza y determinante
    const trace = a_num + d_num;
    const det = a_num * d_num - b_num * c_num;
    
    steps.push({
      title: '2. Invariantes de la Matriz: Traza y Determinante',
      formula: 'τ = tr(A) = a + d,  Δ = det(A) = ad - bc',
      substitution: `τ = ${a} + ${d} = ${trace}
Δ = (${a})(${d}) - (${b})(${c}) = ${det}`,
      result: `**τ = ${trace.toFixed(4)}**  (suma de autovalores)
**Δ = ${det.toFixed(4)}**  (producto de autovalores)`,
      explanation: `La traza y el determinante son invariantes bajo cambios de coordenadas y determinan completamente los autovalores. τ controla el crecimiento/decrecimiento exponencial, mientras que Δ indica si hay componentes oscilatorias o hiperbólicas. Si Δ < 0, tenemos un punto silla (uno estable, uno inestable).`
    });

    // Paso 3: Calcular autovalores con análisis del discriminante
    const discriminant = trace * trace - 4 * det;
    
    let lambda1: number, lambda2: number;
    let eigenvaluesStr: string;
    let realPart = 0, imagPart = 0;
    
    if (discriminant >= 0) {
      lambda1 = (trace + Math.sqrt(discriminant)) / 2;
      lambda2 = (trace - Math.sqrt(discriminant)) / 2;
      eigenvaluesStr = `λ₁ = ${lambda1.toFixed(4)}, λ₂ = ${lambda2.toFixed(4)}`;
    } else {
      realPart = trace / 2;
      imagPart = Math.sqrt(-discriminant) / 2;
      eigenvaluesStr = `λ = ${realPart.toFixed(4)} ± ${imagPart.toFixed(4)}i`;
      lambda1 = realPart;
      lambda2 = realPart;
    }
    
    steps.push({
      title: '3. Autovalores - Ecuación Característica',
      formula: 'det(A - λI) = 0  ⟹  λ² - τ·λ + Δ = 0  ⟹  λ = (τ ± √(τ²-4Δ))/2',
      substitution: `λ² - ${trace}·λ + ${det} = 0
Discriminante: τ² - 4Δ = ${trace}² - 4(${det}) = ${discriminant.toFixed(4)}`,
      result: `**${eigenvaluesStr}**
${discriminant >= 0 ? '(autovalores reales)' : '(autovalores complejos conjugados)'}`,
      explanation: `La ecuación característica determina los autovalores. El discriminante τ²-4Δ decide si son reales o complejos: ${discriminant >= 0 ? 'τ²-4Δ > 0 indica autovalores reales distintos (nodos o silla)' : 'τ²-4Δ < 0 indica autovalores complejos (espiral o centro)'}. Los autovalores son las tasas de crecimiento/decrecimiento a lo largo de las direcciones propias.`
    });

    // Paso 4: Análisis del discriminante para clasificación
    let geometricType = '';
    if (discriminant > 0) {
      geometricType = 'Nodos (trayectorias sin rotación)';
    } else if (discriminant < 0) {
      geometricType = 'Espirales o Centro (trayectorias con rotación)';
    } else {
      geometricType = 'Nodo degenerado o estrella (caso frontera)';
    }
    
    steps.push({
      title: '4. Análisis del Discriminante - Tipo Geométrico',
      formula: 'Δ_discr = τ² - 4Δ',
      substitution: `Δ_discr = ${discriminant.toFixed(4)}`,
      result: `**Tipo geométrico:** ${geometricType}
${discriminant >= 0 ? 'Sin rotación' : 'Con rotación (frecuencia ω = ' + imagPart.toFixed(4) + ')'}`,
      explanation: `El signo del discriminante determina la geometría de las trayectorias. Si τ²-4Δ > 0: dos direcciones propias reales, trayectorias son combinaciones de exponenciales (nodos/silla). Si τ²-4Δ < 0: direcciones propias complejas, las trayectorias rotan alrededor del origen con frecuencia angular ω = √(4Δ-τ²)/2.`
    });

    // Paso 5: Estabilidad y clasificación completa
    let classification: string;
    let stabilityAnalysis: string;
    
    if (det < 0) {
      classification = 'Punto SILLA (hiperbólico inestable)';
      stabilityAnalysis = `Δ < 0 ⟹ λ₁ y λ₂ tienen signos opuestos. Una dirección estable (λ < 0), otra inestable (λ > 0). Inestable global.`;
    } else if (det > 0) {
      if (trace < 0) {
        if (discriminant > 0) {
          classification = 'NODO ESTABLE (sumidero)';
          stabilityAnalysis = `Δ > 0, τ < 0, τ²-4Δ > 0 ⟹ ambos λ < 0 reales. Todas las trayectorias convergen al origen sin oscilar.`;
        } else if (discriminant < 0) {
          classification = 'ESPIRAL ESTABLE (foco atractor)';
          stabilityAnalysis = `Δ > 0, τ < 0, τ²-4Δ < 0 ⟹ Re(λ) < 0, Im(λ) ≠ 0. Trayectorias espiralan hacia el origen.`;
        } else {
          classification = 'NODO ESTABLE DEGENERADO';
          stabilityAnalysis = `τ < 0, τ²-4Δ = 0. Caso frontera entre nodo y espiral estable.`;
        }
      } else if (trace > 0) {
        if (discriminant > 0) {
          classification = 'NODO INESTABLE (fuente)';
          stabilityAnalysis = `Δ > 0, τ > 0, τ²-4Δ > 0 ⟹ ambos λ > 0 reales. Trayectorias divergen del origen sin oscilar.`;
        } else if (discriminant < 0) {
          classification = 'ESPIRAL INESTABLE (foco repulsor)';
          stabilityAnalysis = `Δ > 0, τ > 0, τ²-4Δ < 0 ⟹ Re(λ) > 0, Im(λ) ≠ 0. Trayectorias espiralan alejándose del origen.`;
        } else {
          classification = 'NODO INESTABLE DEGENERADO';
          stabilityAnalysis = `τ > 0, τ²-4Δ = 0. Caso frontera entre nodo y espiral inestable.`;
        }
      } else {
        classification = 'CENTRO (órbitas periódicas cerradas)';
        stabilityAnalysis = `τ = 0, Δ > 0 ⟹ λ = ±iω puramente imaginarios. Órbitas cerradas, no hiperbólico (requiere análisis no lineal para estabilidad).`;
      }
    } else {
      classification = 'LÍNEA DE EQUILIBRIOS (degenerado)';
      stabilityAnalysis = `Δ = 0 ⟹ al menos un λ = 0. El origen no es aislado, existe una recta de equilibrios.`;
    }
    
    steps.push({
      title: '5. Clasificación Completa y Estabilidad',
      formula: 'Criterios: signo de Δ, signo de τ, signo de τ²-4Δ',
      substitution: `Δ = ${det.toFixed(4)} ${det > 0 ? '> 0' : det < 0 ? '< 0' : '= 0'}
τ = ${trace.toFixed(4)} ${trace > 0 ? '> 0' : trace < 0 ? '< 0' : '= 0'}
τ²-4Δ = ${discriminant.toFixed(4)} ${discriminant > 0 ? '> 0' : discriminant < 0 ? '< 0' : '= 0'}`,
      result: `**Tipo de equilibrio:** ${classification}
**Hiperbólico:** ${trace !== 0 || det <= 0 ? 'SÍ (Hartman-Grobman aplica)' : 'NO (requiere análisis de orden superior)'}`,
      explanation: stabilityAnalysis
    });

    // Paso 6: Teorema de Hartman-Grobman
    const isHyperbolic = (trace !== 0 || det <= 0) && det !== 0;
    steps.push({
      title: '6. Teorema de Hartman-Grobman',
      formula: 'Si ningún λ tiene Re(λ) = 0, el equilibrio es hiperbólico',
      substitution: isHyperbolic ? 
        `Ningún autovalor tiene parte real cero ⟹ hiperbólico` :
        `${trace === 0 ? 'τ = 0 ⟹ Re(λ) = 0' : 'Δ = 0 ⟹ λ = 0'} ⟹ NO hiperbólico`,
      result: isHyperbolic ? 
        `**Aplica Hartman-Grobman:** el comportamiento del sistema lineal describe topológicamente las trayectorias de cualquier perturbación no lineal cerca del origen.` :
        `**NO aplica:** el análisis lineal NO garantiza el comportamiento no lineal. Se requieren términos de orden superior.`,
      explanation: `El teorema de Hartman-Grobman establece que si el equilibrio es hiperbólico (Re(λ) ≠ 0 para todos los autovalores), entonces existe un homeomorfismo que lleva las trayectorias del sistema lineal a las del sistema no lineal cerca del equilibrio. ${isHyperbolic ? 'En este caso, la linealización es confiable para predecir la dinámica local.' : 'Aquí el teorema NO aplica: centros pueden convertirse en espirales, bifurcaciones pueden ocurrir.'}`
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

    // Paso 7: Solución numérica y verificación
    const x0_num = x0 as number;
    const y0_num = y0 as number;
    const dist_initial = Math.sqrt(x0_num * x0_num + y0_num * y0_num);
    const dist_final = Math.sqrt(x[x.length - 1] * x[x.length - 1] + y[y.length - 1] * y[y.length - 1]);
    const growth_factor = dist_final / dist_initial;
    
    steps.push({
      title: '7. Solución Numérica y Verificación',
      formula: 'Método RK4 desde (x₀, y₀) = (' + x0 + ', ' + y0 + ')',
      substitution: `t ∈ [0, ${tMax}], paso Δt = 0.01
Distancia inicial: r₀ = ${dist_initial.toFixed(4)}
Distancia final: r(${tMax}) = ${dist_final.toFixed(4)}`,
      result: `**x(${tMax}) = ${x[x.length - 1].toFixed(4)}, y(${tMax}) = ${y[y.length - 1].toFixed(4)}**
**Factor de crecimiento:** r(t)/r₀ = ${growth_factor.toFixed(4)}`,
      explanation: `La solución numérica confirma la clasificación: ${growth_factor > 1.5 ? 'la trayectoria diverge del origen (inestable)' : growth_factor < 0.7 ? 'la trayectoria converge al origen (estable)' : 'la distancia se mantiene aproximadamente constante'}. En sistemas lineales, la distancia al origen crece/decrece aproximadamente como e^(Re(λ_max)·t), donde λ_max es el autovalor con mayor parte real.`
    });

    return {
      steps,
      data: [
        {
          title: 'Evolución Temporal',
          type: 'line',
          datasets: [
            {
              label: 'x(t)',
              data: t.map((ti, i) => ({ x: ti, y: x[i] })),
              borderColor: '#3498db',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true
            },
            {
              label: 'y(t)',
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
          title: 'Retrato de Fase',
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
            },
            {
              label: 'Final',
              data: [{ x: x[x.length - 1], y: y[y.length - 1] }],
              backgroundColor: '#e74c3c',
              borderColor: '#e74c3c',
              pointRadius: 7,
              pointStyle: 'circle',
              borderWidth: 3,
              showLine: false
            },
            {
              label: 'Equilibrio (0,0)',
              data: [{ x: 0, y: 0 }],
              backgroundColor: classification.includes('estable') && !classification.includes('inestable') ? '#2ecc71' : '#e74c3c',
              borderColor: classification.includes('estable') && !classification.includes('inestable') ? '#2ecc71' : '#e74c3c',
              pointRadius: 8,
              pointStyle: 'star',
              borderWidth: 3,
              showLine: false
            }
          ],
          xLabel: 'x',
          yLabel: 'y'
        }
      ]
    };
  }
}
