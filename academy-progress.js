/* OBERON ACADEMY · PERSISTENCIA */
(() => {
  'use strict';
  const KEY = 'oberon_academy_progress_v1';
  const fresh = () => ({version:1, lessons:{}, units:{}, lastLessonId:null});
  function load(){
    try { const parsed=JSON.parse(localStorage.getItem(KEY)); return parsed && parsed.version===1 ? {...fresh(),...parsed} : fresh(); }
    catch(e){ return fresh(); }
  }
  let state=load();
  function save(){ try { localStorage.setItem(KEY,JSON.stringify(state)); } catch(e){ console.warn('Academy: no se pudo guardar el progreso',e); } }
  function lesson(id){ return state.lessons[id] || {status:'locked',score:null,attempts:0,errors:{},lastReview:null,nextReview:null}; }
  function setLesson(id, patch){ state.lessons[id]={...lesson(id),...patch}; save(); return state.lessons[id]; }
  function recordAttempt(id, score, errors){
    const old=lesson(id), merged={...old.errors};
    Object.entries(errors||{}).forEach(([tag,count])=>merged[tag]=(merged[tag]||0)+count);
    const mastered=score>=80;
    setLesson(id,{status:mastered?'mastered':'needs_review',score,attempts:(old.attempts||0)+1,errors:merged,lastReview:new Date().toISOString(),nextReview:new Date(Date.now()+(mastered?86400000:2*3600000)).toISOString()});
    state.lastLessonId=id; save();
  }
  function start(id){ const old=lesson(id); if(old.status==='locked') return; setLesson(id,{status:'in_progress'}); state.lastLessonId=id; save(); }
  function getState(){ return JSON.parse(JSON.stringify(state)); }
  function reset(){ state=fresh(); save(); }
  window.OBERON_ACADEMY_PROGRESS={load:getState,lesson,setLesson,recordAttempt,start,reset,save};
})();
