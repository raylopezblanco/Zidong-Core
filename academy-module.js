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
    const body=openScreen(`UNIDAD ${u.number}`,`<section class="ac-detail"><div class="ac-lesson-row"><h3>${u.icon} ${esc(u.title)}</h3><span class="ac-pill">RUTA DE APRENDIZAJE</span></div><p class="ac-muted">${esc(u.description)}</p><div class="ac-lesson-list">${u.lessons.map(l=>{const st=engine().status(l),ready=l.status==='ready',enabled=st!=='locked'&&ready;const label=st==='mastered'?'DOMINADA':st==='needs_review'?'REPASO':st==='in_progress'?'EN CURSO':st==='locked'?'BLOQUEADA':ready?'DISPONIBLE':'EN PREPARACIÓN';return `<button class="ac-lesson-item" data-lesson="${l.id}" ${enabled?'':'disabled'}><span>${st==='mastered'?'✓':st==='locked'?'🔒':'◈'}</span><span style="flex:1"><strong>${esc(l.title)}</strong><small>${esc(l.objective)}</small></span><span class="ac-pill">${label}</span></button>`}).join('')}</div><p class="ac-muted" style="margin-top:14px">Las lecciones restantes se habilitarán cuando su contenido educativo esté completo y verificado.</p></section>`);
    body.querySelectorAll('[data-lesson]').forEach(b=>b.addEventListener('click',()=>openLesson(b.dataset.lesson)));
  }
  function openLesson(id){
    const lesson=engine().allLessons().find(l=>l.id===id);if(!lesson||lesson.status!=='ready'||engine().status(lesson)==='locked')return;
    progress().start(id);activeLesson={unitId:lesson.unitId,lessonId:id};renderLesson(lesson);
  }
  function renderLesson(l){
    const p=l.phases, exercises=l.practice.exercises;
    const box=openScreen(`LECCIÓN ${l.id.slice(-2)}`,`<article class="ac-lesson"><div class="ac-lesson-row"><span class="ac-pill">UNIDAD ${l.unitNumber} · LECCIÓN ${l.id.slice(-2)}</span><button class="ac-back" id="acBack">← RUTA</button></div><h3 style="margin-top:9px">${esc(l.title)}</h3><p class="ac-muted">${esc(l.objective)}</p>
      <div class="ac-card"><h4>01 · ${esc(p.discovery.title)}</h4><p>${esc(p.discovery.text)}</p><p style="margin-top:7px;color:var(--cyan)">${esc(p.discovery.key)}</p></div>
      <div class="ac-card"><h4>02 · ${esc(p.anatomy.title)}</h4>${p.anatomy.items.map(x=>`<p><strong>${esc(x.label)}:</strong> ${esc(x.detail)}</p>`).join('')}</div>
      <div class="ac-card"><h4>🧠 ${esc(p.memory.title)}</h4><p>${esc(p.memory.text)}</p></div>
      <div class="ac-card"><h4>📜 Origen histórico</h4><p>${esc(p.etymology.available?p.etymology.explanation:p.etymology.note)}</p></div>
      <div class="ac-card"><h4>03 · ${esc(p.pronunciation.title)}</h4>${p.pronunciation.examples.map(x=>`<div class="ac-example"><div><strong>${esc(x.hanzi)}</strong><span>${esc(x.pinyin)} · tono ${x.tone}</span><small class="ac-muted">${esc(x.meaning)}</small></div><button class="ac-audio" data-say="${esc(x.hanzi)}">▶ Escuchar</button></div>`).join('')}<p class="ac-muted">${esc(p.pronunciation.note)}</p></div>
      <div class="ac-card"><h4>04 · Ejemplos</h4>${p.examples.map(x=>`<div class="ac-example"><div><strong>${esc(x.hanzi)}</strong><span>${esc(x.pinyin)}</span><small class="ac-muted">${esc(x.meaning)}</small></div><button class="ac-audio" data-say="${esc(x.hanzi)}">▶ Escuchar</button></div>`).join('')}</div>
      <div class="ac-card"><h4>05 · Mini-práctica</h4><p>${esc(l.practice.instructions)}</p>${exercises.map((q,i)=>`<div class="ac-question" data-q="${q.id}"><p>${i+1}. ${esc(q.question)}</p>${q.audio?`<button class="ac-audio" data-say="${esc(q.audio)}">▶ Escuchar audio</button>`:''}${q.options.map((o,j)=>`<button class="ac-option" data-answer="${j}">${esc(o)}</button>`).join('')}</div>`).join('')}<button class="ac-primary" id="acSubmit">COMPROBAR RESPUESTAS</button><div id="acFeedback"></div></div>
      </article>`);
    $('#acBack',box).addEventListener('click',()=>{activeLesson={unitId:l.unitId};renderUnit(l.unitId);});
    box.querySelectorAll('[data-say]').forEach(b=>b.addEventListener('click',()=>{if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.say);u.lang='zh-CN';speechSynthesis.speak(u);}else alert('Este navegador no tiene síntesis de voz disponible.');}));
    box.querySelectorAll('.ac-question').forEach(q=>q.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{q.querySelectorAll('[data-answer]').forEach(x=>x.classList.remove('chosen'));b.classList.add('chosen');q.dataset.selected=b.dataset.answer;})));
    $('#acSubmit',box).addEventListener('click',()=>submit(l));
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
