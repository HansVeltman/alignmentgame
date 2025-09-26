
// Production app with the user's latest hotspots
const hotspots = {"Start.png": 
                 {"strategy": [61.36, 36.27, 77.36, 52.67], 
                  "process": [77.36, 36.27, 93.36, 52.67], 
                  "control": [61.36000000000001, 53.64323600973236, 93.75062499999999, 68.95279805352797], 
                  "organization": [61.36000000000001, 69.07445255474452, 77.43812499999999, 85.95], 
                  "information": [77.36, 69.19610705596108, 93.04749999999999, 85.95], 
                  "logo": [1.3281250000000002, 0, 46.46875, 8.40389294403893]
                 }, 
                 "Strategy.png": 
                {"strategy":     [0, 0, 0, 0],
                 "process":      [88.17,	11.48, 96.14,	20.93], 
                 "control":      [80.20,	20.93, 96.14,	31.20], 
                 "organization": [80.20,	31.20, 88.17,	41.30], 
                 "information":  [88.17,	31.20, 96.14,	41.30], 
                 "logo": [1, 1, 30, 7]
                 },
                 "Process.png": 
                {"strategy":     [80.20,	11.48, 88.17,	20.93], 
                 "process":      [0, 0, 0, 0], 
                 "control":      [80.20,	20.93, 96.14,	31.20], 
                 "organization": [80.20,	31.20, 88.17,	41.30], 
                 "information":  [88.17,	31.20, 96.14,	41.30], 
                 "logo": [1, 1, 30, 7]
                 }, 
                 "Control.png": 
                 {"strategy": [86.92, 2.41, 92.93, 11.49], 
                  "process":  [93.32, 2.56, 99.64, 11.94], 
                  "control":  [80.43, 13.58, 99.40, 25.82], 
                  "organization": [86.76, 28.95, 93.16, 37.25], 
                  "information":  [92.85, 28.80, 99.48, 36.65], 
                  "logo": [1, 1, 30, 7]
                }, 
                 "Information.png": 
                 {"strategy": [76.94, 2.48, 84.66, 16.43], 
                  "process":  [85.36, 3.73, 93.07, 15.81], 
                  "control":  [77.02, 16.84, 93.62, 31.40], 
                  "organization": [76.86, 31.81, 85.44, 44.09], 
                  "information":  [87.00, 35.75, 99.55, 59.65], 
                  "logo": [1, 1, 30, 7]
                 }, 
                 "Organization.png": 
                {"strategy":     [80.20,	11.48, 88.17,	20.93], 
                 "process":      [88.17,	11.48, 96.14,	20.93], 
                 "control":      [80.20,	20.93, 96.14,	31.20], 
                 "organization": [0, 0, 0, 0], 
                 "information":  [88.17,	31.20, 96.14,	41.30], 
                 "logo": [1, 1, 30, 7]
                 },
                };

const keys = ["strategy","process","control","information","organization","logo"];

let current = "Start.png";
let natW = 1219, natH = 783; // fallback until image loads

function setAspect(w,h) {
  const ratio = document.getElementById('ratio-box');
  ratio.style.minHeight = '0'; // remove safety height once known
  ratio.style.aspectRatio = `${w} / ${h}`;
  document.getElementById('stage').setAttribute('viewBox', `0 0 ${w} ${h}`);
}

function pctToPx([l,t,r,b]) { return [l/100*natW, t/100*natH, r/100*natW, b/100*natH]; }

function setScreen(name) {
  current = name;
  const img = new Image();
  img.onload = () => {
    natW = img.naturalWidth; natH = img.naturalHeight;
    setAspect(natW, natH);
    document.getElementById('stage-img').setAttribute('href', `assets/${name}`);
    drawLayer();
  };
  img.src = `assets/${name}`;
}

function drawLayer() {
  const layer = document.getElementById('hotspot-layer');
  layer.innerHTML = '';
  const H = hotspots[current] || {};
  for (const key of keys) {
    if (!H[key]) continue;
    const [L,T,R,B] = pctToPx(H[key]);
    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('class','hot');
    rect.setAttribute('x', L); rect.setAttribute('y', T);
    rect.setAttribute('width', R-L); rect.setAttribute('height', B-T);
    rect.setAttribute('rx', 14); rect.setAttribute('ry', 14);
    rect.addEventListener('click', () => onHotClick(key));
    layer.appendChild(rect);
  }
}

function onHotClick(key) {
  switch(key) {
    case 'strategy': setScreen('Strategy.png'); break;
    case 'process': setScreen('Process.png'); break;
    case 'control': setScreen('Control.png'); break;
    case 'information': setScreen('Information.png'); break;
    case 'organization': setScreen('Organization.png'); break;
    case 'logo': setScreen('Start.png'); break;
  }
}

function setupUI() {
  document.querySelectorAll('#quickbar button[data-go]').forEach(btn => btn.addEventListener('click', () => setScreen(btn.getAttribute('data-go'))));
}

window.addEventListener('DOMContentLoaded', () => { setupUI(); setScreen('Start.png'); });


// === Overlay dropdowns for Organization screen ===
const dropdownConfig = { "Organization.png": [ { xPct: 10.05, yPct: 18.70 } ] };

let uiOverlay = null;
function ensureOverlay() {
  if (!uiOverlay) {
    const ratioBox = document.getElementById('ratio-box');
    uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    ratioBox.appendChild(uiOverlay);
    // Observe real layout changes (not just window resize)
    const ro = new ResizeObserver(() => repositionDropdowns());
    ro.observe(ratioBox);
    ro.observe(document.getElementById('stage'));
    window.addEventListener('resize', () => repositionDropdowns());
    window.addEventListener('load', () => repositionDropdowns());
  }
  return uiOverlay;
}

function clearDropdowns() {
  ensureOverlay();
  uiOverlay.innerHTML = '';
}

function renderDropdowns(imageName) {
  ensureOverlay();
  clearDropdowns();
  const conf = dropdownConfig[imageName];
  if (!conf || !Array.isArray(conf)) return;

  const options = [
    { value: "", label: "- Person Responsible -", disabled: true, selected: true },
    { value: "Graeme (CEO)", label: "Graeme (CEO)" },
    { value: "Michelle (VP)", label: "Michelle (VP)" },
    { value: "George (VP)", label: "George (VP)" },
    { value: "Peter (VP)", label: "Peter (VP)" },
    { value: "Betty (VP)", label: "Betty (VP)" },
  ];

  conf.forEach(pt => {
    const sel = document.createElement('select');
    sel.className = 'ui-select';
    sel.setAttribute('data-xpct', pt.xPct);
    sel.setAttribute('data-ypct', pt.yPct);
    options.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.disabled) o.disabled = true;
      if (opt.selected) o.selected = true;
      sel.appendChild(o);
    });
    uiOverlay.appendChild(sel);
  });

  repositionDropdowns();
}

// Wait until the inline SVG <image id="stage-img"> has a stable layout
function onStageImageReady(cb) {
  const img = document.getElementById('stage-img');
  if (!img) return;

  // Use two RAFs after load to ensure paint/layout is finished
  const afterLayout = () => requestAnimationFrame(() => requestAnimationFrame(cb));

  // Some browsers expose .href.baseVal; ensure it's set
  const hasSrc = () => {
    try {
      return !!(img.href && img.href.baseVal);
    } catch (e) { return true; } // be liberal
  };

  // Prefer decode() if available
  if (typeof img.decode === 'function') {
    img.decode().then(afterLayout).catch(afterLayout);
  } else {
    img.addEventListener('load', afterLayout, { once: true });
  }

  // If already loaded, still schedule a layout pass
  if (hasSrc()) afterLayout();
}

function repositionDropdowns() {
  if (!uiOverlay) return;
  const stage = document.getElementById('stage');
  const ratioBox = document.getElementById('ratio-box');
  const stageRect = stage.getBoundingClientRect();
  const boxRect = ratioBox.getBoundingClientRect();

  // Natural size of Organization.png
  const NAT_W = 2020, NAT_H = 1080;

  // Compute letterboxed image rect within the stage (preserveAspectRatio="xMidYMid meet")
  const scale = Math.min(stageRect.width / NAT_W, stageRect.height / NAT_H);
  const imgW = NAT_W * scale;
  const imgH = NAT_H * scale;
  const imgLeftAbs = stageRect.left + (stageRect.width - imgW) / 2;
  const imgTopAbs  = stageRect.top  + (stageRect.height - imgH) / 2;

  // Convert to coordinates relative to #ratio-box (not viewport)
  const imgLeft = imgLeftAbs - boxRect.left;
  const imgTop  = imgTopAbs  - boxRect.top;

  // Fit overlay to the actual displayed image
  uiOverlay.style.left = imgLeft + 'px';
  uiOverlay.style.top = imgTop + 'px';
  uiOverlay.style.width = imgW + 'px';
  uiOverlay.style.height = imgH + 'px';

  // Place selects using percentage positions inside the image box
  uiOverlay.querySelectorAll('select.ui-select').forEach(sel => {
    const xPct = parseFloat(sel.getAttribute('data-xpct'));
    const yPct = parseFloat(sel.getAttribute('data-ypct'));
    sel.style.left = (xPct / 100) * imgW + 'px';
    sel.style.top  = (yPct / 100) * imgH + 'px';
  });
}

// Wrap setScreen so we build controls and position them after the image is ready
(function wrapSetScreen() {
  if (typeof setScreen === 'function') {
    const _orig = setScreen;
    window.setScreen = function(name) {
      _orig(name);
      renderDropdowns(name);
      onStageImageReady(() => repositionDropdowns());
    };
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      if (typeof setScreen === 'function') {
        const _orig = setScreen;
        window.setScreen = function(name) {
          _orig(name);
          renderDropdowns(name);
          onStageImageReady(() => repositionDropdowns());
        };
      }
    });
  }
})();

// Initial pass after DOM is ready and image is painted
window.addEventListener('DOMContentLoaded', () => {
  const href = document.getElementById('stage-img')?.getAttribute('href');
  if (href) renderDropdowns(href.split('/').pop());
  onStageImageReady(() => repositionDropdowns());
});
