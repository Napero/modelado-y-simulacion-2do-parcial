import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';
import { COLORS } from '../../utils/chart-helpers';

export class RomeoJulietExercise extends ExerciseBase {
  getTitle(): string {
    return 'Modelo de Romeo y Julieta';
  }

  getDescription(): string {
    return 'Modelo matemático de la relación amorosa entre Romeo y Julieta. dR/dt = a·R + b·J (amor de Romeo), dJ/dt = c·R + d·J (amor de Julieta). Los coeficientes determinan cómo cada uno responde a los sentimientos del otro.';
  }

  getInputFields() {
    return [
      { name: 'a', label: 'a (respuesta de Romeo a sí mismo)', defaultValue: -1, step: 0.1 },
      { name: 'b', label: 'b (respuesta de Romeo a Julieta)', defaultValue: 1, step: 0.1 },
      { name: 'c', label: 'c (respuesta de Julieta a Romeo)', defaultValue: -2, step: 0.1 },
      { name: 'd', label: 'd (respuesta de Julieta a sí misma)', defaultValue: 0.5, step: 0.1 },
      { name: 'R0', label: 'Amor inicial de Romeo (R₀)', defaultValue: 1, step: 0.1 },
      { name: 'J0', label: 'Amor inicial de Julieta (J₀)', defaultValue: 0, step: 0.1 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 20, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { a, b, c, d, R0, J0, tMax } = params;
    
    const steps: SimulationResult['steps'] = [];
    
    const a_num = a as number;
    const b_num = b as number;
    const c_num = c as number;
    const d_num = d as number;
    
    // Paso 1: Modelo de Romeo y Julieta
    steps.push({
      title: '1. Modelo Matemático de Relación Romántica',
      formula: 'dR/dt = a·R + b·J,  dJ/dt = c·R + d·J',
      substitution: `dR/dt = ${a}·R + ${b}·J
dJ/dt = ${c}·R + ${d}·J
Matriz: A = [[${a}, ${b}], [${c}, ${d}]]`,
      result: `**Variables:** R = amor de Romeo, J = amor de Julieta
**Equilibrio:** (R*, J*) = (0, 0) (indiferencia mutua)`,
      explanation: `Modelo de Strogatz para dinámicas románticas. R > 0 indica amor, R < 0 odio. El término a·R representa la autoestima romántica de Romeo (si a < 0, se enfría cuando está muy enamorado). El término b·J es la respuesta de Romeo al amor de Julieta. Simétricamente para Julieta con coeficientes c y d.`
    });

    // Paso 2: Interpretación psicológica de coeficientes (matriz de personalidades)
    const personalityR = a_num > 0 ? 'ENTUSIASTA (↑ refuerza)' : a_num < 0 ? 'CAUTELOSO (↓ modera)' : 'NEUTRAL';
    const responseR = b_num > 0 ? 'RECEPTIVO (+ de J → + de R)' : b_num < 0 ? 'CONTRARIO (+ de J → - de R)' : 'INDIFERENTE';
    const personalityJ = d_num > 0 ? 'ENTUSIASTA (↑ refuerza)' : d_num < 0 ? 'CAUTELOSA (↓ modera)' : 'NEUTRAL';
    const responseJ = c_num > 0 ? 'RECEPTIVA (+ de R → + de J)' : c_num < 0 ? 'CONTRARIA (+ de R → - de J)' : 'INDIFERENTE';
    
    steps.push({
      title: '2. Matriz de Personalidades',
      formula: 'Coeficientes diagonales (a, d): autorespuesta. Extradiagonales (b, c): respuesta al otro',
      substitution: `**Romeo:** a = ${a} → ${personalityR}
            b = ${b} → ${responseR}
**Julieta:** d = ${d} → ${personalityJ}
              c = ${c} → ${responseJ}`,
      result: `**Tipo de relación:** ${b_num * c_num > 0 ? 'Simétrica (ambos receptivos o ambos contrarios)' : b_num * c_num < 0 ? 'Asimétrica (uno receptivo, otro contrario)' : 'Unilateral (uno no responde)'}`,
      explanation: `Los coeficientes diagonales (a, d) determinan si cada persona se autorrefuerza (entusiasta, a > 0) o se automodera (cauteloso, a < 0). Los extradiagonales (b, c) determinan la reciprocidad: si b·c > 0 hay retroalimentación (positiva o negativa), si b·c < 0 hay asimetría (uno persigue, otro huye). El caso clásico "Romeo cauteloso, Julieta contraria" (a < 0, c < 0) genera oscilaciones.`
    });

    // Paso 3: Traza, determinante y autovalores
    const trace = a_num + d_num;
    const det = a_num * d_num - b_num * c_num;
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
      title: '3. Autovalores y Análisis Espectral',
      formula: 'λ² - τ·λ + Δ = 0,  donde τ = a+d, Δ = ad-bc',
      substitution: `τ = ${trace.toFixed(4)}, Δ = ${det.toFixed(4)}
Discriminante: τ²-4Δ = ${discriminant.toFixed(4)}
${eigenvaluesStr}`,
      result: `${discriminant >= 0 ? 'Autovalores REALES' : 'Autovalores COMPLEJOS (frecuencia ω = ' + imagPart.toFixed(4) + ')'}`,
      explanation: `Los autovalores determinan la dinámica temporal. ${discriminant >= 0 ? 'Autovalores reales implican trayectorias monotónicas (nodos) o hiperbólicas (silla), sin oscilaciones.' : 'Autovalores complejos ⟹ oscilaciones con periodo T ≈ ' + (2*Math.PI/imagPart).toFixed(2) + '. La relación alterna entre amor y odio cíclicamente.'}`
    });

    // Paso 4: Clasificación de la relación
    let relationshipType: string;
    let dynamicDescription: string;
    
    if (det < 0) {
      relationshipType = 'RELACIÓN SILLA (trágica)';
      dynamicDescription = `Δ < 0 ⟹ autovalores de signos opuestos. Uno se enamora mientras el otro se desenamoraInestable: no pueden sincronizarse, uno persigue mientras el otro huye. Ejemplo clásico de amor no correspondido dinámicamente.`;
    } else if (det > 0) {
      if (trace < 0) {
        if (discriminant >= 0) {
          relationshipType = 'AMOR ESTABLE CONVERGENTE';
          dynamicDescription = `Ambos λ < 0, reales. La relación se estabiliza en equilibrio (indiferencia mutua si el equilibrio es el origen). Desde cualquier estado inicial, eventualmente pierden interés mutuo.`;
        } else {
          relationshipType = 'CICLOS AMORTIGUADOS (amor oscilante decreciente)';
          dynamicDescription = `Re(λ) < 0, Im(λ) ≠ 0. Oscilaciones de amor/odio que se amortiguan con el tiempo. Como un péndulo con fricción: pasan por fases de amor y odio, pero la intensidad decrece hasta alcanzar indiferencia.`;
        }
      } else if (trace > 0) {
        if (discriminant >= 0) {
          relationshipType = 'AMOR EXPLOSIVO (fuera de control)';
          dynamicDescription = `Ambos λ > 0, reales. La intensidad emocional diverge exponencialmente. Si inician enamorados, el amor crece sin límite (poco realista). Si inician odiándose, el odio se intensifica sin control.`;
        } else {
          relationshipType = 'CICLOS EXPANSIVOS (drama creciente)';
          dynamicDescription = `Re(λ) > 0, Im(λ) ≠ 0. Oscilaciones de amor/odio con amplitud creciente. Relación volátil: los altibajos emocionales se intensifican con el tiempo, cada ciclo más dramático que el anterior.`;
        }
      } else {
        relationshipType = 'AMOR CÍCLICO PERFECTO (órbitas cerradas)';
        dynamicDescription = `τ = 0, Δ > 0 ⟹ λ = ±iω. Oscilaciones perpetuas con amplitud constante. Romeo y Julieta alternan entre amor y odio periódicamente, pero la intensidad se mantiene. Requiere simetría perfecta (a + d = 0).`;
      }
    } else {
      relationshipType = 'RELACIÓN DEGENERADA';
      dynamicDescription = `Δ = 0 ⟹ λ = 0 es autovalor. El sistema tiene una dirección de equilibrios. Matemáticamente singular, poco realista para relaciones.`;
    }
    
    steps.push({
      title: '4. Clasificación de la Relación',
      formula: 'Basado en signos de τ, Δ, y τ²-4Δ',
      substitution: `τ = ${trace.toFixed(4)} ${trace > 0 ? '> 0' : trace < 0 ? '< 0' : '= 0'}
Δ = ${det.toFixed(4)} ${det > 0 ? '> 0' : det < 0 ? '< 0' : '= 0'}`,
      result: `**Tipo:** ${relationshipType}`,
      explanation: dynamicDescription
    });

    // Paso 5: Predicción temporal
    const period = discriminant < 0 ? 2 * Math.PI / imagPart : null;
    const timescale = trace !== 0 ? Math.abs(1 / (trace / 2)) : null;
    
    steps.push({
      title: '5. Predicción Temporal',
      formula: discriminant < 0 ? 'Periodo: T = 2π/ω,  Escala temporal: τ_time = 2/|Re(λ)|' : 'Escala temporal: τ_time = 1/|λ_max|',
      substitution: discriminant < 0 ? 
        `ω = ${imagPart.toFixed(4)} ⟹ T ≈ ${period?.toFixed(2)} unidades
Escala: τ ≈ ${timescale?.toFixed(2)} (tiempo para cambio significativo)` :
        `λ_max ≈ ${Math.max(Math.abs(lambda1), Math.abs(lambda2)).toFixed(4)}
Escala: τ ≈ ${(1/Math.max(Math.abs(lambda1), Math.abs(lambda2))).toFixed(2)}`,
      result: discriminant < 0 ? 
        `**Oscilaciones cada ~${period?.toFixed(1)} unidades de tiempo**` :
        `**Cambio exponencial con escala ~${(1/Math.max(Math.abs(lambda1), Math.abs(lambda2))).toFixed(1)} unidades**`,
      explanation: discriminant < 0 ?
        `El periodo T indica cuánto tarda un ciclo completo amor→odio→amor. La frecuencia angular ω = ${imagPart.toFixed(4)} rad/tiempo determina la rapidez de las oscilaciones.` :
        `La escala temporal indica cuánto tarda el sistema en cambiar significativamente (factor e ≈ 2.718). En este tiempo, las emociones se multiplican o dividen por e.`
    });

    // Resolver numéricamente
    const dt = 0.01;
    const t: number[] = [];
    const R: number[] = [];
    const J: number[] = [];
    
    let currentR = R0 as number;
    let currentJ = J0 as number;
    let currentT = 0;
    
    while (currentT <= (tMax as number)) {
      t.push(currentT);
      R.push(currentR);
      J.push(currentJ);
      
      // RK4
      const k1R = (a as number) * currentR + (b as number) * currentJ;
      const k1J = (c as number) * currentR + (d as number) * currentJ;
      
      const k2R = (a as number) * (currentR + dt * k1R / 2) + (b as number) * (currentJ + dt * k1J / 2);
      const k2J = (c as number) * (currentR + dt * k1R / 2) + (d as number) * (currentJ + dt * k1J / 2);
      
      const k3R = (a as number) * (currentR + dt * k2R / 2) + (b as number) * (currentJ + dt * k2J / 2);
      const k3J = (c as number) * (currentR + dt * k2R / 2) + (d as number) * (currentJ + dt * k2J / 2);
      
      const k4R = (a as number) * (currentR + dt * k3R) + (b as number) * (currentJ + dt * k3J);
      const k4J = (c as number) * (currentR + dt * k3R) + (d as number) * (currentJ + dt * k3J);
      
      currentR = currentR + (dt / 6) * (k1R + 2 * k2R + 2 * k3R + k4R);
      currentJ = currentJ + (dt / 6) * (k1J + 2 * k2J + 2 * k3J + k4J);
      currentT += dt;
    }

    // Paso 6: Resultado de la simulación
    const R_final = R[R.length - 1];
    const J_final = J[J.length - 1];
    const intensity_final = Math.sqrt(R_final * R_final + J_final * J_final);
    const R0_num = R0 as number;
    const J0_num = J0 as number;
    const intensity_initial = Math.sqrt(R0_num * R0_num + J0_num * J0_num);
    const growth = intensity_final / intensity_initial;
    
    let finalInterpretation = '';
    if (Math.abs(R_final) < 0.1 && Math.abs(J_final) < 0.1) {
      finalInterpretation = 'Ambos tienden a la indiferencia mutua.';
    } else if (R_final > 0 && J_final > 0) {
      finalInterpretation = 'Amor mutuo ' + (growth > 1.5 ? 'creciente' : 'estable') + '.';
    } else if (R_final < 0 && J_final < 0) {
      finalInterpretation = 'Odio mutuo ' + (growth > 1.5 ? 'creciente' : 'estable') + '.';
    } else if (R_final * J_final < 0) {
      finalInterpretation = 'Sentimientos opuestos (uno ama, otro odia).';
    } else {
      finalInterpretation = 'Relación en transición.';
    }
    
    steps.push({
      title: '6. Resultado de la Simulación',
      formula: `(R(${tMax}), J(${tMax})) calculado con RK4`,
      substitution: `Desde (R₀, J₀) = (${R0}, ${J0})
Hasta (R, J) = (${R_final.toFixed(3)}, ${J_final.toFixed(3)})
Intensidad: ${intensity_initial.toFixed(3)} → ${intensity_final.toFixed(3)}`,
      result: `**R(${tMax}) = ${R_final.toFixed(2)}** (Romeo)
**J(${tMax}) = ${J_final.toFixed(2)}** (Julieta)
**Factor:** ×${growth.toFixed(2)}`,
      explanation: `${finalInterpretation} La simulación numérica confirma el análisis teórico: ${relationshipType}. ${growth > 1.5 ? 'La intensidad emocional crece exponencialmente.' : growth < 0.7 ? 'La intensidad emocional decrece hacia cero.' : 'La intensidad se mantiene relativamente constante (posible oscilación).'}`
    });

    return {
      steps,
      data: [
        // Emociones vs Tiempo
        {
          title: 'Emociones vs Tiempo',
          type: 'line',
          datasets: [
            {
              label: 'R(t) = Amor de Romeo',
              data: t.map((ti, i) => ({ x: ti, y: R[i] })),
              borderColor: COLORS.stable,
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true
            },
            {
              label: 'J(t) = Amor de Julieta',
              data: t.map((ti, i) => ({ x: ti, y: J[i] })),
              borderColor: COLORS.unstable,
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true
            }
          ],
          xLabel: 'Tiempo',
          yLabel: 'Amor (Desamor)'
        },
        // Trayectoria en el plano (R, J)
        {
          title: 'Trayectoria en el plano (R, J)',
          type: 'scatter',
          datasets: [
            {
              label: 'Trayectoria',
              data: R.map((ri, i) => ({ x: ri, y: J[i] })),
              borderColor: '#9b59b6',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true,
              tension: 0
            },
            {
              label: 'Inicio',
              data: [{ x: R0 as number, y: J0 as number }],
              backgroundColor: '#2ecc71',
              borderColor: '#2ecc71',
              pointRadius: 7,
              pointStyle: 'circle',
              borderWidth: 3,
              showLine: false
            },
            {
              label: 'Final',
              data: [{ x: R[R.length-1], y: J[J.length-1] }],
              backgroundColor: '#e74c3c',
              borderColor: '#e74c3c',
              pointRadius: 7,
              pointStyle: 'rect',
              borderWidth: 3,
              showLine: false
            },
            {
              label: 'Equilibrio (0,0)',
              data: [{ x: 0, y: 0 }],
              backgroundColor: '#f39c12',
              borderColor: '#f39c12',
              pointRadius: 8,
              pointStyle: 'star',
              borderWidth: 3,
              showLine: false
            }
          ],
          xLabel: 'Romeo (R)',
          yLabel: 'Julieta (J)'
        }
      ]
    };
  }
}
