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
