document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Formulario de contacto
// NOTA PARA CRISTIAN: esta web es HTML/CSS/JS puro (sin backend), así que el
// formulario por sí solo NO puede enviar correos. Para que el mensaje SÍ le
// llegue al doctor, conecta este formulario a un servicio gratuito como
// Formspree (https://formspree.io) o EmailJS: solo agregas su "action"/API key
// aquí abajo. Mientras tanto, este código solo confirma visualmente el envío.
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  // TODO: reemplazar esto por el envío real (Formspree / EmailJS)
  note.textContent = '¡Gracias! Tu mensaje fue recibido, te contactaremos pronto.';
  form.reset();
});

// Información de formación: al picar un chip se abre su detalle
const BADGE_INFO = {
  conacem: {
    titulo: 'Certificado CONACEM',
    texto: 'El Consejo Mexicano de Ginecología y Obstetricia, A.C. (CONACEM) es el organismo que certifica que un médico especialista cuenta con la competencia requerida para ejercer la Ginecología y Obstetricia en México. Esta certificación avala su preparación y su actualización constante.'
  },
  especialista: {
    titulo: 'Especialista en Ginecología y Obstetricia',
    texto: 'La especialidad abarca la salud de la mujer en todas sus etapas:',
    lista: [
      'Control ginecológico y prevención',
      'Embarazo: control prenatal, parto y posparto',
      'Salud hormonal y climaterio',
      'Planificación familiar y atención de la mujer en cada etapa de su vida'
    ]
  },
  diplomado: {
    titulo: 'Diplomado en Administración de Hospitales y Gerencia en Salud',
    texto: 'Formación en la organización y gestión de servicios de salud, que complementa su práctica médica para ofrecer una atención más ordenada, eficiente y cuidadosa con cada paciente.'
  }
};
const badgeInfo = document.getElementById('badgeInfo');
const badgeButtons = document.querySelectorAll('.badge[data-info]');
badgeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const abierto = btn.getAttribute('aria-expanded') === 'true';
    badgeButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (abierto) { badgeInfo.hidden = true; return; }
    const d = BADGE_INFO[btn.dataset.info];
    badgeInfo.innerHTML = '';
    const h = document.createElement('h3'); h.textContent = d.titulo;
    const p = document.createElement('p'); p.textContent = d.texto;
    badgeInfo.append(h, p);
    if (d.lista) {
      const ul = document.createElement('ul');
      d.lista.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
      badgeInfo.appendChild(ul);
    }
    btn.setAttribute('aria-expanded', 'true');
    badgeInfo.hidden = false;
  });
});

// ---------------------------------------------------------------
// Experiencia interactiva al bajar
// ---------------------------------------------------------------
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;

// Aparición suave de elementos
const revealEls = $$('.about-intro, .cert-strip figure, .personal h2, .personal > .section-label, .gallery-sec > *:not(.gallery), .huellitas-sec > *:not(.huellitas-grid), .contact');
revealEls.forEach(el => el.classList.add('reveal'));
const storyRows = $$('.story-row');
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }) : null;
[...revealEls, ...storyRows].forEach(el => io ? io.observe(el) : el.classList.add('in'));

// Menú y puntos laterales: sección activa
const navLinks = $$('#mainNav a');
const dotLinks = $$('#dots a');
const sectionIds = [...new Set([...navLinks, ...dotLinks].map(a => a.getAttribute('href')))];
const sections = sectionIds.map(id => $(id)).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = '#' + e.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
        dotLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navIo.observe(s));
}

// Visor para ampliar certificados y fotos
const lightbox = $('#lightbox');
const lbImg = $('#lbImg');
const closeLightbox = () => { lightbox.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; };
$$('.cert-strip img, .stack-card img, .pan img, .sudadera-block img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});
lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

// Frase de la sudadera: cada palabra se ilumina al bajar
const quote = $('#quote');
const words = [];
if (quote) {
  const text = quote.textContent.trim();
  quote.textContent = '';
  text.split(/\s+/).forEach((w, i, arr) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w;
    quote.appendChild(s);
    if (i < arr.length - 1) quote.appendChild(document.createTextNode(' '));
    words.push(s);
  });
}

// Galería apilada: numerar tarjetas
const stackCards = $$('.stack-card');
stackCards.forEach((c, i) => c.style.setProperty('--i', i));

// Actualización por scroll (una sola vez por cuadro)
const siteHeader = $('#site-header');
const progressBar = $('#progress');
const storyImgs = $$('.story-media img');
const pans = $$('.pan');
const sudaderaBlock = $('#sudadera');
const sudaderaImg = $('.sudadera-block img');
let ticking = false;

function update() {
  ticking = false;
  const vh = innerHeight;
  const y = scrollY;

  // Cabecera y barra de progreso
  siteHeader.classList.toggle('scrolled', y > 10);
  const max = document.documentElement.scrollHeight - vh;
  progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

  if (reduceMotion) return;

  // Hero: capas a distinta velocidad
  if (y < vh * 1.2) root.style.setProperty('--sy', y.toFixed(1));

  // Lo que me define: las fotos se desplazan dentro de su marco
  storyImgs.forEach(img => {
    const r = img.parentElement.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50) return;
    const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
    img.style.setProperty('--py', (p * -38).toFixed(1) + 'px');
  });

  // Frase: palabras que se encienden
  if (words.length && sudaderaBlock) {
    const r = sudaderaBlock.getBoundingClientRect();
    const p = clamp((vh * 0.82 - r.top) / (vh * 0.5));
    const on = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < on));
    if (sudaderaImg) {
      sudaderaImg.style.setProperty('--rot', (-6 + p * 6).toFixed(2) + 'deg');
      sudaderaImg.style.setProperty('--sc', (0.94 + p * 0.06).toFixed(3));
    }
  }

  // Galería: la tarjeta anterior se hunde cuando llega la siguiente
  stackCards.forEach((card, i) => {
    const next = stackCards[i + 1];
    if (!next) return;
    const stickTop = parseFloat(getComputedStyle(next).top) || 96;
    const nt = next.getBoundingClientRect().top;
    const p = clamp((vh - nt) / (vh - stickTop));
    card.style.setProperty('--sc', (1 - p * 0.06).toFixed(3));
    card.style.setProperty('--br', (1 - p * 0.18).toFixed(3));
  });

  // Huellitas: la pared se desliza de lado mientras pasas
  pans.forEach(pan => {
    const r = pan.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50) return;
    const img = pan.firstElementChild;
    const extra = Math.max(0, img.offsetWidth - pan.clientWidth);
    const p = clamp((vh - r.top) / (vh + r.height));
    img.style.setProperty('--pan', (-extra * p).toFixed(1) + 'px');
  });
}
function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
window.addEventListener('load', update);
update();

// Con mouse: tarjetas con inclinación suave y foto principal que sigue el cursor
if (canHover && !reduceMotion) {
  $$('.cert-strip figure').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
  const heroEl = $('.hero');
  heroEl.addEventListener('mousemove', (e) => {
    const r = heroEl.getBoundingClientRect();
    root.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1));
    root.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 12).toFixed(1));
  });
  heroEl.addEventListener('mouseleave', () => {
    root.style.setProperty('--mx', 0);
    root.style.setProperty('--my', 0);
  });
}
