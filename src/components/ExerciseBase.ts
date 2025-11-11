import type { SimulationResult, ExerciseParams } from '../models/types';
import { Chart, type ChartConfiguration } from 'chart.js/auto';

export abstract class ExerciseBase {
  protected container: HTMLElement;
  protected chart: Chart | null = null;

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container ${containerId} not found`);
    }
    this.container = element;
  }

  abstract getTitle(): string;
  abstract getDescription(): string;
  abstract getInputFields(): { name: string; label: string; defaultValue: number; step?: number }[];
  abstract solve(params: ExerciseParams): SimulationResult;

  render(): void {
    this.container.innerHTML = `
      <div class="exercise-container">
        <div class="exercise-header">
          <h1>${this.getTitle()}</h1>
          <p class="description">${this.getDescription()}</p>
        </div>
        
        <div class="exercise-content">
          <div class="input-section">
            <h2>Parámetros</h2>
            <form id="exercise-form">
              ${this.renderInputFields()}
              <button type="submit" class="solve-button">Resolver</button>
            </form>
          </div>
          
          <div class="results-section" style="display: none;">
            <div class="steps-container">
              <h2>Solución Paso a Paso</h2>
              <div id="steps-content"></div>
            </div>
            
            <div class="chart-container">
              <h2>Gráficos</h2>
              <canvas id="chart-canvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderInputFields(): string {
    return this.getInputFields().map(field => `
      <div class="input-group">
        <label for="${field.name}">${field.label}</label>
        <input 
          type="number" 
          id="${field.name}" 
          name="${field.name}" 
          value="${field.defaultValue}"
          step="${field.step || 0.1}"
          required
        />
      </div>
    `).join('');
  }

  private attachEventListeners(): void {
    const form = this.container.querySelector('#exercise-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSolve(new FormData(form));
      });
    }
  }

  private handleSolve(formData: FormData): void {
    const params: ExerciseParams = {};
    for (const [key, value] of formData.entries()) {
      params[key] = parseFloat(value as string);
    }

    try {
      const result = this.solve(params);
      this.displayResults(result);
    } catch (error) {
      console.error('Error solving exercise:', error);
      alert('Error al resolver el ejercicio. Verifica los parámetros.');
    }
  }

  private displayResults(result: SimulationResult): void {
    // Mostrar la sección de resultados
    const resultsSection = this.container.querySelector('.results-section') as HTMLElement;
    if (resultsSection) {
      resultsSection.style.display = 'block';
    }

    // Renderizar los pasos
    this.renderSteps(result.steps);

    // Renderizar los gráficos
    this.renderChart(result.data);
  }

  private renderSteps(steps: SimulationResult['steps']): void {
    const stepsContent = this.container.querySelector('#steps-content');
    if (!stepsContent) return;

    stepsContent.innerHTML = steps.map((step, index) => `
      <div class="step">
        <h3>Paso ${index + 1}: ${step.title}</h3>
        
        <div class="formula-section">
          <h4>Fórmula:</h4>
          <div class="formula">${this.formatFormula(step.formula)}</div>
        </div>
        
        ${step.substitution ? `
          <div class="substitution-section">
            <h4>Sustitución:</h4>
            <div class="substitution">${this.formatFormula(step.substitution)}</div>
          </div>
        ` : ''}
        
        <div class="result-section">
          <h4>Resultado:</h4>
          <div class="result">${this.formatFormula(step.result)}</div>
        </div>
        
        ${step.explanation ? `
          <div class="explanation-section">
            <p>${step.explanation}</p>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  private formatFormula(formula: string): string {
    // Convertir notación matemática simple a HTML
    return formula
      .replace(/\^(\w+)/g, '<sup>$1</sup>')
      .replace(/_(\w+)/g, '<sub>$1</sub>')
      .replace(/\*/g, '×')
      .replace(/\//g, '÷');
  }

  private renderChart(data: SimulationResult['data']): void {
    const canvas = this.container.querySelector('#chart-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    // Destruir el gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data[0]?.x.map(x => x.toFixed(2)) || [],
        datasets: data.map(series => ({
          label: series.label,
          data: series.y,
          borderColor: this.getRandomColor(),
          backgroundColor: 'transparent',
          tension: 0.1
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 't'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Valor'
            }
          }
        }
      }
    };

    this.chart = new Chart(canvas, config);
  }

  private getRandomColor(): string {
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  destroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
