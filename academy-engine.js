/* OBERON ACADEMY · Motor de secuencia, dominio y refuerzo. */
(() => {
  'use strict';
  const curriculum=()=>window.OBERON_ACADEMY_CURRICULUM;
  const progress=()=>window.OBERON_ACADEMY_PROGRESS;
  const allLessons=()=>curriculum().units.flatMap(u=>u.lessons);
  function status(l){
    const p=progress().lesson(l.id);
    if(p.status==='mastered')return 'mastered';
    if(p.status==='needs_review')return 'needs_review';
    if(p.status==='in_progress')return 'in_progress';
    const unit=curriculum().units.find(u=>u.id===l.unitId);
    const index=unit.lessons.findIndex(x=>x.id===l.id);
    if(index===0){return l.status==='ready'?'available':'locked';}
    const prev=unit.lessons[index-1];
    return progress().lesson(prev.id).status==='mastered'?(l.status==='ready'?'available':'locked'):'locked';
  }
  function nextRecommended(){
    for(const u of curriculum().units){
      for(const l of u.lessons){
        if(l.status==='ready'&&['available','in_progress','needs_review'].includes(status(l)))return l;
      }
    }
    return null;
  }
  function unitProgress(u){const mastered=u.lessons.filter(l=>progress().lesson(l.id).status==='mastered').length;return {mastered,total:u.lessons.length,percent:Math.round(mastered/u.lessons.length*100)};}
  function evaluate(l,answers){
    let correct=0;const failedTags=[];
    l.practice.exercises.forEach(q=>{if(answers[q.id]===q.answer)correct++;else failedTags.push(q.tag||'fundamentals');});
    const score=Math.round(correct/l.practice.exercises.length*100),passed=score>=75;
    const result={score,passed,correct,total:l.practice.exercises.length,failedTags};
    progress().record(l.id,result);
    if(passed){const unit=curriculum().units.find(u=>u.id===l.unitId),i=unit.lessons.findIndex(x=>x.id===l.id),next=unit.lessons[i+1];if(next&&next.status==='ready')progress().unlock(next.id);}
    return result;
  }
  function allMastered(){return allLessons().filter(l=>progress().lesson(l.id).status==='mastered').length;}
  window.OBERON_ACADEMY_ENGINE={allLessons,status,nextRecommended,unitProgress,evaluate,allMastered};
})();
