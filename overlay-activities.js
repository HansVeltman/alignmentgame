// === Organization Activities & Overlay (robust add-on) ===
(function(){
  console.log('[overlay] script loaded');

  const ORG_NAT_W = 2020, ORG_NAT_H = 1080;

  const activities = [
    { key: "Act_Purchase",           label: "Act_Purchase",           xPx: 203,  yPx: 202,  props: {} },
    { key: "Act_MakePlanning",       label: "Act_MakePlanning",       xPx: 871,  yPx: 202,  props: {} },
    { key: "Act_MakeForecast",       label: "Act_MakeForecast",       xPx: 1173, yPx: 202,  props: {} },
    { key: "Act_PromoteProducts",    label: "Act_PromoteProducts",    xPx: 1478, yPx: 202,  props: {} },
    { key: "Act_SellProduct",        label: "Act_SellProduct",        xPx: 1173, yPx: 309,  props: {} },
    { key: "Act_PromiseOnCustOrder", label: "Act_PromiseOnCustOrder", xPx: 1173, yPx: 408,  props: {} },
    { key: "Act_ManufactWheels",     label: "Act_ManufactWheels",     xPx: 524,  yPx: 465,  props: {} },
    { key: "Act_ManufactFrames",     label: "Act_ManufactFrames",     xPx: 524,  yPx: 600,  props: {} },
    { key: "Act_AssembleProds",      label: "Act_AssembleProds",      xPx: 871,  yPx: 600,  props: {} },
    { key: "Act_DistributeProds",    label: "Act_DistributeProds",    xPx: 1173, yPx: 600,  props: {} },
    { key: "Act_ManageCash",         label: "Act_ManageCash",         xPx: 871,  yPx: 808,  props: {} },
  ];

  const STORAGE_KEY = "activityAssignments_v1";
  function loadAssignments() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveAssignments(map) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }
  function pxToPct(xPx, yPx) {
    return { xPct: (xPx / ORG_NAT_W) * 100, yPct: (yPx / ORG_NAT_H) * 100 };
  }

  let uiOverlay = null;
  function ensureOverlay() {
    if (!uiOverlay) {
      const ratioBox = document.getElementById('ratio-box');
      if (!ratioBox) return null;
      uiOverlay = document.createElement('div');
      uiOverlay.id = 'ui-overlay';
      ratioBox.appendChild(uiOverlay);

      // Temporary visual cue to confirm overlay is present (comment out if not needed)
      // const badge = document.createElement('div');
      // badge.textContent = 'overlay';
      // badge.style.position = 'absolute'; badge.style.right = '6px'; badge.style.bottom = '6px';
      // badge.style.fontSize = '10px'; badge.style.background = 'rgba(0,0,0,.4)'; badge.style.color = 'white';
      // badge.style.padding = '2px 4px'; badge.style.borderRadius = '4px';
      // badge.style.pointerEvents = 'none'; uiOverlay.appendChild(badge);

      const ro = new ResizeObserver(() => repositionDropdowns());
      const stage = document.getElementById('stage');
      if (stage) ro.observe(stage);
      ro.observe(ratioBox);
      window.addEventListener('resize', () => repositionDropdowns());
      window.addEventListener('load', () => repositionDropdowns());
      console.log('[overlay] overlay created');
    }
    return uiOverlay;
  }

  function clearOverlay() {
    if (!ensureOverlay()) return;
    uiOverlay.innerHTML = '';
  }

  function currentImageName() {
    const el = document.getElementById('stage-img');
    if (!el) return null;
    const href = el.getAttribute('href') || (el.href && el.href.baseVal) || '';
    const parts = href.split('/');
    return parts[parts.length - 1] || null;
  }

  function renderOrganizationDropdowns() {
    if (!ensureOverlay()) return;
    clearOverlay();

    if (currentImageName() !== 'Organization.png') return;

    const assignments = loadAssignments();
    const personOptions = [
      { value: "", label: "- Person Responsible -", disabled: true },
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

      personOptions.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        if (opt.disabled) o.disabled = true;
        sel.appendChild(o);
      });

      sel.value = assignments[act.key] ?? "";
      sel.addEventListener('change', () => {
        const map = loadAssignments();
        map[act.key] = sel.value;
        saveAssignments(map);
      });

      uiOverlay.appendChild(sel);
    });

    repositionDropdowns();
    console.log('[overlay] rendered', activities.length, 'dropdowns');
  }

  function onStageImageReady(cb) {
    const img = document.getElementById('stage-img');
    if (!img) return;
    const afterLayout = () => requestAnimationFrame(() => requestAnimationFrame(cb));
    if (typeof img.decode === 'function') {
      img.decode().then(afterLayout).catch(afterLayout);
    } else {
      img.addEventListener('load', afterLayout, { once: true });
    }
    afterLayout();
  }

  function repositionDropdowns() {
    if (!uiOverlay) return;
    const stage = document.getElementById('stage');
    const ratioBox = document.getElementById('ratio-box');
    if (!stage || !ratioBox) return;

    const stageRect = stage.getBoundingClientRect();
    const boxRect = ratioBox.getBoundingClientRect();

    const scale = Math.min(stageRect.width / ORG_NAT_W, stageRect.height / ORG_NAT_H);
    const imgW = ORG_NAT_W * scale;
    const imgH = ORG_NAT_H * scale;
    const imgLeftAbs = stageRect.left + (stageRect.width - imgW) / 2;
    const imgTopAbs  = stageRect.top  + (stageRect.height - imgH) / 2;

    const imgLeft = imgLeftAbs - boxRect.left;
    const imgTop  = imgTopAbs  - boxRect.top;

    uiOverlay.style.left = imgLeft + 'px';
    uiOverlay.style.top = imgTop + 'px';
    uiOverlay.style.width = imgW + 'px';
    uiOverlay.style.height = imgH + 'px';

    uiOverlay.querySelectorAll('select.ui-select').forEach(sel => {
      const xPct = parseFloat(sel.getAttribute('data-xpct'));
      const yPct = parseFloat(sel.getAttribute('data-ypct'));
      sel.style.left = (xPct / 100) * imgW + 'px';
      sel.style.top  = (yPct / 100) * imgH + 'px';
    });
  }

  // Robust triggers: MutationObserver + polling + DOMContentLoaded
  function installObservers() {
    const img = document.getElementById('stage-img');
    if (img && typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === 'attributes' && m.attributeName === 'href') {
            console.log('[overlay] stage-img href changed ->', currentImageName());
            if (currentImageName() === 'Organization.png') {
              renderOrganizationDropdowns();
              onStageImageReady(() => repositionDropdowns());
            } else {
              clearOverlay();
            }
          }
        }
      });
      mo.observe(img, { attributes: true, attributeFilter: ['href'] });
      console.log('[overlay] MutationObserver installed on #stage-img');
    }

    // Fallback polling (in case href changes don't trigger attrs in some browsers)
    let last = null;
    setInterval(() => {
      const now = currentImageName();
      if (now !== last) {
        last = now;
        console.log('[overlay] poll detected change ->', now);
        if (now === 'Organization.png') {
          renderOrganizationDropdowns();
          onStageImageReady(() => repositionDropdowns());
        } else {
          clearOverlay();
        }
      }
    }, 800);
  }

  window.addEventListener('DOMContentLoaded', () => {
    console.log('[overlay] DOMContentLoaded');
    ensureOverlay();
    installObservers();
    if (currentImageName() === 'Organization.png') {
      renderOrganizationDropdowns();
      onStageImageReady(() => repositionDropdowns());
    }
  });
})();
