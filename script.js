/* ════════════════════════════════
   ZYORA PORTFOLIO — script.js
════════════════════════════════ */

/* ── Active nav highlight on scroll ── */
const sections = document.querySelectorAll('.section');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(
        `.nav-links a[data-section="${entry.target.id}"]`
      );
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ── Smooth scroll from nav ── */
navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('sidenav').classList.remove('open');
  });
});

/* ── Mobile sidebar toggle ── */
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('sidenav').classList.toggle('open');
});

/* ── Scroll hint fade ── */
window.addEventListener('scroll', () => {
  const hint = document.querySelector('.scroll-hint');
  if (hint) hint.style.opacity = window.scrollY > 200 ? '0' : '0.5';
}, { passive: true });


/* ════════════════════════════════
   UNIVERSAL LIGHTBOX
   Works for branding, social,
   print, events — any .lb-trigger
════════════════════════════════ */
function setupLightbox(triggersSelector, lbId, imgId, captionId, closeId) {
  const lb      = document.getElementById(lbId);
  const lbImg   = document.getElementById(imgId);
  const lbCap   = document.getElementById(captionId);
  const lbClose = document.getElementById(closeId);
  if (!lb || !lbImg) return;

  document.querySelectorAll(triggersSelector).forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      // prefer data-src, fall back to first <img> src
      let src = card.dataset.src || '';
      if (!src) {
        const img = card.querySelector('img');
        if (img) src = img.getAttribute('src') || '';
      }
      const caption = card.dataset.caption || '';

      // don't open if no real src
      if (!src || src === '' || src === '#') return;

      lbImg.src = src;
      lbCap.textContent = caption;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    lb.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
}

/* One shared Escape key listener for all lightboxes */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.lightbox.open').forEach(lb => {
      lb.classList.remove('open');
      const img = lb.querySelector('.lightbox-img');
      if (img) img.src = '';
      document.body.style.overflow = '';
    });
    closeReelModal();
  }
});

// Branding — click opens lightbox
setupLightbox('#brandGrid .lb-trigger', 'brandLightbox', 'brandLbImg', 'brandLbCaption', 'brandLbClose');

// Social — click opens lightbox
setupLightbox('#socialGrid .lb-trigger', 'socialLightbox', 'socialLbImg', 'socialLbCaption', 'socialLbClose');

// Print — click opens lightbox
setupLightbox('#printGrid .lb-trigger', 'printLightbox', 'printLbImg', 'printLbCaption', 'printLbClose');

// Events — click opens lightbox
setupLightbox('#eventsGrid .lb-trigger', 'eventsLightbox', 'eventsLbImg', 'eventsLbCaption', 'eventsLbClose');


/* ════════════════════════════════
   REEL MODAL  (Content & Video)
════════════════════════════════ */
const reelModal      = document.getElementById('reelModal');
const reelModalVideo = document.getElementById('reelModalVideo');
const reelModalLabel = document.getElementById('reelModalLabel');
const reelModalClose = document.getElementById('reelModalClose');

document.querySelectorAll('.reel-card').forEach(card => {
  const preview = card.querySelector('.reel-preview');
  if (preview && preview.src) {
    preview.addEventListener('loadeddata', () => card.classList.add('has-thumb'));
  }

  card.addEventListener('click', () => {
    const src    = card.querySelector('.reel-preview')?.src;
    const label  = card.dataset.label  || '';
    const client = card.dataset.client || '';

    if (!src) {
      alert('Add your video path to the src="" on this reel card.');
      return;
    }

    reelModalVideo.src = src;
    reelModalLabel.textContent = label + (client ? ' · ' + client : '');
    reelModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    reelModalVideo.play().catch(() => {});
  });
});

function closeReelModal() {
  if (!reelModal) return;
  reelModal.classList.remove('open');
  if (reelModalVideo) { reelModalVideo.pause(); reelModalVideo.src = ''; }
  document.body.style.overflow = '';
}

if (reelModalClose) reelModalClose.addEventListener('click', closeReelModal);
if (reelModal) {
  reelModal.addEventListener('click', e => {
    if (e.target === reelModal) closeReelModal();
  });
}
