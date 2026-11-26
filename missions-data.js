/* OBERON MISSIONS · CATÁLOGO EDITABLE */
(() => {
  'use strict';
  window.OBERON_MISSIONS_DATA = {
    daily: [
      { id:'daily_world_activity', title:'Reactivar un sector', desc:'Completa una actividad de cualquier mundo.', event:'world_activity', goal:1, xp:25, icon:'🌍' },
      { id:'daily_duel', title:'Duelo de entrenamiento', desc:'Gana una batalla 1v1.', event:'duel_win', goal:1, xp:30, icon:'⚔️' },
      { id:'daily_puzzle', title:'Reconstrucción de Hanzi', desc:'Forma 2 palabras en Puzzle.', event:'puzzle_clear', goal:2, xp:25, icon:'🧩' }
    ],
    academy: [
      { id:'academy_lesson', title:'Protocolo de aprendizaje', desc:'Domina una lección de Academy.', event:'academy_mastery', goal:1, xp:35, icon:'📚' }
    ],
    weekly: [
      { id:'weekly_worlds', title:'Estabilizar OBERON', desc:'Completa 5 actividades de los mundos.', event:'world_activity', goal:5, xp:70, icon:'🪐' },
      { id:'weekly_survival', title:'Defensa del núcleo', desc:'Retira 5 alarmas en Survival.', event:'survival_clear', goal:5, xp:70, icon:'🛡️' }
    ]
  };
})();