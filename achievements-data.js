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
