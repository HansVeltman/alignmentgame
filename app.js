
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


// === Top Menu (compact, percent-positioned, from baseline) ===
(function installMenu() {
  const MENU_POS = { x: 950, y: 4 }; // image-space pixels (relative to current image natW/natH)
  const ratioBox = document.getElementById('ratio-box');
  if (!ratioBox) return;

  // Create container once
  let menu = document.getElementById('menu-bar');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'menu-bar';
    menu.innerHTML = `
      <div class="bar" role="menubar" aria-label="Main menu">
        <div class="root" data-root="user">
          <button class="root-btn" aria-haspopup="true" aria-expanded="false">🧑‍💼 User Functions</button>
          <div class="dd" role="menu">
            <ul>
              <li><button class="item" data-action="set-params"><span class="muted">Set params:</span> company (ao: position CODP) / activity</button></li>
              <li><button class="item" data-action="report-activity">Report: activity</button></li>
              <li><button class="item" data-action="report-company">Report: company</button></li>
              <li><button class="item" data-action="report-game">Report: game</button></li>
              <li><button class="item" data-action="report-system">Report: system</button></li>
              <li><button class="item" data-action="snop-classic">S&OP: classic</button></li>
              <li><button class="item" data-action="snop-acs">S&OP: ACS version</button></li>
              <li><button class="item" data-action="decide-now">Decide now: Make quick decisions in an urgent crisis situation</button></li>
            </ul>
          </div>
        </div>
        <div class="root" data-root="admin">
          <button class="root-btn" aria-haspopup="true" aria-expanded="false">🔧 Admin</button>
          <div class="dd" role="menu">
            <ul>
              <li><button class="item" data-action="configure-game">Configure: game</button></li>
              <li><button class="item" data-action="configure-company">Configure: company</button></li>
              <li><button class="item" data-action="manage-users">Manage users</button></li>
              <li><button class="item" data-action="run-day">Run: day</button></li>
              <li><button class="item" data-action="run-week">Run: week</button></li>
              <li><button class="item" data-action="run-month">Run: month</button></li>
              <li><button class="item" data-action="run-year">Run: year</button></li>
            </ul>
          </div>
        </div>
        <div class="root" data-root="help">
          <button class="root-btn" aria-haspopup="true" aria-expanded="false">❓ Help</button>
          <div class="dd" role="menu">
            <ul><li><button class="item" data-action="help">Open help</button></li></ul>
          </div>
        </div>
        <div class="root" data-root="about">
          <button class="root-btn" aria-haspopup="true" aria-expanded="false">ℹ️ About</button>
          <div class="dd" role="menu">
            <ul><li><button class="item" data-action="about">About The Alignment Game</button></li></ul>
          </div>
        </div>
      </div>`;
    ratioBox.appendChild(menu);

    // Interaction: open/close
    function closeAll() {
      menu.querySelectorAll('.root').forEach(r => {
        r.classList.remove('open');
        const b = r.querySelector('.root-btn'); if (b) b.setAttribute('aria-expanded','false');
      });
    }
    menu.addEventListener('click', (e) => {
      const rootBtn = e.target.closest('.root-btn');
      if (rootBtn) {
        const root = rootBtn.closest('.root');
        const isOpen = root.classList.contains('open');
        closeAll();
        root.classList.toggle('open', !isOpen);
        rootBtn.setAttribute('aria-expanded', String(!isOpen));
      }
      const item = e.target.closest('.item');
      if (item) {
        const key = item.dataset.action;
        dispatch(key);
        closeAll();
      }
    });
    document.addEventListener('click', (e) => { if (!menu.contains(e.target)) closeAll(); });

    function dispatch(key) {
      const actions = {
        'set-params':        () => emit('setParams'),
        'report-activity':   () => emit('report',  { scope: 'activity' }),
        'report-company':    () => emit('report',  { scope: 'company' }),
        'report-game':       () => emit('report',  { scope: 'game' }),
        'report-system':     () => emit('report',  { scope: 'system' }),
        'snop-classic':      () => emit('snop',    { variant: 'classic' }),
        'snop-acs':          () => emit('snop',    { variant: 'acs' }),
        'decide-now':        () => emit('decideNow'),
        'configure-game':    () => emit('configure', { target: 'game' }),
        'configure-company': () => emit('configure', { target: 'company' }),
        'manage-users':      () => emit('manageUsers'),
        'run-day':           () => emit('run', { horizon: 'day' }),
        'run-week':          () => emit('run', { horizon: 'week' }),
        'run-month':         () => emit('run', { horizon: 'month' }),
        'run-year':          () => emit('run', { horizon: 'year' }),
        'help':              () => emit('help'),
        'about':             () => emit('about'),
      };
      (actions[key]||(()=>{}))();
    }
    function emit(action, payload={}) {
      window.dispatchEvent(new CustomEvent('menu:action', { detail: { action, payload } }));
    }
  }

  // Position using percentages so it follows the image size without shrinking UI
  function positionMenu() {
    if (!menu) return;
    // natW/natH are maintained by app.js when images load.
    // Guard against zero:
    const w = (typeof natW === 'number' && natW > 0) ? natW : 1600;
    const h = (typeof natH === 'number' && natH > 0) ? natH : 900;
    const leftPct = (MENU_POS.x / w) * 100;
    const topPct  = (MENU_POS.y / h) * 100;
    menu.style.left = leftPct + '%';
    menu.style.top  = topPct + '%';
  }

  // Re-position whenever screen changes or viewport resizes.
  window.addEventListener('resize', positionMenu);

  // Hook into setScreen so after image loads we re-place the menu.
  const _setScreen = window.setScreen;
  if (typeof _setScreen === 'function') {
    window.setScreen = function(name) {
      _setScreen(name);
      // setScreen async loads the image; queue position after next frame
      requestAnimationFrame(() => requestAnimationFrame(positionMenu));
    };
  } else {
    // fallback initial placement
    requestAnimationFrame(positionMenu);
  }
})();

