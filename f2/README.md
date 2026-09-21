# Feliz día de las flores amarillas 🌻

Página web animada, construida con HTML, CSS y JavaScript puro (sin frameworks),
que recrea mediante código un ramo de girasoles animado sobre fondo negro.

## Cómo usarla
Simplemente abre `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox, Safari).
No necesita servidor ni instalación.

## Estructura
```
index.html      → estructura de la página
css/style.css   → todos los estilos y animaciones
js/script.js    → generación del ramo, secuencia de animación e interacción
assets/         → carpeta libre por si quieres añadir imágenes propias
```

## Personalizar el texto
Al inicio de `js/script.js` encontrarás:
```js
const titulo = "Feliz día de las flores amarillas";
const subtitulo = "Ten tu ramo bonita";
const nombrePersona = ""; // escribe aquí un nombre y se añadirá al título
```
También puedes editar el arreglo `mensajesRomanticos` para cambiar los mensajes
que aparecen al tocar una flor.

## Qué incluye
- Fondo negro con partículas/estrellas parpadeantes (canvas) y vegetación oscura de fondo.
- Ramo de 8 girasoles construidos con capas de pétalos en CSS (sin imágenes), con
  tallos y hojas en SVG animados con efecto de "crecimiento".
- Envoltura de papel translúcida (capas en tonos rosa/blanco/gris) con cinta amarilla.
- Secuencia de aparición progresiva: partículas → tallos → hojas → flores → envoltura →
  cinta → mariposas → texto.
- Movimiento continuo y suave tipo "viento" una vez termina la animación de entrada.
- Interacción: toca/haz clic en una flor para verla agrandarse, soltar partículas
  amarillas y mostrar un mensaje romántico.
- Totalmente responsive (móvil vertical/horizontal, tablet, 1366x768, 1920x1080).

## Nota
El video proporcionado se usó únicamente como referencia visual para la composición.
No se incrustó el video ni se copiaron marca de agua, usuario o textos de la plataforma
de origen; todo el resultado está construido con código propio.
