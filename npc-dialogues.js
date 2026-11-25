/* ==========================================================================
   ZIDONG CORE - NPC DIALOGUES MODULE
   Centraliza los diálogos y frases de personajes (Cyberdog, etc.).
   ========================================================================== */

(() => {
    "use strict";

    const DEFAULT_COMPANION_PHRASES = [
        "GRAMÁTICA · 是 (shì) = ser. Úsalo para identificar: 我是工程师 (wǒ shì gōngchéngshī) = Soy ingeniero.",
        "GRAMÁTICA · Para negar con 不 (bù), colócalo antes del verbo: 不工作 (bù gōngzuò) = No funciona.",
        "GRAMÁTICA · ¿Pregunta de sí/no? Añade 吗 (ma) al final: 这是传感器吗？= ¿Esto es un sensor?",
        "GRAMÁTICA · 的 (de) conecta posesión o descripción: 机器的电源 (jīqì de diànyuán) = la fuente de alimentación de la máquina.",
        "GRAMÁTICA · Orden básico: sujeto + verbo + objeto. 我检查设备 (wǒ jiǎnchá shèbèi) = Yo reviso el equipo.",
        "GRAMÁTICA · Los adjetivos pueden ir con 很 (hěn): 机器很大 (jīqì hěn dà) = La máquina es grande.",
        "GRAMÁTICA · 个 (gè) es un clasificador común: 一个传感器 (yí ge chuángǎnqì) = un sensor.",
        "GRAMÁTICA · El tiempo suele ir antes del verbo: 今天我检查机器 (jīntiān wǒ jiǎnchá jīqì) = Hoy reviso la máquina.",
        "GRAMÁTICA · 了 (le) puede marcar una acción completada: 我修好了 (wǒ xiū hǎo le) = Ya lo reparé.",
        "GRAMÁTICA · Para decir dónde está algo usa 在 (zài): 工具在这里 (gōngjù zài zhèlǐ) = La herramienta está aquí."
    ];

    window.ZIDONG_NPC_DIALOGUES = {
        companion: DEFAULT_COMPANION_PHRASES
    };

    window.getCompanionPhrases = function(userName = "") {
        const baseList = Array.isArray(window.ZIDONG_NPC_DIALOGUES?.companion) && window.ZIDONG_NPC_DIALOGUES.companion.length > 0
            ? window.ZIDONG_NPC_DIALOGUES.companion
            : DEFAULT_COMPANION_PHRASES;

        return [...baseList];
    };
})();
