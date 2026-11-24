/* ======================================================================
   ZIDONG CORE · OBERON ACADEMY
   Rediseño visual inicial. No modifica la estructura de otros módulos.
   El contenido didáctico definitivo se incorporará en una fase posterior.
   ====================================================================== */
(() => {
  'use strict';

  const units = [
    { id: 'foundations', number: '01', icon: '🧭', title: 'Fundamentos del mandarín', desc: 'Conoce cómo funciona el idioma, sus sonidos y sus tonos.', tags: ['Pinyin', 'Pronunciación', 'Tonos'], status: 'RUTA PRINCIPAL' },
    { id: 'anatomy', number: '02', icon: '🧩', title: 'Anatomía de los Hanzi', desc: 'Observa trazos, radicales, componentes y formas de los caracteres.', tags: ['Trazos', 'Radicales', 'Estructura'], status: 'RUTA PRINCIPAL' },
    { id: 'logic', number: '03', icon: '🔬', title: 'La lógica de los caracteres', desc: 'Descubre pistas de significado, sonido y familias de caracteres.', tags: ['Componentes', 'Familias', 'Asociación'], status: 'RUTA PRINCIPAL' },
    { id: 'words', number: '04', icon: '🧱', title: 'Construcción de palabras', desc: 'Aprende cómo se combinan los caracteres para formar conceptos.', tags: ['Combinaciones', 'Vocabulario'], status: 'RUTA PRINCIPAL' },
    { id: 'grammar', number: '05', icon: '📝', title: 'Gramática del mandarín', desc: 'Entiende el orden de las palabras y cómo construir ideas.', tags: ['Orden', 'Preguntas', 'Negación'], status: 'RUTA PRINCIPAL' },
    { id: 'communication', number: '06', icon: '🗣️', title: 'Comunicación real', desc: 'Lleva lo aprendido a conversaciones y situaciones de trabajo.', tags: ['Conversación', 'Instrucciones', 'Planta'], status: 'RUTA PRINCIPAL' }
  ];

  let selectedUnit = null;
  let root = null;

  const styleText = `
    #academy .academy-legacy-hidden { display:none !important; }
    #academy .academy-redesign { width:100%; color:var(--text); }
    #academy .ac-hero { position:relative; overflow:hidden; padding:19px 16px 17px; border:1px solid rgba(39,216,232,.38); border-radius:19px; background:radial-gradient(circle at 88% 10%,rgba(39,216,232,.20),transparent 38%),linear-gradient(145deg,#142b45,#0d192b 72%); box-shadow:0 12px 28px rgba(0,0,0,.24); }
    #academy .ac-hero:after { content:'文'; position:absolute; right:12px; bottom:-30px; font:900 128px/1 'Noto Sans SC',sans-serif; color:rgba(39,216,232,.07); pointer-events:none; }
    #academy .ac-kicker { display:inline-flex; align-items:center; gap:6px; color:var(--cyan); font-size:9px; font-weight:900; letter-spacing:1.5px; }
    #academy .ac-hero h2 { margin:8px 0 5px; color:#fff; font-size:23px; line-height:1.12; letter-spacing:.3px; }
    #academy .ac-hero p { max-width:290px; color:#c6d4e5; font-size:11px; line-height:1.5; }
    #academy .ac-hero-bottom { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:15px; }
    #academy .ac-level-pill { border:1px solid rgba(0,245,155,.35); background:rgba(0,245,155,.09); color:var(--green); border-radius:30px; padding:6px 9px; font-size:8px; font-weight:900; letter-spacing:.7px; }
    #academy .ac-hero-mark { color:rgba(255,255,255,.65); font-size:9px; font-weight:800; letter-spacing:1px; }
    #academy .ac-section-head { display:flex; justify-content:space-between; align-items:end; gap:8px; margin:19px 1px 10px; }
    #academy .ac-section-head h3 { color:#fff; font-size:14px; }
    #academy .ac-section-head small { color:var(--muted); font-size:8px; }
    #academy .ac-unit-list { display:flex; flex-direction:column; gap:9px; }
    #academy .ac-unit { width:100%; display:flex; align-items:center; gap:11px; text-align:left; padding:12px; color:var(--text); background:linear-gradient(135deg,rgba(22,40,70,.98),rgba(15,29,49,.98)); border:1px solid var(--border); border-radius:14px; cursor:pointer; transition:transform .16s,border-color .16s,background .16s; }
    #academy .ac-unit:active { transform:scale(.985); }
    #academy .ac-unit.selected { border-color:var(--cyan); background:linear-gradient(135deg,rgba(25,62,83,.98),rgba(15,29,49,.98)); box-shadow:0 0 0 1px rgba(39,216,232,.10),0 7px 18px rgba(0,0,0,.18); }
    #academy .ac-unit-icon { width:42px; height:42px; flex:0 0 42px; display:grid; place-items:center; border-radius:12px; background:rgba(39,216,232,.10); border:1px solid rgba(39,216,232,.22); font-size:20px; }
    #academy .ac-unit-copy { min-width:0; flex:1; }
    #academy .ac-unit-top { display:flex; align-items:center; gap:6px; margin-bottom:4px; }
    #academy .ac-unit-num { color:var(--cyan); font:800 9px/1 monospace; letter-spacing:1px; }
    #academy .ac-unit-status { color:var(--muted); font-size:7px; font-weight:900; letter-spacing:.65px; }
    #academy .ac-unit h4 { color:#fff; font-size:12px; line-height:1.25; }
    #academy .ac-unit p { margin-top:4px; color:#aebed0; font-size:9px; line-height:1.35; }
    #academy .ac-unit-arrow { color:var(--cyan); font-size:18px; font-weight:800; }
    #academy .ac-note { margin-top:13px; padding:10px 12px; border:1px dashed rgba(255,200,87,.35); border-radius:12px; background:rgba(255,200,87,.055); color:#d9c99e; font-size:9px; line-height:1.45; }
    #academy .ac-detail { margin-top:14px; padding:14px; border:1px solid rgba(39,216,232,.35); border-radius:16px; background:linear-gradient(145deg,rgba(17,31,53,.98),rgba(10,22,39,.98)); animation:acFadeIn .2s ease-out; }
    #academy .ac-detail-head { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
    #academy .ac-detail-icon { width:38px; height:38px; display:grid; place-items:center; background:rgba(39,216,232,.10); border-radius:11px; font-size:19px; }
    #academy .ac-detail h3 { color:#fff; font-size:14px; }
    #academy .ac-detail .ac-detail-sub { color:var(--muted); font-size:8px; margin-top:3px; }
    #academy .ac-preview-label { color:var(--cyan); font-size:8px; font-weight:900; letter-spacing:1px; margin:8px 0; }
    #academy .ac-hanzi-demo { display:grid; grid-template-columns:100px 1fr; gap:12px; align-items:center; padding:12px; border:1px solid rgba(39,216,232,.2); border-radius:13px; background:rgba(5,14,26,.65); }
    #academy .ac-hanzi-char { display:grid; place-items:center; min-height:100px; border-radius:11px; background:radial-gradient(circle,rgba(39,216,232,.13),rgba(39,216,232,.025)); color:#fff; font:700 65px/1.2 'Noto Sans SC',serif; }
    #academy .ac-hanzi-info strong { display:block; color:#fff; font-size:12px; }
    #academy .ac-hanzi-info .ac-pinyin { color:var(--gold); font-size:12px; font-weight:900; margin:4px 0; }
    #academy .ac-hanzi-info p { color:#b8c7d8; font-size:9px; line-height:1.4; }
    #academy .ac-memory { display:flex; gap:10px; align-items:center; margin-top:10px; padding:10px; border-radius:12px; background:rgba(167,139,250,.08); border:1px solid rgba(167,139,250,.23); }
    #academy .ac-memory-art { width:54px; height:54px; flex:0 0 54px; display:grid; place-items:center; border-radius:10px; background:rgba(167,139,250,.12); font-size:34px; }
    #academy .ac-memory strong { display:block; color:#c4b5fd; font-size:9px; margin-bottom:3px; }
    #academy .ac-memory p { color:#d3d8e4; font-size:9px; line-height:1.4; }
    #academy .ac-coming { margin-top:10px; color:var(--muted); font-size:8px; line-height:1.4; }
    #academy .ac-close-detail { width:100%; margin-top:12px; padding:9px; border:1px solid var(--border); border-radius:10px; color:var(--cyan); background:rgba(39,216,232,.06); font-size:9px; font-weight:900; cursor:pointer; }
    @keyframes acFadeIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
    @media (min-width:420px) { #academy .ac-unit-list { display:grid; grid-template-columns:1fr 1fr; } #academy .ac-unit { align-items:flex-start; min-height:122px; } #academy .ac-unit-arrow { align-self:center; } }
  `;

  function installStyles() {
    if (document.getElementById('academy-redesign-styles')) return;
    const style = document.createElement('style');
    style.id = 'academy-redesign-styles';
    style.textContent = styleText;
    document.head.appendChild(style);
  }

  function prepareShell() {
    const section = document.getElementById('academy');
    if (!section) return null;
    section.querySelectorAll(':scope > .welcome, :scope > .panel, :scope > #academyTracksBar, :scope > #academyModulesContainer, :scope > #academyLessonDetailContainer')
      .forEach(el => el.classList.add('academy-legacy-hidden'));
    let mount = section.querySelector(':scope > .academy-redesign');
    if (!mount) {
      mount = document.createElement('div');
      mount.className = 'academy-redesign';
      const backButton = section.querySelector(':scope > .back-button');
      section.insertBefore(mount, backButton || null);
    }
    return mount;
  }

  function renderDetail(unit) {
    const detail = root.querySelector('#acUnitDetail');
    if (!detail) return;
    if (!unit) { detail.innerHTML = ''; return; }
    const isAnatomy = unit.id === 'anatomy' || unit.id === 'logic';
    detail.innerHTML = `
      <article class="ac-detail">
        <div class="ac-detail-head">
          <div class="ac-detail-icon">${unit.icon}</div>
          <div><h3>${unit.title}</h3><div class="ac-detail-sub">UNIDAD ${unit.number} · VISTA PREVIA DE ESTRUCTURA</div></div>
        </div>
        <p style="color:#c2d0df;font-size:10px;line-height:1.5;">${unit.desc}</p>
        <div class="ac-preview-label">ASÍ SE VERÁ UNA LECCIÓN VISUAL</div>
        <div class="ac-hanzi-demo">
          <div class="ac-hanzi-char">骨</div>
          <div class="ac-hanzi-info"><strong>HUESO</strong><div class="ac-pinyin">gǔ · tercer tono</div><p>Un carácter presentado como protagonista, acompañado de su lectura y significado.</p></div>
        </div>
        <div class="ac-memory">
          <div class="ac-memory-art" aria-hidden="true">💀</div>
          <div><strong>ASOCIACIÓN VISUAL</strong><p>Una pequeña ilustración de esqueleto sirve como pista para recordar el significado de 骨.</p></div>
        </div>
        <p class="ac-coming">${isAnatomy ? 'En esta unidad añadiremos descomposición del carácter, componentes y una explicación clara de qué es una asociación visual y qué es un origen histórico.' : 'Esta es una maqueta visual. El temario, las explicaciones y los ejercicios definitivos se desarrollarán después de aprobar la interfaz.'}</p>
        <button class="ac-close-detail" type="button" data-ac-close>VOLVER A LA RUTA ↑</button>
      </article>`;
    detail.querySelector('[data-ac-close]').addEventListener('click', () => {
      selectedUnit = null;
      render();
      root.querySelector('.ac-section-head')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function render() {
    root = prepareShell();
    if (!root) return;
    installStyles();
    root.innerHTML = `
      <header class="ac-hero">
        <span class="ac-kicker">✦ SISTEMA DE APRENDIZAJE OBERON</span>
        <h2>OBERON<br>ACADEMY</h2>
        <p>Descubre cómo funciona el chino. Comprende sus caracteres, relaciónalos y aprende a utilizarlos.</p>
        <div class="ac-hero-bottom"><span class="ac-level-pill">RUTA DE APRENDIZAJE · DESDE CERO</span><span class="ac-hero-mark">LEARN · CONNECT · APPLY</span></div>
      </header>
      <div class="ac-section-head"><h3>Tu ruta de aprendizaje</h3><small>6 UNIDADES PROPUESTAS</small></div>
      <div class="ac-unit-list" id="acUnitList">
        ${units.map(unit => `
          <button type="button" class="ac-unit ${selectedUnit === unit.id ? 'selected' : ''}" data-unit="${unit.id}" aria-expanded="${selectedUnit === unit.id}">
            <span class="ac-unit-icon">${unit.icon}</span>
            <span class="ac-unit-copy"><span class="ac-unit-top"><span class="ac-unit-num">${unit.number}</span><span class="ac-unit-status">${unit.status}</span></span><h4>${unit.title}</h4><p>${unit.desc}</p></span>
            <span class="ac-unit-arrow">${selectedUnit === unit.id ? '⌄' : '›'}</span>
          </button>`).join('')}
      </div>
      <div class="ac-note">💡 <strong>Cómo aprenderemos:</strong> primero entenderás la lógica; después usarás imágenes, asociaciones y ejemplos para recordar. No será memorizar por memorizar.</div>
      <div id="acUnitDetail"></div>
    `;
    root.querySelectorAll('[data-unit]').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-unit');
        selectedUnit = selectedUnit === id ? null : id;
        render();
        if (selectedUnit) root.querySelector('#acUnitDetail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
    renderDetail(units.find(unit => unit.id === selectedUnit) || null);
  }

  // Se conservan los puntos de entrada que ya utiliza Zidong Core.
  window.ZIDONG_ACADEMY_TRACKS = window.ZIDONG_ACADEMY_TRACKS || {};
  window.switchAcademyTrack = function () { render(); };
  window.selectAcademyLesson = function () { render(); };
  window.renderAcademyView = render;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once: true });
  } else {
    render();
  }
})();
