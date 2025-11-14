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
    
    const A_num = A as number;
    const B_num = B as number;
    const omegaX_num = omegaX as number;
    const omegaY_num = omegaY as number;
    const phi_num = phi as number;
    const tMax_num = tMax as number;
    
    const steps: SimulationResult['steps'] = [];
    
    // Paso 1: Definición de Curva Parametrizada (Lissajous)
    const vx_component = (A_num * omegaX_num).toFixed(2);
    const vy_component = (B_num * omegaY_num).toFixed(2);
    
    steps.push({
      title: '1. Curvas de Lissajous (Parametrización Armónica)',
      formula: 'x(t) = A·sin(ω₁·t)   y(t) = B·sin(ω₂·t + φ)   Sistema dinámico: ẋ = A·ω₁·cos(ω₁·t)   ẏ = B·ω₂·cos(ω₂·t + φ)',
      substitution: `Para esta curva:
A = ${A_num} (amplitud en x)
B = ${B_num} (amplitud en y)
ω_x = ${omegaX_num} rad/s (frecuencia angular en x)
ω_y = ${omegaY_num} rad/s (frecuencia angular en y)
φ = ${phi_num} rad (desfase inicial)

Parametrización específica:
x(t) = ${A_num}·sin(${omegaX_num}·t)
y(t) = ${B_num}·sin(${omegaY_num}·t + ${phi_num})`,
      result: `**Tipo**: Curva de Lissajous (Jules Antoine Lissajous, 1857)
**Dominio**: t ∈ [0, ∞) (parámetro temporal)
**Codominio**: Órbita en ℝ² contenida en rectángulo [-${A_num}, ${A_num}] × [-${B_num}, ${B_num}]
**Velocidad**: v(t) = (ẋ, ẏ) con componentes máximas ${vx_component} y ${vy_component}`,
      explanation: 'Las curvas de Lissajous son trayectorias en el plano generadas por dos oscilaciones armónicas perpendiculares con posibles diferentes frecuencias y desfase. Históricamente, se observaban en osciloscopios analógicos aplicando señales sinusoidales a los ejes X e Y. La parametrización x(t), y(t) define una curva orientada en el plano: el parámetro t representa el tiempo, y la curva se traza siguiendo el movimiento del punto (x(t), y(t)). Las velocidades ẋ(t) y ẏ(t) indican cómo el punto se mueve a lo largo de la curva. Estas curvas aparecen en sistemas de osciladores acoplados, análisis de señales, y estudio de resonancias.'
    });

    // Paso 2: Relación de Frecuencias y Periodicidad
    const ratio = omegaX_num / omegaY_num;
    
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
    
    const wx = Math.round(omegaX_num * 100);
    const wy = Math.round(omegaY_num * 100);
    const divisor = gcd(wx, wy);
    const simplifiedX = wx / divisor;
    const simplifiedY = wy / divisor;
    const ratio_simplified = simplifiedX / simplifiedY;
    
    const T_x = 2 * Math.PI / omegaX_num;
    const T_y = 2 * Math.PI / omegaY_num;
    const T_curve = Math.abs(simplifiedY) * T_x;
    
    const isRational = Math.abs(ratio - ratio_simplified) < 0.01;
    
    const rationalText = isRational ? 
      `**Periodo de la curva**: T = ${simplifiedY}·T_x = ${T_curve.toFixed(2)} s\n**Ciclos**: ${simplifiedX} oscilaciones en x, ${simplifiedY} oscilaciones en y` :
      '**Densidad**: La curva llena densamente el rectángulo sin repetirse';
    
    const explainRational = isRational ?
      `En este caso, r=${simplifiedX}/${simplifiedY} es racional, por lo que la curva se cierra después de ${simplifiedY} periodos en x. Durante este tiempo, x completa ${simplifiedX} oscilaciones completas mientras y completa ${simplifiedY} oscilaciones. Esta periodicidad crea patrones geométricos regulares.` :
      `Aquí r es irracional, lo que implica que la curva nunca se cierra exactamente. Por el teorema de recurrencia de Poincaré, la curva llena densamente todo el rectángulo, acercándose arbitrariamente a cualquier punto interior.`;
    
    steps.push({
      title: '2. Relación de Frecuencias y Periodicidad de la Curva',
      formula: 'Ratio r = ω₁/ω₂   Si r=m/n racional → Curva cerrada, periodo T = n·T₁ = m·T₂, con n ciclos en x y m en y   Si r irracional → Curva densa que no se cierra',
      substitution: `Periodos individuales:
T_x = 2π/ω_x = 2π/${omegaX_num} = ${T_x.toFixed(4)} s
T_y = 2π/ω_y = 2π/${omegaY_num} = ${T_y.toFixed(4)} s

Ratio de frecuencias:
r = ω_x/ω_y = ${omegaX_num}/${omegaY_num} = ${ratio.toFixed(4)}

Simplificación (GCD):
ω_x : ω_y = ${simplifiedX/100} : ${simplifiedY/100} ≈ ${simplifiedX} : ${simplifiedY}
r ≈ ${simplifiedX}/${simplifiedY} = ${ratio_simplified.toFixed(4)}`,
      result: `**Ratio**: ${ratio.toFixed(4)} ≈ ${simplifiedX}/${simplifiedY}
**Clasificación**: ${isRational ? `Curva **cerrada** (ratio racional)` : 'Curva **abierta/densa** (ratio irracional)'}
${rationalText}`,
      explanation: `La relación de frecuencias r=ω_x/ω_y determina la topología de la curva. ${explainRational} Este fenómeno está relacionado con la teoría de números (aproximación diofantina) y tiene aplicaciones en mecánica celeste (resonancias orbitales) y teoría ergódica.`
    });

    // Paso 3: Análisis del Desfase y Forma Geométrica
    const phi_normalized = ((phi_num % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let shape_type: string;
    
    const sameFreq = Math.abs(omegaX_num - omegaY_num) < 0.01;
    
    if (sameFreq) {
      if (Math.abs(phi_normalized) < 0.1 || Math.abs(phi_normalized - 2*Math.PI) < 0.1) {
        shape_type = 'Línea recta diagonal (fase 0°)';
      } else if (Math.abs(phi_normalized - Math.PI/2) < 0.1) {
        shape_type = 'Círculo o elipse (fase 90°)';
      } else if (Math.abs(phi_normalized - Math.PI) < 0.1) {
        shape_type = 'Línea recta diagonal opuesta (fase 180°)';
      } else if (Math.abs(phi_normalized - 3*Math.PI/2) < 0.1) {
        shape_type = 'Círculo o elipse invertida (fase 270°)';
      } else {
        shape_type = 'Elipse inclinada';
      }
    } else {
      shape_type = 'Figura de Lissajous compleja';
    }
    
    const phaseSubstitution = sameFreq ?
      `Ecuación implícita (eliminando t): Para φ=${phi_num.toFixed(2)}, la relación entre x e y forma una ${shape_type.toLowerCase()}` :
      `Número de intersecciones con ejes: ~${Math.floor(simplifiedX + simplifiedY)}`;
    
    const excentricity = sameFreq && Math.abs(A_num - B_num) > 0.1 ?
      `e = √(1-(b/a)²) = ${Math.sqrt(1 - Math.min(A_num, B_num)**2/Math.max(A_num, B_num)**2).toFixed(3)}` :
      'No aplicable (no es elipse simple)';
    
    const areaEnclosed = sameFreq && Math.abs(phi_normalized - Math.PI/2) < 0.1 ?
      `A = π·${A_num}·${B_num} = ${(Math.PI * A_num * B_num).toFixed(2)}` :
      'Compleja (integral de línea requerida)';
    
    const explainPhase1 = 'Con frecuencias iguales, el desfase determina si la curva es una línea (φ=0 o π) o una elipse (otros valores). Para φ=π/2, obtenemos una elipse con ejes alineados.';
    const explainPhase2 = 'Con frecuencias diferentes, φ afecta la complejidad: cambia el número y ubicación de los bucles. La curva puede tener múltiples intersecciones consigo misma en casos racionales.';
    const explainPhase = sameFreq ? explainPhase1 : explainPhase2;
    
    steps.push({
      title: '3. Efecto del Desfase φ en la Forma Geométrica',
      formula: 'Para ω₁ = ω₂: φ=0 → línea recta y=±(B/A)x   φ=π/2 → elipse x²/A² + y²/B² = 1   φ=π → línea y=∓(B/A)x',
      substitution: `Parámetros de fase:
φ = ${phi_num} rad = ${(phi_num * 180 / Math.PI).toFixed(1)}°
φ normalizado = ${phi_normalized.toFixed(3)} rad ∈ [0, 2π)

Comparación de frecuencias:
|ω_x - ω_y| = |${omegaX_num} - ${omegaY_num}| = ${Math.abs(omegaX_num - omegaY_num).toFixed(3)}
${sameFreq ? '→ Frecuencias iguales (caso especial)' : '→ Frecuencias diferentes'}

${phaseSubstitution}`,
      result: `**Forma geométrica**: ${shape_type}
**Orientación**: ${phi_normalized < Math.PI ? 'Sentido antihorario' : 'Sentido horario'}
**Excentricidad**: ${excentricity}
**Área encerrada**: ${areaEnclosed}`,
      explanation: `El desfase φ controla la forma de la curva de Lissajous. ${explainPhase} Estas formas aparecen en el análisis de oscilaciones acopladas (péndulo doble, circuitos RLC, modos normales de vibraciones) y en la visualización de relaciones de fase en procesamiento de señales.`
    });

    // Paso 4: Eliminación del Parámetro y Ecuación Implícita
    const eliminationCase1 = `Caso especial: frecuencias iguales
De x = ${A_num}sin(ωt) → sin(ωt) = x/${A_num}
De y = ${B_num}sin(ωt + ${phi_num})

Sustituyendo y usando sin²+cos²=1:
cos(ωt) = ±√(1 - (x/${A_num})²)

Ecuación implícita aproximada:
(x/${A_num})² + (y/${B_num})² - 2(x/${A_num})(y/${B_num})cos(${phi_num}) ≈ sin²(${phi_num})`;
    
    const eliminationCase2 = `Caso general: frecuencias diferentes
La eliminación del parámetro requiere técnicas avanzadas:
- Si ratio es racional (${simplifiedX}:${simplifiedY}), usar polinomios de Chebyshev
- La ecuación implícita es una curva algebraica de grado ≤ ${simplifiedX}·${simplifiedY}
- Análisis directo difícil; preferir representación paramétrica`;
    
    const eliminationCase = sameFreq ? eliminationCase1 : eliminationCase2;
    const eliminationMethod = sameFreq ? 'Identidades trigonométricas directas' : 'Polinomios de Chebyshev (avanzado)';
    const eliminationDiff = sameFreq ? 'Baja (caso frecuencias iguales)' : 'Alta (requiere teoría de curvas algebraicas)';
    
    steps.push({
      title: '4. Eliminación del Parámetro Temporal',
      formula: 'Ecuación implícita F(x,y)=0: Caso ω₁=ω₂, φ=0 → y=(B/A)x   Caso ω₁=ω₂, φ=π/2 → x²/A² + y²/B² = 1   General → usar identidades trigonométricas o polinomios de Chebyshev',
      substitution: `Para ω_x=${omegaX_num}, ω_y=${omegaY_num}, φ=${phi_num}:

${eliminationCase}`,
      result: `**Método**: ${eliminationMethod}
**Dificultad**: ${eliminationDiff}
**Preferencia**: En sistemas dinámicos, mantener forma paramétrica x(t), y(t)
**Ventaja paramétrica**: Preserva orientación temporal, facilita análisis de estabilidad`,
      explanation: 'Eliminar el parámetro t consiste en obtener una ecuación implícita F(x,y)=0 que describe la misma curva sin referencia explícita al tiempo. Esto es sencillo cuando las frecuencias son iguales (usar identidades trigonométricas básicas), pero se vuelve extremadamente complejo para frecuencias diferentes. En dinámica, la forma paramétrica es preferible porque preserva información temporal crucial: indica no solo qué puntos están en la trayectoria, sino en qué orden se visitan y a qué velocidad. La ecuación implícita pierde esta información direccional. Para ratios racionales m:n, la curva es algebraica de grado ≤mn (teorema de Bézout), y su ecuación puede obtenerse usando polinomios de Chebyshev.'
    });

    // Paso 5: Cálculo Numérico y Propiedades Geométricas
    const dt = 0.01;
    const t: number[] = [];
    const x: number[] = [];
    const y: number[] = [];
    
    let currentT = 0;
    
    while (currentT <= tMax_num) {
      t.push(currentT);
      x.push(A_num * Math.sin(omegaX_num * currentT));
      y.push(B_num * Math.sin(omegaY_num * currentT + phi_num));
      currentT += dt;
    }
    
    // Calcular longitud de arco aproximada
    let arcLength = 0;
    for (let i = 1; i < x.length; i++) {
      const dx = x[i] - x[i-1];
      const dy = y[i] - y[i-1];
      arcLength += Math.sqrt(dx*dx + dy*dy);
    }
    
    // Calcular velocidades máximas
    const vx_max = Math.abs(A_num * omegaX_num);
    const vy_max = Math.abs(B_num * omegaY_num);
    const v_max = Math.sqrt(vx_max**2 + vy_max**2);
    
    steps.push({
      title: '5. Propiedades Geométricas y Cinemáticas',
      formula: 'Longitud: L = ∫ |v(t)| dt = ∫ √(ẋ² + ẏ²) dt   Velocidad: v(t) = (Aω₁cos(ω₁t), Bω₂cos(ω₂t+φ))   Aceleración: a(t) = (-Aω₁²sin(ω₁t), -Bω₂²sin(ω₂t+φ))',
      substitution: `Simulación numérica con Δt = ${dt}:
Puntos calculados: ${x.length}
Tiempo total: t ∈ [0, ${tMax_num}]

Velocidades máximas:
|ẋ|_max = A·ω_x = ${A_num}·${omegaX_num} = ${vx_max.toFixed(3)}
|ẏ|_max = B·ω_y = ${B_num}·${omegaY_num} = ${vy_max.toFixed(3)}
|v|_max ≈ √(${vx_max.toFixed(2)}² + ${vy_max.toFixed(2)}²) = ${v_max.toFixed(3)}

Longitud de arco aproximada (integral numérica):
L ≈ Σ√(Δx² + Δy²) = ${arcLength.toFixed(2)} unidades`,
      result: `**Longitud de arco**: L ≈ ${arcLength.toFixed(2)}
**Velocidad máxima**: |v|_max = ${v_max.toFixed(2)}
**Aceleración máxima**: |a|_max = ${Math.max(A_num*omegaX_num**2, B_num*omegaY_num**2).toFixed(2)}
**Curvatura**: Variable (máxima en los extremos de los ejes)
**Rectángulo contenedor**: [${-A_num}, ${A_num}] × [${-B_num}, ${B_num}]`,
      explanation: `Las propiedades cinemáticas de la curva parametrizada revelan su dinámica. La velocidad v(t)=(ẋ,ẏ) nunca es cero en curvas de Lissajous típicas (excepto en casos degenerados), indicando movimiento continuo sin paradas. La aceleración siempre apunta hacia el origen, similar a un oscilador armónico 2D. La longitud de arco L=${arcLength.toFixed(1)} se calcula numéricamente; para curvas cerradas (ratio racional), L es finita y se completa en tiempo T=${T_curve.toFixed(2)}; para curvas abiertas (ratio irracional), L tiende a infinito pero la curva permanece acotada. La curvatura varía: es máxima en los vértices donde la curva cambia dirección bruscamente.`
    });

    // Paso 6: Aplicaciones y Conexión con Teoría de Sistemas Dinámicos
    const lyapunov_exp = 0;
    const orbitType = isRational ? `**Periódica** (ratio racional ${simplifiedX}:${simplifiedY})` : '**Cuasi-periódica** (ratio irracional)';
    const torusDim = isRational ? '1D (círculo en 3D)' : '2D (toro en espacio de fases extendido)';
    
    const explainDynamics = isRational ?
      `Con ratio racional ${simplifiedX}:${simplifiedY}, la órbita es periódica, correspondiendo a un círculo (órbita 1D) en el espacio de fases 3D. Esto es un caso de resonancia: las dos frecuencias están en relación armónica.` :
      'Con ratio irracional, la órbita es cuasi-periódica, llenando densamente un toro 2D en el espacio de fases extendido. Esto ilustra el teorema KAM: bajo perturbaciones, toros con ratios suficientemente irracionales persisten, mientras resonancias racionales se destruyen.';
    
    steps.push({
      title: '6. Aplicaciones y Teoría de Órbitas Periódicas',
      formula: 'Sistema: ẋ = Aω₁cos(ω₁t), ẏ = Bω₂cos(ω₂t+φ)   Hamiltoniano: H = -Aω₁sin(ω₁t) - Bω₂sin(ω₂t+φ)',
      substitution: `Clasificación dinámica:
Tipo de sistema: Oscilador lineal desacoplado (no autónomo)
Dimensión del espacio de fases: 2D (si eliminamos t) o 3D (incluyendo t)
Estabilidad: Neutralmente estable (órbitas acotadas)
Exponente de Lyapunov: λ = ${lyapunov_exp} (ni estable ni inestable)

Aplicaciones prácticas:
1. **Osciloscopios**: Visualización de señales AC (Lissajous patterns)
   - Determinar ratio de frecuencias contando loops
   - Medir desfase entre señales
   
2. **Mecánica**: Péndulos acoplados, modos normales de vibración
   - Sistemas con dos grados de libertad
   - Resonancias y anti-resonancias
   
3. **Óptica**: Figuras de difracción, polarización elíptica
   - Combinación de ondas perpendiculares
   
4. **Astronomía**: Órbitas de Lissajous en puntos de Lagrange
   - Satélites JWST, SOHO (órbitas cuasi-periódicas)`,
      result: `**Estabilidad estructural**: Alta (perturbaciones pequeñas solo deforman ligeramente la curva)
**Tipo de órbita**: ${orbitType}
**Dimensión del toro**: ${torusDim}
**Aplicación principal**: Análisis de señales, sistemas oscilatorios, navegación espacial
**Relevancia histórica**: Estudio pionero de sistemas multiperiódicos (Poincaré, 1890s)`,
      explanation: `Las curvas de Lissajous tienen profunda conexión con la teoría de sistemas dinámicos. Representan un caso simple de sistema multiperiódico: dos osciladores independientes acoplados solo por la restricción de compartir el plano. ${explainDynamics} Históricamente, Poincaré estudió estas órbitas en mecánica celeste, donde aparecen en órbitas alrededor de puntos de Lagrange. En ingeniería, se usan para: (1) medir frecuencias y fases en osciloscopios analógicos; (2) diseñar órbitas de satélites (JWST usa órbita de Lissajous alrededor de L2); (3) analizar modos normales en sistemas vibracionales. El caso φ=π/2 con A=B=1 produce un círculo, base de la representación fasorial en AC.`
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
