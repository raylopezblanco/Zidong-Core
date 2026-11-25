/* OBERON · PROGRESIÓN EQUILIBRADA POR COMPETENCIAS
   XP acompaña el avance; los rangos se certifican con conocimientos demostrados. */
(() => {
  'use strict';
  const STORAGE_KEY = 'oberon_player_progress_v1';
  const ranks = [
    { level: 1, name: 'Cadete', icon: '🛰️', minXp: 0, activities: 0, academy: 0, worlds: 0, bosses: 0, desc: 'Iniciaste tu entrenamiento y reconoces tus primeras señales.' },
    { level: 2, name: 'Técnico auxiliar', icon: '🔧', minXp: 300, activities: 3, academy: 0, worlds: 0, bosses: 0, desc: 'Reconoces vocabulario técnico básico y sus Hanzi.' },
    { level: 3, name: 'Técnico especializado', icon: '⚙️', minXp: 900, activities: 8, academy: 2, worlds: 1, bosses: 0, desc: 'Comprendes vocabulario de un área y fundamentos del idioma.' },
    { level: 4, name: 'Ingeniero', icon: '🧠', minXp: 1800, activities: 12, academy: 6, worlds: 2, bosses: 0, desc: 'Relacionas vocabulario técnico con estructuras reales del mandarín.' },
    { level: 5, name: 'Ingeniero sénior', icon: '🚀', minXp: 3000, activities: 18, academy: 12, worlds: 3, bosses: 1, desc: 'Interpretas información de varias especialidades y resuelves retos.' },
    { level: 6, name: 'Comandante', icon: '🛡️', minXp: 4500, activities: 22, academy: 18, worlds: 4, bosses: 3, desc: 'Demuestras comprensión transversal y criterio en situaciones técnicas.' },
    { level: 7, name: 'Guardián de OBERON', icon: '👑', minXp: 6500, activities: 22, academy: 24, worlds: 5, bosses: 5, desc: 'Dominas el conocimiento disponible y mantienes tus competencias.' }
  ];

  function getAcademyMasteredCount() {
    try {
      const state = window.OBERON_ACADEMY_PROGRESS?.load?.();
      return Object.values(state?.lessons || {}).filter(x => x && x.status === 'mastered' && Number(x.score) >= 80).length;
    } catch (_) { return 0; }
  }
  function getEvidence(user) {
    const completed = Array.isArray(user?.completedActivities) ? user.completedActivities : [];
    const worlds = Array.isArray(window.ZIDONG_WORLDS_CONFIG) ? window.ZIDONG_WORLDS_CONFIG : [];
    let activities = 0, masteredWorlds = 0;
    worlds.forEach(world => {
      const acts = Array.isArray(world.activities) ? world.activities : [];
      const done = acts.filter(a => completed.includes(a.id)).length;
      activities += done;
      if (acts.length && done === acts.length) masteredWorlds++;
    });
    const bosses = worlds.filter(w => w.boss?.id && completed.includes(w.boss.id)).length;
    return { activities, academy: getAcademyMasteredCount(), worlds: masteredWorlds, bosses };
  }
  function getRequirements(user, rank) {
    const e = getEvidence(user);
    const xp = Number(user?.xp) || 0;
    return [
      { label: 'XP acumulada', have: xp, need: rank.minXp, ok: xp >= rank.minXp, unit: 'XP' },
      { label: 'Actividades técnicas completadas', have: e.activities, need: rank.activities, ok: e.activities >= rank.activities },
      { label: 'Lecciones Academy dominadas', have: e.academy, need: rank.academy, ok: e.academy >= rank.academy },
      { label: 'Mundos completados', have: e.worlds, need: rank.worlds, ok: e.worlds >= rank.worlds },
      { label: 'Jefes superados', have: e.bosses, need: rank.bosses, ok: e.bosses >= rank.bosses }
    ];
  }
  function isQualified(user, rank) { return getRequirements(user, rank).every(r => r.ok); }
  function getRank(user) {
    let current = ranks[0];
    for (const rank of ranks) if (isQualified(user, rank)) current = rank;
    return current;
  }
  function getNextRank(user) {
    const current = getRank(user);
    return ranks.find(r => r.level === current.level + 1) || null;
  }
  function hydrate(user) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return;
      if (Number.isFinite(saved.xp)) user.xp = Math.max(Number(user.xp) || 0, saved.xp);
      if (Array.isArray(saved.completedActivities)) user.completedActivities = [...new Set([...(user.completedActivities || []), ...saved.completedActivities])];
    } catch (_) {}
  }
  function save(user) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        xp: Number(user?.xp) || 0,
        completedActivities: Array.isArray(user?.completedActivities) ? user.completedActivities : [],
        savedAt: new Date().toISOString()
      }));
    } catch (_) {}
  }
  window.OBERON_PROGRESSION = { ranks, getEvidence, getRequirements, getRank, getNextRank, hydrate, save };
})();
