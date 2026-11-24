/* OBERON ACADEMY · Persistencia local aislada del resto de Zìdòng Core. */
(() => {
  'use strict';
  const KEY='oberon_academy_progress_v1';
  const fresh=()=>({schema:1,lessons:{},updatedAt:new Date().toISOString()});
  let state;
  try { state=JSON.parse(localStorage.getItem(KEY)||'null'); } catch(_) { state=null; }
  if(!state||state.schema!==1||typeof state.lessons!=='object') state=fresh();
  const blank=()=>({status:'locked',attempts:0,bestScore:0,lastScore:null,errors:{},lastStudied:null,masteredAt:null});
  function lesson(id){if(!state.lessons[id])state.lessons[id]=blank();return state.lessons[id];}
  function save(){state.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){console.warn('OBERON Academy: no se pudo guardar el progreso.',e);}}
  function start(id){const p=lesson(id);if(p.status==='locked'||p.status==='available'||p.status==='needs_review')p.status='in_progress';p.lastStudied=new Date().toISOString();save();return p;}
  function record(id,result){const p=lesson(id);p.attempts++;p.lastScore=result.score;p.bestScore=Math.max(p.bestScore||0,result.score);p.lastStudied=new Date().toISOString();for(const tag of result.failedTags||[])p.errors[tag]=(p.errors[tag]||0)+1;if(result.passed){p.status='mastered';p.masteredAt=p.masteredAt||new Date().toISOString();}else{p.status='needs_review';}save();return p;}
  function unlock(id){const p=lesson(id);if(p.status==='locked')p.status='available';save();}
  function snapshot(){return JSON.parse(JSON.stringify(state));}
  window.OBERON_ACADEMY_PROGRESS={lesson,start,record,unlock,save,snapshot,key:KEY};
})();
