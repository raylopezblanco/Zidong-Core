/* OBERON · INTERFAZ DE CERTIFICACIÓN */
(() => {
 'use strict';
 let exam=null,answers={},position=0;
 const $=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function ensureModal(){
  if($('oberonCertificationModal'))return;
  const el=document.createElement('div');el.id='oberonCertificationModal';el.className='modal-overlay';
  el.style.cssText='display:none;position:fixed;inset:0;background:rgba(3,9,18,.92);backdrop-filter:blur(8px);z-index:1000000;justify-content:center;align-items:center;padding:14px;overflow:auto;';
  el.innerHTML=`<div style="width:min(520px,100%);max-height:92vh;overflow:auto;background:linear-gradient(145deg,#0b1424,#142640);border:1.5px solid var(--cyan,#00e5ff);border-radius:18px;padding:20px;color:#fff;box-shadow:0 15px 45px #0009;">
   <div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span style="font-size:11px;color:var(--cyan);font-weight:900;letter-spacing:1px">CENTRO DE CERTIFICACIÓN</span><button id="certClose" style="background:none;border:0;color:#fff;font-size:24px">×</button></div>
   <div id="certBody" style="margin-top:16px"></div></div>`;
  document.body.appendChild(el);el.addEventListener('click',e=>{if(e.target===el)close();});$('certClose').onclick=close;
 }
 function open(){ensureModal();renderHome();$('oberonCertificationModal').style.display='flex';}
 function close(){if($('oberonCertificationModal'))$('oberonCertificationModal').style.display='none';}
 function nextRank(){const p=window.OBERON_PROGRESSION,u=window.getZidongUserData?.()||window.currentUserData;if(!p||!u)return null;const current=p.getRank(u);return p.ranks.find(r=>r.level===current.level+1)||null;}
 function renderHome(){
  const body=$('certBody'),engine=window.OBERON_CERTIFICATION_ENGINE,data=window.OBERON_CERTIFICATION_DATA;
  if(!body||!engine||!data)return;
  const rank=nextRank();
  if(!rank){body.innerHTML='<h2>👑 Máximo rango alcanzado</h2><p>Has completado las certificaciones disponibles de OBERON.</p>';return;}
  const meta=data.ranks.find(r=>r.level===rank.level),req=engine.requirements(rank),ok=req.every(x=>x.ok),record=engine.getRecord(rank.level);
  body.innerHTML=`<div style="font-size:34px">${meta?.icon||'🏅'}</div><h2 style="font-size:21px;margin:6px 0;color:var(--cyan)">${esc(meta?.name||rank.name)}</h2><p style="font-size:12px;color:#cbd5e1;margin-bottom:14px">«El rango se solicita. El conocimiento lo concede».</p>
   <h3 style="font-size:12px;color:var(--green);margin-bottom:8px">REQUISITOS DE ACCESO</h3>
   ${req.map(r=>`<div style="display:flex;justify-content:space-between;gap:8px;font-size:11px;padding:7px 0;border-bottom:1px solid #ffffff18"><span>${esc(r.label)}</span><b style="color:${r.ok?'#00f59b':'#ffb84d'}">${r.have}/${r.need} ${r.unit||''} ${r.ok?'✓':'·'}</b></div>`).join('')}
   <h3 style="font-size:12px;color:var(--green);margin:14px 0 7px">COMPETENCIAS A DEMOSTRAR</h3>
   <ul style="font-size:11px;color:#dbeafe;padding-left:19px;line-height:1.7">${(meta?.competencies||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
   <p style="font-size:11px;color:#aab8ca;margin:12px 0">Evaluación de ${engine.rules().questions} preguntas. Necesitas ${engine.rules().passScore} respuestas correctas. No pierdes XP ni rango si repruebas.</p>
   ${record?.passed?`<div style="padding:12px;border:1px solid #00f59b;border-radius:10px;color:#00f59b">✓ Certificación aprobada · ${record.score}%</div>`:
   `<button id="certStart" ${ok?'':'disabled'} style="width:100%;padding:14px;border:0;border-radius:12px;background:${ok?'var(--cyan,#00e5ff)':'#475569'};color:#071321;font-weight:900;margin-top:8px;opacity:${ok?1:.6}">${ok?'INICIAR CERTIFICACIÓN':'REQUISITOS PENDIENTES'}</button>`}`;
  if($('certStart'))$('certStart').onclick=()=>start(rank.level);
 }
 function start(level){
  const created=window.OBERON_CERTIFICATION_ENGINE.createExam(level);
  if(!created.ok){renderHome();return;}
  exam=created;answers={};position=0;renderQuestion();
 }
 function renderQuestion(){
  const body=$('certBody'),q=exam.questions[position];
  body.innerHTML=`<div style="display:flex;justify-content:space-between;color:var(--cyan);font-size:11px;font-weight:900"><span>CERTIFICACIÓN · NIVEL ${exam.level}</span><span>${position+1}/${exam.questions.length}</span></div>
   <div style="height:5px;background:#ffffff18;border-radius:8px;margin:10px 0 18px"><div style="height:5px;width:${(position+1)/exam.questions.length*100}%;background:var(--cyan);border-radius:8px"></div></div>
   <small style="color:var(--green);font-weight:800">${esc(q.category)}</small><h2 style="font-size:17px;line-height:1.45;margin:9px 0 16px">${esc(q.q)}</h2>
   <div style="display:grid;gap:9px">${q.options.map(o=>`<button data-answer="${esc(o.text)}" style="text-align:left;padding:13px;border-radius:11px;border:1px solid #ffffff2b;background:${answers[q.id]===o.text?'rgba(0,229,255,.16)':'#ffffff08'};color:#fff;font-size:13px">${esc(o.text)}</button>`).join('')}</div>
   <button id="certNext" ${answers[q.id]?'':'disabled'} style="width:100%;padding:13px;margin-top:16px;border:0;border-radius:11px;background:var(--cyan);color:#071321;font-weight:900;opacity:${answers[q.id]?1:.5}">${position===exam.questions.length-1?'FINALIZAR EVALUACIÓN':'SIGUIENTE →'}</button>`;
  body.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{answers[q.id]=b.dataset.answer;renderQuestion();});
  $('certNext').onclick=()=>{if(!answers[q.id])return;if(position<exam.questions.length-1){position++;renderQuestion();}else finish();};
 }
 function finish(){
  const result=window.OBERON_CERTIFICATION_ENGINE.grade(exam,answers);exam=null;
  const body=$('certBody');
  body.innerHTML=`<div style="text-align:center"><div style="font-size:48px">${result.passed?'🏅':'🧠'}</div><h2 style="color:${result.passed?'#00f59b':'#ffbf69'};font-size:22px">${result.passed?'CERTIFICACIÓN APROBADA':'AÚN NO CERTIFICADO'}</h2><div style="font-size:34px;font-weight:900;margin:8px">${result.correct}/${result.total}</div><p style="color:#cbd5e1;font-size:12px">${result.passed?'El conocimiento demostrado autoriza tu ascenso.':'No pierdes XP ni tu rango. Revisa los comentarios y vuelve a intentarlo.'}</p></div>
   ${result.details.map(d=>`<div style="padding:10px;margin-top:8px;border-radius:9px;background:#ffffff08;border-left:3px solid ${d.ok?'#00f59b':'#ffb84d'}"><b style="font-size:11px">${d.ok?'✓':'↻'} ${esc(d.question)}</b><p style="font-size:10px;color:#cbd5e1;margin-top:4px">Tu respuesta: ${esc(d.selected||'Sin respuesta')}<br>Correcta: ${esc(d.correct)}<br>${esc(d.explanation)}</p></div>`).join('')}
   <button id="certDone" style="width:100%;padding:13px;margin-top:14px;border:0;border-radius:11px;background:var(--cyan);color:#071321;font-weight:900">${result.passed?'VER MI NUEVO RANGO':'VOLVER AL CENTRO'}</button>`;
  $('certDone').onclick=()=>{close();if(typeof window.updateProfile==='function')window.updateProfile();if(result.passed&&window.showCyberAlert)window.showCyberAlert('ASCENSO AUTORIZADO','¡Certificación aprobada! Tu nuevo rango ya está registrado.','🏅');};
 }
 window.openOberonCertification=open;
 document.addEventListener('DOMContentLoaded',()=>{
  const profile=document.getElementById('profile');
  if(profile&&!document.getElementById('openOberonCertification')){
   const panel=document.createElement('div');panel.className='panel';panel.style.cssText='background:var(--surface);border:1px solid var(--cyan);border-radius:14px;padding:14px;margin-bottom:10px;';
   panel.innerHTML='<h3 style="font-size:12px;color:var(--cyan);margin-bottom:7px">🏅 CERTIFICACIONES OBERON</h3><p style="font-size:11px;color:var(--muted);margin-bottom:10px">Demuestra lo que sabes y acredita tu siguiente rango.</p><button id="openOberonCertification" style="width:100%;padding:12px;border:0;border-radius:10px;background:var(--cyan);color:#071321;font-weight:900">VER CERTIFICACIÓN DISPONIBLE</button>';
   const anchor=profile.querySelector('.profile-card');anchor?.after(panel);$('openOberonCertification').onclick=open;
  }
 });
})();