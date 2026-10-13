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
