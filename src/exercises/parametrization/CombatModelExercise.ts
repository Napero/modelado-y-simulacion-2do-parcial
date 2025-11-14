import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class CombatModelExercise extends ExerciseBase {
  getTitle(): string {
    return 'Modelo de Combate de Lanchester';
  }

  getDescription(): string {
    return 'Modela el combate entre dos ejércitos. dA/dt = -βB (pérdidas del ejército A), dB/dt = -αA (pérdidas del ejército B). α, β son las tasas de efectividad de combate.';
  }

  getInputFields() {
    return [
      { name: 'A0', label: 'Tropas iniciales A', defaultValue: 100, step: 1 },
      { name: 'B0', label: 'Tropas iniciales B', defaultValue: 80, step: 1 },
      { name: 'alpha', label: 'α (efectividad de A)', defaultValue: 0.05, step: 0.01 },
      { name: 'beta', label: 'β (efectividad de B)', defaultValue: 0.04, step: 0.01 },
      { name: 'tMax', label: 'Tiempo máximo', defaultValue: 50, step: 1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { A0, B0, alpha, beta, tMax } = params;
    
    const A0_num = A0 as number;
    const B0_num = B0 as number;
    const alpha_num = alpha as number;
    const beta_num = beta as number;
    const tMax_num = tMax as number;
    
    const steps: SimulationResult['steps'] = [];
    
    // Paso 1: Ley Cuadrática de Lanchester
    steps.push({
      title: '1. Ley Cuadrática de Lanchester (Combate Directo)',
      formula: 'dA/dt = -β·B\\ndB/dt = -α·A',
      substitution: `Para este combate:
α = ${alpha_num} (efectividad del ejército A)
β = ${beta_num} (efectividad del ejército B)
A(0) = ${A0_num} tropas, B(0) = ${B0_num} tropas

Sistema:
dA/dt = -${beta_num}·B
dB/dt = -${alpha_num}·A`,
      result: `**Modelo de combate moderno**: cada soldado puede atacar a cualquier enemigo
**Tasas de atrito**: α=${alpha_num}, β=${beta_num}
**Interpretación**: Las pérdidas de un bando son proporcionales al tamaño del bando contrario`,
      explanation: 'La ley cuadrática de Lanchester (1916) modela combates donde cada unidad puede atacar a cualquier unidad enemiga (combate con armas de fuego de largo alcance). Las pérdidas de A dependen del tamaño de B (no de A), capturando la idea de concentración de fuego. Los parámetros α y β representan la efectividad relativa de cada ejército (entrenamiento, armamento, táctica). Este modelo predice que duplicar el tamaño de un ejército cuadruplica su efectividad de combate, justificando estrategias de concentración de fuerzas.'
    });

    // Paso 2: Invariante de Lanchester (Primera Integral)
    const C = alpha_num * A0_num ** 2 - beta_num * B0_num ** 2;
    
    steps.push({
      title: '2. Invariante de Lanchester (Ley de Conservación)',
      formula: 'I(A,B) = α·A² - β·B² = constante\\n\\nDerivando:\\ndI/dt = 2α·A·(dA/dt) - 2β·B·(dB/dt)\\n      = 2α·A·(-β·B) - 2β·B·(-α·A)\\n      = -2αβAB + 2αβAB = 0',
      substitution: `Constante de combate:
C = α·A₀² - β·B₀²
C = ${alpha_num}·(${A0_num})² - ${beta_num}·(${B0_num})²
C = ${alpha_num}·${A0_num ** 2} - ${beta_num}·${B0_num ** 2}
C = ${(alpha_num * A0_num ** 2).toFixed(2)} - ${(beta_num * B0_num ** 2).toFixed(2)}`,
      result: `**C = ${C.toFixed(2)}** (se conserva durante toda la batalla)
**Significado**: ${C > 0 ? 'C > 0 → Ventaja para A' : C < 0 ? 'C < 0 → Ventaja para B' : 'C = 0 → Fuerzas equilibradas'}
**Curvas de nivel**: Hipérbolas α·A² - β·B² = C en el plano de fase`,
      explanation: 'El invariante de Lanchester es una primera integral del sistema (análogo a la energía en sistemas conservativos). Geométricamente, las trayectorias siguen hipérbolas en el plano (A,B). El signo de C determina el resultado antes de que comience la batalla: si C>0, el ejército A tiene ventaja estratégica; si C<0, B tiene ventaja; si C=0, es un empate (destrucción mutua). Esta ley demuestra que la victoria depende no solo del tamaño inicial sino del producto de tamaño y efectividad al cuadrado, enfatizando la importancia de la concentración de fuerzas.'
    });

    // Paso 3: Predicción del Resultado y Tropas Remanentes
    let winnerForce: number;
    let winner: string;
    
    if (C > 0) {
      winnerForce = Math.sqrt(C / alpha_num);
      winner = 'A';
    } else if (C < 0) {
      winnerForce = Math.sqrt(-C / beta_num);
      winner = 'B';
    } else {
      winnerForce = 0;
      winner = 'Empate';
    }
    
    const ratio_A = alpha_num * A0_num ** 2;
    const ratio_B = beta_num * B0_num ** 2;
    
    steps.push({
      title: '3. Predicción del Resultado (Condiciones de Victoria)',
      formula: 'Si C = αA₀² - βB₀² > 0 → Gana A con A_final = √(C/α)\\nSi C < 0 → Gana B con B_final = √(-C/β)\\nSi C = 0 → Empate (ambos llegan a 0)',
      substitution: `Potencias de combate iniciales:
Potencia de A: α·A₀² = ${alpha_num}·${A0_num}² = ${ratio_A.toFixed(2)}
Potencia de B: β·B₀² = ${beta_num}·${B0_num}² = ${ratio_B.toFixed(2)}
Diferencia: C = ${ratio_A.toFixed(2)} - ${ratio_B.toFixed(2)} = ${C.toFixed(2)}

${C !== 0 ? `Tropas remanentes del ganador:
${winner}_final = √(${C > 0 ? 'C/α' : '-C/β'}) = √(${Math.abs(C).toFixed(2)}/${C > 0 ? alpha_num : beta_num}) = ${winnerForce.toFixed(2)}` : 'Ambos ejércitos se aniquilan completamente'}`,
      result: `**Ganador predicho: ${winner}**
${C !== 0 ? `**Tropas supervivientes**: ${winnerForce.toFixed(1)} soldados de ${winner}` : '**Destrucción mutua asegurada**'}
**Margen de victoria**: ${C > 0 ? `A tiene ventaja de ${C.toFixed(1)} unidades²` : C < 0 ? `B tiene ventaja de ${(-C).toFixed(1)} unidades²` : 'Perfectamente equilibrado'}`,
      explanation: `La ley de Lanchester permite predecir el resultado completo de la batalla antes de que comience. La "potencia de combate" de cada ejército es propproporcional al cuadrado de su tamaño multiplicado por su efectividad (α·A² y β·B²). ${C > 0 ? `En este caso, A tiene mayor potencia (${ratio_A.toFixed(1)} vs ${ratio_B.toFixed(1)}), por lo que prevalece con ${winnerForce.toFixed(1)} tropas restantes.` : C < 0 ? `Aquí B tiene mayor potencia (${ratio_B.toFixed(1)} vs ${ratio_A.toFixed(1)}), resultando en victoria con ${winnerForce.toFixed(1)} tropas.` : 'Las potencias están perfectamente equilibradas, llevando a aniquilación mutua.'} Esta predicción es exacta (no aproximada) y demuestra el principio militar de "concentración de fuerzas": es mejor tener 100 soldados contra 70 que dividirse en dos grupos de 50 contra dos de 35 (100²>2·50² cuando se normaliza por efectividad).`
    });

    // Paso 4: Equilibrios y Estructura del Espacio de Fases
    steps.push({
      title: '4. Análisis de Equilibrios y Espacio de Fases',
      formula: 'Equilibrios: dA/dt = 0, dB/dt = 0\\n-β·B = 0 → B* = 0\\n-α·A = 0 → A* = 0',
      substitution: `Único equilibrio:
P* = (A*, B*) = (0, 0)

Jacobiano en cualquier punto (A,B):
J(A,B) = [∂(dA/dt)/∂A    ∂(dA/dt)/∂B]   =  [0      -β]
         [∂(dB/dt)/∂A    ∂(dB/dt)/∂B]      [-α      0]

Con α=${alpha_num}, β=${beta_num}:
J = [0         -${beta_num}]
    [-${alpha_num}       0]

Traza: τ = 0
Determinante: Δ = 0 - (-α)·(-β) = -αβ = -${alpha_num}·${beta_num} = ${(-alpha_num * beta_num).toFixed(4)}`,
      result: `**Único equilibrio**: (0,0) = aniquilación total
**Δ = ${(-alpha_num * beta_num).toFixed(4)} < 0** → El origen es un **punto de silla**
**Isoclinas nulas**: dA/dt=0 cuando B=0 (eje A), dB/dt=0 cuando A=0 (eje B)
**Trayectorias**: Hipérbolas α·A² - β·B² = C que no pasan por el origen (excepto C=0)`,
      explanation: 'El único equilibrio (0,0) representa la aniquilación completa de ambos ejércitos, pero es inestable (punto de silla con Δ<0). Las trayectorias son hipérbolas determinadas por el invariante C, y todas convergen hacia uno de los ejes (A=0 o B=0), indicando que uno de los bandos siempre es eliminado completamente. Las isoclinas nulas (dA/dt=0 y dB/dt=0) son los ejes coordenados: sobre el eje A (B=0) no hay cambio en A, y sobre el eje B (A=0) no hay cambio en B. Esta estructura de silla explica por qué las batallas no terminan en empates parciales: el sistema empuja hacia la eliminación completa de un bando.'
    });

    // Paso 5: Solución Numérica y Duración de la Batalla
    const dt = 0.1;
    const t: number[] = [];
    const A: number[] = [];
    const B: number[] = [];
    
    let currentA = A0_num;
    let currentB = B0_num;
    let currentT = 0;
    
    while (currentT <= tMax_num && currentA > 0.1 && currentB > 0.1) {
      t.push(currentT);
      A.push(currentA);
      B.push(currentB);
      
      const dAdt = -beta_num * currentB;
      const dBdt = -alpha_num * currentA;
      
      currentA += dt * dAdt;
      currentB += dt * dBdt;
      currentT += dt;
      
      if (currentA < 0) currentA = 0;
      if (currentB < 0) currentB = 0;
    }

    const battleEnd = t[t.length - 1];
    const finalA = A[A.length - 1];
    const finalB = B[B.length - 1];
    const lossesA = A0_num - finalA;
    const lossesB = B0_num - finalB;
    
    steps.push({
      title: '5. Simulación Numérica y Duración del Combate',
      formula: 'Integración numérica: A(t+Δt) = A(t) + Δt·(dA/dt)\\nB(t+Δt) = B(t) + Δt·(dB/dt)\\ncon Δt = 0.1',
      substitution: `Condiciones iniciales: A(0)=${A0_num}, B(0)=${B0_num}
Tiempo máximo simulado: ${tMax_num}

Resultados de la simulación:
t_final = ${battleEnd.toFixed(1)} (duración de la batalla)
A(t_final) = ${finalA.toFixed(1)} tropas
B(t_final) = ${finalB.toFixed(1)} tropas

Bajas:
Ejército A: ${lossesA.toFixed(1)} soldados (${((lossesA/A0_num)*100).toFixed(1)}% de pérdidas)
Ejército B: ${lossesB.toFixed(1)} soldados (${((lossesB/B0_num)*100).toFixed(1)}% de pérdidas)`,
      result: `**Duración**: ${battleEnd.toFixed(1)} unidades de tiempo
**Ganador numérico**: ${finalA > 1 ? 'A' : finalB > 1 ? 'B' : 'Empate'} ${finalA > 1 ? `con ${finalA.toFixed(1)} tropas` : finalB > 1 ? `con ${finalB.toFixed(1)} tropas` : '(ambos aniquilados)'}
**Verificación del invariante**: C=${C.toFixed(2)} (predicción analítica) vs simulación (${finalA > 1 ? `A_final=${finalA.toFixed(1)} ≈ ${winnerForce.toFixed(1)}` : finalB > 1 ? `B_final=${finalB.toFixed(1)} ≈ ${winnerForce.toFixed(1)}` : 'empate confirmado'})`,
      explanation: `La simulación numérica confirma las predicciones analíticas del invariante de Lanchester. La batalla termina en t=${battleEnd.toFixed(1)} cuando un ejército es eliminado. ${finalA > 1 ? `El ejército A prevalece con ${finalA.toFixed(1)} tropas, muy cercano a la predicción analítica de ${winnerForce.toFixed(1)} tropas.` : finalB > 1 ? `El ejército B gana con ${finalB.toFixed(1)} tropas, concordando con la predicción de ${winnerForce.toFixed(1)} tropas.` : 'Ambos ejércitos son aniquilados, confirmando C≈0.'} La duración depende de las tasas de atrito α y β: combates más efectivos (α,β grandes) terminan más rápido. El modelo captura la dinámica no lineal del combate: las pérdidas se aceleran a medida que un bando gana ventaja, llevando a una conclusión rápida una vez que se establece la superioridad.`
    });

    // Paso 6: Interpretación Militar y Aplicaciones Históricas
    const force_ratio = A0_num / B0_num;
    const effectivity_ratio = Math.sqrt(alpha_num / beta_num);
    const combat_power_ratio = Math.sqrt(ratio_A / ratio_B);
    
    steps.push({
      title: '6. Interpretación Militar y Principios Estratégicos',
      formula: 'Potencia de combate relativa: √(α·A₀²/β·B₀²) = (A₀/B₀)·√(α/β)',
      substitution: `Análisis estratégico:
Ratio numérico: A₀/B₀ = ${A0_num}/${B0_num} = ${force_ratio.toFixed(2)}
Ratio de efectividad: √(α/β) = √(${alpha_num}/${beta_num}) = ${effectivity_ratio.toFixed(2)}
**Potencia de combate relativa**: ${combat_power_ratio.toFixed(2)}:1 a favor de ${C > 0 ? 'A' : C < 0 ? 'B' : 'empate'}

Principios de Lanchester:
1. **Principio de superioridad numérica al cuadrado**: Duplicar tropas cuadruplica poder
2. **Concentración de fuerzas**: ${A0_num} vs ${B0_num} es mejor que dividir (${Math.floor(A0_num/2)} vs ${Math.floor(B0_num/2)}) + (${Math.ceil(A0_num/2)} vs ${Math.ceil(B0_num/2)})
3. **Efectividad táctica**: Una mejora de ${(effectivity_ratio*100-100).toFixed(0)}% en α/β equivale a aumentar ${((effectivity_ratio-1)*A0_num).toFixed(0)} tropas`,
      result: `**Ratio de potencia**: ${combat_power_ratio.toFixed(2)}:1
**Estrategia óptima para ${C < 0 ? 'A' : 'B'}** (el más débil): ${C < 0 ? 'Evitar batalla decisiva, guerrilla, dividir fuerzas enemigas' : 'Evitar batalla decisiva, táctica defensiva, buscar refuerzos'}
**Estrategia óptima para ${C > 0 ? 'A' : 'B'}** (el más fuerte): ${C > 0 ? 'Forzar batalla decisiva, concentrar fuerzas, impedir retirada enemiga' : 'Batalla decisiva inmediata, maximizar contacto'}
**Aplicaciones históricas**: Batalla de Iwo Jima (1945), análisis de Guerra Fría, doctrina militar moderna`,
      explanation: `La ley de Lanchester tiene profundas implicaciones militares verificadas históricamente. El principio clave es que el poder de combate escala con el cuadrado del tamaño del ejército: un ejército de 100 contra uno de 70 tiene ventaja de 100²:70²=10000:4900≈2:1 (no 100:70≈1.4:1). Esto explica por qué la concentración de fuerzas es fundamental: es mejor pelear una batalla grande (100 vs 70) que dos pequeñas (50 vs 35 cada una), porque 100²-70²=5100 > 2(50²-35²)=2550. El modelo fue usado en la Segunda Guerra Mundial para estimar resultados de batallas navales y aéreas. En la Guerra Fría, justificó la doctrina de "destrucción mutua asegurada" (MAD). Limitaciones: asume combate homogéneo (no aplica a guerrillas, no considera terreno, moral, o innovaciones tácticas). Strogatz nota que extensiones incluyen refuerzos, diferentes tipos de unidades, y efectos de terreno.`
    });

    return {
      steps,
      data: [
        {
          x: t,
          y: A,
          label: 'Ejército A'
        },
        {
          x: t,
          y: B,
          label: 'Ejército B'
        }
      ]
    };
  }
}
