
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
                 {"strategy": [86.921875, 2.4105231689088193, 92.929375, 11.489058295964123], 
                  "process": [93.32, 2.56, 99.63999999999999, 11.937488789237666], 
                  "control": [80.4375, 13.581733931240652, 99.405625, 25.81579970104632], 
                  "organization": [86.765625, 28.954813153961123, 93.16374999999998, 37.252585949177885], 
                  "information": [92.85124999999998, 28.80533632286995, 99.48374999999999, 36.65467862481317], 
                  "logo": [0, 0, 36.078125, 9.067264573991032]
                }, 
                 "Information.png": 
                 {"strategy": [76.93875, 2.482282157676349, 84.6575, 16.42921161825726], 
                  "process": [85.360625, 3.7270954356846473, 93.069375, 15.806804979253108], 
                  "control": [77.016875, 16.844149377593354, 93.61624999999998, 31.39464730290457], 
                  "organization": [76.860625, 31.809585062240657, 85.43875000000001, 44.085726141078844], 
                  "information": [87.00125000000001, 35.75149377593361, 99.55375, 59.64589211618257], 
                  "logo": [0, 0, 28.734375, 9.643153526970957]
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


// === Organization Activities & Overlay ===

// Natural size of Organization.png
const ORG_NAT_W = 2020, ORG_NAT_H = 1080;

// Activity object model (pixel positions on Organization.png baseline)
const activities = [
  { key: "Act_Purchase",              label: "Act_Purchase",              xPx: 203,  yPx: 202,  props: {} },
  { key: "Act_MakePlanning",          label: "Act_MakePlanning",          xPx: 871,  yPx: 202,  props: {} },
  { key: "Act_MakeForecast",          label: "Act_MakeForecast",          xPx: 1173, yPx: 202,  props: {} },
  { key: "Act_PromoteProducts",       label: "Act_PromoteProducts",       xPx: 1478, yPx: 202,  props: {} },
  { key: "Act_SellProduct",           label: "Act_SellProduct",           xPx: 1173, yPx: 309,  props: {} },
  { key: "Act_PromiseOnCustOrder",    label: "Act_PromiseOnCustOrder",    xPx: 1173, yPx: 408,  props: {} },
  { key: "Act_ManufactWheels",        label: "Act_ManufactWheels",        xPx: 524,  yPx: 465,  props: {} },
  { key: "Act_ManufactFrames",        label: "Act_ManufactFrames",        xPx: 524,  yPx: 600,  props: {} },
  { key: "Act_AssembleProds",         label: "Act_AssembleProds",         xPx: 871,  yPx: 600,  props: {} },
  { key: "Act_DistributeProds",       label: "Act_DistributeProds",       xPx: 1173, yPx: 600,  props: {} },
  { key: "Act_ManageCash",            label: "Act_ManageCash",            xPx: 871,  yPx: 808,  props: {} },
];

// Persist selections in localStorage
const STORAGE_KEY = "activityAssignments_v1";
function loadAssignments() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function saveAssignments(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

// Convert px positions -> percentages of natural image
function pxToPct(xPx, yPx) {
  return { xPct: (xPx / ORG_NAT_W) * 100, yPct: (yPx / ORG_NAT_H) * 100 };
}

// Create overlay container
let uiOverlay = null;
function ensureOverlay() {
  if (!uiOverlay) {
    const ratioBox = document.getElementById('ratio-box');
    uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    ratioBox.appendChild(uiOverlay);

    // Observe real layout updates
    const ro = new ResizeObserver(() => repositionDropdowns());
    ro.observe(ratioBox);
    ro.observe(document.getElementById('stage'));
    window.addEventListener('resize', () => repositionDropdowns());
    window.addEventListener('load', () => repositionDropdowns());
  }
  return uiOverlay;
}

function clearOverlay() {
  ensureOverlay();
  uiOverlay.innerHTML = '';
}

// Build dropdowns for Organization screen
function renderOrganizationDropdowns() {
  ensureOverlay();
  clearOverlay();

  // Guard: only render when Organization.png is visible
  const current = document.getElementById('stage-img')?.getAttribute('href')?.split('/').pop();
  if (current !== 'Organization.png') return;

  const assignments = loadAssignments();

  const personOptions = [
    { value: "", label: "- Person Responsible -", disabled: true, selected: true },
    { value: "Graeme (CEO)", label: "Graeme (CEO)" },
    { value: "Michelle (VP)", label: "Michelle (VP)" },
    { value: "George (VP)", label: "George (VP)" },
    { value: "Peter (VP)", label: "Peter (VP)" },
    { value: "Betty (VP)", label: "Betty (VP)" },
  ];

  activities.forEach(act => {
    const { xPct, yPct } = pxToPct(act.xPx, act.yPx);
    const sel = document.createElement('select');
    sel.className = 'ui-select';
    sel.setAttribute('data-xpct', xPct.toFixed(4));
    sel.setAttribute('data-ypct', yPct.toFixed(4));
    sel.setAttribute('data-key', act.key);
    sel.setAttribute('aria-label', act.label + ' – Person Responsible');

    // Populate options (apply persisted value if available)
    const saved = assignments[act.key] || "";
    personOptions.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.disabled) o.disabled = true;
      sel.appendChild(o);
    });
    // Set current value (fallback to placeholder "")
    sel.value = saved;

    // Persist on change
    sel.addEventListener('change', e => {
      const map = loadAssignments();
      map[act.key] = sel.value;
      saveAssignments(map);
    });

    uiOverlay.appendChild(sel);
  });

  repositionDropdowns();
}

// Image-ready helper to avoid early wrong sizes
function onStageImageReady(cb) {
  const img = document.getElementById('stage-img');
  if (!img) return;
  const afterLayout = () => requestAnimationFrame(() => requestAnimationFrame(cb));

  if (typeof img.decode === 'function') {
    img.decode().then(afterLayout).catch(afterLayout);
  } else {
    img.addEventListener('load', afterLayout, { once: true });
  }
  // Also run if src already set
  afterLayout();
}

// Position overlay and dropdowns aligning to the letterboxed image area
function repositionDropdowns() {
  if (!uiOverlay) return;
  const stage = document.getElementById('stage');
  const ratioBox = document.getElementById('ratio-box');
  const stageRect = stage.getBoundingClientRect();
  const boxRect = ratioBox.getBoundingClientRect();

  // Compute the displayed image rect (preserveAspectRatio="xMidYMid meet")
  const scale = Math.min(stageRect.width / ORG_NAT_W, stageRect.height / ORG_NAT_H);
  const imgW = ORG_NAT_W * scale;
  const imgH = ORG_NAT_H * scale;
  const imgLeftAbs = stageRect.left + (stageRect.width - imgW) / 2;
  const imgTopAbs  = stageRect.top  + (stageRect.height - imgH) / 2;

  // Convert to coordinates relative to #ratio-box (not viewport)
  const imgLeft = imgLeftAbs - boxRect.left;
  const imgTop  = imgTopAbs  - boxRect.top;

  // Fit overlay to displayed image
  uiOverlay.style.left = imgLeft + 'px';
  uiOverlay.style.top = imgTop + 'px';
  uiOverlay.style.width = imgW + 'px';
  uiOverlay.style.height = imgH + 'px';

  // Place selects by % within the image box
  uiOverlay.querySelectorAll('select.ui-select').forEach(sel => {
    const xPct = parseFloat(sel.getAttribute('data-xpct'));
    const yPct = parseFloat(sel.getAttribute('data-ypct'));
    sel.style.left = (xPct / 100) * imgW + 'px';
    sel.style.top  = (yPct / 100) * imgH + 'px';
  });
}

// Wrap setScreen to build+position controls when Organization is shown
(function wrapSetScreenForActivities() {
  if (typeof setScreen === 'function') {
    const _orig = setScreen;
    window.setScreen = function(name) {
      _orig(name);
      if (name === 'Organization.png') {
        renderOrganizationDropdowns();
        onStageImageReady(() => repositionDropdowns());
      } else {
        // If leaving Organization, keep overlay mounted but clear its contents
        clearOverlay();
      }
    };
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      if (typeof setScreen === 'function') {
        const _orig = setScreen;
        window.setScreen = function(name) {
          _orig(name);
          if (name === 'Organization.png') {
            renderOrganizationDropdowns();
            onStageImageReady(() => repositionDropdowns());
          } else {
            clearOverlay();
          }
        };
      }
    });
  }
})();

// Initial pass on load (if Organization is the first screen for any reason)
window.addEventListener('DOMContentLoaded', () => {
  const href = document.getElementById('stage-img')?.getAttribute('href');
  if (href && href.split('/').pop() === 'Organization.png') {
    renderOrganizationDropdowns();
    onStageImageReady(() => repositionDropdowns());
  }
});
