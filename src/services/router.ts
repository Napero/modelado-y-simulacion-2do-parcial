// Router simple para manejar la navegación entre ejercicios

type RouteHandler = () => void;

class Router {
  private routes: Map<string, RouteHandler> = new Map();
  private currentRoute: string = '';

  constructor() {
    window.addEventListener('popstate', () => {
      this.navigate(window.location.hash.slice(1) || '');
    });
  }

  register(path: string, handler: RouteHandler): void {
    this.routes.set(path, handler);
  }

  navigate(path: string): void {
    this.currentRoute = path;
    window.location.hash = path;
    
    const handler = this.routes.get(path) || this.routes.get('');
    if (handler) {
      handler();
    }
  }

  getCurrentRoute(): string {
    return this.currentRoute;
  }
}

export const router = new Router();
