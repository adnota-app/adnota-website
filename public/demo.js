/* Hero browser mockup — sequenced tool demo.
   4-tool loop: eraser → resizer → sticky → marker. ~13s per cycle.
   Drives both the dock's active tool + data-accent color so the border
   and glow match whichever tool is "in use" right now. */

const dock = document.getElementById('vellum-dock');
const browserWrap = document.getElementById('hero-browser');
const article = document.querySelector('.hero-mockup .fake-article');
const highlight = document.getElementById('demo-highlight');
const sticky = document.getElementById('demo-sticky');
const stickyText = document.getElementById('demo-sticky-text');
const eraseTarget = document.getElementById('demo-erase-target');
const rect = document.getElementById('demo-rect');
const scribble = document.getElementById('demo-scribble');
const scribbleTarget = document.getElementById('demo-scribble-target');
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
  persist:   '#22c55e',
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
      setTimeout(step, 700 / cps);
    };
    step();
  });
}

/* Lay a freehand pen scribble over the word "disagreed". Sized + positioned
   off the target span's live bounding box, then a two-pass zigzag path is
   generated and revealed via stroke-dashoffset so it draws on like a pen.
   Same scale-aware math as positionRectAroundH1 — works on the CSS-scaled
   mobile mockup. */
function positionScribble() {
  const articleBox = article.getBoundingClientRect();
  const targetBox = scribbleTarget.getBoundingClientRect();
  const scale = articleBox.width / article.offsetWidth || 1;
  const padX = 4;
  const padY = 3;
  const w = targetBox.width  / scale + padX * 2;
  const h = targetBox.height / scale + padY * 2;
  scribble.style.top    = ((targetBox.top  - articleBox.top)  / scale - padY) + 'px';
  scribble.style.left   = ((targetBox.left - articleBox.left) / scale - padX) + 'px';
  scribble.style.width  = w + 'px';
  scribble.style.height = h + 'px';
  scribble.setAttribute('viewBox', `0 0 ${w} ${h}`);

  /* Two-pass zigzag: forward L→R with peaks alternating top/bottom, then
     back R→L slightly offset so the strokes overlap and read as a real
     scribble rather than a single clean wave. */
  const path = scribble.querySelector('path');
  const peaks = 7;
  const margin = 2;
  const yMid = h / 2;
  const yTop = h * 0.20;
  const yBot = h * 0.80;
  const segW = (w - margin * 2) / peaks;
  let d = `M ${margin} ${yMid.toFixed(2)}`;
  for (let i = 0; i < peaks; i++) {
    const x = margin + segW * (i + 1);
    const y = i % 2 === 0 ? yTop : yBot;
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  for (let i = peaks - 1; i >= 0; i--) {
    const x = margin + segW * (i + 0.5);
    const y = i % 2 === 0 ? yBot * 0.92 : yTop * 1.35;
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += ` L ${(margin + segW * 0.4).toFixed(2)} ${(yMid + 0.5).toFixed(2)}`;
  path.setAttribute('d', d);

  const length = path.getTotalLength();
  path.style.transition = 'none';
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  /* Double rAF: first frame commits the reset, second frame starts the
     transition. Single rAF batches with the style write and the browser
     skips the animation. */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 0.7s ease-out';
      path.style.strokeDashoffset = 0;
    });
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
  /* Bounding rects are post-transform; rect.style values are layout px.
     On mobile .browser-wrap is CSS-scaled, so divide visible deltas by
     the live scale (visible width / layout width) to write correct values. */
  const scale = articleBox.width / article.offsetWidth || 1;
  rect.style.top    = ((textBox.top    - articleBox.top)  / scale - padY) + 'px';
  rect.style.left   = ((textBox.left   - articleBox.left) / scale - padX) + 'px';
  rect.style.width  = (textBox.width  / scale + padX * 2) + 'px';
  rect.style.height = (textBox.height / scale + padY * 2) + 'px';
  rect.style.right  = 'auto';
}

function stripState() {
  eraseTarget.classList.remove('erased', 'anno-erase-hover');
  article.classList.remove('expanded', 'anno-resize-hover');
  sticky.classList.remove('visible');
  stickyText.textContent = '';
  rect.classList.remove('visible');
  scribble.classList.remove('visible');
  highlight.classList.remove('visible');
  setActive(null);
  setCaption(null);
}

async function runLoop() {
  stripState();
  await wait(800);

  /* Eraser — select the ad (red outline + dimension badge), then remove it. */
  setActive('eraser', 'eraser');
  setCaption('Erase noise', 'eraser');
  await wait(700);
  eraseTarget.classList.add('anno-erase-hover');
  await wait(1200);
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
  await wait(600);
  sticky.classList.add('visible');
  await wait(400);
  await typeInto(stickyText, 'Follow up on this!');
  await wait(800);

  /* Marker — yellow highlight on a sentence, pink box around the headline,
     freehand scribble over "disagreed" to show the pen tool in action. */
  setActive('marker', 'highlight');
  setCaption('Highlight and Paint', 'highlight');
  await wait(700);
  highlight.classList.add('visible');
  await wait(900);
  positionRectAroundH1();
  rect.classList.add('visible');
  await wait(900);
  positionScribble();
  scribble.classList.add('visible');
  await wait(1100);

  /* Closing beat — fake a browser refresh. Article body + every visible
     annotation fades together while the chrome's progress bar sweeps; when
     it completes, the page restores with the annotations already in place.
     Demonstrates the persistence pillar instead of just stating it. */
  // setActive(null);
  // await wait(400);
  // setCaption('Persists across reloads', 'persist');
  // browserWrap.classList.add('reloading');
  // await wait(750);
  // browserWrap.classList.remove('reloading');
  // await wait(1200);

  setCaption(null);
  await wait(500);
  runLoop();
}

window.addEventListener('load', () => setTimeout(runLoop, 1200));
