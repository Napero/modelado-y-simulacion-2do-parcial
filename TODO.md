# Lista de Tareas - Modelado y Simulación

Este archivo rastrea el progreso del desarrollo del cliente web para resolver los ejercicios del examen.

## Fase 1: Estructura y UI Base

- [ ] **1.1: Crear la estructura de la interfaz principal:**
    - [ ] Crear un componente de navegación con 4 pestañas principales correspondientes a los 4 puntos del examen.
    - [ ] Implementar submenús desplegables para cada pestaña que listen los ejercicios específicos.
- [ ] **1.2: Configurar el enrutamiento:**
    - [ ] Instalar y configurar una librería de enrutamiento (ej. `lit-router` o una simple implementación custom).
    - [ ] Crear una página/componente base para cada ejercicio.
    - [ ] Asegurarse de que la navegación entre pestañas y submenús cargue la página del ejercicio correspondiente.

## Fase 2: Implementación de Ejercicios

Para cada ejercicio, se deben seguir los siguientes pasos:
- **Crear la interfaz de usuario (UI):**
    - Campos de entrada para los parámetros del modelo.
    - Un botón para "Resolver".
    - Secciones para mostrar la explicación paso a paso, las fórmulas y los resultados.
    - Un canvas o contenedor para los gráficos.
- **Implementar la lógica de simulación:**
    - Escribir la función que resuelve el sistema de ecuaciones.
- **Mostrar la solución paso a paso:**
    - Mostrar la fórmula general.
    - Sustituir los valores de entrada en la fórmula.
    - Mostrar el resultado final.
- **Generar gráficos dinámicos:**
    - Usar una librería como `Chart.js` o `D3.js` para visualizar los resultados.

---

### Tareas por Ejercicio:

- [ ] **Punto 1: Sistemas dinámicos lineales (1D)**
    - [ ] **1.1: Virus Verhulst:** Implementar UI, lógica, pasos y gráficos.
    - [ ] **1.2: Enfriamiento de Newton:** Implementar UI, lógica, pasos y gráficos.
    - [ ] **1.3: Bifurcación:** Implementar UI, lógica, pasos y gráficos.

- [ ] **Punto 2: Sistemas lineales (2D)**
    - [ ] **2.1: Sistema {x'=ax+by, y'=cx+dy}:** Implementar UI, lógica, pasos y gráficos.
    - [ ] **2.2: Romeo y Julieta:** Implementar UI, lógica, pasos y gráficos.

- [ ] **Punto 3: Sistemas no lineales**
    - [ ] **3.1: Sistema Lotka-Volterra:** Implementar UI, lógica, pasos y gráficos.
    - [ ] **3.2: Sistema de conservación de energía:** Implementar UI, lógica, pasos y gráficos.
    - [ ] **3.3: Sistema Radial bifurcación Hopf:** Implementar UI, lógica, pasos y gráficos.

- [ ] **Punto 4: Sistema de aplicación de parametrización**
    - [ ] **4.1: Modelo de combate:** Implementar UI, lógica, pasos y gráficos.
    - [ ] **4.2: Solución parametrizada:** Implementar UI, lógica, pasos y gráficos.
