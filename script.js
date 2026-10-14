document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
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

// ---- Mejoras de diseño ----
// Sombra del menú al bajar
const siteHeader = document.getElementById('site-header');
const onScroll = () => siteHeader.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú móvil: estado accesible
menuToggle.addEventListener('click', () =>
  menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('open')));

// Aparición suave de las secciones al hacer scroll
const revealEls = document.querySelectorAll(
  '.hero-text, .hero-photo, .about-intro, .cert-strip figure, .personal h2, .personal-card, .sudadera-block, .gallery img, .huellitas-sec > *, .huellitas-grid img, .contact'
);
revealEls.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Resaltar en el menú la sección donde estás
const navLinks = [...document.querySelectorAll('#mainNav a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navIo.observe(s));
}

// Visor para ampliar certificados y fotos
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const closeLightbox = () => { lightbox.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; };
document.querySelectorAll('.cert-strip img, .gallery img, .huellitas-grid img, .sudadera-block img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});
lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

// ---- Segunda ronda ----
// Barra de progreso de lectura
const progressBar = document.getElementById('progress');
const updateProgress = () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Efecto 3D suave en tarjetas y movimiento de la foto principal (solo con mouse)
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (canHover && !reduceMotion) {
  document.querySelectorAll('.personal-card, .cert-strip figure').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
  const photoWrap = document.querySelector('.photo-wrap');
  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('mousemove', (e) => {
    const r = heroEl.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    photoWrap.style.transform = `translate(${(x * 14).toFixed(1)}px, ${(y * 10).toFixed(1)}px)`;
  });
  heroEl.addEventListener('mouseleave', () => { photoWrap.style.transform = ''; });
}
