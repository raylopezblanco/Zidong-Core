/* OBERON · FRASES DE CYBERDOG: microdatos para repasar sin etiquetas. */
(() => {
    "use strict";
    const DEFAULT_COMPANION_PHRASES = [
        "En chino, primero suele ir el tiempo y después la acción: 我今天工作 (hoy trabajo). 🕒",
        "Para negar una acción habitual usa 不 (bù): 我不懂 (no entiendo). 🚫",
        "吗 (ma) al final convierte una afirmación en pregunta: 你忙吗？(¿estás ocupado?). ❔",
        "的 (de) conecta posesión o descripción: 我的机器 (mi máquina). 🔩",
        "是 (shì) relaciona identidad: 这是传感器 (esto es un sensor). 🧠",
        "在 (zài) indica dónde ocurre algo: 我在工厂 (estoy en la fábrica). 🏭",
        "了 (le) puede señalar que una acción ya ocurrió: 修好了 (ya quedó reparado). ✅",
        "En muchas frases, el orden básico es sujeto + verbo + objeto: 我检查机器 (reviso la máquina). ⚙️",
        "个 (gè) es un clasificador común: 一个工人 (un trabajador). 👷",
        "Los adjetivos pueden usar 很 (hěn): 机器很新 (la máquina es nueva). ✨"
    ];
    window.ZIDONG_NPC_DIALOGUES = { companion: DEFAULT_COMPANION_PHRASES };
    window.getCompanionPhrases = function(userName = "") {
        const base = [...DEFAULT_COMPANION_PHRASES];
        const cleanName = String(userName || "").trim();
        if (cleanName && cleanName !== "New user") base.unshift(`¡Buen turno, ${cleanName}! Recuerda: poco a poco también se domina un idioma. ⚡`);
        return base;
    };
})();
