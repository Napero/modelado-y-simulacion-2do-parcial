import { categories, getExercisesByCategory } from '../utils/exercises-config';
import { router } from '../services/router';

export class Navigation {
  private container: HTMLElement;
  private currentCategory: string = categories[0];

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container ${containerId} not found`);
    }
    this.container = element;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <nav class="navigation">
        <div class="tabs">
          ${this.renderTabs()}
        </div>
        <div class="submenu">
          ${this.renderSubmenu(this.currentCategory)}
        </div>
      </nav>
    `;
    this.attachEventListeners();
  }

  private renderTabs(): string {
    return categories.map((category, index) => `
      <button 
        class="tab ${category === this.currentCategory ? 'active' : ''}" 
        data-category="${category}"
        data-index="${index + 1}"
      >
        ${index + 1}. ${this.getCategoryShortName(category)}
      </button>
    `).join('') + `
      <div class="materials-dropdown">
        <button class="tab materials-btn">
          📚 Material de Clase
        </button>
        <div class="materials-menu">
          <a href="materiales/9. Sistemas Autonomos desacoplados 1d.pdf" target="_blank">
            Sistemas Autónomos 1D
          </a>
          <a href="materiales/10.Bifurcaciones.pdf" target="_blank">
            Bifurcaciones
          </a>
          <a href="materiales/13.sistemas_dinamicos_no_lineales.pdf" target="_blank">
            Sistemas No Lineales
          </a>
          <a href="materiales/13.sistemas_dinamicos_no_lineales 1.pdf" target="_blank">
            Sistemas No Lineales (parte 2)
          </a>
          <a href="materiales/14.sistemas_dinamicos_no_lineales_aplicaciones.pdf" target="_blank">
            Aplicaciones No Lineales
          </a>
          <a href="materiales/15.Parametrizacion_sistemas_dinamicos.pdf" target="_blank">
            Parametrización
          </a>
        </div>
      </div>
      <button class="tab cheatsheet-btn" id="cheatsheet-toggle-nav">
        📐 Formulas
      </button>
    `;
  }

  private getCategoryShortName(category: string): string {
    const shortNames: Record<string, string> = {
      'Sistemas dinámicos lineales (1D)': 'Dinámicos 1D',
      'Sistemas lineales (2D)': 'Lineales 2D',
      'Sistemas no lineales': 'No lineales',
      'Sistema de aplicación de parametrización': 'Parametrización'
    };
    return shortNames[category] || category;
  }

  private renderSubmenu(category: string): string {
    const exercises = getExercisesByCategory(category);
    return `
      <div class="submenu-content">
        <h3>${category}</h3>
        <ul class="exercise-list">
          ${exercises.map(ex => `
            <li>
              <a href="#${ex.path}" data-path="${ex.path}">
                ${ex.name}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Event listeners para las pestañas
    this.container.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const category = target.dataset.category;
        if (category) {
          this.switchCategory(category);
        }
      });
    });

    // Event listener para el botón de cheatsheet
    const cheatsheetBtn = document.getElementById('cheatsheet-toggle-nav');
    if (cheatsheetBtn) {
      cheatsheetBtn.addEventListener('click', () => {
        window.open('./formulario.html', '_blank');
      });
    }

    // Event listeners para los enlaces del submenú
    this.container.querySelectorAll('.exercise-list a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        const path = target.dataset.path;
        if (path) {
          router.navigate(path);
        }
      });
    });
  }

  private switchCategory(category: string): void {
    this.currentCategory = category;
    
    // Actualizar pestañas activas
    this.container.querySelectorAll('.tab').forEach(tab => {
      const tabElement = tab as HTMLElement;
      if (tabElement.dataset.category === category) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Actualizar submenú
    const submenuContainer = this.container.querySelector('.submenu');
    if (submenuContainer) {
      submenuContainer.innerHTML = this.renderSubmenu(category);
      this.attachSubmenuListeners();
    }
  }

  private attachSubmenuListeners(): void {
    this.container.querySelectorAll('.exercise-list a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        const path = target.dataset.path;
        if (path) {
          router.navigate(path);
        }
      });
    });
  }
}
