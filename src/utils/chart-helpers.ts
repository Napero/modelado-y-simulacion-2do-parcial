// Utilidades para crear gráficos mejorados con campos vectoriales y puntos críticos

export interface VectorFieldConfig {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  gridSize: number;
  vectorScale?: number;
}

export interface PhasePortraitData {
  title?: string;
  type: 'scatter';
  datasets: any[];
  xLabel: string;
  yLabel: string;
}

export interface BifurcationData {
  title?: string;
  type: 'line';
  datasets: any[];
  xLabel: string;
  yLabel: string;
}

// Generar campo vectorial para sistema 2D
export function generateVectorField(
  config: VectorFieldConfig,
  dxdt: (x: number, y: number) => number,
  dydt: (x: number, y: number) => number
): { x: number[], y: number[], u: number[], v: number[] } {
  const { xMin, xMax, yMin, yMax, gridSize, vectorScale = 0.1 } = config;
  
  const x: number[] = [];
  const y: number[] = [];
  const u: number[] = [];
  const v: number[] = [];
  
  const dx = (xMax - xMin) / gridSize;
  const dy = (yMax - yMin) / gridSize;
  
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      const xi = xMin + i * dx;
      const yj = yMin + j * dy;
      
      const ui = dxdt(xi, yj);
      const vi = dydt(xi, yj);
      
      // Normalizar vectores
      const mag = Math.sqrt(ui * ui + vi * vi);
      if (mag > 0) {
        x.push(xi);
        y.push(yj);
        u.push(ui / mag * vectorScale);
        v.push(vi / mag * vectorScale);
      }
    }
  }
  
  return { x, y, u, v };
}

// Crear dataset para trayectoria con color específico
export function createTrajectoryDataset(
  x: number[],
  y: number[],
  label: string,
  color: string,
  options?: {
    showPoints?: boolean;
    lineWidth?: number;
    dashed?: boolean;
  }
) {
  return {
    label,
    data: x.map((xi, i) => ({ x: xi, y: y[i] })),
    borderColor: color,
    backgroundColor: color + '20',
    borderWidth: options?.lineWidth || 2,
    pointRadius: options?.showPoints ? 4 : 0,
    pointBackgroundColor: color,
    borderDash: options?.dashed ? [5, 5] : [],
    tension: 0.2,
    showLine: true
  };
}

// Crear dataset para puntos críticos
export function createCriticalPointDataset(
  points: { x: number, y: number, label?: string }[],
  type: 'stable' | 'unstable' | 'saddle' | 'center',
  customLabel?: string
) {
  const config: { [key: string]: { color: string, symbol: string, label: string } } = {
    stable: { color: '#2ecc71', symbol: '●', label: 'Estable' },
    unstable: { color: '#e74c3c', symbol: '○', label: 'Inestable' },
    saddle: { color: '#f39c12', symbol: '◇', label: 'Silla' },
    center: { color: '#3498db', symbol: '◆', label: 'Centro' }
  };
  
  const cfg = config[type];
  
  return {
    label: customLabel || cfg.label,
    data: points.map(p => ({ x: p.x, y: p.y })),
    backgroundColor: cfg.color,
    borderColor: cfg.color,
    borderWidth: 3,
    pointRadius: 8,
    pointStyle: type === 'unstable' ? 'circle' : 'rect',
    showLine: false
  };
}

// Colores consistentes para gráficos
export const COLORS = {
  stable: '#3498db',      // Azul para estable
  unstable: '#e74c3c',    // Rojo para inestable
  trajectory: '#2ecc71',  // Verde para trayectorias
  parameter: '#9b59b6',   // Morado para parámetros
  energy: '#f39c12',      // Naranja para energía
  prey: '#16a085',        // Verde azulado para presas
  predator: '#c0392b',    // Rojo oscuro para depredadores
  field: '#95a5a6',       // Gris para campo vectorial
  grid: '#ecf0f1'         // Gris claro para grid
};

// Crear gráfico de bifurcación con ramas estables e inestables
export function createBifurcationChart(
  paramValues: number[],
  stablePoints: number[],
  unstablePoints: number[],
  paramName: string = 'r',
  varName: string = 'x*',
  title?: string
): BifurcationData {
  return {
    title: title || `Diagrama de Bifurcación`,
    type: 'line',
    datasets: [
      {
        label: 'Equilibrio Estable',
        data: paramValues.map((r, i) => ({ x: r, y: stablePoints[i] })),
        borderColor: COLORS.stable,
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 0,
        showLine: true,
        segment: {
          borderDash: (ctx: any) => {
            // Línea sólida solo donde hay puntos válidos
            const point = stablePoints[ctx.p0DataIndex];
            return isNaN(point) || !isFinite(point) ? [5, 5] : [];
          }
        }
      },
      {
        label: 'Equilibrio Inestable',
        data: paramValues.map((r, i) => ({ x: r, y: unstablePoints[i] })),
        borderColor: COLORS.unstable,
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 0,
        borderDash: [5, 5],
        showLine: true,
        segment: {
          borderDash: (ctx: any) => {
            const point = unstablePoints[ctx.p0DataIndex];
            return isNaN(point) || !isFinite(point) ? [] : [5, 5];
          }
        }
      }
    ],
    xLabel: `Parámetro ${paramName}`,
    yLabel: `Posición de Equilibrio ${varName}`
  };
}

// Integrador RK4 mejorado para trayectorias
export function integrateRK4(
  x0: number,
  y0: number,
  t0: number,
  tMax: number,
  dt: number,
  dxdt: (x: number, y: number, t: number) => number,
  dydt: (x: number, y: number, t: number) => number
): { t: number[], x: number[], y: number[] } {
  const t: number[] = [t0];
  const x: number[] = [x0];
  const y: number[] = [y0];
  
  let ti = t0;
  let xi = x0;
  let yi = y0;
  
  while (ti < tMax) {
    // RK4
    const k1x = dxdt(xi, yi, ti);
    const k1y = dydt(xi, yi, ti);
    
    const k2x = dxdt(xi + dt/2 * k1x, yi + dt/2 * k1y, ti + dt/2);
    const k2y = dydt(xi + dt/2 * k1x, yi + dt/2 * k1y, ti + dt/2);
    
    const k3x = dxdt(xi + dt/2 * k2x, yi + dt/2 * k2y, ti + dt/2);
    const k3y = dydt(xi + dt/2 * k2x, yi + dt/2 * k2y, ti + dt/2);
    
    const k4x = dxdt(xi + dt * k3x, yi + dt * k3y, ti + dt);
    const k4y = dydt(xi + dt * k3x, yi + dt * k3y, ti + dt);
    
    xi = xi + dt/6 * (k1x + 2*k2x + 2*k3x + k4x);
    yi = yi + dt/6 * (k1y + 2*k2y + 2*k3y + k4y);
    ti = ti + dt;
    
    t.push(ti);
    x.push(xi);
    y.push(yi);
    
    // Detener si diverge
    if (Math.abs(xi) > 1e6 || Math.abs(yi) > 1e6 || isNaN(xi) || isNaN(yi)) {
      break;
    }
  }
  
  return { t, x, y };
}
