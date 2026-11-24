/* ZIDONG CORE · OBERON ACADEMY
   Vista dinámica: los datos vienen del currículo, el estado del motor y el progreso.
*/
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  let root=null, activeLesson=null;
  const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const curriculum=()=>window.OBERON_ACADEMY_CURRICULUM;
  const engine=()=>window.OBERON_ACADEMY_ENGINE;
  const progress=()=>window.OBERON_ACADEMY_PROGRESS;
  const css=`
  #academy .academy-legacy-hidden{display:none!important}
  #academy .academy-redesign{width:100%;color:var(--text)}
  #oberon-academy-overlay .ac-shifu-mentor{display:flex;align-items:center;gap:10px;margin:10px 0 14px;padding:9px 11px;border:1px solid rgba(39,216,232,.25);border-radius:14px;background:linear-gradient(110deg,rgba(39,216,232,.10),rgba(0,245,155,.07))}
  #oberon-academy-overlay .ac-shifu-mentor img{width:58px;height:58px;object-fit:contain;border-radius:12px;background:rgba(255,255,255,.06)}
  #oberon-academy-overlay .ac-shifu-mentor strong{display:block;color:#fff;font-size:12px;margin-bottom:3px}
  #oberon-academy-overlay .ac-shifu-mentor span{display:block;color:#c6d4e5;font-size:11px;line-height:1.4}
  #academy .ac-hero{position:relative;overflow:hidden;padding:19px 16px;border:1px solid rgba(39,216,232,.38);border-radius:19px;background:radial-gradient(circle at 88% 10%,rgba(39,216,232,.2),transparent 38%),linear-gradient(145deg,#142b45,#0d192b 72%);box-shadow:0 12px 28px #0003}
  #academy .ac-kicker{color:var(--cyan);font-size:9px;font-weight:900;letter-spacing:1.5px}
  #academy .ac-hero h2{margin:8px 0 5px;color:#fff;font-size:23px;line-height:1.12}
  #academy .ac-hero p{max-width:320px;color:#c6d4e5;font-size:11px;line-height:1.5}
  #academy .ac-cta{width:100%;margin-top:14px;padding:12px;border:1px solid rgba(0,245,155,.4);border-radius:12px;background:linear-gradient(110deg,rgba(0,245,155,.16),rgba(39,216,232,.12));color:#fff;font-weight:900;font-size:11px;cursor:pointer}
  #academy .ac-cta:disabled{opacity:.5;cursor:not-allowed}
  #academy .ac-section-head{display:flex;justify-content:space-between;align-items:end;gap:8px;margin:19px 1px 10px}
  #academy .ac-section-head h3{color:#fff;font-size:14px}
  #academy .ac-section-head small{color:var(--muted);font-size:8px}
  #academy .ac-unit-list{display:flex;flex-direction:column;gap:9px}
  #academy .ac-unit{width:100%;display:flex;align-items:center;gap:11px;text-align:left;padding:12px;color:var(--text);background:linear-gradient(135deg,rgba(22,40,70,.98),rgba(15,29,49,.98));border:1px solid var(--border);border-radius:14px;cursor:pointer}
  #academy .ac-unit:disabled{opacity:.58;cursor:not-allowed}
  #academy .ac-unit.selected{border-color:var(--cyan);background:linear-gradient(135deg,#193e53,#0f1d31)}
  #academy .ac-unit-icon{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border-radius:12px;background:#27d8e21a;font-size:20px}
  #academy .ac-unit-copy{min-width:0;flex:1}
  #academy .ac-unit-top{display:flex;gap:6px;margin-bottom:4px}
  #academy .ac-unit-num{color:var(--cyan);font:800 9px monospace}
  #academy .ac-unit-status{color:var(--muted);font-size:7px;font-weight:900}
  #academy .ac-unit h4{color:#fff;font-size:12px;line-height:1.25}
  #academy .ac-unit p{margin-top:4px;color:#aebed0;font-size:9px;line-height:1.35}
  #academy .ac-progress{height:4px;margin-top:8px;overflow:hidden;border-radius:9px;background:#ffffff16}
  #academy .ac-progress span{display:block;height:100%;background:var(--cyan)}
  #academy .ac-detail,#academy .ac-lesson{margin-top:14px;padding:14px;border:1px solid #27d8e259;border-radius:16px;background:linear-gradient(145deg,#111f35fa,#0a1627fa)}
  #academy .ac-lesson-row{display:flex;justify-content:space-between;gap:8px;align-items:center}
  #academy .ac-detail h3,#academy .ac-lesson h3{color:#fff;font-size:14px}
  #academy .ac-muted{color:var(--muted);font-size:9px;line-height:1.5}
  #academy .ac-lesson-list{display:grid;gap:7px;margin-top:12px}
  #academy .ac-lesson-item{display:flex;align-items:center;gap:9px;padding:10px;border:1px solid var(--border);border-radius:11px;background:#071321;color:#e7f0fa;text-align:left}
  #academy .ac-lesson-item:disabled{opacity:.45}
  #academy .ac-lesson-item strong{display:block;font-size:10px}
  #academy .ac-lesson-item small{display:block;margin-top:3px;color:var(--muted);font-size:8px}
  #academy .ac-pill{padding:4px 7px;border-radius:20px;background:#27d8e218;color:var(--cyan);font-size:7px;font-weight:900;white-space:nowrap}
  #academy .ac-card{margin-top:10px;padding:12px;border:1px solid #ffffff18;border-radius:13px;background:#061321a8}
  #academy .ac-card h4{margin-bottom:7px;color:var(--cyan);font-size:10px;letter-spacing:.5px}
  #academy .ac-card p,#academy .ac-card li{color:#d1dce9;font-size:10px;line-height:1.6}
  #academy .ac-hanzi{margin:9px 0;text-align:center;color:#fff;font:700 58px/1.3 'Noto Sans SC',serif}
  #academy .ac-example{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 0;border-top:1px solid #ffffff14}
  #academy .ac-example strong{color:#fff;font-size:19px}
  #academy .ac-example span{display:block;color:#f5c85b;font-size:10px}
  #academy .ac-audio{border:1px solid #27d8e255;border-radius:8px;padding:6px 9px;background:#27d8e211;color:var(--cyan);font-size:9px}
  #academy .ac-question{margin-top:10px;padding:12px;border:1px solid #ffffff1c;border-radius:12px}
  #academy .ac-question p{color:#fff;font-size:11px;font-weight:800;margin-bottom:8px}
  #academy .ac-option{display:block;width:100%;margin-top:6px;padding:9px;border:1px solid var(--border);border-radius:9px;background:#0d1c2e;color:#dce8f5;text-align:left;font-size:10px}
  #academy .ac-option.chosen{border-color:var(--cyan);background:#27d8e21c}
  #academy .ac-primary,#academy .ac-secondary{width:100%;margin-top:12px;padding:11px;border-radius:10px;font-size:10px;font-weight:900}
  #academy .ac-primary{border:0;background:var(--cyan);color:#061321}
  #academy .ac-secondary{border:1px solid var(--border);background:#ffffff08;color:var(--cyan)}
  #academy .ac-result{margin-top:12px;padding:11px;border-radius:10px;background:#00f59b12;color:#b9f7dd;font-size:10px;line-height:1.5}
  #academy .ac-back{border:0;background:none;color:var(--cyan);font-size:9px;font-weight:900}
  /* Pantallas flotantes independientes para unidad y lección */
  #oberon-academy-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:0;background:rgba(2,8,18,.82);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:acFadeIn .18s ease both}
  #oberon-academy-overlay .ac-screen{position:relative;width:100%;height:100%;max-width:900px;overflow:hidden;display:flex;flex-direction:column;background:radial-gradient(circle at 90% 0%,rgba(39,216,232,.12),transparent 34%),linear-gradient(160deg,#10223a,#071321 70%);border:1px solid rgba(39,216,232,.35);box-shadow:0 24px 90px #000b;animation:acScreenIn .24s cubic-bezier(.2,.8,.2,1) both}
  #oberon-academy-overlay .ac-screen-head{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(39,216,232,.2);background:#071321eF}
  #oberon-academy-overlay .ac-screen-head strong{color:#fff;font-size:11px;letter-spacing:1px}
  #oberon-academy-overlay .ac-screen-close{width:34px;height:34px;border:1px solid #27d8e255;border-radius:10px;background:#27d8e214;color:var(--cyan);font-size:17px;cursor:pointer}
  #oberon-academy-overlay .ac-screen-body{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:15px 14px 28px}
  #oberon-academy-overlay .ac-screen-body>.ac-detail,#oberon-academy-overlay .ac-screen-body>.ac-lesson{max-width:760px;margin:0 auto;padding:0;border:0;background:transparent}
  #oberon-academy-overlay .ac-screen-body .ac-card{background:rgba(4,15,29,.78)}
  #oberon-academy-overlay .ac-screen-body .ac-lesson-row{margin-bottom:10px}
  #oberon-academy-overlay .ac-screen-body .ac-primary{cursor:pointer}
  @keyframes acFadeIn{from{opacity:0}to{opacity:1}}
  @keyframes acScreenIn{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
  @media(min-width:700px){#oberon-academy-overlay{padding:24px}#oberon-academy-overlay .ac-screen{height:min(92vh,900px);border-radius:22px}#oberon-academy-overlay .ac-screen-body{padding:22px 26px 34px}}
  @media(max-width:380px){#oberon-academy-overlay .ac-screen-head{padding:11px 12px}#oberon-academy-overlay .ac-screen-body{padding:12px 10px 24px}}
  @media(min-width:420px){#academy .ac-unit-list{display:grid;grid-template-columns:1fr 1fr}#academy .ac-unit{align-items:flex-start;min-height:130px}}

  /* Lecciones en formato diapositiva: lectura cómoda en móvil */
  #oberon-academy-overlay .ac-lesson-paged{max-width:680px;margin:0 auto;padding:0 0 12px}
  #oberon-academy-overlay .ac-course-title{margin:18px 0 6px;color:#fff;font-size:clamp(23px,6vw,32px);line-height:1.15}
  #oberon-academy-overlay .ac-course-objective{color:#b8c9dc;font-size:15px;line-height:1.55}
  #oberon-academy-overlay .ac-slide-progress{height:5px;margin:18px 0 7px;border-radius:8px;background:#ffffff18;overflow:hidden}
  #oberon-academy-overlay .ac-slide-progress span{display:block;height:100%;background:linear-gradient(90deg,#00f59b,#27d8e2);transition:width .2s}
  #oberon-academy-overlay .ac-slide-counter{color:#8da6bd;font-size:10px;letter-spacing:1px;text-align:right}
  #oberon-academy-overlay .ac-slide-content{min-height:360px;padding:18px 0 10px}
  #oberon-academy-overlay .ac-slide-kicker{color:#27d8e2;font-size:11px;font-weight:900;letter-spacing:1.5px}
  #oberon-academy-overlay .ac-slide-title{margin:10px 0 16px;color:#fff;font-size:clamp(24px,6vw,34px);line-height:1.15}
  #oberon-academy-overlay .ac-slide-copy{color:#e2ebf5;font-size:18px;line-height:1.75;margin:0 0 18px}
  #oberon-academy-overlay .ac-key-takeaway{padding:15px;border:1px solid #27d8e25c;border-radius:14px;background:#27d8e213;color:#66e8ee;font-size:17px;font-weight:800;line-height:1.5}
  #oberon-academy-overlay .ac-visual{position:relative;height:235px;max-width:420px;margin:24px auto 8px;display:grid;place-items:center;overflow:hidden;border:1px solid #27d8e238;border-radius:20px;background:radial-gradient(circle,#153b54,#081727 70%)}
  #oberon-academy-overlay .ac-visual-core{z-index:2;width:112px;height:112px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(145deg,#1e536b,#10283d);border:2px solid #27d8e2;box-shadow:0 0 30px #27d8e255}
  #oberon-academy-overlay .ac-visual-core span{font-size:34px;color:white}.ac-visual-core small{font-size:9px;letter-spacing:2px;color:#8eeef0}
  #oberon-academy-overlay .ac-orbit{position:absolute;width:205px;height:115px;border:1px solid #27d8e255;border-radius:50%;transform:rotate(-25deg)}
  #oberon-academy-overlay .ac-orbit-two{width:290px;height:165px;transform:rotate(35deg);border-color:#00f59b44}
  #oberon-academy-overlay .ac-visual-node{position:absolute;z-index:3;display:flex;flex-direction:column;align-items:center;padding:7px 12px;border-radius:10px;background:#0c2035;border:1px solid #27d8e277;box-shadow:0 5px 18px #0007}
  #oberon-academy-overlay .ac-visual-node b{font-size:20px;color:#fff}.ac-visual-node small{font-size:10px;color:#a9c2d5}
  #oberon-academy-overlay .ac-node-a{top:12px;left:calc(50% - 40px)}#oberon-academy-overlay .ac-node-b{bottom:15px;left:12px}#oberon-academy-overlay .ac-node-c{bottom:15px;right:12px}
  #oberon-academy-overlay .ac-pieces-visual{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:6px;margin:8px 0 20px}
  #oberon-academy-overlay .ac-piece{min-width:0;min-height:116px;padding:10px 5px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:1px solid #27d8e266;border-radius:13px;background:linear-gradient(160deg,#163b52,#0a1a2d);text-align:center}
  #oberon-academy-overlay .ac-piece strong{font-size:26px;color:#fff}#oberon-academy-overlay .ac-piece b{font-size:12px;color:#27d8e2}#oberon-academy-overlay .ac-piece small{font-size:10px;line-height:1.3;color:#b6c8d9}
  #oberon-academy-overlay .ac-piece-connector{color:#00f59b;font-size:20px;font-weight:900}
  #oberon-academy-overlay .ac-slide-points{display:grid;gap:10px}
  #oberon-academy-overlay .ac-slide-point{display:flex;gap:12px;padding:13px;border:1px solid #ffffff20;border-radius:13px;background:#071728}
  #oberon-academy-overlay .ac-slide-point>span{flex:0 0 28px;width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:#27d8e222;color:#27d8e2;font-weight:900}
  #oberon-academy-overlay .ac-slide-point b{color:#fff;font-size:15px}#oberon-academy-overlay .ac-slide-point p{margin-top:4px;color:#c8d6e4;font-size:14px;line-height:1.55}
  #oberon-academy-overlay .ac-memory-art,#oberon-academy-overlay .ac-info-art{margin:8px auto 20px;padding:24px;text-align:center;border:1px solid #27d8e244;border-radius:16px;background:radial-gradient(circle,#173c53,#081727)}
  #oberon-academy-overlay .ac-memory-art span{display:block;font-size:48px}#oberon-academy-overlay .ac-memory-art b{display:block;margin:8px;color:#27d8e2;font-size:12px;letter-spacing:1px}#oberon-academy-overlay .ac-memory-art p{color:#c8d6e4;font-size:13px}#oberon-academy-overlay .ac-info-art{font-size:54px}
  #oberon-academy-overlay .ac-vocab-list{display:grid;gap:10px}#oberon-academy-overlay .ac-vocab{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px;border:1px solid #ffffff20;border-radius:13px;background:#071728}
  #oberon-academy-overlay .ac-vocab>div{display:grid;gap:3px}#oberon-academy-overlay .ac-vocab strong{font-size:29px;color:#fff}#oberon-academy-overlay .ac-vocab b{font-size:15px;color:#f5c85b}#oberon-academy-overlay .ac-vocab small{font-size:12px;color:#b8c9dc}
  #oberon-academy-overlay .ac-slide-nav{display:flex;gap:10px;position:sticky;bottom:-1px;padding:10px 0 4px;background:linear-gradient(180deg,transparent,#071321 25%)}
  #oberon-academy-overlay .ac-slide-nav button{flex:1;min-height:48px;font-size:12px}#oberon-academy-overlay .ac-slide-nav button:disabled{opacity:.25}
  #oberon-academy-overlay .ac-question{padding:15px}#oberon-academy-overlay .ac-question p{font-size:15px;line-height:1.5}#oberon-academy-overlay .ac-option{padding:13px;font-size:14px;line-height:1.4}
  @media(max-width:390px){#oberon-academy-overlay .ac-slide-content{min-height:300px}#oberon-academy-overlay .ac-pieces-visual{gap:3px}#oberon-academy-overlay .ac-piece{min-height:105px;padding:7px 3px}#oberon-academy-overlay .ac-piece strong{font-size:22px}#oberon-academy-overlay .ac-piece small{font-size:9px}}
  `;
  function styles(){if($('#academy-redesign-styles'))return;const s=document.createElement('style');s.id='academy-redesign-styles';s.textContent=css;document.head.appendChild(s);}
  function shell(){
    const section=$('#academy');if(!section)return null;
    section.querySelectorAll(':scope > .welcome,:scope > .panel,:scope > #academyTracksBar,:scope > #academyModulesContainer,:scope > #academyLessonDetailContainer').forEach(x=>x.classList.add('academy-legacy-hidden'));
    let mount=$(':scope > .academy-redesign',section);
    if(!mount){mount=document.createElement('div');mount.className='academy-redesign';const back=section.querySelector(':scope > .back-button');section.insertBefore(mount,back||null);}
    return mount;
  }
  function render(){
    root=shell();if(!root)return;styles();
    const units=curriculum().units, next=engine().nextRecommended();
    const mastered=engine().allLessons().filter(l=>progress().lesson(l.id).status==='mastered').length;
    root.innerHTML=`
      <header class="ac-hero"><span class="ac-kicker">✦ SISTEMA DE APRENDIZAJE OBERON</span><h2>OBERON<br>ACADEMY</h2>
      <p>Aprende mandarín desde cero: comprende los sonidos, descubre la lógica de los Hanzi y utiliza lo aprendido en situaciones reales.</p>
      <button class="ac-cta" id="acContinue" ${next?'':'disabled'}>▶ CONTINUAR APRENDIENDO ${next?`· ${esc(next.title)}`:'· PRÓXIMAMENTE'}</button>
      <div class="ac-muted" style="margin-top:8px">PROGRESO GENERAL · ${mastered}/${engine().allLessons().length} lecciones dominadas</div></header>
      <div class="ac-section-head"><h3>Tu ruta de aprendizaje</h3><small>6 MÓDULOS · 36 LECCIONES</small></div>
      <div class="ac-unit-list">${units.map(u=>{const p=engine().unitProgress(u),open=u.number==='01'||units[Number(u.number)-2]?.lessons.every(l=>progress().lesson(l.id).status==='mastered');return `<button class="ac-unit ${activeLesson?.unitId===u.id?'selected':''}" data-unit="${u.id}" ${open?'':'disabled'}><span class="ac-unit-icon">${u.icon}</span><span class="ac-unit-copy"><span class="ac-unit-top"><span class="ac-unit-num">${u.number}</span><span class="ac-unit-status">${open?'RUTA DISPONIBLE':'🔒 BLOQUEADO'}</span></span><h4>${esc(u.title)}</h4><p>${esc(u.description)}</p><div class="ac-progress"><span style="width:${p.percent}%"></span></div><small class="ac-muted">${p.mastered}/${p.total} dominadas</small></span><span>${open?'›':'🔒'}</span></button>`}).join('')}</div>
      <div id="acContent"></div>`;
    $('#acContinue',root)?.addEventListener('click',()=>{if(next)openLesson(next.id);});
    root.querySelectorAll('[data-unit]').forEach(b=>b.addEventListener('click',()=>{activeLesson={unitId:b.dataset.unit};renderUnit(b.dataset.unit);}));

  }
  function openScreen(title, content, onClose){
    closeScreen(false);
    const overlay=document.createElement('div');overlay.id='oberon-academy-overlay';
    overlay.innerHTML=`<section class="ac-screen" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header class="ac-screen-head"><strong>OBERON ACADEMY <span style="color:var(--cyan)">/ ${esc(title)}</span></strong><button class="ac-screen-close" type="button" aria-label="Cerrar">×</button></header><div class="ac-screen-body">${content}</div></section>`;
    ($('#academy')||document.body).appendChild(overlay);document.body.dataset.academyScroll=document.body.style.overflow||'';document.body.style.overflow='hidden';
    const close=()=>{closeScreen();if(onClose)onClose();};
    overlay.querySelector('.ac-screen-close').addEventListener('click',close);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
    window.__oberonAcademyEscape= e=>{if(e.key==='Escape'){close();}};
    document.addEventListener('keydown',window.__oberonAcademyEscape);
    return overlay.querySelector('.ac-screen-body');
  }
  function closeScreen(restore=true){
    const old=$('#oberon-academy-overlay');if(old)old.remove();
    document.body.style.overflow=document.body.dataset.academyScroll||'';delete document.body.dataset.academyScroll;
    if(window.__oberonAcademyEscape){document.removeEventListener('keydown',window.__oberonAcademyEscape);delete window.__oberonAcademyEscape;}
  }
  function renderUnit(unitId){
    const u=curriculum().units.find(x=>x.id===unitId);if(!u)return;
    const lessonRows=u.lessons.map((l,index)=>{
      const st=engine().status(l);
      // Modo exploración: toda lección con contenido listo se puede abrir.
      const enabled= l.status==='ready';
      const label=st==='mastered'?'DOMINADA':st==='needs_review'?'REPASO':st==='in_progress'?'EN CURSO':enabled?'DISPONIBLE':l.status==='ready'?'BLOQUEADA':'EN PREPARACIÓN';
      const icon=st==='mastered'?'✓':enabled?'▶':'🔒';
      return `<button type="button" class="ac-lesson-item" data-lesson="${l.id}" ${enabled?'':'disabled'} aria-label="${esc(l.title)} · ${label}"><span>${icon}</span><span style="flex:1"><strong>${esc(l.title)}</strong><small>${esc(l.objective)}</small></span><span class="ac-pill">${label}</span></button>`;
    }).join('');
    const first=u.lessons.find((l,i)=>i===0&&l.status==='ready');
    const body=openScreen(`UNIDAD ${u.number}`,`<section class="ac-detail"><div class="ac-lesson-row"><h3>${u.icon} ${esc(u.title)}</h3><span class="ac-pill">RUTA DE APRENDIZAJE</span></div><p class="ac-muted">${esc(u.description)}</p><div class="ac-lesson-list">${lessonRows}</div>${first&&progress().lesson(first.id).status!=='mastered'?`<button type="button" class="ac-primary" id="acStartFirst">▶ COMENZAR LECCIÓN 01</button>`:''}<p class="ac-muted" style="margin-top:14px">Modo exploración: puedes abrir cualquier lección que ya tenga contenido. Las que están en preparación se habilitarán cuando se publiquen.</p></section>`);
    body.querySelectorAll('[data-lesson]:not(:disabled)').forEach(b=>b.addEventListener('click',()=>openLesson(b.dataset.lesson)));
    $('#acStartFirst',body)?.addEventListener('click',()=>openLesson(first.id));
  }
  function openLesson(id){
    const lesson=engine().allLessons().find(l=>l.id===id);if(!lesson||lesson.status!=='ready')return;
    progress().start(id);activeLesson={unitId:lesson.unitId,lessonId:id};renderLesson(lesson);
  }
  function lessonSlides(l){
    const p=l.phases;
    const svgIntro=`<div class="ac-visual ac-visual-intro" role="img" aria-label="El mandarín combina escritura, pronunciación y significado"><div class="ac-orbit ac-orbit-one"></div><div class="ac-orbit ac-orbit-two"></div><div class="ac-visual-core"><span>中文</span><small>MANDARÍN</small></div><div class="ac-visual-node ac-node-a"><b>汉字</b><small>Escritura</small></div><div class="ac-visual-node ac-node-b"><b>拼音</b><small>Pronunciación</small></div><div class="ac-visual-node ac-node-c"><b>意义</b><small>Significado</small></div></div>`;
    const svgPieces=`<div class="ac-pieces-visual" role="img" aria-label="Tres piezas: Hanzi, Pinyin y palabra"><div class="ac-piece"><strong>汉字</strong><b>Hanzi</b><small>Lo que ves escrito</small></div><div class="ac-piece-connector">＋</div><div class="ac-piece"><strong>拼音</strong><b>Pinyin</b><small>Cómo se pronuncia</small></div><div class="ac-piece-connector">＋</div><div class="ac-piece"><strong>你好</strong><b>Palabra</b><small>Uno o más caracteres</small></div></div>`;
    return [
      {title:p.discovery.title, kicker:'01 · DESCUBRIMIENTO', body:`<p class="ac-slide-copy">${esc(p.discovery.text)}</p><div class="ac-key-takeaway">${esc(p.discovery.key)}</div>${svgIntro}`},
      {title:p.anatomy.title,kicker:'02 · TRES PIEZAS',body:`${svgPieces}<div class="ac-slide-points">${p.anatomy.items.map((x,i)=>`<div class="ac-slide-point"><span>${i+1}</span><div><b>${esc(x.label)}</b><p>${esc(x.detail)}</p></div></div>`).join('')}</div>`},
      {title:p.memory.title,kicker:'03 · ASOCIACIÓN VISUAL',body:`<div class="ac-memory-art"><span>🧠</span><b>RECURSO PARA RECORDAR</b><p>Una imagen mental para conectar ideas.</p></div><p class="ac-slide-copy">${esc(p.memory.text)}</p>`},
      {title:'Origen histórico',kicker:'04 · ETIMOLOGÍA',body:`<div class="ac-info-art">📜</div><p class="ac-slide-copy">${esc(p.etymology.available?p.etymology.explanation:p.etymology.note)}</p>`},
      {title:p.pronunciation.title,kicker:'05 · PRONUNCIACIÓN',body:`<p class="ac-slide-copy">${esc(p.pronunciation.note)}</p><div class="ac-vocab-list">${p.pronunciation.examples.map(x=>`<div class="ac-vocab"><div><strong>${esc(x.hanzi)}</strong><b>${esc(x.pinyin)}</b><small>${esc(x.meaning)} · tono ${esc(x.tone)}</small></div><button class="ac-audio" data-say="${esc(x.hanzi)}">▶ Escuchar</button></div>`).join('')}</div>`},
      {title:'Ejemplos en contexto',kicker:'06 · OBSERVA Y ESCUCHA',body:`<div class="ac-vocab-list">${p.examples.map(x=>`<div class="ac-vocab"><div><strong>${esc(x.hanzi)}</strong><b>${esc(x.pinyin)}</b><small>${esc(x.meaning)}</small></div><button class="ac-audio" data-say="${esc(x.hanzi)}">▶ Escuchar</button></div>`).join('')}</div>`},
      {title:'Comprueba lo aprendido',kicker:'07 · MINI-PRÁCTICA',body:`<p class="ac-slide-copy">${esc(l.practice.instructions)}</p>${l.practice.exercises.map((q,i)=>`<div class="ac-question" data-q="${q.id}"><p>${i+1}. ${esc(q.question)}</p>${q.audio?`<button class="ac-audio" data-say="${esc(q.audio)}">▶ Escuchar audio</button>`:''}${q.options.map((o,j)=>`<button class="ac-option" data-answer="${j}">${esc(o)}</button>`).join('')}</div>`).join('')}<button class="ac-primary" id="acSubmit">COMPROBAR RESPUESTAS</button><div id="acFeedback"></div>`}
    ];
  }
  function renderLesson(l, startAt=0){
    const slides=lessonSlides(l);let current=Math.max(0,Math.min(startAt,slides.length-1));
    const box=openScreen(`LECCIÓN ${l.id.slice(-2)}`,`<article class="ac-lesson ac-lesson-paged"><div class="ac-lesson-row"><span class="ac-pill">UNIDAD ${l.unitNumber} · LECCIÓN ${l.id.slice(-2)}</span><button class="ac-back" id="acBack">← RUTA</button></div><h2 class="ac-course-title">${esc(l.title)}</h2><p class="ac-course-objective">${esc(l.objective)}</p><div class="ac-shifu-mentor"><img src="Panda%20Shifu.gif" alt="Panda Shifu, mentor de Academy"><div><strong>PANDA SHIFU · MENTOR</strong><span>“La paciencia convierte cada sonido en conocimiento. ¡Vamos paso a paso!”</span></div></div><div class="ac-slide-progress"><span id="acSlideProgress"></span></div><div class="ac-slide-counter" id="acSlideCounter"></div><section class="ac-slide-content" id="acSlideContent"></section><div class="ac-slide-nav"><button class="ac-secondary" id="acPrev">← ANTERIOR</button><button class="ac-primary" id="acNext">SIGUIENTE →</button></div></article>`);
    const show=()=>{
      const s=slides[current];$('#acSlideContent',box).innerHTML=`<div class="ac-slide-kicker">${esc(s.kicker)}</div><h3 class="ac-slide-title">${esc(s.title)}</h3>${s.body}`;
      $('#acSlideCounter',box).textContent=`PANTALLA ${current+1} DE ${slides.length}`;
      $('#acSlideProgress',box).style.width=`${(current+1)/slides.length*100}%`;
      $('#acPrev',box).disabled=current===0;
      $('#acNext',box).textContent=current===slides.length-1?'FINALIZAR →':'SIGUIENTE →';
      $('#acNext',box).style.display=current===slides.length-1?'none':'block';
      $('#acPrev',box).style.display='block';
      box.querySelectorAll('[data-say]').forEach(b=>b.addEventListener('click',()=>{if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.say);u.lang='zh-CN';speechSynthesis.speak(u);}else alert('Este navegador no tiene síntesis de voz disponible.');}));
      box.querySelectorAll('.ac-question').forEach(q=>q.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{q.querySelectorAll('[data-answer]').forEach(x=>x.classList.remove('chosen'));b.classList.add('chosen');q.dataset.selected=b.dataset.answer;})));
      $('#acSubmit',box)?.addEventListener('click',()=>submit(l));
    };
    $('#acBack',box).addEventListener('click',()=>{activeLesson={unitId:l.unitId};renderUnit(l.unitId);});
    $('#acPrev',box).addEventListener('click',()=>{if(current>0){current--;show();box.scrollTop=0;}});
    $('#acNext',box).addEventListener('click',()=>{if(current<slides.length-1){current++;show();box.scrollTop=0;}});
    show();
  }
  function submit(l){
    const box=$('#oberon-academy-overlay .ac-screen-body'),answers={};
    l.practice.exercises.forEach(q=>{const selected=$(`[data-q="${q.id}"]`,box)?.dataset.selected;if(selected!==undefined)answers[q.id]=Number(selected);});
    if(Object.keys(answers).length!==l.practice.exercises.length){$('#acFeedback',box).innerHTML='<div class="ac-result">Completa todas las preguntas antes de comprobar tus respuestas.</div>';return;}
    const result=engine().evaluate(l,answers);
    const explanations=l.practice.exercises.map(q=>`<p>${answers[q.id]===q.answer?'✓':'✕'} ${esc(q.explanation)}</p>`).join('');
    $('#acFeedback',box).innerHTML=`<div class="ac-result"><strong>${result.score}% · ${result.passed?'¡Lección dominada!':'Necesitas un pequeño refuerzo.'}</strong>${explanations}<p style="margin-top:8px">${result.passed?'Tu avance quedó guardado. La siguiente lección disponible ya está desbloqueada.':'Tu progreso no se borra. Puedes volver a intentarlo y reforzar el punto que falló.'}</p><button class="ac-primary" id="acFinish">${result.passed?'VOLVER A LA RUTA':'VOLVER A INTENTAR'}</button></div>`;
    $('#acSubmit',box).disabled=true;
    $('#acFinish',box).addEventListener('click',()=>{if(result.passed){activeLesson={unitId:l.unitId};renderUnit(l.unitId);}else renderLesson(l);});
  }
  window.ZIDONG_ACADEMY_TRACKS=window.ZIDONG_ACADEMY_TRACKS||{};
  window.switchAcademyTrack=()=>render();
  window.selectAcademyLesson=id=>openLesson(id);
  window.renderAcademyView=render;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
