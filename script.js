/* ============================================================
   PORTFOLIO — JUSTE AGBO — script.js v2.1
   EmailJS + animations + nav
   ============================================================ */


const EMAILJS_SERVICE_ID  = 'service_6z9yqlk';   
const EMAILJS_TEMPLATE_ID = 'template_f3fzmbn';  
const EMAILJS_PUBLIC_KEY  = 'g6Xgo0imkx5uIa2Cs';   

// ── Init EmailJS ──
emailjs.init(EMAILJS_PUBLIC_KEY);


// ── Burger menu ──
const burger = document.getElementById('burger');
const nav    = document.getElementById('mainNav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Navbar scroll effect ──
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Active nav link on scroll ──
const navLinks = [...document.querySelectorAll('#mainNav a')];
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function updateActiveLink() {
  const y = window.scrollY + 120;
  for (let i = sections.length - 1; i >= 0; i--) {
    if (y >= sections[i].offsetTop) {
      navLinks.forEach(l => l.classList.remove('active'));
      navLinks[i].classList.add('active');
      break;
    }
  }
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── Reveal animations ──
const revealEls = document.querySelectorAll('.reveal, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay * 120);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el) => {
  const parent = el.parentElement;
  const siblings = [...parent.querySelectorAll('.reveal, .reveal-right')];
  const idx = siblings.indexOf(el);
  if (idx > 0) el.dataset.delay = idx;
  revealObs.observe(el);
});

// ── Skill bars animation ──
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const w = entry.target.getAttribute('data-w') || '0';
      requestAnimationFrame(() => { entry.target.style.width = w + '%'; });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(bar => skillObs.observe(bar));


// ══════════════════════════════════════════════
//  FORMULAIRE DE CONTACT — EmailJS
// ══════════════════════════════════════════════
const form       = document.getElementById('contactForm');
const feedback   = document.getElementById('formFeedback');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = document.getElementById('btnText');
const btnIcon    = document.getElementById('btnIcon');
const btnSpinner = document.getElementById('btnSpinner');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    const prenom  = document.getElementById('f-prenom').value.trim();
    const nom     = document.getElementById('f-nom').value.trim();
    const email   = document.getElementById('f-email').value.trim();
    const sujet   = document.getElementById('f-sujet').value.trim();
    const message = document.getElementById('f-message').value.trim();

    // Validation basique
    if (!prenom || !nom || !email || !sujet || !message) {
      showFeedback('⚠ Veuillez remplir tous les champs.', 'error');
      return;
    }
    // Validation format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('⚠ Veuillez saisir une adresse email valide.', 'error');
      return;
    }

    // État chargement
    setLoading(true);

    const templateParams = {
      from_prenom : prenom,
      from_nom    : nom,
      from_email  : email,
      sujet       : sujet,
      message     : message,
      reply_to    : email,
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      showFeedback('✅ Message envoyé ! Je vous répondrai bientôt.', 'success');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showFeedback('❌ Erreur lors de l\'envoi. Réessayez ou contactez-moi directement par email.', 'error');
    } finally {
      setLoading(false);
    }
  });
}

function setLoading(on) {
  submitBtn.disabled = on;
  btnText.textContent = on ? 'Envoi en cours…' : 'Envoyer le message';
  btnIcon.style.display    = on ? 'none' : 'inline';
  btnSpinner.style.display = on ? 'inline' : 'none';
}

function showFeedback(msg, type) {
  if (!feedback) return;
  feedback.textContent = msg;
  feedback.className = 'form-feedback ' + type;
}