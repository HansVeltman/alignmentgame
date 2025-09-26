
// Production app with the user's latest hotspots
const hotspots = {"Start.png": 
                 {"strategy": [61.36, 36.27, 77.36, 52.67], 
                  "process": [77.36, 36.27, 93.36, 52.67], 
                  "control": [61.36, 53.64, 93.75, 68.95], 
                  "organization": [61.36, 69.07, 77.44, 85.95], 
                  "information": [77.36, 69.20, 93.05, 85.95], 
                  "logo": [1.33, 0, 46.47, 8.40]
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
                  "process": [93.32, 2.56, 99.64, 11.94], 
                  "control": [80.44, 13.58, 99.41, 25.82], 
                  "organization": [86.77, 28.95, 93.16, 37.25], 
                  "information": [92.85, 28.81, 99.48, 36.65], 
                  "logo": [0, 0, 36.08, 9.07]
                }, 
                 "Information.png": 
                 {"strategy": [76.94, 2.48, 84.66, 16.43], 
                  "process": [85.36, 3.73, 93.07, 15.81], 
                  "control": [77.02, 16.84, 93.62, 31.39], 
                  "organization": [76.86, 31.81, 85.44, 44.09], 
                  "information": [87.00, 35.75, 99.55, 59.65], 
                  "logo": [0, 0, 28.73, 9.64]
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
