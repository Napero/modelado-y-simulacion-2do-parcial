import type { Exercise } from '../models/types';

// Configuración de todos los ejercicios organizados por categorías
export const exercises: Exercise[] = [
  // Punto 1: Sistemas dinámicos lineales (1D)
  {
    id: 'verhulst',
    name: 'Virus Verhulst',
    category: 'Sistemas dinámicos lineales (1D)',
    path: 'verhulst'
  },
  {
    id: 'newton-cooling',
    name: 'Enfriamiento de Newton',
    category: 'Sistemas dinámicos lineales (1D)',
    path: 'newton-cooling'
  },
  {
    id: 'bifurcation-1d',
    name: 'Bifurcación',
    category: 'Sistemas dinámicos lineales (1D)',
    path: 'bifurcation-1d'
  },
  
  // Punto 2: Sistemas lineales (2D)
  {
    id: 'linear-2d',
    name: 'Sistema {x\'=ax+by, y\'=cx+dy}',
    category: 'Sistemas lineales (2D)',
    path: 'linear-2d'
  },
  {
    id: 'romeo-juliet',
    name: 'Romeo y Julieta',
    category: 'Sistemas lineales (2D)',
    path: 'romeo-juliet'
  },
  
  // Punto 3: Sistemas no lineales
  {
    id: 'lotka-volterra',
    name: 'Sistema Lotka-Volterra',
    category: 'Sistemas no lineales',
    path: 'lotka-volterra'
  },
  {
    id: 'energy-conservation',
    name: 'Sistema de conservación de energía',
    category: 'Sistemas no lineales',
    path: 'energy-conservation'
  },
  {
    id: 'hopf-bifurcation',
    name: 'Sistema Radial bifurcación Hopf',
    category: 'Sistemas no lineales',
    path: 'hopf-bifurcation'
  },
  
  // Punto 4: Sistema de aplicación de parametrización
  {
    id: 'combat-model',
    name: 'Modelo de combate',
    category: 'Sistema de aplicación de parametrización',
    path: 'combat-model'
  },
  {
    id: 'parametrized-solution',
    name: 'Solución parametrizada',
    category: 'Sistema de aplicación de parametrización',
    path: 'parametrized-solution'
  }
];

// Organizar ejercicios por categoría
export const categories = [
  'Sistemas dinámicos lineales (1D)',
  'Sistemas lineales (2D)',
  'Sistemas no lineales',
  'Sistema de aplicación de parametrización'
];

export function getExercisesByCategory(category: string): Exercise[] {
  return exercises.filter(ex => ex.category === category);
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(ex => ex.id === id);
}
