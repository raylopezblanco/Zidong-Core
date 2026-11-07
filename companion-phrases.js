/* ==========================================================================
   ZIDONG CORE 12.0 - COMPANION PHRASES & GRAMMAR TIPS REPOSITORY
   ========================================================================== */

window.ZidongPhrases = {
    getPhrases: function(userName) {
        const rawName = (userName || "New user").trim();
        const isChilaquil = rawName.toLowerCase() === "chilaquil";

        const namePhrase = isChilaquil
            ? `Chilaquil... ¡jajaja te la creíste! Ahora sí te queda con ganas ese nombre 🐶🌶️`
            : `${rawName}... te quedaría mejor Chilaquil 🐶🔥`;

        return [
            namePhrase,
            `Regla de la mano izquierda: en 线 (cable), el radical izquierdo 纟 indica el material (fibra/hilo) y la derecha da la pista del sonido. 🧵`,
            `¿Caracteres 3 en 1? Muchos Hanzi se arman como bloques de Lego: en 机 (máquina), 木 es madera y 几 es mesa. ⚙️`,
            `Gramática fácil: en chino los verbos NUNCA se conjugan. "Yo reparo", "tú reparaste" y "él reparará" usan exactamente el mismo verbo. 💡`,
            `Para hablar en pasado en una bitácora de turno, solo agregas la partícula 了 (le) después del verbo. Ejemplo: 停了 (se detuvo). ⏱️`,
            `El radical izquierdo 钅 (jīn) significa metal. Si lo ves en un manual, seguro es una pieza metálica: 铁 (hierro), 铜 (cobre), 钉 (perno). 🛠️`,
            `Para negar una acción o indicar que un sensor NO detecta, pon 不 (bù) antes del verbo: 不动作 (sin movimiento / no actúa). 🚫`,
            `En las alarmas HMI, la palabra 过 (guò) significa "exceso / sobrepasar": 过载 (sobrecarga), 过热 (sobrecalentamiento), 过压 (sobrevoltaje). ⚡`,
            `Cuando veas 器 (qì) al final de una palabra, significa "aparato o dispositivo": 传感器 (sensor), 控制器 (controlador), 继电器 (relevador). 📟`,
            `El carácter 电 (diàn) nació del dibujo de un relámpago cruzando las nubes. Hoy forma todo lo eléctrico: 电压 (voltaje), 电流 (corriente). 🌩️`,
            `En chino no existe el plural con "S". "Un motor" y "diez motores" usan la misma palabra: 电机 (diànjī). ¡Menos cosas que memorizar! 🔧`,
            `La palabra 故障 (gùzhàng) es la más importante en mantenimiento: significa "falla o avería". Si la ves en rojo, toca revisar la estación. 🚨`,
            `El carácter 门 (mén - puerta) es literalmente el dibujo de dos hojas de puerta de seguridad industrial vistas de frente. 🚪`,
            `En neumática, 气 (qì) son líneas de vapor flotando: 气压 (presión de aire), 气缸 (cilindro neumático), 漏气 (fuga de aire). 💨`,
            `Para indicar posición en un eje, usa 上 (arriba), 下 (abajo), 左 (izquierda), 右 (derecha) y 原位 (posición Home). 🎯`
        ];
    }
};
