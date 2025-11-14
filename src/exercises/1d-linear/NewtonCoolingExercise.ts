import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

export class NewtonCoolingExercise extends ExerciseBase {
  getTitle(): string {
    return 'Ley de Enfriamiento de Newton';
  }

  getDescription(): string {
    return 'La ley de enfriamiento de Newton establece que la tasa de cambio de temperatura de un objeto es proporcional a la diferencia entre su temperatura y la temperatura ambiente. Ecuación: dT/dt = -k·(T - T_amb)';
  }

  getInputFields() {
    return [
      { name: 'T0', label: 'Temperatura inicial (T₀) °C', defaultValue: 100 },
      { name: 'Tamb', label: 'Temperatura ambiente (T_amb) °C', defaultValue: 20 },
      { name: 'k', label: 'Constante de enfriamiento (k)', defaultValue: 0.1, step: 0.01 },
      { name: 'tMax', label: 'Tiempo máximo (minutos)', defaultValue: 50, step: 1 },
      { name: 'dt', label: 'Paso de tiempo (Δt)', defaultValue: 0.5, step: 0.1 }
    ];
  }

  solve(params: ExerciseParams): SimulationResult {
    const { T0, Tamb, k, tMax, dt } = params;
    
    const steps: SimulationResult['steps'] = [];
    const t: number[] = [];
    const T: number[] = [];
    
    const T0_num = T0 as number;
    const Tamb_num = Tamb as number;
    const k_num = k as number;
    const diff = T0_num - Tamb_num;
    
    // Paso 1: Definición del Sistema - Ley de Newton
    steps.push({
      title: '1. Definición del Sistema - Ley de Enfriamiento de Newton',
      formula: 'dT/dt = -k·(T - T_amb)',
      substitution: `dT/dt = -${k}·(T - ${Tamb})`,
      result: `**Parámetros:** k = ${k} (coef. enfriamiento), T_amb = ${Tamb}°C, T₀ = ${T0}°C`,
      explanation: `La ley de Newton establece que la tasa de enfriamiento es proporcional a la diferencia de temperatura con el ambiente. El signo negativo indica que si T > T_amb, entonces dT/dt < 0 (el objeto se enfría). Este modelo es válido para diferencias de temperatura moderadas donde la transferencia de calor es principalmente por convección.`
    });

    // Paso 2: Punto de equilibrio y estabilidad
    steps.push({
      title: '2. Punto de Equilibrio y Estabilidad',
      formula: 'dT/dt = 0  ⟹  -k·(T* - T_amb) = 0',
      substitution: `T* - ${Tamb} = 0  ⟹  T* = ${Tamb}°C`,
      result: `**Equilibrio:** T* = ${Tamb}°C (temperatura ambiente)
**Estabilidad:** f'(T*) = -k = -${k} < 0 → ESTABLE`,
      explanation: `El único equilibrio es T* = T_amb: cuando el objeto alcanza la temperatura ambiente, deja de intercambiar calor. Para verificar estabilidad, calculamos f'(T) = -k < 0, lo que confirma que es un atractor: cualquier temperatura inicial T₀ ≠ T_amb converge exponencialmente hacia T_amb.`
    });

    // Paso 3: Solución analítica mediante separación de variables
    steps.push({
      title: '3. Solución Analítica - Método de Separación de Variables',
      formula: 'dT/(T - T_amb) = -k·dt  ⟹  ∫dT/(T - T_amb) = ∫-k·dt',
      substitution: `ln|T - T_amb| = -k·t + C
Aplicando T(0) = ${T0}: ln|${T0} - ${Tamb}| = C
C = ln(${diff})`,
      result: `**T(t) = T_amb + (T₀ - T_amb)·e^(-k·t)**
T(t) = ${Tamb} + ${diff}·e^(-${k}·t)`,
      explanation: `La ecuación es separable: movemos todos los términos en T a un lado y los de t al otro. Integrando ambos lados obtenemos una relación logarítmica. Aplicando la condición inicial T(0) = T₀ determinamos la constante C. La solución muestra decaimiento exponencial hacia T_amb con constante de tiempo τ = 1/k.`
    });

    // Paso 4: Tiempo característico
    const tau = 1 / k_num;
    const T_at_tau = Tamb_num + diff * Math.exp(-1);
    const reduction_tau = (1 - Math.exp(-1)) * 100;
    
    steps.push({
      title: '4. Tiempo Característico τ',
      formula: 'τ = 1/k  (constante de tiempo)',
      substitution: `τ = 1/${k} = ${tau.toFixed(4)} minutos
T(τ) = ${Tamb} + ${diff}·e^(-1) = ${T_at_tau.toFixed(2)}°C`,
      result: `**En t = τ:** la diferencia (T - T_amb) se reduce al 37% del valor inicial
**Reducción:** ${reduction_tau.toFixed(1)}% de la diferencia inicial`,
      explanation: `El tiempo característico τ = 1/k cuantifica la rapidez del enfriamiento. Después de τ minutos, la diferencia de temperatura se reduce a 1/e ≈ 37% de su valor inicial. Valores pequeños de k implican enfriamiento lento (buen aislamiento), mientras que k grande indica enfriamiento rápido (buena transferencia de calor).`
    });

    // Paso 5: Vida media
    const tHalf = Math.log(2) / k_num;
    const THalf = Tamb_num + diff * Math.exp(-Math.log(2));
    
    steps.push({
      title: '5. Vida Media (Half-Life) del Enfriamiento',
      formula: 't_1/2 = ln(2)/k',
      substitution: `t_1/2 = ln(2)/${k} = ${tHalf.toFixed(4)} minutos`,
      result: `**t_1/2 = ${tHalf.toFixed(2)} min**, T(t_1/2) = ${THalf.toFixed(2)}°C`,
      explanation: `Tiempo para que la diferencia de temperatura se reduzca a la mitad. Es independiente de T₀: siempre toma el mismo tiempo reducir la diferencia al 50%.`
    });

    // Resolver analíticamente
    let currentT = 0;
    
    const analyticalT = (time: number) => {
      return Tamb_num + diff * Math.exp(-k_num * time);
    };

    while (currentT <= (tMax as number)) {
      t.push(currentT);
      T.push(analyticalT(currentT));
      currentT += dt as number;
    }

    // Paso 6: Interpretación física
    const T_final = T[T.length - 1];
    const remaining_diff = T_final - Tamb_num;
    const percent_cooled = (1 - remaining_diff / diff) * 100;
    
    steps.push({
      title: '6. Interpretación Física y Resultado',
      formula: `T(${tMax}) = ${Tamb} + ${diff}·e^(-${k}·${tMax})`,
      substitution: `Diferencia restante: ${remaining_diff.toFixed(2)}°C`,
      result: `**T(${tMax}) = ${T_final.toFixed(2)}°C**
**Enfriamiento:** ${percent_cooled.toFixed(1)}%`,
      explanation: `Después de ${tMax} min, se ha enfriado ${percent_cooled.toFixed(1)}% hacia T_amb. El enfriamiento es asintótico: prácticamente después de 3-5 vidas medias la diferencia es despreciable. Aplicaciones: forense, cocina, procesos industriales.`
    });

    return {
      steps,
      data: [
        {
          title: 'Enfriamiento del Objeto',
          type: 'line',
          datasets: [
            {
              label: 'Temperatura T(t)',
              data: t.map((ti, i) => ({ x: ti, y: T[i] })),
              borderColor: '#e74c3c',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              showLine: true
            },
            {
              label: 'Temperatura Ambiente',
              data: [{ x: 0, y: Tamb as number }, { x: tMax as number, y: Tamb as number }],
              borderColor: '#3498db',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              showLine: true
            }
          ],
          xLabel: 'Tiempo (minutos)',
          yLabel: 'Temperatura (°C)'
        }
      ]
    };
  }
}
