
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
                 {"strategy": [83.35624999999999, 1.5802721088435372, 92.4325, 9.89575963718821], 
                  "process": [94.15124999999999, 6.5689342403628075, 99.31125, 11.70981859410431], 
                  "control": [87.809375, 12.16333333333333, 100.483125, 17.57140589569161], 
                  "organization": [87.80937499999999, 18.024920634920623, 93.44812499999999, 23.308480725623586], 
                  "information": [94.073125, 17.798163265306126, 98.764375, 22.854965986394575], 
                  "logo": [0, 0, 33.578125, 6.517006802721091]
                 }, 
                 "Process.png": 
                 {"strategy": [82, 8, 88, 17], 
                  "process": [90, 2, 98, 15], 
                  "control": [82, 17, 94, 26], 
                  "organization": [83, 26, 88, 34], 
                  "information": [88, 26, 94, 33], 
                  "logo": [0, 0, 33, 9]
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
                 {"strategy": [75.92187499999984, 5.610523168908822, 81.92937499999984, 14.689058295964111], 
                  "process": [81.71999999999983, 4.560000000000001, 88.03999999999982, 13.937488789237658], 
                  "control": [75.64, 13.58, 88.2, 20.2], 
                  "organization": [71, 23.1, 80.01, 32.4], 
                  "information": [81.4, 20.33, 88.04, 27], 
                  "logo": [0, 0, 36.132993847254376, 9.067264573991032]
                 }
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
