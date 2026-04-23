/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── HERO BROWSER ANIMATION ── */
const highlight = document.getElementById('demo-highlight');
const sticky = document.getElementById('demo-sticky');
const eraseTarget = document.getElementById('demo-erase-target');
const rect = document.getElementById('demo-rect');

function runHeroDemo() {
  // Phase 1: highlight appears
  setTimeout(() => { highlight.style.transition = 'background 0.5s'; highlight.style.background = 'rgba(236,72,153,0.35)'; }, 1000);
  // Phase 2: sticky note pops in
  setTimeout(() => { sticky.classList.add('visible'); }, 2000);
  // Phase 3: rect annotation
  setTimeout(() => { rect.classList.add('visible'); }, 3000);
  // Phase 4: ad gets erased
  setTimeout(() => {
    eraseTarget.classList.add('anno-erase-hover');
    setTimeout(() => {
      eraseTarget.classList.add('erased');
      eraseTarget.classList.remove('anno-erase-hover');
    }, 700);
  }, 4000);
  // Loop
  setTimeout(() => {
    highlight.style.background = 'transparent';
    sticky.classList.remove('visible');
    rect.classList.remove('visible');
    eraseTarget.classList.remove('erased');
    setTimeout(runHeroDemo, 800);
  }, 7500);
}

window.addEventListener('load', () => setTimeout(runHeroDemo, 1200));

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
