// === Organization Activities & Overlay (robust add-on, v2) ===
(function(){
  console.log('[overlay v2] script loaded');

  const ORG_NAT_W = 2020, ORG_NAT_H = 1080;
  const VOFF_PERSON = 0;     // px offset for PersonResponsible
  const VOFF_MEASURE = 16;   // px below the person select
  const VOFF_BONUS = 32;     // px below the person select

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

  const STORAGE_KEY = "activityAssignments_v2";
  function loadAssignments() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
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

      const ro = new ResizeObserver(() => repositionDropdowns());
      const stage = document.getElementById('stage');
      if (stage) ro.observe(stage);
      ro.observe(ratioBox);
      window.addEventListener('resize', () => repositionDropdowns());
      window.addEventListener('load', () => repositionDropdowns());
      console.log('[overlay v2] overlay created');
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

  function optionsPerson() {
    return [
      { value: "", label: "- Person Responsible -", disabled: true },
      { value: "Graeme (CEO)", label: "Graeme (CEO)" },
      { value: "Michelle (VP)", label: "Michelle (VP)" },
      { value: "George (VP)", label: "George (VP)" },
      { value: "Peter (VP)", label: "Peter (VP)" },
      { value: "Betty (VP)", label: "Betty (VP)" },
    ];
  }

  function optionsMeasurement() {
    return [
      { value: "", label: "-Performance measure-", disabled: true },
      { value: "100% Cost budget", label: "100% Cost budget" },
      { value: "75% Cost, 25% Result", label: "75% Cost, 25% Result" },
      { value: "50% Cost, 50% Result", label: "50% Cost, 50% Result" },
      { value: "25% Cost, 75% Result", label: "25% Cost, 75% Result" },
      { value: "100% Result", label: "100% Result" },
      { value: "Product cost price reduction", label: "Product cost price reduction" },
      { value: "Conform to plan", label: "Conform to plan" },
    ];
  }

  function optionsBonus() {
    return [
      { value: "", label: "- Bonus impact -", disabled: true },
      { value: "Super bonus", label: "Super bonus" },
      { value: "Strong bonus", label: "Strong bonus" },
      { value: "Medium bonus", label: "Medium bonus" },
      { value: "Low bonus", label: "Low bonus" },
      { value: "No bonus", label: "No bonus" },
    ];
  }

  function makeSelect(xPct, yPct, key, kind, savedValue, topOffsetPx) {
    const sel = document.createElement('select');
    sel.className = 'ui-select';
    sel.setAttribute('data-xpct', xPct.toFixed(2));
    sel.setAttribute('data-ypct', yPct.toFixed(2));
    sel.setAttribute('data-key', key);
    sel.setAttribute('data-kind', kind);
    sel.setAttribute('data-topoffset', String(topOffsetPx || 0));
    sel.setAttribute('aria-label', key + ' – ' + kind);

    const opts = (kind === 'PersonResponsible') ? optionsPerson()
                : (kind === 'PerformanceMeasurement') ? optionsMeasurement()
                : optionsBonus();

    opts.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.disabled) o.disabled = true;
      sel.appendChild(o);
    });

    sel.value = savedValue ?? "";
    sel.addEventListener('change', () => {
      const map = loadAssignments();
      const rec = map[key] || {};
      rec[kind] = sel.value;
      map[key] = rec;
      saveAssignments(map);
    });

    return sel;
  }

  function renderOrganizationDropdowns() {
    if (!ensureOverlay()) return;
    clearOverlay();
    if (currentImageName() !== 'Organization.png') return;

    const assignments = loadAssignments();
    activities.forEach(act => {
      const { xPct, yPct } = pxToPct(act.xPx, act.yPx);

      const saved = assignments[act.key] || {};
      const selPerson = makeSelect(xPct, yPct, act.key, 'PersonResponsible', saved.PersonResponsible, VOFF_PERSON);
      const selMeasure = makeSelect(xPct, yPct, act.key, 'PerformanceMeasurement', saved.PerformanceMeasurement, VOFF_MEASURE);
      const selBonus = makeSelect(xPct, yPct, act.key, 'BonusImpact', saved.BonusImpact, VOFF_BONUS);

      uiOverlay.appendChild(selPerson);
      uiOverlay.appendChild(selMeasure);
      uiOverlay.appendChild(selBonus);
    });

    repositionDropdowns();
    console.log('[overlay v2] rendered', activities.length * 3, 'dropdowns');
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
      const extra = parseFloat(sel.getAttribute('data-topoffset') || '0');
      sel.style.left = (xPct / 100) * imgW + 'px';
      sel.style.top  = ((yPct / 100) * imgH + extra) + 'px';
    });
  }

  function installObservers() {
    const img = document.getElementById('stage-img');
    if (img && typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === 'attributes' && m.attributeName === 'href') {
            console.log('[overlay v2] href changed ->', currentImageName());
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
      console.log('[overlay v2] MutationObserver installed');
    }

    let last = null;
    setInterval(() => {
      const now = currentImageName();
      if (now !== last) {
        last = now;
        console.log('[overlay v2] poll change ->', now);
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
    console.log('[overlay v2] DOMContentLoaded');
    ensureOverlay();
    installObservers();
    if (currentImageName() === 'Organization.png') {
      renderOrganizationDropdowns();
      onStageImageReady(() => repositionDropdowns());
    }
  });
})();
