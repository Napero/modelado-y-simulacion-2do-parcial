# PARTE 2 — Sistemas Dinámicos

## Sistemas Autónomos

Dadas las siguientes ecuaciones diferenciales:

**Consignas:**
- Resolver analíticamente si es posible.  
- Calcular puntos de equilibrio.  
- Dibujar su diagrama de fase.  
- Graficar soluciones.

**Ecuaciones:**
1. ẋ = 2x, x ≥ 0  
2. ẋ = x² − 4  
3. ẋ = 3x − x²  
4. ẏ = 3y − 9  
5. ẏ = 4 − 2y  
6. ẏ = 3 − 2y  
7. ẏ = y² − 6y + 5  
8. ẋ̇ = sin(x)  
9. ẋ = 4x − x²  
10. ẏ = 3y(y − 2)  
11. ẏ = y² − 4y − 12  
12. ẏ = y² − y  
13. ẏ = (y − 1)²  
14. ẏ = y(y + 1)(y − 2)  
15. ẏ = y + 2  
16. ẏ = y(4 − y)

---

## Bifurcaciones

**Consignas:**
- Encontrar los puntos fijos.  
- Determinar estabilidad lineal en función del parámetro.  
- Identificar el valor donde ocurre la bifurcación y clasificarla.  
- Dibujar el diagrama de bifurcación (usar código Python).

**Sistemas:**
1. ẋ = r + x²  
2. ẋ = r·x − x²  
3. ẋ = r·x − x³  
4. ẋ = r + 3x − x³  
5. ẋ = r − eˣ  
6. ẋ = r − x²  
7. ẋ = r·x + x³  
8. ẋ = x³ − r·x  
9. ẋ = (r − 1) − (x − 1)²  
10. ẋ = (r − 2)x − x²  
11. ẋ = (r − 3)x − x³  
12. ẋ = r − (x − 2)²  
13. ẋ = (r − 1)(x − 1) − (x − 1)²  
14. ẋ = r·x(1 − x/k) − h

**Variables (ejercicio 14):**
- x = Tamaño de la población (peces en un lago).  
- r = Tasa de crecimiento intrínseca.  
- k = Capacidad de carga del ecosistema.  
- h = Tasa de cosecha (pesca).

---

## Sistemas Dinámicos Lineales 2D

**Consignas:**
- Resolver analíticamente si es posible.  
- Calcular puntos de equilibrio.  
- Calcular autovalores y autovectores asociados.  
- Dibujar el diagrama de fase manualmente.  
- Graficar soluciones (campo vectorial y trayectorias con software).

**Ejemplos de sistemas:**
1. { ẋ = x ; ẏ = y }  
2. { ẋ = −y ; ẏ = x }  
3. { ẋ = x ; ẏ = −y }  
4. { ẋ = y − x ; ẏ = −y − x }  
5. { ẋ = x + y ; ẏ = x + y }  
6. { ẋ = −y ; ẏ = x }  
7. { ẋ = 2y ; ẏ = 2x }  
8. { ẋ = −y + x ; ẏ = x + y }  
9. { ẋ = x − 2y ; ẏ = −2x + y }  
10. { ẋ = x + 2y ; ẏ = 3y + 4x }  
11. { ẋ = x − 2y ; ẏ = x + y }  
12. { ẋ = x − y ; ẏ = 3x + 3y }  
13. { ẋ = −4x + 3y ; ẏ = −6x + 5y }  
14. { ẋ = 6x − y ; ẏ = 5x + 4y }  
15. { ẋ = x + 2y ; ẏ = 2x − 4y }  
16. { ẋ = 2x − 5y ; ẏ = 4x − 2y }  
17. { ẋ = −5x + 2y ; ẏ = −10x + 3y }  
18. { ẋ = −2x + 3y ; ẏ = −6x + 4y }  
19. { ẋ = 5x − 4y ; ẏ = x + y }  
20. { ẋ = 3x + y ; ẏ = x + 3y }  
21. { ẋ = y ; ẏ = 6x + y }  
22. { ẋ = 2x − 2y ; ẏ = 4x − 2y }  
23. { ẋ = x + 2y ; ẏ = 2x + y }  
24. { ẋ = 2x + 3y ; ẏ = 2x + y }  
25. { ẋ = −3x − 4y ; ẏ = 2x + y }  
26. { ẋ = 3x − y ; ẏ = 9x − 3y }  
27. { ẋ = −2x + y ; ẏ = x − 2y }  
28. { ẋ = x + 3y ; ẏ = x − y }
29. Ẋ=[[a,-2][2,-1]]X

**Ejercicio 29:**  
Hallar a ∈ ℝ tal que el sistema tenga:  
a) Equilibrio silla-nodo  
b) Nodo estable  
c) Espiral

---

## Sistemas Lineales No Homogéneos

**Consignas:**
- Resolver si es posible analíticamente.  
- Hallar autovalores y autovectores.  
- Escribir la solución general matricial.  
- Analizar cambio o preservación de la dinámica al introducir f(t).  
- Resolver con coeficientes indeterminados o variación de parámetros.  
- Simular la dinámica.

**Ejemplos de sistemas:**
1. Ẋ = [[0, −1], [−9, 0]]X + [1, 9]  
2. Ẋ = [[1, 2], [2, 1]]X + [−5, −7]  
3. Ẋ = [[4, −1], [2, 1]]X + [0, −6]  
4. Ẋ = [[−2, 1], [1, −2]]X + [3, 2]  
5. Ẋ = [[−1, 2], [−1, 1]]X + [−8, 3]  
6. Ẋ = [[−1, 0], [0, −2]]X + [3, 5]  
7. Ẋ = [[−1, 0], [0, −2]]X + [cos(t), 0]  
8. Ẋ = [[−1, 0], [0, −2]]X + [eᵗ, 0]  
9. Ẋ = [[1, 0], [0, −2]]X + [eᵗ, 0]  
10. Ẋ = [[1, 2], [0, −1]]X + [t, −t]

---

## Conversión de EDO de orden 2 a sistema de primer orden

**Ecuaciones:**
a) ÿ − 4y = 2  
b) ÿ + 2ẏ − 3y = 6

**Generalización:**
Para una ecuación de la forma:  
ÿ + a₁ẏ + a₀y = f(t)  
se transforma en:

dX/dt = [[0, 1], [−a₀, −a₁]] X + f(t)

---

## Sistemas Dinámicos No Lineales

**Consignas:**
- Calcular puntos de equilibrio.  
- Linealizar el sistema en los puntos críticos.  
- Calcular autovalores/autovectores si son hiperbólicos (Hartman–Grobman).  
- Analizar puntos no hiperbólicos (coordenadas polares o Lyapunov).  
- Dibujar diagrama de fase y graficar trayectorias.

*(Se listan 20 sistemas no lineales, desde los de tipo ẋ = y, ẏ = x(3−x) hasta sistemas más complejos como Lotka–Volterra, Hopf, etc.)*

---

## Aplicaciones

1. Modelo de **Romeo y Julieta**  
   {
   ẋ = aR + bJ  
   ẏ = cR + dJ  
   }

2. Sistema **Depredador–Presa (Lotka–Volterra)**  
   {
   ẋ = (a − b·y)x  
   ẏ = (d·x − c)y  
   }

3. **Oscilador armónico simple:**  
   ẋ = y, ẏ = −x  

4. **Sistema conservativo:**  
   ẋ = y, ẏ = −x − x³  

5. Hallar función de Hamilton para:  
   ẋ = y³, ẏ = −x  

6. Determinar si gana o pierde energía:  
   ẋ = y, ẏ = −x − y  

---

## Parametrización y Estructura Orbital

**Ejercicios:**
1. ẋ = −x, ẏ = −y  
2. ẋ = x, ẏ = x + y  
3. ẋ = y, ẏ = −x  
4. ẋ = x², ẏ = −y  
5. ẋ = y, ẏ = −sin(x)  
6. ẋ = x + t, ẏ = −y + cos(t)  
7. ẋ = −x + t², ẏ = y + sin(t)  
8. ẋ = x, ẏ = x·y  
9. ẋ = y, ẏ = −x + sin(t)  
10. ẋ = −y + a·x(x² + y²), ẏ = x + a·y(x² + y²)

---

## Ejercicios Adicionales

### Análisis de bifurcaciones (gráficos y comparación con software)

**Unidimensionales:**
a) ẋ = μ + x − x³  
b) ẋ = μ − 2x²  
c) ẋ = μx² − x³  
d) ẋ = μ + 2x²  
e) ẋ = μx² − 2μx + 1  
f) ẋ = μx + x³ − x⁵  
g) ẋ = 1 + μx − x³  

**Sistemas 2D:**
1. ẋ = x + y − μ,  ẏ = 2x + 2y + 1 − μ  
   - Analizar estructura orbital.  
   - Demostrar bifurcación en μ = −1.  
   - Mostrar que hay línea de equilibrios x + y = −1.  

2. ẋ = μx + μy + 1,  ẏ = x + y − μ  
3. ẋ = y + 2,  ẏ = x − y − μ  
4. ẋ = x + μy,  ẏ = μx − y  
5. ẋ = μx − x²,  ẏ = −y  

---

## Modelos de Combate

**a)** Modelo Lanchester clásico:  
ẋ = −a·y,  ẏ = −b·x  
(con y sin refuerzos α, β)

**b)** Modelo no convencional:  
ẋ = a·x·y,  ẏ = b·x  

**c)** Modelo de Lotka–Volterra con espacio limitado:  
ẋ = (a − b·y)x  
ẏ = −(d − c·x)y  

**d)** Variante con interacciones intraespecíficas:  
ẋ = (a − b·y − αx)x  
ẏ = −(d − c·x − βy)y  

**e)** Principio de exclusión competitiva:  
ẋ = (a − x − y)x  
ẏ = (b − x − y)y  

**f)** Modelo epidemiológico (umbral epidemiológico ρ = γ/r):  
ẋ = −r·x·y  
ẏ = r·x·y − γ·y

---

## Sistemas Conservativos

Probar si son centro o silla:

a) ẋ = x − 2xy,  ẏ = x − y + y²  
b) ẋ = 2xy,  ẏ = 1 + 3x² − y²  

---

## Sistemas de Orden 2

Analizar y convertir a 2D:

a) ÿ + 2ẏ + 2x = 0,  x(0)=1, ẋ(0)=0  
b) ÿ + 2ẏ + x = 0,  x(0)=1, ẋ(0)=0

---

## Sistemas No Homogéneos

a) ẋ = 2x − y + 1,  ẏ = −x + 2y − 5,  X(0) = (2,3)  
b) ẋ = −x + 4y − 2,  ẏ = x − y − 1,  X(0) = (3,1)

---

## Conjuntos Límite (Unidimensionales)

Analizar cualitativamente los siguientes:

a) ẋ = x² − x − 2  
b) ẋ = x³ − 4x² + 4x  
c) ẋ = x − x³  
d) ẋ = x⁴ − x²  
e) ẋ = −x⁴ + x²
