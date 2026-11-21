/* ==========================================================================
   ZIDONG CORE - NPC DIALOGUES MODULE
   Centraliza los diálogos y frases de personajes (Cyberdog, etc.).
   ========================================================================== */

(() => {
    "use strict";

    const DEFAULT_COMPANION_PHRASES = [
        "¡Los VFDs Delta MS300 regulan la frecuencia de los motores en la línea de SMT! ⚡",
        "¿Sabías que 'diàn' (电) significa electricidad y se usa en casi todo término electrónico? 🔋",
        "El mantenimiento autónomo previene paros imprevistos en las máquinas Ersa Versaflow. ⚙️",
        "¡Revisa las electroválvulas SMC si notas caída de presión en los pistones neumáticos! 💨"
    ];

    window.ZIDONG_NPC_DIALOGUES = {
        companion: DEFAULT_COMPANION_PHRASES
    };

    window.getCompanionPhrases = function(userName = "") {
        const baseList = Array.isArray(window.ZIDONG_NPC_DIALOGUES?.companion) && window.ZIDONG_NPC_DIALOGUES.companion.length > 0
            ? window.ZIDONG_NPC_DIALOGUES.companion
            : DEFAULT_COMPANION_PHRASES;

        const cleanName = String(userName || "").trim();
        if (!cleanName || cleanName === "New user") {
            return [...baseList];
        }

        return [
            `¡Listo para el turno, ${cleanName}! Tócame si quieres otro dato técnico o de Hanzi. ⚡`,
            ...baseList
        ];
    };
})();
