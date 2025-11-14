import './style.css';
import 'katex/dist/katex.min.css';
import { Navigation } from './components/Navigation';
import { Cheatsheet } from './components/Cheatsheet';
import { router } from './services/router';

// Import KaTeX auto-render
declare global {
  interface Window {
    renderMathInElement: any;
  }
}

// Load auto-render dynamically
import('katex/dist/contrib/auto-render.mjs').then((module: any) => {
  window.renderMathInElement = module.default;
}).catch(() => {
  console.warn('KaTeX auto-render not loaded');
});

// Import all exercises
import { VerhulstExercise } from './exercises/1d-linear/VerhulstExercise';
import { NewtonCoolingExercise } from './exercises/1d-linear/NewtonCoolingExercise';
import { Bifurcation1DExercise } from './exercises/1d-linear/Bifurcation1DExercise';
import { Linear2DExercise } from './exercises/2d-linear/Linear2DExercise';
import { RomeoJulietExercise } from './exercises/2d-linear/RomeoJulietExercise';
import { LotkaVolterraExercise } from './exercises/nonlinear/LotkaVolterraExercise';
import { EnergyConservationExercise } from './exercises/nonlinear/EnergyConservationExercise';
import { HopfBifurcationExercise } from './exercises/nonlinear/HopfBifurcationExercise';
import { CombatModelExercise } from './exercises/parametrization/CombatModelExercise';
import { ParametrizedSolutionExercise } from './exercises/parametrization/ParametrizedSolutionExercise';

// Initialize the app
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div class="app-container">
    <header class="header">
      <h1>Modelado y Simulación - Guía de Ejercicios</h1>
    </header>
    <div id="navigation"></div>
    <main id="content" class="content"></main>
    <div id="cheatsheet-container"></div>
  </div>
`;

// Initialize navigation
new Navigation('navigation');

// Initialize cheatsheet
new Cheatsheet('cheatsheet-container');

// Exercise instances map
let currentExercise: any = null;

const exerciseMap: Record<string, () => any> = {
  'verhulst': () => new VerhulstExercise('content'),
  'newton-cooling': () => new NewtonCoolingExercise('content'),
  'bifurcation-1d': () => new Bifurcation1DExercise('content'),
  'linear-2d': () => new Linear2DExercise('content'),
  'romeo-juliet': () => new RomeoJulietExercise('content'),
  'lotka-volterra': () => new LotkaVolterraExercise('content'),
  'energy-conservation': () => new EnergyConservationExercise('content'),
  'hopf-bifurcation': () => new HopfBifurcationExercise('content'),
  'combat-model': () => new CombatModelExercise('content'),
  'parametrized-solution': () => new ParametrizedSolutionExercise('content')
};

// Router handlers
for (const [path, exerciseFactory] of Object.entries(exerciseMap)) {
  router.register(path, () => {
    if (currentExercise && currentExercise.destroy) {
      currentExercise.destroy();
    }
    currentExercise = exerciseFactory();
    currentExercise.setExerciseId(path); // Pasar el ID del ejercicio
    currentExercise.render();
  });
}

// Home route
router.register('', () => {
  const content = document.getElementById('content');
  if (content) {
    content.innerHTML = `
      <div class="home">
        <h2>Bienvenido a la Guía de Modelado y Simulación</h2>
        <p>Selecciona un ejercicio del menú de navegación para comenzar.</p>
        
        <div class="categories-overview">
          <div class="category-card">
            <h3>1. Sistemas Dinámicos Lineales (1D)</h3>
            <ul>
              <li>Virus Verhulst</li>
              <li>Enfriamiento de Newton</li>
              <li>Bifurcación</li>
            </ul>
          </div>
          
          <div class="category-card">
            <h3>2. Sistemas Lineales (2D)</h3>
            <ul>
              <li>Sistema {x'=ax+by, y'=cx+dy}</li>
              <li>Romeo y Julieta</li>
            </ul>
          </div>
          
          <div class="category-card">
            <h3>3. Sistemas No Lineales</h3>
            <ul>
              <li>Sistema Lotka-Volterra</li>
              <li>Sistema de conservación de energía</li>
              <li>Sistema Radial bifurcación Hopf</li>
            </ul>
          </div>
          
          <div class="category-card">
            <h3>4. Aplicación de Parametrización</h3>
            <ul>
              <li>Modelo de combate</li>
              <li>Solución parametrizada</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
});

// Navigate to initial route
const initialPath = window.location.hash.slice(1) || '';
router.navigate(initialPath);


