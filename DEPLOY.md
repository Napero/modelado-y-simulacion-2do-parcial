# Despliegue a GitHub Pages

## Pasos para desplegar:

### 1. Asegúrate de que tu repositorio esté en GitHub

Si aún no has hecho push de tu código:

```bash
git add .
git commit -m "Aplicación completa de modelado y simulación"
git push origin main
```

### 2. Construir y desplegar

Simplemente ejecuta:

```bash
npm run deploy
```

Este comando:
- Compila el TypeScript
- Construye la aplicación para producción
- Despliega automáticamente a la rama `gh-pages`

### 3. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** > **Pages**
3. En **Source**, selecciona la rama `gh-pages`
4. Haz clic en **Save**

### 4. Acceder a tu sitio

Después de unos minutos, tu aplicación estará disponible en:

```
https://napero.github.io/modelado-y-simulacion-2p/
```

## Actualizar el sitio

Cada vez que quieras actualizar el sitio desplegado:

```bash
npm run deploy
```

## Notas

- El archivo `vite.config.ts` está configurado con `base: '/modelado-y-simulacion-2p/'` para que funcione correctamente en GitHub Pages
- Si cambias el nombre del repositorio, actualiza la propiedad `base` en `vite.config.ts`
- El archivo `.nojekyll` en `public/` previene que GitHub Pages procese los archivos con Jekyll

## Desarrollo local

Para desarrollo local:

```bash
npm run dev
```

Luego abre http://localhost:5173
