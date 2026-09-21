/* ============================================================
   Feliz día de las flores amarillas — lógica de la escena
   ============================================================ */

// ---------- PERSONALIZACIÓN (editar aquí sin tocar el resto) ----------
const titulo = "Feliz día de las flores amarillas";
const subtitulo = "para que huelle bien";
const nombrePersona = ""; // si se rellena, se añade al final del título

const mensajesRomanticos = [
  "para que huelle bien"
];

// ---------- Utilidades ----------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min, max) => Math.random() * (max - min) + min;
const NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

// ============================================================
// 1. TEXTO SUPERIOR
// ============================================================
function setupText() {
  const t = $("#titulo");
  const s = $("#subtitulo");
  t.textContent = nombrePersona ? `${titulo}, ${nombrePersona}` : titulo;
  s.textContent = subtitulo;
}

// ============================================================
// 2. FONDO — estrellas / polvo / partículas (canvas)
// ============================================================
function setupBackground() {
  const canvas = $("#bg-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, stars = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.4, 1.6) * devicePixelRatio,
      phase: rand(0, Math.PI * 2),
      speed: rand(0.2, 0.6),
      driftX: rand(-0.05, 0.05),
      driftY: rand(-0.03, -0.01)
    }));
  }

  function tick(time) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(time * 0.0006 * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${tw * 0.85})`;
      ctx.fill();
      s.x += s.driftX;
      s.y += s.driftY;
      if (s.y < -5) s.y = h + 5;
      if (s.x < -5) s.x = w + 5;
      if (s.x > w + 5) s.x = -5;
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
}

// ============================================================
// 3. VEGETACIÓN DE FONDO (pasto / hojas oscuras)
// ============================================================
function setupFoliage() {
  const svg = $("#foliage");
  svg.setAttribute("viewBox", "0 0 1000 300");
  const grad = svgEl("linearGradient", { id: "foliageGrad", x1: "0", y1: "0", x2: "0", y2: "1" });
  grad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#0d160a" }));
  grad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#020402" }));
  const defs = svgEl("defs");
  defs.appendChild(grad);
  svg.appendChild(defs);

  // matas de pasto distribuidas en la base
  for (let i = 0; i < 26; i++) {
    const x = (i / 26) * 1000 + rand(-15, 15);
    const baseH = rand(30, 90);
    const tilt = rand(-14, 14);
    const path = svgEl("path", {
      d: `M ${x} 300 Q ${x + tilt} ${300 - baseH * 0.6} ${x + tilt * 1.6} ${300 - baseH}`,
      stroke: "url(#foliageGrad)",
      "stroke-width": rand(2, 5),
      fill: "none",
      "stroke-linecap": "round",
      opacity: rand(0.5, 0.95)
    });
    svg.appendChild(path);
  }
  // silueta de hojas grandes en los laterales
  [ {x:40,side:1}, {x:960,side:-1} ].forEach(({x,side})=>{
    for(let i=0;i<4;i++){
      const y = 300 - i*35 - rand(0,15);
      const w = rand(70,130);
      const leaf = svgEl("path", {
        d: `M ${x} ${y} Q ${x + side*w} ${y-20} ${x + side*w*0.3} ${y-55} Q ${x+side*10} ${y-25} ${x} ${y} Z`,
        fill: "#0c1508",
        opacity: rand(0.6,0.9)
      });
      svg.appendChild(leaf);
    }
  });
}

// ============================================================
// 4. DATOS DEL RAMO (posiciones, tamaños, tiempos)
// ============================================================
// x,y en % dentro de bouquet-wrap (0,0 = esquina sup. izq.)
const flowersData = [
  { x: 50, y: 20, size: 40, rot: -4, z: 6, base: [50, 96] },
  { x: 30, y: 34, size: 34, rot: -10, z: 5, base: [46, 97] },
  { x: 70, y: 33, size: 35, rot: 9, z: 5, base: [55, 97] },
  { x: 16, y: 52, size: 30, rot: -16, z: 4, base: [40, 98] },
  { x: 84, y: 50, size: 31, rot: 15, z: 4, base: [60, 98] },
  { x: 40, y: 50, size: 29, rot: -6, z: 3, base: [47, 98] },
  { x: 60, y: 49, size: 29, rot: 7, z: 3, base: [53, 98] },
  { x: 50, y: 60, size: 24, rot: 2, z: 7, base: [50, 99] },
];

// ============================================================
// 5. TALLOS Y HOJAS (SVG)
// ============================================================
function setupStemsAndLeaves(timeline) {
  const svg = $("#stems-svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");

  const defs = svgEl("defs");
  const grad = svgEl("linearGradient", { id: "stemGradient", x1: "0", y1: "1", x2: "0", y2: "0" });
  grad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#1c3212" }));
  grad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#4a7a2e" }));
  defs.appendChild(grad);
  svg.appendChild(defs);

  flowersData.forEach((f, i) => {
    const [bx, by] = f.base;
    const midX = (bx + f.x) / 2 + rand(-4, 4);
    const midY = (by + f.y) / 2;
    const d = `M ${bx} ${by} Q ${midX} ${midY} ${f.x} ${f.y + f.size * 0.32}`;

    const path = svgEl("path", { d, class: "stem-path" });
    path.style.setProperty("--len", "160");
    path.style.setProperty("--sdelay", `${timeline.stem[i]}s`);
    svg.appendChild(path);

    // un par de hojas por tallo
    const leafCount = i % 2 === 0 ? 2 : 1;
    for (let l = 0; l < leafCount; l++) {
      const t = 0.35 + l * 0.3;
      const px = bx + (midX - bx) * t;
      const py = by + (midY - by) * t;
      const side = l % 2 === 0 ? 1 : -1;
      const w = f.size * 0.22;
      const leaf = svgEl("path", {
        d: `M ${px} ${py} Q ${px + side * w} ${py - w * 0.35} ${px + side * w * 1.3} ${py + w * 0.15}
            Q ${px + side * w} ${py + w * 0.4} ${px} ${py} Z`,
        class: "leaf-path"
      });
      leaf.style.setProperty("--ldelay", `${timeline.leaf[i] + l * 0.12}s`);
      svg.appendChild(leaf);
    }
  });

  return svg;
}

// ============================================================
// 6. FLORES (pétalos generados por CSS/JS)
// ============================================================
function makePetalLayer(className, count, pw, ph, delayBase, delayStep) {
  const layer = document.createElement("div");
  layer.className = className;
  for (let i = 0; i < count; i++) {
    const ang = (360 / count) * i + (className.includes("inner") ? (360 / count) / 2 : 0);
    const wrap = document.createElement("div");
    wrap.className = "petal-wrap";
    wrap.style.setProperty("--ang", `${ang}deg`);
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.setProperty("--pw", `${pw}%`);
    petal.style.setProperty("--ph", `${ph}%`);
    petal.style.setProperty("--pdelay", `${delayBase + i * delayStep}s`);
    wrap.appendChild(petal);
    layer.appendChild(wrap);
  }
  return layer;
}

function buildFlower(f, index, timeline) {
  const el = document.createElement("div");
  el.className = "flower";
  el.style.setProperty("--x", `${f.x}%`);
  el.style.setProperty("--y", `${f.y}%`);
  el.style.setProperty("--size", `clamp(60px, ${f.size * 0.9}vw, ${f.size * 3.6}px)`);
  el.style.setProperty("--rot", `${f.rot}deg`);
  el.style.setProperty("--z", f.z);
  el.style.setProperty("--delay", `${timeline.flower[index]}s`);
  el.style.setProperty("--sway-dur", `${rand(5, 8).toFixed(2)}s`);
  el.style.setProperty("--sway-delay", `${rand(0, 3).toFixed(2)}s`);

  const rot = document.createElement("div");
  rot.className = "flower-rot";
  const sway = document.createElement("div");
  sway.className = "flower-sway";

  const outer = makePetalLayer("petals-outer", 13, 20, 46, 0, 0.018);
  const inner = makePetalLayer("petals-inner", 11, 15, 34, 0.15, 0.018);
  const center = document.createElement("div");
  center.className = "flower-center";

  sway.appendChild(outer);
  sway.appendChild(inner);
  sway.appendChild(center);
  rot.appendChild(sway);
  el.appendChild(rot);

  // interacción: clic / toque
  el.addEventListener("click", () => onFlowerClick(el));

  return el;
}

function setupFlowers(timeline) {
  const layer = $("#flowers-layer");
  flowersData.forEach((f, i) => {
    layer.appendChild(buildFlower(f, i, timeline));
  });
}

// ============================================================
// 7. ENVOLTURA DE PAPEL + CINTA
// ============================================================
function setupWrapper(timeline) {
  const svg = $("#wrapper-svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");

  const layers = [
    { pts: "20,55 80,55 62,99 38,99", fill: "var(--papel-blanco)", d: 0 },
    { pts: "14,58 58,52 70,99 30,97", fill: "var(--papel-rosa)", d: 0.12 },
    { pts: "46,52 86,60 66,98 50,96", fill: "var(--papel-gris)", d: 0.24 },
    { pts: "24,57 50,50 40,98 22,90", fill: "var(--papel-rosa)", d: 0.34 },
    { pts: "50,50 76,58 78,92 55,97", fill: "var(--papel-blanco)", d: 0.44 },
  ];

  layers.forEach(l => {
    const poly = svgEl("polygon", { points: l.pts, class: "wrap-layer" });
    poly.style.fill = l.fill;
    poly.style.setProperty("--wdelay", `${timeline.wrapper + l.d}s`);
    svg.appendChild(poly);
  });

  // cinta amarilla alrededor de la parte superior de la envoltura
  const ribbonLayer = $("#ribbon-layer");
  const ribbonSvg = svgEl("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none" });
  ribbonSvg.style.position = "absolute";
  ribbonSvg.style.inset = "0";
  ribbonSvg.style.width = "100%";
  ribbonSvg.style.height = "100%";

  const band = svgEl("polygon", {
    points: "16,55 84,55 80,62 20,62",
    class: "ribbon-shape",
    opacity: "0.92"
  });
  band.style.fill = "var(--cinta)";
  band.style.animationDelay = `${timeline.ribbon}s`;

  const knotL = svgEl("polygon", { points: "44,58 50,50 50,66", fill: "#e0a800", class: "ribbon-shape" });
  knotL.style.animationDelay = `${timeline.ribbon + 0.1}s`;
  const knotR = svgEl("polygon", { points: "56,58 50,50 50,66", fill: "#ffdf6b", class: "ribbon-shape" });
  knotR.style.animationDelay = `${timeline.ribbon + 0.1}s`;

  ribbonSvg.appendChild(band);
  ribbonSvg.appendChild(knotL);
  ribbonSvg.appendChild(knotR);
  ribbonLayer.appendChild(ribbonSvg);
}

// ============================================================
// 8. MARIPOSAS DISCRETAS
// ============================================================
function butterflySVG(color) {
  return `
  <svg viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path class="wing" d="M20 15 C10 -5, -5 5, 8 16 C-2 22, 10 32, 20 15 Z" fill="${color}"/>
      <path class="wing" d="M20 15 C30 -5, 45 5, 32 16 C42 22, 30 32, 20 15 Z" fill="${color}"/>
    </g>
    <line x1="20" y1="9" x2="20" y2="21" stroke="${color}" stroke-width="1.4"/>
  </svg>`;
}

function setupButterflies(timeline) {
  const holder = $("#butterflies");
  const positions = [
    { x: 12, y: 78, size: 26, delay: 0 },
    { x: 86, y: 74, size: 22, delay: 0.3 },
    { x: 22, y: 90, size: 18, delay: 0.6 },
    { x: 74, y: 92, size: 20, delay: 0.9 },
  ];
  positions.forEach(p => {
    const b = document.createElement("div");
    b.className = "butterfly";
    b.style.left = `${p.x}%`;
    b.style.top = `${p.y}%`;
    b.style.width = `${p.size}px`;
    b.style.height = `${p.size * 0.75}px`;
    b.style.animationDelay = `${timeline.butterflies + p.delay}s, ${rand(0, 2)}s`;
    b.innerHTML = butterflySVG(Math.random() > 0.5 ? "#d8c24a" : "#8a8a8a");
    holder.appendChild(b);
  });
}

// ============================================================
// 9. INTERACCIÓN: clic / toque sobre una flor
// ============================================================
function onFlowerClick(el) {
  el.classList.remove("pulse");
  void el.offsetWidth; // reflow para reiniciar animación
  el.classList.add("pulse");

  const rect = el.getBoundingClientRect();
  spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

  const msg = mensajesRomanticos[Math.floor(Math.random() * mensajesRomanticos.length)];
  showMessage(msg);
}

function showMessage(text) {
  const box = $("#message-box");
  box.classList.remove("show");
  void box.offsetWidth;
  box.textContent = text;
  box.classList.add("show");
}

// ---------- Partículas de clic (canvas) ----------
let fxCtx, fxParticles = [];
function setupFx() {
  const canvas = $("#fx-canvas");
  fxCtx = canvas.getContext("2d");
  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  window.addEventListener("resize", resize);
  resize();

  function loop() {
    fxCtx.clearRect(0, 0, fxCtx.canvas.width, fxCtx.canvas.height);
    fxParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.life -= 0.018;
      if (p.life > 0) {
        fxCtx.beginPath();
        fxCtx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        fxCtx.fillStyle = `rgba(255, ${190 + Math.floor(p.life*40)}, 60, ${p.life})`;
        fxCtx.fill();
      }
    });
    fxParticles = fxParticles.filter(p => p.life > 0);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function spawnParticles(clientX, clientY) {
  const canvas = $("#fx-canvas");
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) * devicePixelRatio;
  const y = (clientY - rect.top) * devicePixelRatio;
  for (let i = 0; i < 18; i++) {
    const ang = rand(0, Math.PI * 2);
    const speed = rand(0.8, 3.2) * devicePixelRatio;
    fxParticles.push({
      x, y,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed - 1,
      r: rand(1.5, 3.2) * devicePixelRatio,
      life: 1
    });
  }
}

// ============================================================
// 10. LÍNEA DE TIEMPO Y ARRANQUE DE LA ANIMACIÓN
// ============================================================
function buildTimeline() {
  const stem = [], leaf = [], flower = [];
  let t = 0.25;
  flowersData.forEach((f, i) => {
    stem.push(t);
    leaf.push(t + 0.55);
    t += 0.16;
  });
  const stemsEnd = t + 1.0; // duración de crecimiento del tallo
  let ft = stemsEnd + 0.15;
  flowersData.forEach(() => {
    flower.push(ft);
    ft += 0.32;
  });
  const flowersEnd = ft + 0.85;
  const wrapper = flowersEnd + 0.1;
  const ribbon = wrapper + 0.9;
  const butterflies = wrapper + 0.4;
  const title = ribbon + 0.5;
  const subtitle = title + 0.35;
  return { stem, leaf, flower, wrapper, ribbon, butterflies, title, subtitle };
}

function playIntro(timeline) {
  requestAnimationFrame(() => {
    $$(".stem-path").forEach(p => p.classList.add("grow"));
    $$(".leaf-path").forEach(p => p.classList.add("show"));
    $$(".flower").forEach(f => f.classList.add("visible"));
    $$(".wrap-layer").forEach(p => p.classList.add("show"));
    $$(".ribbon-shape").forEach(p => p.classList.add("show"));
    $$(".butterfly").forEach(p => p.classList.add("show"));

    setTimeout(() => $("#titulo").classList.add("show"), timeline.title * 1000);
    setTimeout(() => $("#subtitulo").classList.add("show"), timeline.subtitle * 1000);
  });
}

// ============================================================
// INICIO
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  setupText();
  setupBackground();
  setupFoliage();
  setupFx();

  const timeline = buildTimeline();
  setupStemsAndLeaves(timeline);
  setupFlowers(timeline);
  setupWrapper(timeline);
  setupButterflies(timeline);

  playIntro(timeline);
});

  playIntro(timeline);
});
