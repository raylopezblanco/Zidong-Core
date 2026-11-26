/* OBERON · MOTOR DE CERTIFICACIONES */
(() => {
 'use strict';
 const KEY='oberon_certifications_v1';
 const rules=()=>window.OBERON_CERTIFICATION_DATA?.examRules||{questions:10,passScore:8,reviewDelayMinutes:5};
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(_){return {};}}
 function save(data){try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){console.warn('No se pudo guardar la certificación',e);}}
 function getRecord(level){return load()[String(level)]||null;}
 function isCertified(level){const r=getRecord(level);return !!(r&&r.passed===true);}
 function requirements(rank){
  const user=window.getZidongUserData?.()||window.currentUserData||{};
  return window.OBERON_PROGRESSION?.getRequirements(user,rank)||[];
 }
 function canAttempt(level){
  const rank=window.OBERON_CERTIFICATION_DATA?.ranks.find(r=>r.level===level);
  if(!rank||level<=1||isCertified(level))return false;
  const ladder=window.OBERON_PROGRESSION?.ranks||[];
  const rankInfo=ladder.find(r=>r.level===level);
  return !!rankInfo&&requirements(rankInfo).every(x=>x.ok);
 }
 function createExam(level){
  if(!canAttempt(level))return {ok:false,reason:isCertified(level)?'already':'requirements'};
  const bank=window.OBERON_CERTIFICATION_BANK||[];
  const eligible=bank.filter(q=>q.minRank<=level);
  if(eligible.length<rules().questions)return {ok:false,reason:'bank'};
  const shuffled=[...eligible].sort(()=>Math.random()-.5);
  return {ok:true,level,questions:shuffled.slice(0,rules().questions).map(q=>({...q,options:q.o.map((v,i)=>({text:v,index:i})).sort(()=>Math.random()-.5)})).map(q=>({...q,correctText:q.o[q.a]}))};
 }
 function grade(exam,answers){
  let correct=0;
  const detail=exam.questions.map(q=>{
   const selected=answers[q.id];
   const ok=selected===q.correctText;
   if(ok)correct++;
   return {id:q.id,category:q.category,question:q.q,selected:selected??null,correct:q.correctText,ok,explanation:q.e};
  });
  const total=exam.questions.length,score=Math.round(correct/total*100),passed=correct>=rules().passScore;
  const result={level:exam.level,correct,total,score,passed,details:detail,date:new Date().toISOString()};
  if(passed){
   const data=load();
   data[String(exam.level)]={passed:true,score,correct,total,date:result.date,competencies:window.OBERON_CERTIFICATION_DATA.ranks.find(r=>r.level===exam.level)?.competencies||[]};
   save(data);
   const user=window.getZidongUserData?.()||window.currentUserData;
   if(user&&window.OBERON_PROGRESSION?.save)window.OBERON_PROGRESSION.save(user);
  }
  return result;
 }
 function getAll(){return load();}
 window.OBERON_CERTIFICATION_ENGINE={getRecord,isCertified,canAttempt,createExam,grade,getAll,requirements,rules};
})();