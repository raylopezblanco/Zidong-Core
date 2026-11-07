/* ==========================================================================
   ZIDONG CORE 8.0 - SISTEMA INDUSTRIAL INTEGRAL
   - 4 Fases por Hanzi (Significado, Pinyin, Palabra compuesta, Identificar en Alarma)
   - Boss Checkpoint cada 5 niveles con repaso y escaneo múltiple de alarmas
   - 1v1 con 3 Niveles (Simulador de Enlace, Servocontrolador Overclock, Protocolo Centinela IA)
   - Récords de 1v1 y Alarmas Retiradas en Survivor registrados en Profile
   - Lore: Mundo Eléctrico (Voltaria), Mundo Mecánico (Kinetix), etc.
   ========================================================================== */

(() => {
    "use strict";

    function triggerHaptic(type) {
        if (type === "success") {
            if (navigator.vibrate) navigator.vibrate(35);
            if (window.ZidongAudio && window.ZidongAudio.playSuccess) window.ZidongAudio.playSuccess();
        } else if (type === "error") {
            if (navigator.vibrate) navigator.vibrate([50, 40]);
            if (window.ZidongAudio && window.ZidongAudio.playError) window.ZidongAudio.playError();
        } else if (type === "win") {
            if (navigator.vibrate) navigator.vibrate([60, 40, 100]);
            if (window.ZidongAudio && window.ZidongAudio.playVictory) window.ZidongAudio.playVictory();
        }
    }

    const STORAGE_KEY = "zidong_core_progress_v8";

    // =====================================
    // 1. BASE DE DATOS DEMOSTRATIVA DE MUNDOS Y HANZI
    // =====================================
    const WORLDS_CONFIG = [
        {
            id: "world_1",
            title: "MUNDO ELÉCTRICO",
            subtitle: "Planeta Voltaria · Redes y Gabinetes I/O",
            planetName: "Planeta Voltaria",
            icon: "⚡",
            color: "#27d8e8",
            planetClass: "planet-electric",
            unlocked: true,
            activities: [
                {
                    id: "h_001",
                    hanzi: "电",
                    pinyin: "diàn",
                    meaning: "Electricidad",
                    compound: "电缆",
                    compoundPinyin: "diànlǎn",
                    compoundMeaning: "Cable eléctrico",
                    alarmSentence: "ALM-01: 2号站电缆断开停机",
                    alarmPrompt: "Identifica el Hanzi de ELECTRICIDAD (电) dentro de la alarma de pantalla:",
                    alarmTarget: "电",
                    reward: 80
                },
                {
                    id: "h_002",
                    hanzi: "机",
                    pinyin: "jī",
                    meaning: "Máquina",
                    compound: "电机",
                    compoundPinyin: "diànjī",
                    compoundMeaning: "Motor eléctrico",
                    alarmSentence: "ALM-02: 伺服电机堵转故障报警",
                    alarmPrompt: "Identifica el Hanzi de MÁQUINA / MOTOR (机) dentro de la alarma:",
                    alarmTarget: "机",
                    reward: 80
                },
                {
                    id: "h_003",
                    hanzi: "线",
                    pinyin: "xiàn",
                    meaning: "Línea / Cable",
                    compound: "电线",
                    compoundPinyin: "diànxiàn",
                    compoundMeaning: "Cableado de control",
                    alarmSentence: "ALM-03: 控制电线接触不良警报",
                    alarmPrompt: "Identifica el Hanzi de LÍNEA / CABLE (线) en el mensaje HMI:",
                    alarmTarget: "线",
                    reward: 80
                },
                {
                    id: "h_004",
                    hanzi: "力",
                    pinyin: "lì",
                    meaning: "Fuerza / Potencia",
                    compound: "动力",
                    compoundPinyin: "dònglì",
                    compoundMeaning: "Potencia motriz",
                    alarmSentence: "ALM-04: 主轴动力不足警告",
                    alarmPrompt: "Identifica el Hanzi de FUERZA / POTENCIA (力) en la alarma:",
                    alarmTarget: "力",
                    reward: 80
                },
                {
                    id: "h_005",
                    hanzi: "控",
                    pinyin: "kòng",
                    meaning: "Control / Mando",
                    compound: "控制",
                    compoundPinyin: "kòngzhì",
                    compoundMeaning: "Controlador PLC",
                    alarmSentence: "ALM-05: PLC控制器通讯中断",
                    alarmPrompt: "Identifica el Hanzi de CONTROL (控) en la alarma de red:",
                    alarmTarget: "控",
                    reward: 80
                }
            ],
            boss: {
                id: "boss_world_1",
                name: "CHECKPOINT: COMISIONAMIENTO VOLTARIA",
                desc: "Repaso integral de los 5 niveles anteriores y escaneo múltiple de alarmas",
                reward: 250
            }
        },
        {
            id: "world_2",
            title: "MUNDO MECÁNICO",
            subtitle: "Planeta Kinetix · Servos y Ejes Cinemáticos",
            planetName: "Planeta Kinetix",
            icon: "⚙️",
            color: "#ffc857",
            planetClass: "planet-mechanical",
            unlocked: true,
            activities: [
                {
                    id: "h_006",
                    hanzi: "轴",
                    pinyin: "zhóu",
                    meaning: "Eje / Flecha",
                    compound: "伺服轴",
                    compoundPinyin: "sìfú zhóu",
                    compoundMeaning: "Eje servo Z",
                    alarmSentence: "ALM-06: Z轴原点复位超时",
                    alarmPrompt: "Identifica el Hanzi de EJE (轴) dentro de la alarma:",
                    alarmTarget: "轴",
                    reward: 100
                },
                {
                    id: "h_007",
                    hanzi: "转",
                    pinyin: "zhuǎn",
                    meaning: "Giro / Rotación",
                    compound: "转速",
                    compoundPinyin: "zhuànsù",
                    compoundMeaning: "Velocidad RPM",
                    alarmSentence: "ALM-07: 主轴转速异常超限",
                    alarmPrompt: "Identifica el Hanzi de GIRO (转) en la pantalla:",
                    alarmTarget: "转",
                    reward: 100
                },
                {
                    id: "h_008",
                    hanzi: "合",
                    pinyin: "hé",
                    meaning: "Cierre / Acople",
                    compound: "离合器",
                    compoundPinyin: "líhéqì",
                    compoundMeaning: "Embrague de banda",
                    alarmSentence: "ALM-08: 离合器分离故障",
                    alarmPrompt: "Identifica el Hanzi de ACOPLE (合) en la falla mecánica:",
                    alarmTarget: "合",
                    reward: 100
                },
                {
                    id: "h_009",
                    hanzi: "紧",
                    pinyin: "jǐn",
                    meaning: "Ajuste / Apriete",
                    compound: "紧固",
                    compoundPinyin: "jǐngù",
                    compoundMeaning: "Sujeción de husillo",
                    alarmSentence: "ALM-09: 夹具紧固不到位",
                    alarmPrompt: "Identifica el Hanzi de APRIETE / SUJECIÓN (紧) en la alarma:",
                    alarmTarget: "紧",
                    reward: 100
                },
                {
                    id: "h_010",
                    hanzi: "位",
                    pinyin: "wèi",
                    meaning: "Posición",
                    compound: "原位",
                    compoundPinyin: "yuánwèi",
                    compoundMeaning: "Posición HOME",
                    alarmSentence: "ALM-10: 机械臂未在原位",
                    alarmPrompt: "Identifica el Hanzi de POSICIÓN (位) en la HMI:",
                    alarmTarget: "位",
                    reward: 100
                }
            ],
            boss: {
                id: "boss_world_2",
                name: "CHECKPOINT: COMISIONAMIENTO KINETIX",
                desc: "Repaso integral de los componentes mecánicos y escaneo cinemático",
                reward: 300
            }
        },
        {
            id: "world_3",
            title: "MUNDO NEUMÁTICO",
            subtitle: "Planeta Aethel · Presión y Válvulas",
            planetName: "Planeta Aethel",
            icon: "💨",
            color: "#00f59b",
            planetClass: "planet-pneumatic",
            unlocked: true,
            activities: [
                {
                    id: "h_011",
                    hanzi: "气",
                    pinyin: "qì",
                    meaning: "Aire / Gas",
                    compound: "气缸",
                    compoundPinyin: "qìgāng",
                    compoundMeaning: "Cilindro neumático",
                    alarmSentence: "ALM-11: 顶升气缸动作超时",
                    alarmPrompt: "Identifica el Hanzi de AIRE / NEUMÁTICA (气):",
                    alarmTarget: "气",
                    reward: 120
                },
                {
                    id: "h_012",
                    hanzi: "压",
                    pinyin: "yā",
                    meaning: "Presión",
                    compound: "气压",
                    compoundPinyin: "qìyā",
                    compoundMeaning: "Presión Bar",
                    alarmSentence: "ALM-12: 主管路气压不足报警",
                    alarmPrompt: "Identifica el Hanzi de PRESIÓN (压):",
                    alarmTarget: "压",
                    reward: 120
                },
                {
                    id: "h_013",
                    hanzi: "阀",
                    pinyin: "fá",
                    meaning: "Válvula",
                    compound: "电磁阀",
                    compoundPinyin: "diàncífá",
                    compoundMeaning: "Solenoide neumático",
                    alarmSentence: "ALM-13: 换向电磁阀无响应",
                    alarmPrompt: "Identifica el Hanzi de VÁLVULA (阀):",
                    alarmTarget: "阀",
                    reward: 120
                },
                {
                    id: "h_014",
                    hanzi: "管",
                    pinyin: "guǎn",
                    meaning: "Manguera / Tubo",
                    compound: "气管",
                    compoundPinyin: "qìguǎn",
                    compoundMeaning: "Tubo de aire",
                    alarmSentence: "ALM-14: 供气管路破损警报",
                    alarmPrompt: "Identifica el Hanzi de TUBO / MANGUERA (管):",
                    alarmTarget: "管",
                    reward: 120
                },
                {
                    id: "h_015",
                    hanzi: "漏",
                    pinyin: "lòu",
                    meaning: "Fuga",
                    compound: "漏气",
                    compoundPinyin: "lòuqì",
                    compoundMeaning: "Fuga de aire",
                    alarmSentence: "ALM-15: 检测到真空吸盘漏气",
                    alarmPrompt: "Identifica el Hanzi de FUGA (漏):",
                    alarmTarget: "漏",
                    reward: 120
                }
            ],
            boss: {
                id: "boss_world_3",
                name: "CHECKPOINT: COMISIONAMIENTO AETHEL",
                desc: "Verificación de válvulas, estanqueidad y cilindros",
                reward: 350
            }
        },
        {
            id: "world_4",
            title: "MUNDO ROBÓTICO & AGV",
            subtitle: "Planeta Machina · Celdas y Flotas AGV",
            planetName: "Planeta Machina",
            icon: "🤖",
            color: "#a78bfa",
            planetClass: "planet-robotics",
            unlocked: true,
            activities: [
                {
                    id: "h_016",
                    hanzi: "手",
                    pinyin: "shǒu",
                    meaning: "Brazo / Gripper",
                    compound: "机械手",
                    compoundPinyin: "jīxièshǒu",
                    compoundMeaning: "Robot manipulador",
                    alarmSentence: "ALM-16: 机械手碰撞急停",
                    alarmPrompt: "Identifica el Hanzi de BRAZO ROBOT (手):",
                    alarmTarget: "手",
                    reward: 150
                },
                {
                    id: "h_017",
                    hanzi: "车",
                    pinyin: "chē",
                    meaning: "Carro / AGV",
                    compound: "导引车",
                    compoundPinyin: "dǎoyǐnchē",
                    compoundMeaning: "Carro AGV autónomo",
                    alarmSentence: "ALM-17: 4号自动导引车偏离磁条",
                    alarmPrompt: "Identifica el Hanzi de CARRO / AGV (车):",
                    alarmTarget: "车",
                    reward: 150
                },
                {
                    id: "h_018",
                    hanzi: "点",
                    pinyin: "diǎn",
                    meaning: "Punto / Coordenada",
                    compound: "示教点",
                    compoundPinyin: "shìjiàodiǎn",
                    compoundMeaning: "Punto Teach Point",
                    alarmSentence: "ALM-18: 示教点数据校验错误",
                    alarmPrompt: "Identifica el Hanzi de PUNTO (点):",
                    alarmTarget: "点",
                    reward: 150
                },
                {
                    id: "h_019",
                    hanzi: "速",
                    pinyin: "sù",
                    meaning: "Velocidad",
                    compound: "减速",
                    compoundPinyin: "jiǎnsù",
                    compoundMeaning: "Reductor de velocidad",
                    alarmSentence: "ALM-19: 减速机油温过高",
                    alarmPrompt: "Identifica el Hanzi de VELOCIDAD (速):",
                    alarmTarget: "速",
                    reward: 150
                },
                {
                    id: "h_020",
                    hanzi: "避",
                    pinyin: "bì",
                    meaning: "Evadir / Obstáculo",
                    compound: "避障",
                    compoundPinyin: "bìzhàng",
                    compoundMeaning: "Sensor Lidar de evasión",
                    alarmSentence: "ALM-20: 激光避障雷达被遮挡",
                    alarmPrompt: "Identifica el Hanzi de EVASIÓN (避):",
                    alarmTarget: "避",
                    reward: 150
                }
            ],
            boss: {
                id: "boss_world_4",
                name: "CHECKPOINT: COMISIONAMIENTO MACHINA",
                desc: "Sincronización de flotas AGV y celdas Fanuc",
                reward: 400
            }
        },
        {
            id: "world_5",
            title: "MUNDO VISIÓN AOI",
            subtitle: "Planeta Lumina · Óptica y Cámaras",
            planetName: "Planeta Lumina",
            icon: "👁️",
            color: "#ff7777",
            planetClass: "planet-vision",
            unlocked: true,
            activities: [
                {
                    id: "h_021",
                    hanzi: "光",
                    pinyin: "guāng",
                    meaning: "Luz / Óptica",
                    compound: "光源",
                    compoundPinyin: "guāngyuán",
                    compoundMeaning: "Lámpara estroboscópica",
                    alarmSentence: "ALM-21: 视觉光源亮度不足",
                    alarmPrompt: "Identifica el Hanzi de LUZ / ÓPTICA (光):",
                    alarmTarget: "光",
                    reward: 180
                },
                {
                    id: "h_022",
                    hanzi: "镜",
                    pinyin: "jìng",
                    meaning: "Lente / Cámara",
                    compound: "镜头",
                    compoundPinyin: "jìngtóu",
                    compoundMeaning: "Lente de enfoque",
                    alarmSentence: "ALM-22: 工业镜头污损检测失败",
                    alarmPrompt: "Identifica el Hanzi de LENTE (镜):",
                    alarmTarget: "镜",
                    reward: 180
                },
                {
                    id: "h_023",
                    hanzi: "视",
                    pinyin: "shì",
                    meaning: "Visión",
                    compound: "视觉",
                    compoundPinyin: "shìjué",
                    compoundMeaning: "Sistema de visión",
                    alarmSentence: "ALM-23: AOI视觉比对未通过",
                    alarmPrompt: "Identifica el Hanzi de VISIÓN (视):",
                    alarmTarget: "视",
                    reward: 180
                },
                {
                    id: "h_024",
                    hanzi: "检",
                    pinyin: "jiǎn",
                    meaning: "Inspección",
                    compound: "检测",
                    compoundPinyin: "jiǎncè",
                    compoundMeaning: "Test de calidad",
                    alarmSentence: "ALM-24: 焊点尺寸检测异常",
                    alarmPrompt: "Identifica el Hanzi de INSPECCIÓN (检):",
                    alarmTarget: "检",
                    reward: 180
                },
                {
                    id: "h_025",
                    hanzi: "错",
                    pinyin: "cuò",
                    meaning: "Falso / Error",
                    compound: "误检",
                    compoundPinyin: "wùjiǎn",
                    compoundMeaning: "Falso rechazo en línea",
                    alarmSentence: "ALM-25: 发生连续误检停线",
                    alarmPrompt: "Identifica el Hanzi de ERROR (错/误):",
                    alarmTarget: "错",
                    reward: 180
                }
            ],
            boss: {
                id: "boss_world_5",
                name: "CHECKPOINT: COMISIONAMIENTO LUMINA",
                desc: "Ajuste de parámetros ópticos y cero falso rechazo",
                reward: 500
            }
        }
    ];

    // BANCO DEL LABORATORIO
    const LAB_COMPONENTS = [
        { hanzi: "电", pinyin: "diàn", es: "Electricidad", cat: "world_1", catName: "⚡ Voltaria", part: "电缆 (Cable)" },
        { hanzi: "机", pinyin: "jī", es: "Máquina / Motor", cat: "world_1", catName: "⚡ Voltaria", part: "电机 (Motor)" },
        { hanzi: "线", pinyin: "xiàn", es: "Línea / Cable", cat: "world_1", catName: "⚡ Voltaria", part: "电线 (Cableado)" },
        { hanzi: "力", pinyin: "lì", es: "Fuerza / Potencia", cat: "world_1", catName: "⚡ Voltaria", part: "动力 (Potencia)" },
        { hanzi: "控", pinyin: "kòng", es: "Control / PLC", cat: "world_1", catName: "⚡ Voltaria", part: "控制 (Control)" },
        
        { hanzi: "轴", pinyin: "zhóu", es: "Eje / Flecha", cat: "world_2", catName: "⚙️ Kinetix", part: "伺服轴 (Eje Z)" },
        { hanzi: "转", pinyin: "zhuǎn", es: "Giro / RPM", cat: "world_2", catName: "⚙️ Kinetix", part: "转速 (Velocidad)" },
        { hanzi: "合", pinyin: "hé", es: "Acople", cat: "world_2", catName: "⚙️ Kinetix", part: "离合器 (Embrague)" },
        { hanzi: "紧", pinyin: "jǐn", es: "Sujeción", cat: "world_2", catName: "⚙️ Kinetix", part: "紧固 (Tornillería)" },
        { hanzi: "位", pinyin: "wèi", es: "Posición", cat: "world_2", catName: "⚙️ Kinetix", part: "原位 (Home)" },

        { hanzi: "气", pinyin: "qì", es: "Neumática", cat: "world_3", catName: "💨 Aethel", part: "气缸 (Cilindro)" },
        { hanzi: "压", pinyin: "yā", es: "Presión Bar", cat: "world_3", catName: "💨 Aethel", part: "气压 (Regulador)" },
        { hanzi: "阀", pinyin: "fá", es: "Válvula", cat: "world_3", catName: "💨 Aethel", part: "电磁阀 (Solenoide)" },

        { hanzi: "手", pinyin: "shǒu", es: "Brazo Robot", cat: "world_4", catName: "🤖 Machina", part: "机械手 (Fanuc)" },
        { hanzi: "车", pinyin: "chē", es: "Carro AGV", cat: "world_4", catName: "🤖 Machina", part: "导引车 (AGV)" },

        { hanzi: "光", pinyin: "guāng", es: "Sensor Óptico", cat: "world_5", catName: "👁️ Lumina", part: "光源 (Lámpara)" },
        { hanzi: "视", pinyin: "shì", es: "Visión Cámara", cat: "world_5", catName: "👁️ Lumina", part: "视觉 (AOI)" }
    ];

    // RANGOS PROFESIONALES HASTA 45,000 XP
    const INDUSTRIAL_RANKS = [
        { id: 1, name: "Becario", minXP: 0, icon: "📋", desc: "Familiarización con la línea y simbología" },
        { id: 2, name: "Practicante", minXP: 800, icon: "🔰", desc: "Apoyo en cambio de herramentales y verificación visual" },
        { id: 3, name: "Operador", minXP: 2000, icon: "⚙️", desc: "Operación de estaciones automatizadas en Voltaria" },
        { id: 4, name: "Operador Especializado", minXP: 4000, icon: "🛠️", desc: "Calibración de husillos y reseteo de fallas de alimentador" },
        { id: 5, name: "Técnico Jr", minXP: 7000, icon: "⚡", desc: "Diagnóstico eléctrico de señales I/O y relevadores" },
        { id: 6, name: "Técnico Sr", minXP: 11000, icon: "🔧", desc: "Mantenimiento preventivo a servomotores y líneas neumáticas" },
        { id: 7, name: "Ingeniero Jr", minXP: 16000, icon: "💻", desc: "Comisionamiento de sub-estaciones PLC y bus Profinet" },
        { id: 8, name: "Ingeniero Full", minXP: 22000, icon: "🚀", desc: "Optimización de tiempo de ciclo SMT y celdas Kinetix" },
        { id: 9, name: "Ingeniero Sr", minXP: 30000, icon: "🏅", desc: "Arquitectura de celdas robóticas y enlace SCADA global" },
        { id: 10, name: "Maestro de Programación", minXP: 45000, icon: "👑", desc: "Guardián Supremo de OBERON: Cero Downtime en planta" }
    ];

    // MEDALLAS
    const MEDALS_DB = [
        { id: "b_practicante", icon: "🔰", name: "Practicante de Automatización", desc: "Insignia oficial de bienvenida a OBERON", isUnlocked: () => true },
        { id: "b_ai_slayer", icon: "🤖", name: "Derrotador de IA", desc: "Vence a la IA en el duelo 1v1 Battle al menos 1 vez", isUnlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
        { id: "b_troubleshooter", icon: "🛠️", name: "Solucionador de Fallas Básico", desc: "Supera al menos 1 emergencia en Survivor Mode", isUnlocked: () => Number(localStorage.getItem("zidong_survivor_wins") || 0) >= 1 },
        { id: "b_electric", icon: "⚡", name: "Comisionado Eléctrico", desc: "Especialista en potencia y señales", isUnlocked: () => true },
        { id: "b_dragon", icon: "龍", name: "Dragón Zìdòng", desc: "Fundador de la academia técnica", isUnlocked: () => true },
        { id: "b_overclock", icon: "⭐", name: "Overclock 3★", desc: "Test aprobado en menos de 12 segundos", isUnlocked: () => Object.values(career.nodeStars || {}).some(s => s >= 3) }
    ];

    // LOGROS XBOX
    const XBOX_ACHIEVEMENTS = [
        { id: "ach_welcome", title: "Bienvenido a OBERON", desc: "Supera el protocolo de inicialización de 10s.", score: 100, icon: "🪐", unlocked: () => true },
        { id: "ach_first_circuit", title: "Primer Circuito Energizado", desc: "Domina tu primer componente eléctrico.", score: 100, icon: "⚡", unlocked: () => career.completedActivities.length >= 1 },
        { id: "ach_voltaria", title: "Maestría en Voltaria", desc: "Domina 3 componentes de potencia eléctrica.", score: 150, icon: "🔌", unlocked: () => career.completedActivities.filter(id => id.startsWith("h_00")).length >= 3 },
        { id: "ach_kinetix", title: "Cinemática de Kinetix", desc: "Calibra un servomotor en Kinetix.", score: 150, icon: "⚙️", unlocked: () => career.completedActivities.some(id => ["h_006", "h_007", "h_008"].includes(id)) },
        { id: "ach_survivor_hero", title: "Ingeniero de Choque (18s)", desc: "Despeja alarmas en Survivor bajo 18 segundos.", score: 200, icon: "🚨", unlocked: () => Number(localStorage.getItem("zidong_survivor_wins") || 0) >= 1 },
        { id: "ach_ai_tamer", title: "Cerebro de Silicio Vencido", desc: "Derrota a la IA en Duelo 1v1 Battle.", score: 200, icon: "⚔️", unlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
        { id: "ach_ai_master", title: "Pesadilla de la IA", desc: "Derrota a la máquina 3 veces en 1v1.", score: 300, icon: "👑", unlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 3 },
        { id: "ach_technician", title: "Rango Técnico Jr Alcanzado", desc: "Acumula más de 7,000 XP en tu historial.", score: 150, icon: "📈", unlocked: () => currentUserData.xp >= 7000 }
    ];

    // =====================================
    // 2. ESTADO DEL USUARIO (DEFAULT: New user)
    // =====================================
    const career = {
        completedActivities: ["h_001"],
        assessmentPassed: false,
        nodeStars: { "h_001": 3 }
    };

    let currentUserData = {
        name: "New user",
        initials: "NU",
        xp: 1850,
        level: 5,
        streak: 5
    };

    function loadSavedProgress() {
        try {
            const savedName = localStorage.getItem("zidong_user_name");
            if (savedName) {
                currentUserData.name = savedName;
                currentUserData.initials = getInitials(savedName);
            } else {
                currentUserData.name = "New user";
                currentUserData.initials = "NU";
            }

            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved) {
                if (saved.player) {
                    currentUserData.xp = saved.player.xp || 1850;
                    currentUserData.level = saved.player.level || 5;
                    currentUserData.streak = saved.player.streak || 5;
                }
                if (saved.career) {
                    career.completedActivities = saved.career.completedActivities || ["h_001"];
                    career.assessmentPassed = Boolean(saved.career.assessmentPassed);
                    career.nodeStars = saved.career.nodeStars || { "h_001": 3 };
                }
            }
        } catch (e) {
            console.error("Error al cargar:", e);
        }
    }

    function saveProgress() {
        try {
            const saved = {
                player: currentUserData,
                career: {
                    completedActivities: career.completedActivities,
                    assessmentPassed: career.assessmentPassed,
                    nodeStars: career.nodeStars
                }
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) {
            console.error("Error al guardar:", e);
        }
    }

    function getInitials(name) {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    }

    function awardXP(reward) {
        currentUserData.xp += reward;
        renderRanksSection();
        updateProfile();
        saveProgress();
    }

    function getCurrentRank(xp = 1850) {
        let current = INDUSTRIAL_RANKS[0];
        for (let i = INDUSTRIAL_RANKS.length - 1; i >= 0; i--) {
            if (xp >= INDUSTRIAL_RANKS[i].minXP) {
                current = INDUSTRIAL_RANKS[i];
                break;
            }
        }
        return current;
    }

    // =====================================
    // 3. EDICIÓN DE NOMBRE (1 SOLA VEZ)
    // =====================================
    window.editUserNameOnce = () => {
        const alreadyChanged = localStorage.getItem("zidong_name_changed") === "true";
        if (alreadyChanged) {
            triggerHaptic("error");
            alert(`🔒 No puedes modificar tu nombre de nuevo.
El sistema OBERON ya registró tu firma oficial como: "${currentUserData.name}".`);
            return;
        }

        const warningMsg = `⚠️ ¡ATENCIÓN! PROTOCOLO OBERON:

Solo tienes permitido registrar tu nombre UNA SOLA VEZ en la terminal.

Piénsalo bien: tal y como lo escribas ahora, así serás conocido en los 5 planetas.

¿Deseas continuar?`;
        
        if (!confirm(warningMsg)) return;

        const newName = prompt("Escribe tu nombre y apellido técnico definitivo:", currentUserData.name);
        if (!newName || newName.trim().length < 2) {
            alert("Operación cancelada: El nombre es muy corto.");
            return;
        }

        const cleanName = newName.trim();
        currentUserData.name = cleanName;
        currentUserData.initials = getInitials(cleanName);
        localStorage.setItem("zidong_user_name", cleanName);
        localStorage.setItem("zidong_name_changed", "true");

        triggerHaptic("win");
        updateUserDisplay();
        updateProfile();
        saveProgress();

        alert(`✅ Identidad registrada con éxito: "${cleanName}".
Firma biométrica bloqueada permanentemente.`);
    };

    function updateUserDisplay() {
        const topU = document.getElementById("topUsername");
        const topA = document.getElementById("topAvatar");
        const profU = document.getElementById("profileName");
        const profA = document.getElementById("profileAvatar");
        const editNotice = document.getElementById("nameEditNotice");

        if (topU) topU.textContent = currentUserData.name;
        if (topA && !topA.classList.contains("custom-icon")) topA.textContent = currentUserData.initials;
        if (profU) profU.textContent = currentUserData.name;
        if (profA && !profA.classList.contains("custom-icon")) profA.textContent = currentUserData.initials;

        const isLocked = localStorage.getItem("zidong_name_changed") === "true";
        if (editNotice) {
            editNotice.innerHTML = isLocked 
                ? "🔒 Nombre oficial bloqueado (ya utilizado)" 
                : "✏️ Toca aquí para editar nombre <strong style='color:#ffaa00;'>(1 sola vez)</strong>";
        }
    }

    // =====================================
    // 4. CAREER MODE EN MENÚ PLANETARIO COMPACTO
    // =====================================
    function renderCareerPlanetsMenu() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;

        container.replaceChildren();

        WORLDS_CONFIG.forEach((world, wIdx) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass}`;

            planetCard.innerHTML = `
                <div class="planet-sphere-wrapper">
                    <div class="planet-sphere" style="box-shadow: 0 0 25px ${world.color}88, inset -8px -8px 18px rgba(0,0,0,0.8), inset 6px 6px 14px rgba(255,255,255,0.4);">
                        <span class="planet-core-icon">${world.icon}</span>
                    </div>
                    <div class="planet-orbit-ring" style="border-color:${world.color}66;"></div>
                </div>

                <div class="planet-menu-meta">
                    <span class="planet-tag" style="color:${world.color};">${world.title}</span>
                    <h4>${world.planetName}</h4>
                    <p>${world.subtitle}</p>
                    <span class="planet-enter-badge">EXPLORAR PLANETA →</span>
                </div>
            `;

            planetCard.onclick = () => openWorldDetails(world);
            container.appendChild(planetCard);
        });
    }

    function openWorldDetails(world) {
        if (typeof window.navigateTo === "function") {
            window.navigateTo("worldDetailsView");
        }

        const titleEl = document.getElementById("selectedWorldTitle");
        const subEl = document.getElementById("selectedWorldSubtitle");
        const iconEl = document.getElementById("selectedWorldIcon");
        const stream = document.getElementById("selectedWorldStream");

        if (titleEl) titleEl.textContent = world.title;
        if (subEl) subEl.textContent = `${world.planetName} · ${world.subtitle}`;
        if (iconEl) iconEl.textContent = world.icon;

        if (!stream) return;
        stream.replaceChildren();

        // 5 Niveles continuos
        world.activities.forEach((act, aIdx) => {
            const isCompleted = career.completedActivities.includes(act.id);
            const stars = (career.nodeStars && career.nodeStars[act.id]) || (isCompleted ? 3 : 0);
            const nodeEl = document.createElement("div");
            nodeEl.className = `path-step ${aIdx % 2 === 0 ? "left" : "right"}`;

            nodeEl.innerHTML = `
                <div class="path-node ${isCompleted ? "completed" : "current"}">
                    <span>${isCompleted ? "✓" : act.hanzi}</span>
                </div>
                <div class="path-label">
                    <strong>Nivel 0${aIdx + 1} · ${act.meaning} ${isCompleted ? "⭐".repeat(stars) : ""}</strong>
                    <small>4 Fases: Significado, Pinyin, Compuesta, Alarma</small>
                    <span class="node-action">${isCompleted ? "REPETIR TEST ↺" : "CALIBRAR EN LÍNEA ⚡"}</span>
                </div>
            `;

            nodeEl.style.cursor = "pointer";
            nodeEl.onclick = () => openActivity(act);
            stream.appendChild(nodeEl);
        });

        // BOSS CHECKPOINT AL FINAL (NIVEL 6)
        if (world.boss) {
            const bossCompleted = career.assessmentPassed;
            const bossNode = document.createElement("div");
            bossNode.className = "path-step left";
            bossNode.innerHTML = `
                <div class="path-node assessment ${bossCompleted ? "completed" : "current"}" style="border-color:${world.color};">
                    <span>${bossCompleted ? "✓" : "🏅"}</span>
                </div>
                <div class="path-label">
                    <strong style="color:${world.color};">${world.boss.name}</strong>
                    <small>${world.boss.desc}</small>
                    <span class="node-action" style="color:${world.color};">INICIAR CHECKPOINT FINAL →</span>
                </div>
            `;
            bossNode.style.cursor = "pointer";
            bossNode.onclick = () => startBossCheckpoint(world);
            stream.appendChild(bossNode);
        }
    }

    // =====================================
    // 5. APRENDIZAJE EN 4 FASES POR HANZI
    // =====================================
    function openActivity(act) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        startHanzi4Phases(act);
    }

    function startHanzi4Phases(act) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        let phase = 1;

        // FASE 1: SIGNIFICADO
        function renderPhase1() {
            const allMeanings = ["Electricidad", "Máquina", "Línea / Cable", "Fuerza / Potencia", "Control", "Eje / Flecha", "Presión", "Cilindro", "Aire", "Válvula"];
            const wrongOpts = allMeanings.filter(m => m !== act.meaning).sort(() => 0.5 - Math.random()).slice(0, 2);
            const options = [act.meaning, ...wrongOpts].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar">
                    <span class="step-dot active">1. Significado</span>
                    <span class="step-dot">2. Pinyin</span>
                    <span class="step-dot">3. Compuesta</span>
                    <span class="step-dot">4. Alarma HMI</span>
                </div>

                <span class="tag" style="border-color:var(--cyan); color:var(--cyan); margin:8px 0 4px 0;">FASE 1 DE 4 · IDENTIFICACIÓN</span>
                <div class="recognition-hanzi">${act.hanzi}</div>
                <h3 style="font-size:14px; margin-bottom:12px; color:#fff;">¿Cuál es el significado técnico de este carácter?</h3>
                <div class="career-quiz-grid" id="phaseQuizGrid"></div>
            `;

            const grid = card.querySelector("#phaseQuizGrid");
            options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "cf-btn-option";
                btn.style.fontSize = "13.5px";
                btn.style.padding = "12px 10px";
                btn.textContent = opt;

                btn.onclick = () => {
                    const allButtons = grid.querySelectorAll("button");
                    allButtons.forEach(b => b.style.pointerEvents = "none");

                    if (opt === act.meaning) {
                        triggerHaptic("success");
                        btn.classList.add("btn-correct");
                        setTimeout(() => { phase = 2; renderPhase2(); }, 350);
                    } else {
                        triggerHaptic("error");
                        btn.classList.add("btn-wrong");
                        setTimeout(renderPhase1, 450);
                    }
                };
                grid.appendChild(btn);
            });
        }

        // FASE 2: CÓMO SE DICE (PINYIN Y TONO)
        function renderPhase2() {
            const dummyPinyins = ["diàn", "jī", "xiàn", "lì", "kòng", "zhóu", "zhuǎn", "qì", "fá", "shǒu"].filter(p => p !== act.pinyin);
            const shuffledP = dummyPinyins.sort(() => 0.5 - Math.random()).slice(0, 2);
            const options = [act.pinyin, ...shuffledP].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar">
                    <span class="step-dot done">✓</span>
                    <span class="step-dot active">2. Pronunciación</span>
                    <span class="step-dot">3. Compuesta</span>
                    <span class="step-dot">4. Alarma HMI</span>
                </div>

                <span class="tag" style="border-color:#a78bfa; color:#a78bfa; margin:8px 0 4px 0;">FASE 2 DE 4 · LECTURA FONÉTICA</span>
                <div class="recognition-hanzi">${act.hanzi}</div>
                <h3 style="font-size:14px; margin-bottom:12px; color:#fff;">¿Cómo se pronuncia en mandarín técnico?</h3>
                <div class="career-quiz-grid" id="phaseQuizGrid"></div>
            `;

            const grid = card.querySelector("#phaseQuizGrid");
            options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "cf-btn-option";
                btn.style.fontSize = "15px";
                btn.style.padding = "12px 10px";
                btn.textContent = opt;

                btn.onclick = () => {
                    const allButtons = grid.querySelectorAll("button");
                    allButtons.forEach(b => b.style.pointerEvents = "none");

                    if (opt === act.pinyin) {
                        triggerHaptic("success");
                        btn.classList.add("btn-correct");
                        setTimeout(() => { phase = 3; renderPhase3(); }, 350);
                    } else {
                        triggerHaptic("error");
                        btn.classList.add("btn-wrong");
                        setTimeout(renderPhase2, 450);
                    }
                };
                grid.appendChild(btn);
            });
        }

        // FASE 3: FORMAR LA PALABRA COMPUESTA (ENSAMBLE TÉCNICO)
        function renderPhase3() {
            const chars = act.compound.split("");
            const targetChar = chars.find(c => c !== act.hanzi) || act.hanzi;
            const dummyPool = ["缆", "箱", "压", "电", "机", "线", "阀", "器", "门", "轴"].filter(c => c !== targetChar);
            const blockOptions = [targetChar, ...dummyPool.sort(() => 0.5 - Math.random()).slice(0, 2)].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar">
                    <span class="step-dot done">✓</span>
                    <span class="step-dot done">✓</span>
                    <span class="step-dot active">3. Compuesta</span>
                    <span class="step-dot">4. Alarma HMI</span>
                </div>

                <span class="tag" style="border-color:#ffaa00; color:#ffaa00; margin:8px 0 4px 0;">FASE 3 DE 4 · PALABRA COMPUESTA</span>
                <p style="font-size:11px; color:var(--muted); margin:4px 0;">FORMA EL TÉRMINO DE PLANTA:</p>
                <h2 style="color:var(--cyan); margin: 4px 0 12px 0;">${act.compoundMeaning}</h2>

                <div class="cf-slots-dock" style="margin-bottom:14px;">
                    <div class="cf-slot filled">${act.hanzi}</div>
                    <div class="cf-slot empty" id="slotTarget">_</div>
                </div>

                <div style="display:flex; justify-content:center; gap:12px;" id="compoundBlocksGrid"></div>
            `;

            const bGrid = card.querySelector("#compoundBlocksGrid");
            blockOptions.forEach(char => {
                const b = document.createElement("button");
                b.className = "cf-part-btn";
                b.style.width = "64px";
                b.textContent = char;

                b.onclick = () => {
                    if (char === targetChar) {
                        triggerHaptic("success");
                        const slot = card.querySelector("#slotTarget");
                        slot.textContent = char;
                        slot.classList.add("filled");
                        slot.classList.remove("empty");
                        setTimeout(() => { phase = 4; renderPhase4(); }, 400);
                    } else {
                        triggerHaptic("error");
                        b.style.opacity = "0.2";
                        b.style.pointerEvents = "none";
                    }
                };
                bGrid.appendChild(b);
            });
        }

        // FASE 4: IDENTIFICAR LA PALABRA/HANZI DENTRO DE LA ALARMA REAL DE HMI
        function renderPhase4() {
            card.innerHTML = `
                <div class="phase-stepper-bar">
                    <span class="step-dot done">✓</span>
                    <span class="step-dot done">✓</span>
                    <span class="step-dot done">✓</span>
                    <span class="step-dot active">4. Escáner HMI</span>
                </div>

                <span class="tag" style="border-color:#00f59b; color:#00f59b; margin:8px 0 4px 0;">FASE 4 DE 4 · ESCÁNER EN PISO</span>
                <p style="font-size:12px; color:#ffffff; font-weight:700; margin:8px 0 12px 0;">
                    ${act.alarmPrompt}
                </p>

                <div class="hmi-alarm-scanner-box">
                    <div class="hmi-screen-header">
                        <small>HMI RUNTIME · ALARM MONITOR</small>
                        <span class="alarm-led-red">●</span>
                    </div>
                    <div class="hmi-tokens-container" id="alarmTokensGrid"></div>
                </div>

                <p style="font-size:10px; color:var(--muted); margin-top:8px;">
                    Toca el carácter exacto dentro de la oración para autorizar el rearme.
                </p>
            `;

            const tokensGrid = card.querySelector("#alarmTokensGrid");
            const chars = act.alarmSentence.split("");

            chars.forEach((c) => {
                const tokenBtn = document.createElement("button");
                tokenBtn.className = "hmi-char-token";
                tokenBtn.textContent = c;

                tokenBtn.onclick = () => {
                    if (c === act.alarmTarget) {
                        triggerHaptic("win");
                        tokenBtn.classList.add("token-hit");

                        if (!career.completedActivities.includes(act.id)) {
                            career.completedActivities.push(act.id);
                        }
                        if (!career.nodeStars) career.nodeStars = {};
                        career.nodeStars[act.id] = 3;
                        awardXP(act.reward);

                        setTimeout(() => {
                            alert(`🌟 ¡NIVEL Y 4 FASES COMPLETADAS! (+${act.reward} XP)\nHas dominado "${act.hanzi}" (${act.meaning}).`);
                            if (typeof window.navigateTo === "function") window.navigateTo("career");
                        }, 400);
                    } else {
                        triggerHaptic("error");
                        tokenBtn.classList.add("token-miss");
                        setTimeout(() => tokenBtn.classList.remove("token-miss"), 300);
                    }
                };
                tokensGrid.appendChild(tokenBtn);
            });
        }

        renderPhase1();
    }

    // =====================================
    // 6. BOSS CHECKPOINT (REPASO DE LOS 5 NIVELES ANTERIORES)
    // =====================================
    function startBossCheckpoint(world) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        let qIdx = 0;
        const questions = world.activities;

        function renderBossStep() {
            if (qIdx < questions.length) {
                const act = questions[qIdx];
                card.innerHTML = `
                    <span class="tag" style="border-color:${world.color}; color:${world.color}; margin-bottom:8px;">
                        ${world.boss.name} · REPASO ${qIdx + 1}/5
                    </span>
                    <div class="recognition-hanzi" style="font-size:64px;">${act.hanzi}</div>
                    <h3 style="font-size:14px; margin-bottom:12px; color:#fff;">¿Cuál es la refacción o palabra compuesta?</h3>
                    <div class="career-quiz-grid" id="bossQuizGrid"></div>
                `;

                const dummyCompounds = ["电缆 (Cable)", "电机 (Motor)", "控制 (PLC)", "伺服轴 (Eje)", "气缸 (Cilindro)", "视觉 (AOI)"];
                const wrong = dummyCompounds.filter(c => !c.startsWith(act.compound)).sort(() => 0.5 - Math.random()).slice(0, 2);
                const opts = [`${act.compound} (${act.compoundMeaning})`, ...wrong].sort(() => 0.5 - Math.random());

                const grid = card.querySelector("#bossQuizGrid");
                opts.forEach(opt => {
                    const btn = document.createElement("button");
                    btn.className = "cf-btn-option";
                    btn.style.fontSize = "13px";
                    btn.style.padding = "12px 10px";
                    btn.textContent = opt;

                    btn.onclick = () => {
                        if (opt.startsWith(act.compound)) {
                            triggerHaptic("success");
                            btn.classList.add("btn-correct");
                            qIdx++;
                            setTimeout(renderBossStep, 350);
                        } else {
                            triggerHaptic("error");
                            btn.classList.add("btn-wrong");
                        }
                    };
                    grid.appendChild(btn);
                });
            } else {
                // FASE 4 DEL BOSS: ESCÁNER COMBINADO DE TODAS LAS ALARMAS
                renderBossPhase4Combined(world);
            }
        }

        function renderBossPhase4Combined(world) {
            const multiAlarms = [
                "ALM-99: 1号主电机过载, 导致伺服轴原位丢失并造成气缸低气压停机"
            ];

            card.innerHTML = `
                <span class="tag" style="border-color:${world.color}; color:${world.color}; margin-bottom:8px;">
                    ${world.boss.name} · FASE FINAL DE CERTIFICACIÓN
                </span>
                <p style="font-size:12px; color:#fff; font-weight:700; margin:6px 0 12px 0;">
                    Identifica el Hanzi de MOTOR (机) dentro de la alarma combinada:
                </p>

                <div class="hmi-alarm-scanner-box">
                    <div class="hmi-screen-header">
                        <small>CHECKPOINT MASTER SCANNER</small>
                        <span class="alarm-led-red">●</span>
                    </div>
                    <div class="hmi-tokens-container" id="bossTokensGrid"></div>
                </div>
            `;

            const tokensGrid = card.querySelector("#bossTokensGrid");
            multiAlarms[0].split("").forEach(c => {
                const b = document.createElement("button");
                b.className = "hmi-char-token";
                b.textContent = c;

                b.onclick = () => {
                    if (c === "机") {
                        triggerHaptic("win");
                        b.classList.add("token-hit");
                        career.assessmentPassed = true;
                        awardXP(world.boss.reward);

                        setTimeout(() => {
                            alert(`🏆 ¡CHECKPOINT CONQUISTADO! (+${world.boss.reward} XP)\nHas certificado el ${world.title} (${world.planetName}).`);
                            if (typeof window.navigateTo === "function") window.navigateTo("career");
                        }, 400);
                    } else {
                        triggerHaptic("error");
                        b.classList.add("token-miss");
                        setTimeout(() => b.classList.remove("token-miss"), 300);
                    }
                };
                tokensGrid.appendChild(b);
            });
        }

        renderBossStep();
    }

    // =====================================
    // 7. ARENA 1V1 CON 3 NIVELES DE DIFICULTAD
    // =====================================
    const VS_DIFFICULTIES = {
        EASY: {
            name: "Simulador de Enlace",
            badge: "FÁCIL",
            prob: 0.55,
            points: 50,
            rate: 2200,
            winBonus: 80,
            desc: "Rival estándar de calibración con velocidad moderada"
        },
        MEDIUM: {
            name: "Servocontrolador Overclock",
            badge: "MEDIO",
            prob: 0.70,
            points: 75,
            rate: 1700,
            winBonus: 120,
            desc: "IA de planta con alta cadencia de respuesta"
        },
        HARD: {
            name: "Protocolo Centinela IA",
            badge: "EXPERTO",
            prob: 0.85,
            points: 100,
            rate: 1200,
            winBonus: 200,
            desc: "Velocidad extrema: Requiere racha PERFECT para ganar"
        }
    };

    let selectedVsDiffKey = "MEDIUM";
    let vsTimer = null;
    let vsTimeLeft = 20;
    let myVsPoints = 0;
    let rivalVsPoints = 0;

    window.openVsMode = () => {
        stopVsSession();
        triggerHaptic("success");
        if (typeof window.navigateTo === "function") {
            window.navigateTo("vsBattle");
        }
        document.getElementById("vsDifficultySelector").style.display = "block";
        document.getElementById("vsBattleArenaContainer").style.display = "none";
        document.getElementById("vsDefeatScreen").style.display = "none";
    };

    window.start1v1WithDifficulty = (diffKey) => {
        selectedVsDiffKey = diffKey;
        const diff = VS_DIFFICULTIES[diffKey];

        document.getElementById("vsDifficultySelector").style.display = "none";
        document.getElementById("vsBattleArenaContainer").style.display = "block";
        document.getElementById("vsDefeatScreen").style.display = "none";

        document.getElementById("vsRivalName").textContent = diff.name;
        document.getElementById("vsRivalAvatar").textContent = diffKey === "HARD" ? "⚡" : diffKey === "MEDIUM" ? "🤖" : "⚙️";
        document.getElementById("vsDiffBadge").textContent = diff.badge;

        myVsPoints = 0;
        rivalVsPoints = 0;
        vsTimeLeft = 20;

        document.getElementById("vsMyScore").textContent = "0 PTS";
        document.getElementById("vsRivalScore").textContent = "0 PTS";
        document.getElementById("vsSeconds").textContent = vsTimeLeft;

        startVsRound();
    };

    function startVsRound() {
        stopVsSession();
        const diff = VS_DIFFICULTIES[selectedVsDiffKey];
        const timerBar = document.getElementById("vsTimerBar");

        vsTimer = setInterval(() => {
            vsTimeLeft--;
            document.getElementById("vsSeconds").textContent = vsTimeLeft;
            if (timerBar) timerBar.style.width = `${(vsTimeLeft / 20) * 100}%`;

            if (window.ZidongAudio && window.ZidongAudio.playClockTick) {
                window.ZidongAudio.playClockTick(vsTimeLeft % 2 === 0);
            }

            // IA anota según la dificultad seleccionada
            if (Math.random() < diff.prob) {
                rivalVsPoints += diff.points;
                document.getElementById("vsRivalScore").textContent = `${rivalVsPoints} PTS`;
            }

            if (vsTimeLeft <= 0) {
                stopVsSession();
                finishVsBattle();
            }
        }, 1000);

        loadVsQuestion();
    }

    function loadVsQuestion() {
        const pool = LAB_COMPONENTS;
        const item = pool[Math.floor(Math.random() * pool.length)];
        document.getElementById("vsHanziDisplay").textContent = item.hanzi;

        const otherMeanings = pool.filter(a => a.es !== item.es).map(a => a.es);
        const shuffled = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 2);
        const options = [item.es, ...shuffled].sort(() => 0.5 - Math.random());

        const grid = document.getElementById("vsOptionsGrid");
        grid.replaceChildren();

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "cf-btn-option";
            btn.style.fontSize = "13px";
            btn.style.padding = "11px 10px";
            btn.textContent = opt;

            btn.onclick = () => {
                const allButtons = grid.querySelectorAll("button");
                allButtons.forEach(b => b.style.pointerEvents = "none");

                if (opt === item.es) {
                    triggerHaptic("success");
                    btn.classList.add("btn-correct");
                    myVsPoints += 100;
                    document.getElementById("vsMyScore").textContent = `${myVsPoints} PTS`;
                    setTimeout(loadVsQuestion, 240);
                } else {
                    triggerHaptic("error");
                    btn.classList.add("btn-wrong");
                    vsTimeLeft = Math.max(0, vsTimeLeft - 3);
                    document.getElementById("vsSeconds").textContent = vsTimeLeft;
                    setTimeout(loadVsQuestion, 300);
                }
            };
            grid.appendChild(btn);
        });
    }

    function finishVsBattle() {
        stopVsSession();
        const diff = VS_DIFFICULTIES[selectedVsDiffKey];
        const win = myVsPoints >= rivalVsPoints;

        // Registrar récord en localStorage por dificultad
        const recordKey = `zidong_vs_best_${selectedVsDiffKey.toLowerCase()}`;
        const prevBest = Number(localStorage.getItem(recordKey) || 0);
        if (myVsPoints > prevBest) {
            localStorage.setItem(recordKey, myVsPoints);
        }

        if (win) {
            triggerHaptic("win");
            awardXP(diff.winBonus);
            const currentWins = Number(localStorage.getItem("zidong_vs_wins") || 0) + 1;
            localStorage.setItem("zidong_vs_wins", currentWins);
            alert(`🏆 ¡VICTORIA! Superaste a "${diff.name}" con ${myVsPoints} vs ${rivalVsPoints} PTS (+${diff.winBonus} XP)`);
            renderAchievements();
            renderBadgesGrid();
            updateProfile();
            if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
        } else {
            triggerHaptic("error");
            if (window.ZidongAudio && window.ZidongAudio.playLineCollapse) {
                window.ZidongAudio.playLineCollapse();
            }

            document.getElementById("vsBattleArenaContainer").style.display = "none";
            const defeatScreen = document.getElementById("vsDefeatScreen");
            defeatScreen.style.display = "block";

            document.getElementById("vsDefeatRivalAvatar").textContent = selectedVsDiffKey === "HARD" ? "⚡" : "🤖";
            document.getElementById("vsDefeatScores").textContent = `${currentUserData.name}: ${myVsPoints} PTS vs ${diff.name}: ${rivalVsPoints} PTS`;
        }
    }

    function stopVsSession() {
        clearInterval(vsTimer);
        vsTimer = null;
    }

    window.stopVsSession = stopVsSession;

    // =====================================
    // 8. CURIOSIDADES GRAMATICALES TÉCNICAS DEL CYBERDOG
    // =====================================
    function getCompanionMessages() {
        const rawName = (currentUserData.name || "New user").trim();
        const isChilaquil = rawName.toLowerCase() === "chilaquil";

        const chilaquilMessage = isChilaquil
            ? `Chilaquil... ¡jajaja te la creíste! Ahora te falta la salsa verde y la crema 🐶🌶️`
            : `${rawName}... te quedaría mejor Chilaquil 🐶🔥`;

        return [
            chilaquilMessage,
            `Dato de Hanzi: 线 (cable) tiene el radical 纟 a la izquierda, que significa 'fibra/seda'. En chino, el lado izquierdo suele dar la pista del material. 🧵`,
            `¿Sabías que un solo Hanzi pueden ser 3 juntos? En 机 (máquina), 木 es madera y 几 es mesa: el concepto original de telar industrial. ⚙️`,
            `Curiosidad técnica: El carácter 电 (diàn) originalmente era el dibujo de un rayo cayendo de las nubes en tormenta. ⚡`,
            `Regla de oro: En chino no hay conjugaciones de verbos enredadas como en español. Solo pones partículas como 了 para pasado. 💡`,
            `Tip de piso: El radical 钅 (jīn) indica metal en herramientas: 铁 (hierro), 钻 (broca), 钉 (perno de fijación). 🛠️`,
            `¡Terminal OBERON en línea! Modo Survivor con +3 segundos por alarma retirada. 🚨`
        ];
    }

    let lastMsgIndex = -1;
    function interactWithCompanion() {
        const bubbleText = document.getElementById("companionText");
        const dogImg = document.getElementById("companionVisual");

        triggerHaptic("success");

        const messages = getCompanionMessages();
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * messages.length);
        } while (nextIndex === lastMsgIndex);
        lastMsgIndex = nextIndex;

        if (bubbleText) {
            bubbleText.style.opacity = "0";
            setTimeout(() => {
                bubbleText.textContent = messages[nextIndex];
                bubbleText.style.opacity = "1";
            }, 120);
        }

        if (dogImg) {
            dogImg.style.transform = "scale(0.92) translateY(4px)";
            setTimeout(() => { dogImg.style.transform = "scale(1) translateY(0)"; }, 180);
        }
    }

    // =====================================
    // 9. LABORATORIO (LAB)
    // =====================================
    let currentLabCategory = "all";

    function renderLabComponents(filteredList = null) {
        const container = document.getElementById("labComponentsContainer");
        if (!container) return;

        let list = filteredList;
        if (!list) {
            list = currentLabCategory === "all" 
                ? LAB_COMPONENTS 
                : LAB_COMPONENTS.filter(c => c.cat === currentLabCategory);
        }

        container.replaceChildren();

        list.forEach(comp => {
            const card = document.createElement("div");
            card.className = "comp-card";
            card.innerHTML = `
                <div class="comp-header">
                    <span class="comp-hanzi">${comp.hanzi}</span>
                    <span class="comp-pinyin">${comp.pinyin}</span>
                </div>
                <strong>${comp.es}</strong>
                <small>${comp.part} · ${comp.catName}</small>
            `;
            card.onclick = () => {
                triggerHaptic("success");
                alert(`🔬 ${comp.hanzi} (${comp.pinyin})
Significado: ${comp.es}
Aplicación: ${comp.part}
Planeta: ${comp.catName}`);
            };
            container.appendChild(card);
        });
    }

    window.filterLabCategory = (cat, btnEl) => {
        currentLabCategory = cat;
        document.querySelectorAll(".lab-tab-btn").forEach(b => b.classList.remove("active"));
        if (btnEl) btnEl.classList.add("active");
        renderLabComponents();
    };

    window.filterLabComponents = (query) => {
        const q = query.trim().toLowerCase();
        if (!q) {
            renderLabComponents();
            return;
        }
        const filtered = LAB_COMPONENTS.filter(c => 
            c.hanzi.includes(q) || c.pinyin.toLowerCase().includes(q) || c.es.toLowerCase().includes(q) || c.part.toLowerCase().includes(q)
        );
        renderLabComponents(filtered);
    };

    // =====================================
    // 10. ESCALAFÓN DE RANGOS
    // =====================================
    function renderRanksSection() {
        const container = document.getElementById("ranksLadderContainer");
        const headerBadge = document.getElementById("topRankBadge");
        const profileRankBadge = document.getElementById("profileRankBadge");
        if (!container) return;

        const current = getCurrentRank(currentUserData.xp);

        if (headerBadge) headerBadge.textContent = `${current.icon} ${current.name}`;
        if (profileRankBadge) profileRankBadge.textContent = `${current.icon} ${current.name} (Rango ${current.id}/10)`;

        container.replaceChildren();

        INDUSTRIAL_RANKS.forEach(rank => {
            const isReached = currentUserData.xp >= rank.minXP;
            const isCurrent = rank.id === current.id;

            const card = document.createElement("div");
            card.className = `rank-ladder-card ${isReached ? "reached" : "locked"} ${isCurrent ? "current-rank" : ""}`;

            card.innerHTML = `
                <div class="rank-icon-box">${rank.icon}</div>
                <div class="rank-info-box">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${rank.id}. ${rank.name}</strong>
                        <span class="rank-xp-req">${rank.minXP.toLocaleString("en-US")} XP</span>
                    </div>
                    <small>${rank.desc}</small>
                </div>
                <div class="rank-status-tag">
                    ${isCurrent ? "<span class='badge-current'>ACTUAL</span>" : isReached ? "✓" : "🔒"}
                </div>
            `;
            container.appendChild(card);
        });
    }

    // =====================================
    // 11. PERFIL CON RÉCORDS DE 1V1 Y SURVIVOR
    // =====================================
    function updateProfile() {
        const xp = document.getElementById("profileXP");
        const level = document.getElementById("profileLevel");
        const streak = document.getElementById("profileStreak");
        const completed = document.getElementById("profileCompleted");

        if (xp) xp.textContent = Number(currentUserData.xp).toLocaleString("en-US");
        if (level) level.textContent = "05";
        if (streak) streak.textContent = "5 Días";
        if (completed) completed.textContent = career.completedActivities.length;

        // Récord de alarmas retiradas en Survivor
        const bestAlarms = localStorage.getItem("zidong_survivor_best_cleared") || "0";
        const totalAlarms = localStorage.getItem("zidong_survivor_total_cleared") || "0";
        const profBestEl = document.getElementById("profileSurvivorBest");
        if (profBestEl) profBestEl.textContent = `${bestAlarms} Alarmas (Total: ${totalAlarms})`;

        // Récords 1v1
        const bestEasy = localStorage.getItem("zidong_vs_best_easy") || "0";
        const bestMed = localStorage.getItem("zidong_vs_best_medium") || "0";
        const bestHard = localStorage.getItem("zidong_vs_best_hard") || "0";
        const profVsEl = document.getElementById("profileVsRecords");
        if (profVsEl) {
            profVsEl.innerHTML = `
                <span>Fácil: <strong>${bestEasy}</strong> pts</span> · 
                <span>Medio: <strong>${bestMed}</strong> pts</span> · 
                <span>Experto: <strong>${bestHard}</strong> pts</span>
            `;
        }

        const savedIcon = localStorage.getItem("zidong_equipped_badge") || currentUserData.initials;
        applyAvatarIcon(savedIcon);
        updateUserDisplay();
        renderBadgesGrid();
        renderRanksSection();
    }

    function renderBadgesGrid() {
        const container = document.getElementById("badgesContainer");
        if (!container) return;

        container.replaceChildren();
        const currentEquipped = localStorage.getItem("zidong_equipped_badge") || currentUserData.initials;

        MEDALS_DB.forEach(medal => {
            const unlocked = medal.isUnlocked();
            const isEquipped = currentEquipped === medal.icon;

            const badgeEl = document.createElement("div");
            badgeEl.className = `badge-item ${unlocked ? "" : "locked"} ${isEquipped ? "equipped" : ""}`;
            badgeEl.innerHTML = `
                <span class="badge-icon">${unlocked ? medal.icon : "🔒"}</span>
                <span class="badge-title">${medal.name}</span>
            `;

            if (unlocked) {
                badgeEl.onclick = () => {
                    const newEquip = isEquipped ? currentUserData.initials : medal.icon;
                    localStorage.setItem("zidong_equipped_badge", newEquip);
                    triggerHaptic("success");
                    renderBadgesGrid();
                    applyAvatarIcon(newEquip);
                };
            }
            container.appendChild(badgeEl);
        });
    }

    function applyAvatarIcon(icon) {
        const profileAvatar = document.getElementById("profileAvatar");
        const topAvatar = document.getElementById("topAvatar");
        [profileAvatar, topAvatar].forEach(el => {
            if (!el) return;
            el.textContent = icon;
            if (icon !== "NU" && icon !== currentUserData.initials) el.classList.add("custom-icon");
            else el.classList.remove("custom-icon");
        });
    }

    function renderAchievements() {
        const container = document.getElementById("achievementsListContainer");
        const totalScoreEl = document.getElementById("totalGamerscore");
        if (!container) return;

        container.replaceChildren();
        let totalG = 0;

        XBOX_ACHIEVEMENTS.forEach(ach => {
            const isUnlocked = ach.unlocked();
            if (isUnlocked) totalG += ach.score;

            const card = document.createElement("div");
            card.className = `achieve-card ${isUnlocked ? "unlocked" : "locked"}`;
            card.innerHTML = `
                <div class="achieve-icon">${isUnlocked ? ach.icon : "🔒"}</div>
                <div class="achieve-details">
                    <strong>${ach.title}</strong>
                    <small>${ach.desc}</small>
                </div>
                <div class="achieve-score">
                    <span>${ach.score}</span>
                    <strong>G</strong>
                </div>
            `;
            container.appendChild(card);
        });

        if (totalScoreEl) totalScoreEl.textContent = `${totalG} G`;
    }

    // DAILY REWARD MODAL ESTÉTICO
    window.claimDailyReward = () => {
        const lastClaim = localStorage.getItem("zidong_last_daily_claim");
        const today = new Date().toDateString();

        const modal = document.getElementById("dailyRewardModal");
        const claimBtn = document.getElementById("btnClaimRewardAction");
        const titleEl = document.getElementById("rewardModalTitle");
        const descEl = document.getElementById("rewardModalDesc");

        if (lastClaim === today) {
            triggerHaptic("error");
            titleEl.textContent = "¡RECOMPENSA RECLAMADA!";
            descEl.textContent = "Ya recibiste tus +100 XP de guardia hoy. Vuelve en el siguiente cambio de turno.";
            claimBtn.textContent = "ENTENDIDO";
            claimBtn.onclick = () => { modal.style.display = "none"; };
        } else {
            triggerHaptic("win");
            titleEl.textContent = "¡BONO DE TURNO OBERON!";
            descEl.textContent = "Has recibido +100 XP por inicio de operaciones en el sistema.";
            claimBtn.textContent = "RECLAMAR +100 XP 🎁";
            claimBtn.onclick = () => {
                awardXP(100);
                localStorage.setItem("zidong_last_daily_claim", today);
                triggerHaptic("success");
                modal.style.display = "none";
                const sub = document.getElementById("dailyRewardSubtitle");
                if (sub) sub.textContent = "¡Reclamado hoy! ✓";
            };
        }

        modal.style.display = "flex";
    };

    window.closeRewardModal = (e) => {
        if (e.target.id === "dailyRewardModal") {
            document.getElementById("dailyRewardModal").style.display = "none";
        }
    };

    window.toggleDailyMissionsModal = () => {
        const modal = document.getElementById("dailyMissionsModal");
        if (!modal) return;
        const isHidden = modal.style.display === "none";
        modal.style.display = isHidden ? "flex" : "none";
        if (isHidden) triggerHaptic("success");
    };

    window.closeMissionsModal = (e) => {
        if (e.target.id === "dailyMissionsModal") window.toggleDailyMissionsModal();
    };

    // SPLASH SCREEN 10s
    function checkFirstTimeSplash() {
        const hasLoaded = sessionStorage.getItem("oberon_splash_done");
        const splash = document.getElementById("oberonSplashScreen");
        if (!splash) return;

        if (hasLoaded) {
            splash.style.display = "none";
            return;
        }

        splash.style.display = "flex";
        let progress = 0;
        const bar = document.getElementById("splashLoadingFill");
        const statusText = document.getElementById("splashStatusText");

        const steps = [
            "Conectando al enlace cuántico de OBERON...",
            "Sincronizando telemetría de Voltaria y Kinetix...",
            "Calibrando cilindros neumáticos de Aethel...",
            "Inicializando algoritmos de visión en Lumina...",
            "Conexión neural establecida. Sistema seguro."
        ];

        const splashTimer = setInterval(() => {
            progress += 1;
            if (bar) bar.style.width = `${progress * 10}%`;
            if (statusText) {
                const stepIdx = Math.min(Math.floor(progress / 2), steps.length - 1);
                statusText.textContent = steps[stepIdx];
            }

            if (progress >= 10) {
                clearInterval(splashTimer);
                sessionStorage.setItem("oberon_splash_done", "true");
                setTimeout(() => {
                    splash.style.opacity = "0";
                    setTimeout(() => { splash.style.display = "none"; }, 350);
                }, 200);
            }
        }, 1000);

        window.skipSplashLoading = () => {
            clearInterval(splashTimer);
            sessionStorage.setItem("oberon_splash_done", "true");
            splash.style.display = "none";
        };
    }

    function initializeApplication() {
        loadSavedProgress();
        updateUserDisplay();
        renderCareerPlanetsMenu();
        renderLabComponents();
        renderRanksSection();
        renderAchievements();
        updateProfile();
        checkFirstTimeSplash();

        if (window.ZidongAudio) {
            window.ZidongAudio.switchTrack("dashboard");
        }

        console.log("--------------------------------");
        console.log("ZIDONG CORE 8.0: ONLINE");
        console.log("--------------------------------");
    }

    window.awardXP = awardXP;
    window.renderCareerPlanetsMenu = renderCareerPlanetsMenu;
    window.interactWithCompanion = interactWithCompanion;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApplication);
    } else {
        initializeApplication();
    }

})();
