// === Organization Activities & Overlay (robust add-on, v2) ===
(function(){
  console.log('[overlay v2] script loaded');

  const ORG_NAT_W = 2020, ORG_NAT_H = 1080;
  const VOFF_PERSON = 0;     // px offset for PersonResponsible
  const VOFF_MEASURE = 18;   // px below the person select
  const VOFF_BONUS = 36;     // px below the person select

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
      { value: "", label: "-Performance Measure-", disabled: true }
  });
})();
