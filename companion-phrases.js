/* ==========================================================================
   ZIDONG CORE - COMPANION PHRASES REPOSITORY
   Banco modular de diálogos, datos curiosos de Hanzi y respuestas reactivas.
   ========================================================================== */

window.ZidongPhrases = {
    /**
     * Genera la lista de frases para el Cyberdog según el nombre del usuario
     * @param {string} userName 
     * @returns {string[]} Frases formateadas a máximo 3 renglones
     */
    getPhrases: function(userName) {
        const rawName = (userName || "New user").trim();
        const isChilaquil = rawName.toLowerCase() === "chilaquil";

        // Diálogo reactivo al nombre
        const namePhrase = isChilaquil
            ? `Chilaquil... ¡jajaja te la creíste! Ahora sí te queda con ganas ese nombre 🐶🌶️`
            : `${rawName}... te quedaría mejor Chilaquil 🐶🔥`;

        return [
            namePhrase,
            `En 线 (cable), el radical 纟 significa seda/fibra. Indica siempre el material. 🧵`,
            `En 机 (máquina), 木 es madera y 几 es mesa: el concepto original de telar industrial. ⚙️`,
            `El carácter 电 (diàn) originalmente era el dibujo de un rayo cayendo de las nubes. ⚡`,
            `En chino no hay conjugaciones de verbos enredadas. Solo pones partículas como 了. 💡`,
            `El radical 钅 (metal) está en herramientas: 铁 (hierro), 钻 (broca), 钉 (perno). 🛠️`,
            `El carácter 门 (puerta) imita dos batientes de madera abiertos en una entrada. 🚪`,
            `En 气 (gas/aire), los trazos representan nubes en movimiento y vapor a presión. 💨`,
            `En 光 (luz), la parte superior es una llama y la inferior una persona arrodillada. 👁️`,
            `¡Terminal OBERON en línea! Modo Survivor experto sin pistas: +3s por alarma retirada. 🚨`
        ];
    }
};
