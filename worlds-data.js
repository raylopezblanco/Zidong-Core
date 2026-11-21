/* ==========================================================================
   ZIDONG CORE - WORLDS CATALOG (5 MUNDOS OBERON)
   Catálogo central de mundos, Hanzi, oraciones de práctica y Final Boss.
   ========================================================================== */

(() => {
    "use strict";

    window.ZIDONG_WORLDS_CONFIG = [
        {
            id: "world_1",
            title: "MUNDO ELÉCTRICO",
            planetName: "Planeta Voltaria",
            subtitle: "VFDs, motores y cableado de control",
            icon: "⚡",
            color: "#00f59b",
            planetClass: "planet-voltaria",
            activities: [
                { id: "w1_a1", hanzi: "电", pinyin: "diàn", meaning: "Electricidad / Voltaje", reward: 50, audioNote: "diàn", sentence: "主电源电箱电压正常", sentenceEs: "El voltaje en la caja de energía principal es normal" },
                { id: "w1_a2", hanzi: "线", pinyin: "xiàn", meaning: "Línea / Cableado", reward: 50, audioNote: "xiàn", sentence: "3号工位控制线连接牢固", sentenceEs: "La línea de control de la estación 3 está bien conectada" },
                { id: "w1_a3", hanzi: "模", pinyin: "mó", meaning: "Módulo de potencia", reward: 60, audioNote: "mó", sentence: "变频器功率模组温度偏高", sentenceEs: "La temperatura del módulo de potencia del VFD está alta" },
                { id: "w1_a4", hanzi: "组", pinyin: "zǔ", meaning: "Ensamble eléctrico", reward: 70, audioNote: "zǔ", sentence: "线束组件已通过导通测试", sentenceEs: "El ensamble de arnés aprobó la prueba de continuidad" },
                { id: "w1_a5", hanzi: "控", pinyin: "kòng", meaning: "Control / PLC", reward: 70, audioNote: "kòng", sentence: "主控柜与PLC通讯恢复正常", sentenceEs: "La comunicación entre el gabinete de control y el PLC volvió a la normalidad" },
                { id: "w1_a6", hanzi: "路", pinyin: "lù", meaning: "Circuito / Rama", reward: 80, audioNote: "lù", sentence: "检测到24V控制回路断路", sentenceEs: "Se detectó circuito abierto en el lazo de control de 24V" }
            ],
            boss: {
                id: "w1_boss",
                title: "JEFE DE LÍNEA · VFD DELTA MS300",
                badgeName: "Maestro VFD Delta",
                reward: 150,
                sequence: [
                    { char: "电", esName: "Electricidad" },
                    { char: "线", esName: "Cableado" },
                    { char: "模", esName: "Módulo" }
                ]
            }
        },
        {
            id: "world_2",
            title: "MUNDO MECÁNICO",
            planetName: "Planeta ErsaWave",
            subtitle: "Soldadura selectiva y ejes de transmisión",
            icon: "⚙️",
            color: "#00e5ff",
            planetClass: "planet-ersa",
            activities: [
                { id: "w2_a1", hanzi: "机", pinyin: "jī", meaning: "Máquina / Mecanismo", reward: 50, audioNote: "jī" },
                { id: "w2_a2", hanzi: "动", pinyin: "dòng", meaning: "Movimiento / Accionamiento", reward: 50, audioNote: "dòng" },
                { id: "w2_a3", hanzi: "器", pinyin: "qì", meaning: "Aparato / Dispositivo", reward: 60, audioNote: "qì" },
                { id: "w2_a4", hanzi: "修", pinyin: "xiū", meaning: "Mantenimiento / Reparación", reward: 70, audioNote: "xiū" }
            ],
            boss: {
                id: "w2_boss",
                title: "JEFE DE LÍNEA · ERSA VERSAFLOW",
                badgeName: "Especialista Versaflow",
                reward: 150,
                sequence: [
                    { char: "机", esName: "Máquina" },
                    { char: "动", esName: "Movimiento" },
                    { char: "器", esName: "Dispositivo" }
                ]
            }
        },
        {
            id: "world_3",
            title: "MUNDO NEUMÁTICO",
            planetName: "Planeta SMC Air",
            subtitle: "Electroválvulas y pistones de aire",
            icon: "💨",
            color: "#ffaa00",
            planetClass: "planet-smc",
            activities: [
                { id: "w3_a1", hanzi: "气", pinyin: "qì", meaning: "Aire / Neumática", reward: 50, audioNote: "qì" },
                { id: "w3_a2", hanzi: "阀", pinyin: "fá", meaning: "Válvula", reward: 50, audioNote: "fá" },
                { id: "w3_a3", hanzi: "压", pinyin: "yā", meaning: "Presión", reward: 60, audioNote: "yā" },
                { id: "w3_a4", hanzi: "缸", pinyin: "gāng", meaning: "Cilindro neumático", reward: 70, audioNote: "gāng" }
            ],
            boss: {
                id: "w3_boss",
                title: "JEFE DE LÍNEA · BLOQUE SMC",
                badgeName: "Ingeniero Neumático SMC",
                reward: 150,
                sequence: [
                    { char: "气", esName: "Aire" },
                    { char: "阀", esName: "Válvula" },
                    { char: "压", esName: "Presión" }
                ]
            }
        },
        {
            id: "world_4",
            title: "MUNDO ROBÓTICA",
            planetName: "Planeta Kuka-Fanuc",
            subtitle: "Brazo robótico y lógica de celdas",
            icon: "🤖",
            color: "#ff4444",
            planetClass: "planet-robot",
            activities: [
                { id: "w4_a1", hanzi: "人", pinyin: "rén", meaning: "Humano / Operador", reward: 50, audioNote: "rén" },
                { id: "w4_a2", hanzi: "爪", pinyin: "zhǎo", meaning: "Gripper / Pinza", reward: 50, audioNote: "zhǎo" },
                { id: "w4_a3", hanzi: "程", pinyin: "chéng", meaning: "Programa / Rutina", reward: 60, audioNote: "chéng" },
                { id: "w4_a4", hanzi: "安", pinyin: "ān", meaning: "Seguridad / Interlock", reward: 70, audioNote: "ān" }
            ],
            boss: {
                id: "w4_boss",
                title: "JEFE DE LÍNEA · CELDA KUKA",
                badgeName: "Maestro Kuka-Fanuc",
                reward: 150,
                sequence: [
                    { char: "人", esName: "Operador" },
                    { char: "爪", esName: "Pinza" },
                    { char: "安", esName: "Seguridad" }
                ]
            }
        },
        {
            id: "world_5",
            title: "MUNDO CALIDAD",
            planetName: "Planeta Six Sigma",
            subtitle: "Inspección óptica AOI y métricas",
            icon: "📊",
            color: "#a855f7",
            planetClass: "planet-quality",
            activities: [
                { id: "w5_a1", hanzi: "检", pinyin: "jiǎn", meaning: "Inspección / Calidad", reward: 50, audioNote: "jiǎn" },
                { id: "w5_a2", hanzi: "测", pinyin: "cè", meaning: "Prueba / Medición", reward: 50, audioNote: "cè" },
                { id: "w5_a3", hanzi: "误", pinyin: "wù", meaning: "Error / Defecto", reward: 60, audioNote: "wù" },
                { id: "w5_a4", hanzi: "良", pinyin: "liáng", meaning: "Aprobado / Good", reward: 70, audioNote: "liáng" }
            ],
            boss: {
                id: "w5_boss",
                title: "JEFE DE LÍNEA · ESTACIÓN AOI",
                badgeName: "Auditor Six Sigma",
                reward: 200,
                sequence: [
                    { char: "检", esName: "Inspección" },
                    { char: "测", esName: "Medición" },
                    { char: "良", esName: "Aprobado" }
                ]
            }
        }
    ];
})();
