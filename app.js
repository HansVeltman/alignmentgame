
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
