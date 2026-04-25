/* Hero browser mockup — sequenced tool demo.
   4-tool loop: eraser → resizer → sticky → marker. ~13s per cycle.
   Drives both the dock's active tool + data-accent color so the border
   and glow match whichever tool is "in use" right now. */

const dock = document.getElementById('vellum-dock');
const article = document.querySelector('.hero-mockup .fake-article');
const highlight = document.getElementById('demo-highlight');
const sticky = document.getElementById('demo-sticky');
const stickyText = document.getElementById('demo-sticky-text');
const eraseTarget = document.getElementById('demo-erase-target');
const rect = document.getElementById('demo-rect');
const caption = document.getElementById('demo-caption');

const tools = {
  eraser:  dock.querySelector('[data-tool-id="eraser"]'),
  sticky:  dock.querySelector('[data-tool-id="sticky"]'),
  marker:  dock.querySelector('[data-tool-id="marker"]'),
  resizer: dock.querySelector('[data-tool-id="resizer"]'),
};

const CAPTION_COLOR = {
  eraser:    '#ef4444',
  resizer:   '#3b82f6',
  sticky:    '#f59e0b',
  highlight: '#a78bfa',
};

function setActive(toolId, accent) {
  Object.values(tools).forEach(btn => btn.classList.remove('active'));
  if (toolId && tools[toolId]) tools[toolId].classList.add('active');
  if (accent) dock.setAttribute('data-accent', accent);
  else dock.removeAttribute('data-accent');
}

function setCaption(text, accent) {
  if (!text) {
    caption.classList.remove('visible');
    return;
  }
  caption.textContent = text;
  caption.style.setProperty('--caption-color', CAPTION_COLOR[accent] || 'var(--accent)');
  caption.classList.add('visible');
}

/* Visibility-aware wait: if the tab is hidden when the timer fires, hold
   until it's visible again before resolving. Keeps the loop in sync with
   what the user is actually looking at — no phases burned in background
   tabs (and no battery either). */
function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!document.hidden) return resolve();
      const onVisible = () => {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', onVisible);
        resolve();
      };
      document.addEventListener('visibilitychange', onVisible);
    }, ms);
  });
}

function typeInto(el, text, cps = 16) {
  return new Promise(resolve => {
    el.textContent = '';
    let i = 0;
    const step = () => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) return resolve();
      setTimeout(step, 1000 / cps);
    };
    step();
  });
}

/* Wrap the rect around just the h1 text — not the full article width and
   not through the byline below. Called right before fading the rect in, so
   the article's current layout (possibly .expanded) is reflected. */
function positionRectAroundH1() {
  const h1 = article.querySelector('.fake-h1');
  const articleBox = article.getBoundingClientRect();
  const range = document.createRange();
  range.selectNodeContents(h1);
  const textBox = range.getBoundingClientRect();
  const padX = 10;
  const padY = 5;
  rect.style.top    = (textBox.top    - articleBox.top  - padY) + 'px';
  rect.style.left   = (textBox.left   - articleBox.left - padX) + 'px';
  rect.style.width  = (textBox.width  + padX * 2) + 'px';
  rect.style.height = (textBox.height + padY * 2) + 'px';
  rect.style.right  = 'auto';
}

function stripState() {
  eraseTarget.classList.remove('erased', 'anno-erase-hover');
  article.classList.remove('expanded', 'anno-resize-hover');
  sticky.classList.remove('visible');
  stickyText.textContent = '';
  rect.classList.remove('visible');
  highlight.classList.remove('visible');
  setActive(null);
  setCaption(null);
}

async function runLoop() {
  stripState();
  await wait(1000);

  /* Eraser — select the ad (red outline + dimension badge), then remove it. */
  setActive('eraser', 'eraser');
  setCaption('Erase noise', 'eraser');
  await wait(700);
  eraseTarget.classList.add('anno-erase-hover');
  await wait(1450);
  eraseTarget.classList.add('erased');
  eraseTarget.classList.remove('anno-erase-hover');
  await wait(900);

  /* Resizer — blue dashed outline + handles appear, article expands while
     still "selected" so the drag-to-resize gesture reads clearly. */
  setActive('resizer', 'resizer');
  setCaption('Resize things', 'resizer');
  await wait(700);
  article.classList.add('anno-resize-hover');
  await wait(600);
  article.classList.add('expanded');
  await wait(1100);
  article.classList.remove('anno-resize-hover');
  await wait(700);

  /* Sticky — drop a note, type the body text. */
  setActive('sticky', 'sticky');
  setCaption('Take notes', 'sticky');
  await wait(700);
  sticky.classList.add('visible');
  await wait(400);
  await typeInto(stickyText, 'Follow up on this!');
  await wait(900);

  /* Marker — yellow highlight on a sentence, pink box around the headline. */
  setActive('marker', 'highlight');
  setCaption('Highlight and Paint', 'highlight');
  await wait(700);
  highlight.classList.add('visible');
  await wait(800);
  positionRectAroundH1();
  rect.classList.add('visible');
  await wait(1900);

  /* Linger with all 4 tool results visible so the viewer can absorb the
     final annotated state, then loop — stripState() at the top of runLoop
     triggers the CSS transitions to unwind. */
  setActive(null);
  await wait(1500);
  runLoop();
}

window.addEventListener('load', () => setTimeout(runLoop, 1200));
