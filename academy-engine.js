/* OBERON ACADEMY · MOTOR DE APRENDIZAJE */
(() => {
  'use strict';
  const curriculum=()=>window.OBERON_ACADEMY_CURRICULUM;
  const progress=()=>window.OBERON_ACADEMY_PROGRESS;
  function allLessons(){ return curriculum().units.flatMap(u=>u.lessons.map(l=>({...l,unitId:u.id,unitNumber:u.number}))); }
  function isUnlocked(lesson){
    const all=allLessons(), idx=all.findIndex(x=>x.id===lesson.id);
    if(idx===0) return true;
    const previous=all[idx-1];
    return previous && progress().lesson(previous.id).status==='mastered';
  }
  function status(lesson){
    const saved=progress().lesson(lesson.id);
    if(saved.status==='mastered'||saved.status==='in_progress'||saved.status==='needs_review') return saved.status;
    return isUnlocked(lesson)?'available':'locked';
  }
  function nextRecommended(){
    const all=allLessons();
    const review=all.find(l=>{const s=progress().lesson(l.id); return s.status==='needs_review' && s.nextReview && Date.now()>=Date.parse(s.nextReview);});
    if(review) return {...review,recommendation:'review'};
    return all.find(l=>status(l)==='available' && l.status==='ready') || all.find(l=>status(l)==='in_progress' && l.status==='ready') || null;
  }
  function unitProgress(unit){
    const mastered=unit.lessons.filter(l=>progress().lesson(l.id).status==='mastered').length;
    return {mastered,total:unit.lessons.length,percent:Math.round(mastered/unit.lessons.length*100)};
  }
  function evaluate(lesson,answers){
    const questions=lesson.practice?.exercises||[];
    let correct=0; const errors={};
    questions.forEach((q,i)=>{ if(answers[q.id]===q.answer) correct++; else errors[q.tag||'general']=(errors[q.tag||'general']||0)+1; });
    const score=questions.length?Math.round(correct/questions.length*100):0;
    progress().recordAttempt(lesson.id,score,errors);
    return {score,correct,total:questions.length,errors,passed:score>=80};
  }
  function unitMastery(unit){
    return unit.lessons.every(l=>progress().lesson(l.id).status==='mastered');
  }
  window.OBERON_ACADEMY_ENGINE={allLessons,isUnlocked,status,nextRecommended,unitProgress,evaluate,unitMastery};
})();
