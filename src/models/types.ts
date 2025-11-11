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
  data: {
    x: number[];
    y: number[];
    label: string;
  }[];
  additionalInfo?: Record<string, any>;
}

export interface ExerciseParams {
  [key: string]: number | string;
}
