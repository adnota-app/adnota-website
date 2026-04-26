/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── MOBILE NAV TOGGLE ── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  const setOpen = (open) => {
    navToggle.setAttribute('aria-expanded', String(open));
    navLinks.classList.toggle('is-open', open);
  };
  navToggle.addEventListener('click', () => {
    setOpen(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });
}

/* ── UPVOTE ── */
function upvote(el) {
  const count = el.querySelector('.fr-count');
  const arrow = el.querySelector('.fr-arrow');
  const n = parseInt(count.textContent);
  count.textContent = n + 1;
  arrow.style.color = 'var(--accent)';
  count.style.color = 'var(--accent)';
  el.style.borderColor = 'rgba(124,58,237,0.4)';
  el.onclick = null; // one vote per session
}

/* ── TWEAKS ── */
function applyTweak(key, val) {
  if (key === 'accentColor') {
    document.documentElement.style.setProperty('--accent', val);
    document.documentElement.style.setProperty('--accent-glow', val + '59');
    document.documentElement.style.setProperty('--accent-soft', val + '1a');
  }
  if (key === 'heroTag') {
    document.querySelector('h1').innerHTML = val.replace('\n','<br>');
  }
  if (key === 'ctaLabel') {
    document.querySelector('.btn-primary').childNodes[1].textContent = ' ' + val;
  }
  if (key === 'showFeatureBase') {
    document.getElementById('requests').style.display = val ? '' : 'none';
  }
  window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
}

window.addEventListener('message', e => {
  if (e.data?.type === '__activate_edit_mode') document.getElementById('tweaks-panel').style.display = 'block';
  if (e.data?.type === '__deactivate_edit_mode') document.getElementById('tweaks-panel').style.display = 'none';
});
window.parent.postMessage({ type: '__edit_mode_available' }, '*');
