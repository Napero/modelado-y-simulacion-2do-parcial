import type { SimulationResult, ExerciseParams } from '../models/types';
import { Chart, type ChartConfiguration } from 'chart.js/auto';
import { getPresets } from '../utils/presets';

export abstract class ExerciseBase {
  protected container: HTMLElement;
  protected charts: Chart[] = [];
  protected exerciseId: string = '';

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

  setExerciseId(id: string): void {
    this.exerciseId = id;
  }

  render(): void {
    const presets = getPresets(this.exerciseId);
    
    this.container.innerHTML = `
      <div class="exercise-container">
        <div class="exercise-header">
          <h1>${this.getTitle()}</h1>
          <p class="description">${this.getDescription()}</p>
        </div>
        
        <div class="exercise-content">
          <div class="input-section">
            ${presets.length > 0 ? `
              <div class="presets-section">
                <h3>📋 Ejemplos Precargados</h3>
                <div class="presets-buttons">
                  ${presets.map((preset, idx) => `
                    <button type="button" class="preset-button" data-preset-index="${idx}" title="${preset.description}">
                      ${preset.name}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
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
            
            <div class="charts-container" id="charts-container">
              <h2>Gráficos</h2>
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

    // Agregar listeners para los botones de presets
    const presetButtons = this.container.querySelectorAll('.preset-button');
    presetButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const presetIndex = parseInt(target.dataset.presetIndex || '0');
        this.loadPreset(presetIndex);
      });
    });
  }

  private loadPreset(index: number): void {
    const presets = getPresets(this.exerciseId);
    if (index < 0 || index >= presets.length) return;

    const preset = presets[index];
    const form = this.container.querySelector('#exercise-form') as HTMLFormElement;
    if (!form) return;

    // Cargar los valores del preset en el formulario
    Object.entries(preset.params).forEach(([key, value]) => {
      const input = form.querySelector(`#${key}`) as HTMLInputElement;
      if (input) {
        input.value = value.toString();
      }
    });

    // Resolver automáticamente con el preset
    this.handleSolve(new FormData(form));
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
    const container = this.container.querySelector('#charts-container') as HTMLElement;
    if (!container) return;

    // Destruir gráficos anteriores
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    // Limpiar contenedor
    const existingCanvases = container.querySelectorAll('.chart-wrapper');
    existingCanvases.forEach(canvas => canvas.remove());

    // Renderizar cada gráfico
    data.forEach((chartData, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'chart-wrapper';
      
      if (chartData.title) {
        const title = document.createElement('h3');
        title.textContent = chartData.title;
        title.style.textAlign = 'center';
        title.style.marginTop = index > 0 ? '30px' : '10px';
        wrapper.appendChild(title);
      }

      const canvas = document.createElement('canvas');
      canvas.id = `chart-${index}`;
      wrapper.appendChild(canvas);
      container.appendChild(wrapper);

      const chart = this.createChart(canvas, chartData);
      if (chart) {
        this.charts.push(chart);
      }
    });
  }

  protected createChart(canvas: HTMLCanvasElement, chartData: any): Chart | null {
    // Determinar si usar scatter mode (datos como {x, y}) o line mode (datos como arrays separados)
    const useScatterMode = chartData.datasets && chartData.datasets.length > 0 && 
                          chartData.datasets[0].data && 
                          chartData.datasets[0].data.length > 0 &&
                          typeof chartData.datasets[0].data[0] === 'object' &&
                          'x' in chartData.datasets[0].data[0];

    // Asegurar que todos los datasets tengan showLine definido
    const processedDatasets = useScatterMode ? chartData.datasets.map((ds: any) => ({
      ...ds,
      showLine: ds.showLine !== false, // Por defecto true a menos que sea explícitamente false
      spanGaps: true, // Conectar líneas aunque haya gaps
      segment: {
        borderColor: ds.borderColor,
      }
    })) : chartData.datasets;

    const config: ChartConfiguration = {
      type: chartData.type || 'line',
      data: useScatterMode ? {
        datasets: processedDatasets
      } : {
        labels: chartData.x?.map((x: number) => x.toFixed(2)) || [],
        datasets: chartData.datasets || [{
          label: chartData.label,
          data: chartData.y,
          borderColor: chartData.color || '#3498db',
          backgroundColor: chartData.backgroundColor || 'transparent',
          tension: 0.1,
          borderWidth: 2,
          pointRadius: chartData.showPoints ? 4 : 0,
          pointBackgroundColor: chartData.pointColor || chartData.color || '#3498db'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0 // Desactivar animaciones para mejor rendimiento
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            type: useScatterMode ? 'linear' : 'category',
            display: true,
            title: {
              display: true,
              text: chartData.xLabel || 't'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: chartData.yLabel || 'Valor'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    };

    return new Chart(canvas, config);
  }

  destroy(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }
}
