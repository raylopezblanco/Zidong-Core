/* ==========================================================================
   ZIDONG CORE - MEDALS & BADGES REPOSITORY
   Definición de medallas de honor técnico estilo militar/sci-fi para avatar.
   ========================================================================== */

window.ZidongMedals = [
    {
        id: "b_practicante",
        icon: "🔰",
        name: "Practicante de Automatización",
        desc: "Insignia oficial de bienvenida al sistema OBERON",
        isUnlocked: (progress) => true
    },
    {
        id: "badge_voltaria",
        icon: "⚡",
        name: "Conquistador de Voltaria",
        desc: "Supera el Boss Checkpoint del Mundo Eléctrico",
        isUnlocked: (progress) => Boolean(progress.career.bossBeaten && progress.career.bossBeaten["boss_world_1"])
    },
    {
        id: "badge_kinetix",
        icon: "⚙️",
        name: "Engranaje de Kinetix",
        desc: "Supera el Boss Checkpoint del Mundo Mecánico",
        isUnlocked: (progress) => Boolean(progress.career.bossBeaten && progress.career.bossBeaten["boss_world_2"])
    },
    {
        id: "badge_aethel",
        icon: "💨",
        name: "Maestro Neumático",
        desc: "Supera el Boss Checkpoint del Mundo Neumático",
        isUnlocked: (progress) => Boolean(progress.career.bossBeaten && progress.career.bossBeaten["boss_world_3"])
    },
    {
        id: "badge_machina",
        icon: "🤖",
        name: "Arquitecto de Machina",
        desc: "Supera el Boss Checkpoint del Mundo Robótico",
        isUnlocked: (progress) => Boolean(progress.career.bossBeaten && progress.career.bossBeaten["boss_world_4"])
    },
    {
        id: "badge_lumina",
        icon: "👁️",
        name: "Ojo de Lumina",
        desc: "Supera el Boss Checkpoint del Mundo Visión AOI",
        isUnlocked: (progress) => Boolean(progress.career.bossBeaten && progress.career.bossBeaten["boss_world_5"])
    },
    {
        id: "b_ai_slayer",
        icon: "⚔️",
        name: "Derrotador de IA",
        desc: "Vence a la IA en el duelo 1v1 Battle al menos 1 vez",
        isUnlocked: (progress) => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1
    },
    {
        id: "b_troubleshooter",
        icon: "🚨",
        name: "Solucionador de Fallas",
        desc: "Retira al menos 1 alarma en Survivor Mode",
        isUnlocked: (progress) => Number(localStorage.getItem("zidong_survivor_wins") || 0) >= 1
    },
    {
        id: "b_overclock",
        icon: "⭐",
        name: "Overclock 3★",
        desc: "Consigue 3 estrellas en cualquier test",
        isUnlocked: (progress) => Object.values(progress.career.nodeStars || {}).some(s => s >= 3)
    },
    {
        id: "b_dragon",
        icon: "龍",
        name: "Dragón Zìdòng",
        desc: "Fundador legendario de la academia técnica",
        isUnlocked: (progress) => true
    }
];
