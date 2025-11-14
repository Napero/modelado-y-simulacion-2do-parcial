// Tipos base para la aplicación

export interface Exercise {
  id: string;
  name: string;
  category: string;
  path: string;
}

export interface Step {
  title: string;
  formula: string;
  substitution?: string;
  result: string;
  explanation?: string;
}

export interface SimulationResult {
  steps: Step[];
  data: ChartData[];
  additionalInfo?: Record<string, any>;
}

export interface ChartData {
  title?: string;
  type?: 'line' | 'scatter' | 'bar';
  x?: number[];
  y?: number[];
  label?: string;
  color?: string;
  backgroundColor?: string;
  showPoints?: boolean;
  pointColor?: string;
  datasets?: any[];
  xLabel?: string;
  yLabel?: string;
}

export interface ExerciseParams {
  [key: string]: number | string;
}
