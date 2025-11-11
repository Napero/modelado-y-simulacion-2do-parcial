import { ExerciseBase } from '../../components/ExerciseBase';
import type { SimulationResult, ExerciseParams } from '../../models/types';

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
    
    // Paso 1: Sistema de ecuaciones
    steps.push({
      title: 'Sistema de Ecuaciones de Amor',
      formula: 'dR/dt = a·R + b·J\\ndJ/dt = c·R + d·J',
      substitution: `dR/dt = ${a}·R + ${b}·J\\ndJ/dt = ${c}·R + ${d}·J`,
      result: 'Modelo lineal de interacción romántica',
      explanation: 'R representa el amor de Romeo, J el amor de Julieta. Coeficientes positivos = atracción, negativos = distanciamiento.'
    });

    // Paso 2: Interpretación de coeficientes
    const interpretA = (a as number) > 0 ? 'Romeo es entusiasta (se anima solo)' : 
                       (a as number) < 0 ? 'Romeo es cauteloso (se enfría solo)' : 
                       'Romeo es neutro consigo mismo';
    const interpretB = (b as number) > 0 ? 'Romeo se anima con el amor de Julieta' : 
                       (b as number) < 0 ? 'Romeo se aleja cuando Julieta lo ama' : 
                       'Romeo no responde a Julieta';
    const interpretC = (c as number) > 0 ? 'Julieta se anima con el amor de Romeo' : 
                       (c as number) < 0 ? 'Julieta se aleja cuando Romeo la ama' : 
                       'Julieta no responde a Romeo';
    const interpretD = (d as number) > 0 ? 'Julieta es entusiasta (se anima sola)' : 
                       (d as number) < 0 ? 'Julieta es cautelosa (se enfría sola)' : 
                       'Julieta es neutra consigo misma';
    
    steps.push({
      title: 'Interpretación de Coeficientes',
      formula: 'a, b, c, d',
      result: `a=${a}: ${interpretA}\\nb=${b}: ${interpretB}\\nc=${c}: ${interpretC}\\nd=${d}: ${interpretD}`,
      explanation: 'Los coeficientes determinan la dinámica de la relación.'
    });

    // Paso 3: Condiciones iniciales
    steps.push({
      title: 'Condiciones Iniciales',
      formula: 'R(0) = R_0, J(0) = J_0',
      substitution: `R(0) = ${R0}, J(0) = ${J0}`,
      result: `Estado inicial de la relación`,
      explanation: 'Valores positivos = amor, negativos = odio, cero = indiferencia.'
    });

    // Paso 4: Análisis de autovalores
    const trace = (a as number) + (d as number);
    const det = (a as number) * (d as number) - (b as number) * (c as number);
    const discriminant = trace * trace - 4 * det;
    
    let behavior: string;
    if (discriminant >= 0) {
      const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
      const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
      if (lambda1 > 0 && lambda2 > 0) {
        behavior = 'Amor explosivo (diverge al infinito)';
      } else if (lambda1 < 0 && lambda2 < 0) {
        behavior = 'Amor convergente (tienden al equilibrio)';
      } else {
        behavior = 'Relación inestable (silla)';
      }
    } else {
      const realPart = trace / 2;
      if (realPart > 0) {
        behavior = 'Ciclos expansivos (amor oscilante creciente)';
      } else if (realPart < 0) {
        behavior = 'Ciclos amortiguados (amor oscilante decreciente)';
      } else {
        behavior = 'Ciclos perfectos (amor periódico)';
      }
    }
    
    steps.push({
      title: 'Comportamiento a Largo Plazo',
      formula: 'Autovalores de la matriz [[a,b],[c,d]]',
      result: behavior,
      explanation: `Traza=${trace.toFixed(2)}, Det=${det.toFixed(2)}`
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

    steps.push({
      title: 'Estado Final',
      formula: `R(${tMax}), J(${tMax})`,
      result: `Romeo: ${R[R.length - 1].toFixed(2)}, Julieta: ${J[J.length - 1].toFixed(2)}`,
      explanation: 'Estado de amor después del tiempo simulado.'
    });

    return {
      steps,
      data: [
        {
          x: t,
          y: R,
          label: 'Amor de Romeo'
        },
        {
          x: t,
          y: J,
          label: 'Amor de Julieta'
        }
      ]
    };
  }
}
