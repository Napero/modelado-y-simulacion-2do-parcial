// Componente de Cheatsheet con fórmulas matemáticas usando KaTeX

export class Cheatsheet {
  private container: HTMLElement;
  private isOpen: boolean = false;

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
      <div class="cheatsheet-wrapper">
        <button class="cheatsheet-toggle" id="cheatsheet-toggle">
          📚 Formulas
        </button>
        <div class="cheatsheet-panel" id="cheatsheet-panel">
          <div class="cheatsheet-header">
            <h2>📚 Formulas de Referencia</h2>
            <button class="cheatsheet-close" id="cheatsheet-close">✕</button>
          </div>
          <div class="cheatsheet-content">
            ${this.renderTabs()}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderTabs(): string {
    return `
      <div class="cheatsheet-tabs">
        <button class="cheatsheet-tab active" data-tab="general">General</button>
        <button class="cheatsheet-tab" data-tab="1d">Sistemas 1D</button>
        <button class="cheatsheet-tab" data-tab="bifurcation">Bifurcaciones</button>
        <button class="cheatsheet-tab" data-tab="linear2d">Sistemas Lineales 2D</button>
        <button class="cheatsheet-tab" data-tab="nonlinear">No Lineales</button>
        <button class="cheatsheet-tab" data-tab="parametric">Parametrización</button>
      </div>
      <div class="cheatsheet-tab-content">
        ${this.renderGeneralTab()}
        ${this.renderSystem1DTab()}
        ${this.renderBifurcationTab()}
        ${this.renderLinear2DTab()}
        ${this.renderNonlinearTab()}
        ${this.renderParametricTab()}
      </div>
    `;
  }

  private renderGeneralTab(): string {
    return `
      <div class="tab-panel active" data-panel="general">
        <h3>Matemática General</h3>
        
        <div class="formula-section">
          <h4>Derivadas Básicas</h4>
          <div class="formula-grid">
            <div class="formula-item">
              <span class="formula-label">Potencia:</span>
              <div class="formula-tex">$$\\frac{d}{dx}x^n = nx^{n-1}$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Exponencial:</span>
              <div class="formula-tex">$$\\frac{d}{dx}e^x = e^x$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Logaritmo:</span>
              <div class="formula-tex">$$\\frac{d}{dx}\\ln(x) = \\frac{1}{x}$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Seno:</span>
              <div class="formula-tex">$$\\frac{d}{dx}\\sin(x) = \\cos(x)$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Coseno:</span>
              <div class="formula-tex">$$\\frac{d}{dx}\\cos(x) = -\\sin(x)$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Tangente:</span>
              <div class="formula-tex">$$\\frac{d}{dx}\\tan(x) = \\sec^2(x)$$</div>
            </div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Integrales Básicas</h4>
          <div class="formula-grid">
            <div class="formula-item">
              <span class="formula-label">Potencia:</span>
              <div class="formula-tex">$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Exponencial:</span>
              <div class="formula-tex">$$\\int e^x dx = e^x + C$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Logaritmo:</span>
              <div class="formula-tex">$$\\int \\frac{1}{x} dx = \\ln|x| + C$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Seno:</span>
              <div class="formula-tex">$$\\int \\sin(x) dx = -\\cos(x) + C$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Coseno:</span>
              <div class="formula-tex">$$\\int \\cos(x) dx = \\sin(x) + C$$</div>
            </div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Identidades Trigonométricas</h4>
          <div class="formula-grid">
            <div class="formula-item">
              <span class="formula-label">Pitagórica:</span>
              <div class="formula-tex">$$\\sin^2(x) + \\cos^2(x) = 1$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Ángulo doble (seno):</span>
              <div class="formula-tex">$$\\sin(2x) = 2\\sin(x)\\cos(x)$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Ángulo doble (coseno):</span>
              <div class="formula-tex">$$\\cos(2x) = \\cos^2(x) - \\sin^2(x)$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Suma de ángulos:</span>
              <div class="formula-tex">$$\\sin(a \\pm b) = \\sin(a)\\cos(b) \\pm \\cos(a)\\sin(b)$$</div>
            </div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Álgebra Lineal</h4>
          <div class="formula-grid">
            <div class="formula-item">
              <span class="formula-label">Autovalores 2×2:</span>
              <div class="formula-tex">$$\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Traza:</span>
              <div class="formula-tex">$$\\text{tr}(A) = a + d \\text{ para } A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Determinante:</span>
              <div class="formula-tex">$$\\det(A) = ad - bc$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Discriminante:</span>
              <div class="formula-tex">$$\\Delta = \\text{tr}(A)^2 - 4\\det(A)$$</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderSystem1DTab(): string {
    return `
      <div class="tab-panel" data-panel="1d">
        <h3>Sistemas Dinámicos 1D</h3>
        
        <div class="formula-section">
          <h4>Ecuación General</h4>
          <div class="formula-tex">$$\\frac{dx}{dt} = f(x)$$</div>
          <p class="formula-note">Sistema autónomo unidimensional</p>
        </div>

        <div class="formula-section">
          <h4>Puntos de Equilibrio</h4>
          <div class="formula-tex">$$x^* \\text{ es equilibrio si } f(x^*) = 0$$</div>
        </div>

        <div class="formula-section">
          <h4>Estabilidad Lineal</h4>
          <div class="formula-grid">
            <div class="formula-item">
              <span class="formula-label">Estable:</span>
              <div class="formula-tex">$$f'(x^*) < 0$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">Inestable:</span>
              <div class="formula-tex">$$f'(x^*) > 0$$</div>
            </div>
            <div class="formula-item">
              <span class="formula-label">No hiperbólico:</span>
              <div class="formula-tex">$$f'(x^*) = 0$$</div>
            </div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Modelos Clásicos</h4>
          <div class="formula-item">
            <span class="formula-label">Verhulst (Logístico):</span>
            <div class="formula-tex">$$\\frac{dP}{dt} = rP\\left(1 - \\frac{P}{K}\\right)$$</div>
            <p class="formula-note">Solución: $$P(t) = \\frac{K}{1 + \\left(\\frac{K}{P_0} - 1\\right)e^{-rt}}$$</p>
          </div>
          <div class="formula-item">
            <span class="formula-label">Enfriamiento de Newton:</span>
            <div class="formula-tex">$$\\frac{dT}{dt} = -k(T - T_{amb})$$</div>
            <p class="formula-note">Solución: $$T(t) = T_{amb} + (T_0 - T_{amb})e^{-kt}$$</p>
          </div>
        </div>
      </div>
    `;
  }

  private renderBifurcationTab(): string {
    return `
      <div class="tab-panel" data-panel="bifurcation">
        <h3>Bifurcaciones</h3>
        
        <div class="formula-section">
          <h4>Definición</h4>
          <p class="formula-note">Cambio cualitativo en la dinámica al variar un parámetro</p>
        </div>

        <div class="formula-section">
          <h4>Bifurcación Silla-Nodo</h4>
          <div class="formula-tex">$$\\dot{x} = r + x^2$$</div>
          <div class="formula-item">
            <span class="formula-label">Punto crítico:</span>
            <div class="formula-tex">$$r_c = 0$$</div>
          </div>
          <div class="formula-item">
            <span class="formula-label">Equilibrios:</span>
            <div class="formula-tex">$$x^* = \\pm\\sqrt{-r} \\text{ si } r < 0$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Bifurcación Pitchfork Supercrítica</h4>
          <div class="formula-tex">$$\\dot{x} = rx - x^3$$</div>
          <div class="formula-item">
            <span class="formula-label">Equilibrios:</span>
            <div class="formula-tex">$$x^* = 0, \\pm\\sqrt{r} \\text{ (para } r > 0)$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Bifurcación Pitchfork Subcrítica</h4>
          <div class="formula-tex">$$\\dot{x} = rx + x^3$$</div>
        </div>

        <div class="formula-section">
          <h4>Bifurcación Transcrítica</h4>
          <div class="formula-tex">$$\\dot{x} = rx - x^2$$</div>
          <p class="formula-note">Intercambio de estabilidad entre dos equilibrios</p>
        </div>

        <div class="formula-section">
          <h4>Bifurcación de Hopf</h4>
          <div class="formula-item">
            <span class="formula-label">Condición:</span>
            <p class="formula-note">Autovalores cruzan el eje imaginario: $$\\lambda = \\alpha(r) \\pm i\\omega(r)$$ con $$\\alpha(r_c) = 0$$</p>
          </div>
          <div class="formula-item">
            <span class="formula-label">Forma normal:</span>
            <div class="formula-tex">$$\\dot{r} = \\mu r - r^3, \\quad \\dot{\\theta} = \\omega$$</div>
          </div>
        </div>
      </div>
    `;
  }

  private renderLinear2DTab(): string {
    return `
      <div class="tab-panel" data-panel="linear2d">
        <h3>Sistemas Lineales 2D</h3>
        
        <div class="formula-section">
          <h4>Forma General</h4>
          <div class="formula-tex">$$\\dot{\\mathbf{x}} = A\\mathbf{x}, \\quad A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$</div>
        </div>

        <div class="formula-section">
          <h4>Clasificación de Equilibrios</h4>
          <div class="formula-item">
            <span class="formula-label">Autovalores:</span>
            <div class="formula-tex">$$\\lambda_{1,2} = \\frac{\\text{tr}(A) \\pm \\sqrt{\\Delta}}{2}$$</div>
            <div class="formula-tex">$$\\Delta = \\text{tr}(A)^2 - 4\\det(A)$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Casos según $$\\Delta$$</h4>
          <div class="formula-grid">
            <div class="formula-item">
              <span class="formula-label">$$\\Delta > 0$$:</span>
              <p class="formula-note">Autovalores reales distintos</p>
              <ul>
                <li>$$\\lambda_1, \\lambda_2 < 0$$: Nodo estable</li>
                <li>$$\\lambda_1, \\lambda_2 > 0$$: Nodo inestable</li>
                <li>$$\\lambda_1 \\cdot \\lambda_2 < 0$$: Punto silla</li>
              </ul>
            </div>
            <div class="formula-item">
              <span class="formula-label">$$\\Delta < 0$$:</span>
              <p class="formula-note">Autovalores complejos $$\\lambda = \\alpha \\pm i\\beta$$</p>
              <ul>
                <li>$$\\alpha < 0$$: Espiral estable (foco)</li>
                <li>$$\\alpha > 0$$: Espiral inestable</li>
                <li>$$\\alpha = 0$$: Centro</li>
              </ul>
            </div>
            <div class="formula-item">
              <span class="formula-label">$$\\Delta = 0$$:</span>
              <p class="formula-note">Autovalor repetido: Nodo degenerado</p>
            </div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Solución General</h4>
          <div class="formula-item">
            <span class="formula-label">Autovalores reales distintos:</span>
            <div class="formula-tex">$$\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$$</div>
          </div>
          <div class="formula-item">
            <span class="formula-label">Autovalores complejos $$\\lambda = \\alpha \\pm i\\beta$$:</span>
            <div class="formula-tex">$$\\mathbf{x}(t) = e^{\\alpha t}(c_1\\cos(\\beta t) + c_2\\sin(\\beta t))$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Teorema de Hartman-Grobman</h4>
          <p class="formula-note">Si el equilibrio es hiperbólico ($$\\text{Re}(\\lambda) \\neq 0$$), la dinámica local es topológicamente equivalente a su linealización</p>
        </div>
      </div>
    `;
  }

  private renderNonlinearTab(): string {
    return `
      <div class="tab-panel" data-panel="nonlinear">
        <h3>Sistemas No Lineales</h3>
        
        <div class="formula-section">
          <h4>Forma General</h4>
          <div class="formula-tex">$$\\begin{cases} \\dot{x} = f(x,y) \\\\ \\dot{y} = g(x,y) \\end{cases}$$</div>
        </div>

        <div class="formula-section">
          <h4>Linealización</h4>
          <div class="formula-item">
            <span class="formula-label">Matriz Jacobiana:</span>
            <div class="formula-tex">$$J(x,y) = \\begin{pmatrix} \\frac{\\partial f}{\\partial x} & \\frac{\\partial f}{\\partial y} \\\\ \\frac{\\partial g}{\\partial x} & \\frac{\\partial g}{\\partial y} \\end{pmatrix}$$</div>
          </div>
          <p class="formula-note">Evaluar en el punto de equilibrio $$(x^*, y^*)$$</p>
        </div>

        <div class="formula-section">
          <h4>Función de Lyapunov</h4>
          <div class="formula-item">
            <span class="formula-label">Condición de estabilidad:</span>
            <div class="formula-tex">$$V(\\mathbf{x}) > 0 \\text{ y } \\dot{V}(\\mathbf{x}) < 0$$</div>
          </div>
          <div class="formula-item">
            <span class="formula-label">Derivada temporal:</span>
            <div class="formula-tex">$$\\dot{V} = \\nabla V \\cdot \\mathbf{F} = \\frac{\\partial V}{\\partial x}f + \\frac{\\partial V}{\\partial y}g$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Sistemas Conservativos (Hamiltonianos)</h4>
          <div class="formula-item">
            <span class="formula-label">Forma:</span>
            <div class="formula-tex">$$\\dot{x} = \\frac{\\partial H}{\\partial y}, \\quad \\dot{y} = -\\frac{\\partial H}{\\partial x}$$</div>
          </div>
          <div class="formula-item">
            <span class="formula-label">Conservación:</span>
            <div class="formula-tex">$$\\frac{dH}{dt} = 0$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Modelos Clásicos</h4>
          <div class="formula-item">
            <span class="formula-label">Lotka-Volterra:</span>
            <div class="formula-tex">$$\\begin{cases} \\dot{x} = \\alpha x - \\beta xy \\\\ \\dot{y} = \\delta xy - \\gamma y \\end{cases}$$</div>
            <p class="formula-note">Equilibrio: $$(\\gamma/\\delta, \\alpha/\\beta)$$</p>
          </div>
          <div class="formula-item">
            <span class="formula-label">Van der Pol:</span>
            <div class="formula-tex">$$\\ddot{x} - \\mu(1-x^2)\\dot{x} + x = 0$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Teorema de Poincaré-Bendixson</h4>
          <p class="formula-note">En 2D, si una trayectoria está confinada en una región cerrada sin puntos fijos, entonces converge a un ciclo límite</p>
        </div>
      </div>
    `;
  }

  private renderParametricTab(): string {
    return `
      <div class="tab-panel" data-panel="parametric">
        <h3>Parametrización y Estructura Orbital</h3>
        
        <div class="formula-section">
          <h4>Eliminación de Parámetro</h4>
          <div class="formula-tex">$$\\frac{dy}{dx} = \\frac{\\dot{y}}{\\dot{x}} = \\frac{g(x,y)}{f(x,y)}$$</div>
        </div>

        <div class="formula-section">
          <h4>Coordenadas Polares</h4>
          <div class="formula-item">
            <span class="formula-label">Transformación:</span>
            <div class="formula-tex">$$x = r\\cos(\\theta), \\quad y = r\\sin(\\theta)$$</div>
          </div>
          <div class="formula-item">
            <span class="formula-label">Ecuaciones:</span>
            <div class="formula-tex">$$\\dot{r} = \\frac{x\\dot{x} + y\\dot{y}}{r}, \\quad \\dot{\\theta} = \\frac{x\\dot{y} - y\\dot{x}}{r^2}$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Conjuntos Límite</h4>
          <div class="formula-item">
            <span class="formula-label">$$\\omega$$-límite:</span>
            <div class="formula-tex">$$\\omega(x_0) = \\{y : \\exists t_n \\to +\\infty \\text{ tal que } \\phi(t_n, x_0) \\to y\\}$$</div>
          </div>
          <div class="formula-item">
            <span class="formula-label">$$\\alpha$$-límite:</span>
            <div class="formula-tex">$$\\alpha(x_0) = \\{y : \\exists t_n \\to -\\infty \\text{ tal que } \\phi(t_n, x_0) \\to y\\}$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Conversión EDO de Orden 2</h4>
          <div class="formula-item">
            <span class="formula-label">Ecuación:</span>
            <div class="formula-tex">$$\\ddot{y} + a_1\\dot{y} + a_0 y = f(t)$$</div>
          </div>
          <div class="formula-item">
            <span class="formula-label">Sistema equivalente:</span>
            <div class="formula-tex">$$\\begin{cases} \\dot{x}_1 = x_2 \\\\ \\dot{x}_2 = -a_0 x_1 - a_1 x_2 + f(t) \\end{cases}$$</div>
          </div>
        </div>

        <div class="formula-section">
          <h4>Separatrices</h4>
          <p class="formula-note">Curvas que separan regiones con comportamiento cualitativo diferente (variedades estable/inestable de puntos silla)</p>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const toggleBtn = document.getElementById('cheatsheet-toggle');
    const closeBtn = document.getElementById('cheatsheet-close');
    const panel = document.getElementById('cheatsheet-panel');

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        this.isOpen = !this.isOpen;
        panel.classList.toggle('open', this.isOpen);
      });
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener('click', () => {
        this.isOpen = false;
        panel.classList.remove('open');
      });
    }

    // Tab switching
    const tabs = document.querySelectorAll('.cheatsheet-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tabName = target.dataset.tab;
        
        // Remove active from all tabs and panels
        document.querySelectorAll('.cheatsheet-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        
        // Add active to clicked tab and corresponding panel
        target.classList.add('active');
        const panel = document.querySelector(`[data-panel="${tabName}"]`);
        if (panel) {
          panel.classList.add('active');
        }

        // Render KaTeX after tab switch
        this.renderKaTeX();
      });
    });

    // Initial KaTeX render
    setTimeout(() => this.renderKaTeX(), 100);
  }

  private renderKaTeX(): void {
    if (typeof window === 'undefined' || !(window as any).renderMathInElement) {
      return;
    }

    const content = document.querySelector('.cheatsheet-content');
    if (content) {
      (window as any).renderMathInElement(content, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ],
        throwOnError: false
      });
    }
  }
}
