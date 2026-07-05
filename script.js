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

/* ════════════════════════════════
   LIGHTBOX  — shared for branding & social
   Any element with class .lb-trigger and
   data-src / data-caption opens its
   nearest .lightbox sibling-or-ancestor.
════════════════════════════════ */
function setupLightbox(triggersSelector, lbId, imgId, captionId, closeId, accentVar) {
  const lb      = document.getElementById(lbId);
  const lbImg   = document.getElementById(imgId);
  const lbCap   = document.getElementById(captionId);
  const lbClose = document.getElementById(closeId);
  if (!lb) return;

  document.querySelectorAll(triggersSelector).forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const src     = card.dataset.src     || card.querySelector('img')?.src || '';
      const caption = card.dataset.caption || '';
      if (!src || src.endsWith('/') || src === window.location.href) return;
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
}

// Branding lightbox
setupLightbox('#brandGrid .lb-trigger', 'brandLightbox', 'brandLbImg', 'brandLbCaption', 'brandLbClose');

// Social lightbox
setupLightbox('#social .lb-trigger', 'socialLightbox', 'socialLbImg', 'socialLbCaption', 'socialLbClose');

/* ── Scroll hint fade ── */
window.addEventListener('scroll', () => {
  const hint = document.querySelector('.scroll-hint');
  if (hint) hint.style.opacity = window.scrollY > 200 ? '0' : '0.5';
}, { passive: true });


/* ════════════════════════════════
   REEL MODAL  (Content & Video)
════════════════════════════════ */
const reelModal      = document.getElementById('reelModal');
const reelModalVideo = document.getElementById('reelModalVideo');
const reelModalLabel = document.getElementById('reelModalLabel');
const reelModalClose = document.getElementById('reelModalClose');

document.querySelectorAll('.reel-card').forEach(card => {
  /* auto-grab first frame as thumbnail if video loads */
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
  reelModal.classList.remove('open');
  reelModalVideo.pause();
  reelModalVideo.src = '';
  document.body.style.overflow = '';
}

if (reelModalClose) reelModalClose.addEventListener('click', closeReelModal);
if (reelModal) {
  reelModal.addEventListener('click', e => {
    if (e.target === reelModal) closeReelModal();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeReelModal();
});
