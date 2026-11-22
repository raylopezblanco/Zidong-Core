/* ==========================================================================
   ZIDONG CORE - ACHIEVEMENTS REPOSITORY
   Logros estilo Xbox con Gamerscore G para progresión industrial.
   ========================================================================== */

window.ZidongAchievements = [
    {
        id: "ach_welcome",
        title: "Bienvenido a OBERON",
        desc: "Supera el protocolo de inicialización de 6s.",
        score: 100,
        icon: "🪐",
        unlocked: (data) => true
    },
    {
        id: "ach_first_circuit",
        title: "Primer Circuito Energizado",
        desc: "Domina tu primer componente técnico en modo carrera.",
        score: 100,
        icon: "⚡",
        unlocked: (data) => data.completedActivities.length >= 1
    },
    {
        id: "ach_voltaria",
        title: "Maestría en Voltaria",
        desc: "Domina 3 componentes de potencia eléctrica.",
        score: 150,
        icon: "🔌",
        unlocked: (data) => data.completedActivities.filter(id => id.startsWith("w1_")).length >= 3
    },
    {
        id: "ach_kinetix",
        title: "Cinemática de Kinetix",
        desc: "Calibra un servomotor en el Planeta Kinetix.",
        score: 150,
        icon: "⚙️",
        unlocked: (data) => data.completedActivities.some(id => ["w2_01", "w2_02", "w2_03"].includes(id))
    },
    {
        id: "ach_survivor_hero",
        title: "Ingeniero de Choque (18s)",
        desc: "Salva la línea antes de los 18 segundos en Survivor.",
        score: 200,
        icon: "🚨",
        unlocked: (data) => Number(localStorage.getItem("zidong_survivor_wins") || 0) >= 1
    },
    {
        id: "ach_ai_tamer",
        title: "Cerebro de Silicio Vencido",
        desc: "Derrota a la IA en Duelo 1v1 Battle.",
        score: 200,
        icon: "⚔️",
        unlocked: (data) => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1
    },
    {
        id: "ach_ai_master",
        title: "Pesadilla de la IA",
        desc: "Derrota a la máquina 3 veces en 1v1.",
        score: 300,
        icon: "👑",
        unlocked: (data) => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 3
    },
    {
        id: "ach_overclock",
        title: "Calibración Overclock",
        desc: "Consigue 3 estrellas ⭐⭐⭐ en cualquier test.",
        score: 150,
        icon: "⭐",
        unlocked: (data) => Object.values(data.nodeStars || {}).some(s => s >= 3)
    },
    {
        id: "ach_technician",
        title: "Rango Técnico Jr Alcanzado",
        desc: "Acumula más de 7,000 XP en tu historial.",
        score: 150,
        icon: "📈",
        unlocked: (data) => (data.xp || 0) >= 7000
    }
];

(() => {
    "use strict";

    window.getPlantAchievements = function(userData, rankCalcFn) {
        const ud = userData || {};
        const completed = Array.isArray(ud.completedActivities) ? ud.completedActivities : [];
        const worlds = Array.isArray(window.ZIDONG_WORLDS_CONFIG) ? window.ZIDONG_WORLDS_CONFIG : [];
        const w1Acts = (worlds[0] && Array.isArray(worlds[0].activities)) ? worlds[0].activities : [];
        const rankLevel = typeof rankCalcFn === "function" ? rankCalcFn(ud.xp || 0).level : (ud.level || 1);

        return [
            {
                id: "b_first_step",
                icon: "🚀",
                name: "Primeros Pasos",
                desc: "Completa tu primera lección en cualquier mundo.",
                isUnlocked: () => completed.length >= 1
            },
            {
                id: "b_volt_master",
                icon: "⚡",
                name: "Electricista Oberon",
                desc: "Domina todas las lecciones del Mundo Eléctrico.",
                isUnlocked: () => w1Acts.length > 0 && w1Acts.every(a => completed.includes(a.id))
            },
            {
                id: "b_mechanic",
                icon: "⚙️",
                name: "Manos a la Máquina",
                desc: "Supera el checkpoint del Mundo Mecánico.",
                isUnlocked: () => completed.includes("w2_a4")
            },
            {
                id: "b_ai_slayer",
                icon: "⚔️",
                name: "Derrotador de IA",
                desc: "Vence a la IA en el duelo 1v1 Battle",
                isUnlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1
            },
            {
                id: "b_survivor",
                icon: "⚠️",
                name: "Defensor del Núcleo",
                desc: "Retira con éxito al menos 5 alarmas en Survivor Mode.",
                isUnlocked: () => Number(localStorage.getItem("zidong_survivor_cleared") || 0) >= 5
            },
            {
                id: "b_polyglot",
                icon: "🧠",
                name: "Soporte Bilingüe",
                desc: "Alcanza el Nivel 3 de rango o superior.",
                isUnlocked: () => rankLevel >= 3
            },
            {
                id: "b_swap_combo",
                icon: "🧩",
                name: "Pulso de Rejilla x2",
                desc: "Alcanza al menos un combo x2 o superior en Hanzi-Swap.",
                isUnlocked: () => Number(localStorage.getItem("zidong_swap_max_combo") || 0) >= 2
            }
        ];
    };
})();
