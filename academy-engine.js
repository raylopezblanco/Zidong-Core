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
    // Modo exploración: todas las lecciones con contenido listo se pueden abrir.
    // No modifica el progreso ni marca lecciones como dominadas.
    return l.status==='ready' ? 'available' : 'locked';
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
    const score=Math.round(correct/l.practice.exercises.length*100),passed=score>=80;
    const errorCounts={};failedTags.forEach(tag=>errorCounts[tag]=(errorCounts[tag]||0)+1);
    progress().recordAttempt(l.id,score,errorCounts);
    return {score,passed,correct,total:l.practice.exercises.length,failedTags};
  }
  function allMastered(){return allLessons().filter(l=>progress().lesson(l.id).status==='mastered').length;}
  window.OBERON_ACADEMY_ENGINE={allLessons,status,nextRecommended,unitProgress,evaluate,allMastered};
})();
