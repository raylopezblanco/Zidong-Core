/* OBERON · MATRIZ DE COMPETENCIAS Y CERTIFICACIONES */
(() => {
  'use strict';
  const ranks = [
    {level:1,name:'Cadete',icon:'🛰️',competencies:['Reconoce el propósito de Hanzi y Pinyin.','Identifica los tonos básicos.']},
    {level:2,name:'Técnico auxiliar',icon:'🔧',competencies:['Reconoce Hanzi y Pinyin básicos.','Relaciona sonidos, tonos y significados.','Comprende frases sencillas.']},
    {level:3,name:'Técnico especializado',icon:'⚙️',competencies:['Interpreta vocabulario frecuente.','Reconoce estructuras gramaticales básicas.','Comprende instrucciones cortas.']},
    {level:4,name:'Ingeniero',icon:'🧠',competencies:['Interpreta oraciones funcionales.','Comprende vocabulario técnico contextual.','Aplica negación, preguntas y orden de palabras.']},
    {level:5,name:'Ingeniero sénior',icon:'🚀',competencies:['Integra vocabulario de varias áreas.','Interpreta mensajes laborales breves.','Resuelve situaciones con contexto.']},
    {level:6,name:'Comandante',icon:'🛡️',competencies:['Demuestra comprensión transversal.','Distingue matices de instrucciones y estados.','Aplica el idioma en escenarios nuevos.']},
    {level:7,name:'Guardián de OBERON',icon:'👑',competencies:['Integra lectura, gramática y vocabulario.','Interpreta comunicaciones técnicas complejas.','Demuestra dominio sostenido.']}
  ];
  const examRules = {questions:10,passScore:8,reviewDelayMinutes:5};
  window.OBERON_CERTIFICATION_DATA = {ranks,examRules};
})();