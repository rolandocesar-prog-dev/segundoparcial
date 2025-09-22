# Examen Práctico - Segundo Parcial
   ## Tecnologías de Internet

   ### Framework CSS Elegido: **Bootstrap**
   
   Este proyecto utiliza **Bootstrap 5** como framework CSS para el diseño responsive y componentes de interfaz.

   ### Tecnologías utilizadas:
   - Angular 20.3.2 (standalone)
   - Node.js 22.19.0
   - npm 10.9.3
   - Bootstrap 5

   ### Desarrollo:
```bash
   ng serve

   ### Template utilizado:
   **Creative** - Start Bootstrap
   - **Fuente:** https://startbootstrap.com/theme/creative
   - **Licencia:** MIT License
   - **Autor:** Start Bootstrap
   - **Descripción:** Template one-page responsive con diseño creativo
   
   #### Licencia del Template:
   Copyright (c) 2013-2024 Start Bootstrap
   Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)

8. Funcionalidad Offline (PWA)
La aplicación está configurada como PWA con Service Worker habilitado para funcionar completamente offline.
Recursos pre-cacheados:

Todos los archivos HTML, CSS y JavaScript de la aplicación
Imágenes y assets del template Bootstrap Creative
Recursos externos: Bootstrap CDN, Google Fonts, Bootstrap Icons

Cómo probar offline:

Construir en producción:

bash
ng build --configuration=production

Servir la aplicación:

bash
npx http-server -p 8080 -c-1 dist/segundoparcial/browser

Verificar en Chrome DevTools:

Abrir la aplicación en http://localhost:8080
F12 → Application → Service Workers
Activar checkbox "Offline"
Recargar la página (F5)



Resultado:
✅ La página Home y la navegación a /ui funcionan completamente sin conexión a internet.