/* ==========================================================================
   ZIDONG CORE 12.0 - SISTEMA INDUSTRIAL INTEGRAL
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

    const STORAGE_KEY = "zidong_core_progress_v12";

    // 1. LOS 5 MUNDOS DE MANUFACTURA (8 HANZI CADA UNO)
    const WORLDS_CONFIG = [
        {
            id: "world_1",
            title: "MUNDO ELÉCTRICO",
            subtitle: "Planeta Voltaria · Potencia y Señales",
            planetName: "Planeta Voltaria",
            icon: "⚡",
            color: "#27d8e8",
            planetClass: "planet-electric",
            unlocked: true,
            activities: [
                { id: "w1_01", hanzi: "电", pinyin: "diàn", meaning: "Electricidad", compound: "电缆", compoundMeaning: "Cable eléctrico", alarmSentence: "ALM-01: 2号站电缆断开停机", alarmTarget: "电", reward: 80 },
                { id: "w1_02", hanzi: "机", pinyin: "jī", meaning: "Máquina / Motor", compound: "电机", compoundMeaning: "Motor eléctrico", alarmSentence: "ALM-02: 伺服电机堵转故障报警", alarmTarget: "机", reward: 80 },
                { id: "w1_03", hanzi: "线", pinyin: "xiàn", meaning: "Línea / Cable", compound: "电线", compoundMeaning: "Cableado de control", alarmSentence: "ALM-03: 控制电线接触不良警报", alarmTarget: "线", reward: 80 },
                { id: "w1_04", hanzi: "力", pinyin: "lì", meaning: "Fuerza / Potencia", compound: "动力", compoundMeaning: "Potencia motriz", alarmSentence: "ALM-04: 主轴动力不足警告", alarmTarget: "力", reward: 80 },
                { id: "w1_05", hanzi: "控", pinyin: "kòng", meaning: "Control / PLC", compound: "控制", compoundMeaning: "Controlador PLC", alarmSentence: "ALM-05: PLC控制器通讯中断", alarmTarget: "控", reward: 80 },
                { id: "w1_06", hanzi: "源", pinyin: "yuán", meaning: "Fuente / Origen", compound: "电源", compoundMeaning: "Fuente 24V", alarmSentence: "ALM-06: 24V电源过载保护触发", alarmTarget: "源", reward: 80 },
                { id: "w1_07", hanzi: "缆", pinyin: "lǎn", meaning: "Cable blindado", compound: "光缆", compoundMeaning: "Cable de fibra", alarmSentence: "ALM-07: 通讯光缆信号丢失", alarmTarget: "缆", reward: 80 },
                { id: "w1_08", hanzi: "路", pinyin: "lù", meaning: "Circuito / Vía", compound: "短路", compoundMeaning: "Cortocircuito", alarmSentence: "ALM-08: 驱动电路发生短路", alarmTarget: "路", reward: 80 }
            ],
            boss: {
                id: "boss_world_1",
                name: "CHECKPOINT: VOLTARIA",
                badgeId: "badge_voltaria",
                badgeName: "Conquistador de Voltaria",
                badgeIcon: "⚡",
                sequence: [
                    { esName: "Cable", targetHanzi: "缆" },
                    { esName: "Motor", targetHanzi: "机" },
                    { esName: "Electricidad", targetHanzi: "电" }
                ],
                alarmSentence: "ALM-CHECK: 1号电缆磨损导致电机主电路短路停机",
                reward: 350
            }
        },
        {
            id: "world_2",
            title: "MUNDO MECÁNICO",
            subtitle: "Planeta Kinetix · Servos y Cinemática",
            planetName: "Planeta Kinetix",
            icon: "⚙️",
            color: "#ffc857",
            planetClass: "planet-mechanical",
            unlocked: true,
            activities: [
                { id: "w2_01", hanzi: "轴", pinyin: "zhóu", meaning: "Eje / Flecha", compound: "伺服轴", compoundMeaning: "Eje servo Z", alarmSentence: "ALM-11: Z轴原点复位超时", alarmTarget: "轴", reward: 100 },
                { id: "w2_02", hanzi: "转", pinyin: "zhuǎn", meaning: "Giro / Rotación", compound: "转速", compoundMeaning: "Velocidad RPM", alarmSentence: "ALM-12: 主轴转速异常超限", alarmTarget: "转", reward: 100 },
                { id: "w2_03", hanzi: "合", pinyin: "hé", meaning: "Cierre / Acople", compound: "离合器", compoundMeaning: "Embrague de banda", alarmSentence: "ALM-13: 离合器分离故障", alarmTarget: "合", reward: 100 },
                { id: "w2_04", hanzi: "紧", pinyin: "jǐn", meaning: "Ajuste / Apriete", compound: "紧固", compoundMeaning: "Sujeción de husillo", alarmSentence: "ALM-14: 夹具紧固不到位", alarmTarget: "紧", reward: 100 },
                { id: "w2_05", hanzi: "位", pinyin: "wèi", meaning: "Posición / Home", compound: "原位", compoundMeaning: "Posición HOME", alarmSentence: "ALM-15: 机械臂未在原位", alarmTarget: "位", reward: 100 },
                { id: "w2_06", hanzi: "轮", pinyin: "lún", meaning: "Rueda / Polea", compound: "齿轮", compoundMeaning: "Engranaje", alarmSentence: "ALM-16: 传动齿轮磨损报警", alarmTarget: "轮", reward: 100 },
                { id: "w2_07", hanzi: "杆", pinyin: "gān", meaning: "Vástago / Barra", compound: "丝杆", compoundMeaning: "Tornillo de bolas", alarmSentence: "ALM-17: 滚珠丝杆润滑不足", alarmTarget: "杆", reward: 100 },
                { id: "w2_08", hanzi: "齿", pinyin: "chǐ", meaning: "Diente / Engrane", compound: "齿条", compoundMeaning: "Cremallera", alarmSentence: "ALM-18: 齿条咬合卡死警告", alarmTarget: "齿", reward: 100 }
            ],
            boss: {
                id: "boss_world_2",
                name: "CHECKPOINT: KINETIX",
                badgeId: "badge_kinetix",
                badgeName: "Engranaje de Kinetix",
                badgeIcon: "⚙️",
                sequence: [
                    { esName: "Eje", targetHanzi: "轴" },
                    { esName: "Posición", targetHanzi: "位" },
                    { esName: "Giro", targetHanzi: "转" }
                ],
                alarmSentence: "ALM-CHECK: 进给轴未在原位即开始旋转导致联轴器卡死",
                reward: 400
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
                { id: "w3_01", hanzi: "气", pinyin: "qì", meaning: "Aire / Neumática", compound: "气缸", compoundMeaning: "Cilindro neumático", alarmSentence: "ALM-21: 顶升气缸动作超时", alarmTarget: "气", reward: 120 },
                { id: "w3_02", hanzi: "压", pinyin: "yā", meaning: "Presión Bar", compound: "气压", compoundMeaning: "Presión de aire", alarmSentence: "ALM-22: 主管路气压不足报警", alarmTarget: "压", reward: 120 },
                { id: "w3_03", hanzi: "阀", pinyin: "fá", meaning: "Válvula / Solenoide", compound: "电磁阀", compoundMeaning: "Solenoide neumático", alarmSentence: "ALM-23: 换向电磁阀无响应", alarmTarget: "阀", reward: 120 },
                { id: "w3_04", hanzi: "管", pinyin: "guǎn", meaning: "Tubo / Manguera", compound: "气管", compoundMeaning: "Manguera de aire", alarmSentence: "ALM-24: 供气管路破损警报", alarmTarget: "管", reward: 120 },
                { id: "w3_05", hanzi: "漏", pinyin: "lòu", meaning: "Fuga de aire", compound: "漏气", compoundMeaning: "Fuga neumática", alarmSentence: "ALM-25: 检测到真空吸盘漏气", alarmTarget: "漏", reward: 120 },
                { id: "w3_06", hanzi: "塞", pinyin: "sāi", meaning: "Tapón / Pistón", compound: "活塞", compoundMeaning: "Pistón neumático", alarmSentence: "ALM-26: 气缸活塞密封损坏", alarmTarget: "塞", reward: 120 },
                { id: "w3_07", hanzi: "缸", pinyin: "gāng", meaning: "Cilindro / Cámara", compound: "气缸", compoundMeaning: "Cilindro de agarre", alarmSentence: "ALM-27: 夹紧气缸未到位", alarmTarget: "缸", reward: 120 },
                { id: "w3_08", hanzi: "排", pinyin: "pái", meaning: "Escape / Purga", compound: "排气", compoundMeaning: "Escape de aire", alarmSentence: "ALM-28: 节流排气消音器堵塞", alarmTarget: "排", reward: 120 }
            ],
            boss: {
                id: "boss_world_3",
                name: "CHECKPOINT: AETHEL",
                badgeId: "badge_aethel",
                badgeName: "Maestro Neumático",
                badgeIcon: "💨",
                sequence: [
                    { esName: "Presión", targetHanzi: "压" },
                    { esName: "Válvula", targetHanzi: "阀" },
                    { esName: "Fuga", targetHanzi: "漏" }
                ],
                alarmSentence: "ALM-CHECK: 供气气压突降, 确认电磁阀密封圈漏气",
                reward: 450
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
                { id: "w4_01", hanzi: "手", pinyin: "shǒu", meaning: "Brazo / Gripper", compound: "机械手", compoundMeaning: "Robot manipulador", alarmSentence: "ALM-31: 机械手碰撞急停", alarmTarget: "手", reward: 150 },
                { id: "w4_02", hanzi: "车", pinyin: "chē", meaning: "Carro / AGV", compound: "导引车", compoundMeaning: "Carro AGV autónomo", alarmSentence: "ALM-32: 4号自动导引车偏离磁条", alarmTarget: "车", reward: 150 },
                { id: "w4_03", hanzi: "点", pinyin: "diǎn", meaning: "Punto / Coordenada", compound: "示教点", compoundMeaning: "Teach Point", alarmSentence: "ALM-33: 示教点数据校验错误", alarmTarget: "点", reward: 150 },
                { id: "w4_04", hanzi: "速", pinyin: "sù", meaning: "Velocidad", compound: "减速", compoundMeaning: "Reductor de velocidad", alarmSentence: "ALM-34: 减速机油温过高", alarmTarget: "速", reward: 150 },
                { id: "w4_05", hanzi: "避", pinyin: "bì", meaning: "Evadir / Obstáculo", compound: "避障", compoundMeaning: "Sensor Lidar", alarmSentence: "ALM-35: 激光避障雷达被遮挡", alarmTarget: "避", reward: 150 },
                { id: "w4_06", hanzi: "停", pinyin: "tíng", meaning: "Parada / Stop", compound: "暂停", compoundMeaning: "Pausa en celda", alarmSentence: "ALM-36: 机器人进入安全暂停", alarmTarget: "停", reward: 150 },
                { id: "w4_07", hanzi: "臂", pinyin: "bì", meaning: "Brazo articulado", compound: "手臂", compoundMeaning: "Brazo Fanuc", alarmSentence: "ALM-37: 关节手臂力矩超限", alarmTarget: "臂", reward: 150 },
                { id: "w4_08", hanzi: "夹", pinyin: "jiā", meaning: "Pinza / Sujetar", compound: "夹爪", compoundMeaning: "Pinza neumática", alarmSentence: "ALM-38: 末端夹爪零件掉落", alarmTarget: "夹", reward: 150 }
            ],
            boss: {
                id: "boss_world_4",
                name: "CHECKPOINT: MACHINA",
                badgeId: "badge_machina",
                badgeName: "Arquitecto de Machina",
                badgeIcon: "🤖",
                sequence: [
                    { esName: "Carro (AGV)", targetHanzi: "车" },
                    { esName: "Brazo", targetHanzi: "手" },
                    { esName: "Evadir", targetHanzi: "避" }
                ],
                alarmSentence: "ALM-CHECK: 导引车靠近机械手取料工位, 触发避障急停",
                reward: 500
            }
        },
        {
            id: "world_5",
            title: "MUNDO VISIÓN AOI",
            subtitle: "Planeta Lumina · Óptica e Inspección",
            planetName: "Planeta Lumina",
            icon: "👁️",
            color: "#ff7777",
            planetClass: "planet-vision",
            unlocked: true,
            activities: [
                { id: "w5_01", hanzi: "光", pinyin: "guāng", meaning: "Luz / Lámpara", compound: "光源", compoundMeaning: "Lámpara estroboscópica", alarmSentence: "ALM-41: 视觉光源亮度不足", alarmTarget: "光", reward: 180 },
                { id: "w5_02", hanzi: "镜", pinyin: "jìng", meaning: "Lente / Cámara", compound: "镜头", compoundMeaning: "Lente de enfoque", alarmSentence: "ALM-42: 工业镜头污损检测失败", alarmTarget: "镜", reward: 180 },
                { id: "w5_03", hanzi: "视", pinyin: "shì", meaning: "Visión / Detección", compound: "视觉", compoundMeaning: "Sistema de visión", alarmSentence: "ALM-43: AOI视觉比对未通过", alarmTarget: "视", reward: 180 },
                { id: "w5_04", hanzi: "检", pinyin: "jiǎn", meaning: "Inspección / Test", compound: "检测", compoundMeaning: "Test de calidad", alarmSentence: "ALM-44: 焊点尺寸检测异常", alarmTarget: "检", reward: 180 },
                { id: "w5_05", hanzi: "错", pinyin: "cuò", meaning: "Falso / Error", compound: "误检", compoundMeaning: "Falso rechazo en línea", alarmSentence: "ALM-45: 发生连续误检停线", alarmTarget: "错", reward: 180 },
                { id: "w5_06", hanzi: "焦", pinyin: "jiāo", meaning: "Enfoque / Foco", compound: "对焦", compoundMeaning: "Autoenfoque", alarmSentence: "ALM-46: 工业相机对焦失败", alarmTarget: "焦", reward: 180 },
                { id: "w5_07", hanzi: "色", pinyin: "sè", meaning: "Color / Pigmento", compound: "颜色", compoundMeaning: "Color de PCB", alarmSentence: "ALM-47: 阻焊颜色识别超差", alarmTarget: "色", reward: 180 },
                { id: "w5_08", hanzi: "像", pinyin: "xiàng", meaning: "Imagen / Cuadro", compound: "图像", compoundMeaning: "Captura de imagen", alarmSentence: "ALM-48: 图像采集卡掉帧报警", alarmTarget: "像", reward: 180 }
            ],
            boss: {
                id: "boss_world_5",
                name: "CHECKPOINT: LUMINA",
                badgeId: "badge_lumina",
                badgeName: "Ojo de Lumina",
                badgeIcon: "👁️",
                sequence: [
                    { esName: "Luz", targetHanzi: "光" },
                    { esName: "Lente", targetHanzi: "镜" },
                    { esName: "Inspección", targetHanzi: "检" }
                ],
                alarmSentence: "ALM-CHECK: 环形光源闪烁导致镜头曝光过度, 焊点检测失败",
                reward: 600
            }
        }
    ];

    // BANCO DEL LABORATORIO (COMPONENTES)
    const LAB_COMPONENTS = [
        { hanzi: "电", pinyin: "diàn", es: "Electricidad", cat: "world_1", catName: "⚡ Voltaria", part: "电缆 (Cable)" },
        { hanzi: "机", pinyin: "jī", es: "Máquina / Motor", cat: "world_1", catName: "⚡ Voltaria", part: "电机 (Motor)" },
        { hanzi: "线", pinyin: "xiàn", es: "Línea / Cable", cat: "world_1", catName: "⚡ Voltaria", part: "电线 (Cableado)" },
        { hanzi: "力", pinyin: "lì", es: "Fuerza / Potencia", cat: "world_1", catName: "⚡ Voltaria", part: "动力 (Potencia)" },
        { hanzi: "控", pinyin: "kòng", es: "Control / PLC", cat: "world_1", catName: "⚡ Voltaria", part: "控制 (Control)" },
        { hanzi: "源", pinyin: "yuán", es: "Fuente de poder", cat: "world_1", catName: "⚡ Voltaria", part: "电源 (Fuente 24V)" },
        { hanzi: "缆", pinyin: "lǎn", es: "Cable blindado", cat: "world_1", catName: "⚡ Voltaria", part: "光缆 (Fibra)" },
        { hanzi: "路", pinyin: "lù", es: "Circuito", cat: "world_1", catName: "⚡ Voltaria", part: "短路 (Corto)" },

        { hanzi: "轴", pinyin: "zhóu", es: "Eje / Flecha", cat: "world_2", catName: "⚙️ Kinetix", part: "伺服轴 (Eje Z)" },
        { hanzi: "转", pinyin: "zhuǎn", es: "Giro / RPM", cat: "world_2", catName: "⚙️ Kinetix", part: "转速 (Velocidad)" },
        { hanzi: "合", pinyin: "hé", es: "Acople", cat: "world_2", catName: "⚙️ Kinetix", part: "离合器 (Embrague)" },
        { hanzi: "紧", pinyin: "jǐn", es: "Sujeción", cat: "world_2", catName: "⚙️ Kinetix", part: "紧固 (Tornillería)" },
        { hanzi: "位", pinyin: "wèi", es: "Posición", cat: "world_2", catName: "⚙️ Kinetix", part: "原位 (Home)" },
        { hanzi: "轮", pinyin: "lún", es: "Rueda / Polea", cat: "world_2", catName: "⚙️ Kinetix", part: "齿轮 (Engrane)" },
        { hanzi: "杆", pinyin: "gān", es: "Tornillo de bolas", cat: "world_2", catName: "⚙️ Kinetix", part: "丝杆 (Husillo)" },
        { hanzi: "齿", pinyin: "chǐ", es: "Diente de engrane", cat: "world_2", catName: "⚙️ Kinetix", part: "齿条 (Cremallera)" },

        { hanzi: "气", pinyin: "qì", es: "Neumática", cat: "world_3", catName: "💨 Aethel", part: "气缸 (Cilindro)" },
        { hanzi: "压", pinyin: "yā", es: "Presión Bar", cat: "world_3", catName: "💨 Aethel", part: "气压 (Regulador)" },
        { hanzi: "阀", pinyin: "fá", es: "Válvula", cat: "world_3", catName: "💨 Aethel", part: "电磁阀 (Solenoide)" },
        { hanzi: "管", pinyin: "guǎn", es: "Tubo de aire", cat: "world_3", catName: "💨 Aethel", part: "气管 (Manguera)" },
        { hanzi: "漏", pinyin: "lòu", es: "Fuga de aire", cat: "world_3", catName: "💨 Aethel", part: "漏气 (Fuga)" },

        { hanzi: "手", pinyin: "shǒu", es: "Brazo Robot", cat: "world_4", catName: "🤖 Machina", part: "机械手 (Fanuc)" },
        { hanzi: "车", pinyin: "chē", es: "Carro AGV", cat: "world_4", catName: "🤖 Machina", part: "导引车 (AGV)" },
        { hanzi: "点", pinyin: "diǎn", es: "Punto Teach", cat: "world_4", catName: "🤖 Machina", part: "示教点 (Punto)" },
        { hanzi: "速", pinyin: "sù", es: "Velocidad", cat: "world_4", catName: "🤖 Machina", part: "减速 (Reductor)" },
        { hanzi: "避", pinyin: "bì", es: "Evasión Lidar", cat: "world_4", catName: "🤖 Machina", part: "避障 (Sensor)" },

        { hanzi: "光", pinyin: "guāng", es: "Sensor Óptico", cat: "world_5", catName: "👁️ Lumina", part: "光源 (Lámpara)" },
        { hanzi: "镜", pinyin: "jìng", es: "Lente cámara", cat: "world_5", catName: "👁️ Lumina", part: "镜头 (Lente)" },
        { hanzi: "视", pinyin: "shì", es: "Visión AOI", cat: "world_5", catName: "👁️ Lumina", part: "视觉 (AOI)" },
        { hanzi: "检", pinyin: "jiǎn", es: "Inspección", cat: "world_5", catName: "👁️ Lumina", part: "检测 (Test)" },
        { hanzi: "错", pinyin: "cuò", es: "Falso rechazo", cat: "world_5", catName: "👁️ Lumina", part: "误检 (Rechazo)" }
    ];

    // RANGOS PROFESIONALES (0 A 45,000 XP)
    const INDUSTRIAL_RANKS = [
        { id: 1, name: "Becario", minXP: 0, maxXP: 800, icon: "📋", desc: "Familiarización con la línea y simbología" },
        { id: 2, name: "Practicante", minXP: 800, maxXP: 2000, icon: "🔰", desc: "Apoyo en cambio de herramentales y verificación visual" },
        { id: 3, name: "Operador", minXP: 2000, maxXP: 4000, icon: "⚙️", desc: "Operación de estaciones automatizadas en Voltaria" },
        { id: 4, name: "Operador Especializado", minXP: 4000, maxXP: 7000, icon: "🛠️", desc: "Calibración de husillos y reseteo de fallas" },
        { id: 5, name: "Técnico Jr", minXP: 7000, maxXP: 11000, icon: "⚡", desc: "Diagnóstico eléctrico de señales I/O y relevadores" },
        { id: 6, name: "Técnico Sr", minXP: 11000, maxXP: 16000, icon: "🔧", desc: "Mantenimiento preventivo a servomotores y neumática" },
        { id: 7, name: "Ingeniero Jr", minXP: 16000, maxXP: 22000, icon: "💻", desc: "Comisionamiento de sub-estaciones PLC y buses" },
        { id: 8, name: "Ingeniero Full", minXP: 22000, maxXP: 30000, icon: "🚀", desc: "Optimización de tiempo de ciclo SMT y celdas Kinetix" },
        { id: 9, name: "Ingeniero Sr", minXP: 30000, maxXP: 45000, icon: "🏅", desc: "Arquitectura de celdas robóticas y enlace SCADA" },
        { id: 10, name: "Maestro de Programación", minXP: 45000, maxXP: 99999, icon: "👑", desc: "Guardián Supremo de OBERON: Cero Downtime" }
    ];

    // MEDALLAS (INCLUYENDO MEDALLAS DE MODO CARRERA)
    const MEDALS_DB = [
        { id: "b_practicante", icon: "🔰", name: "Practicante de Automatización", desc: "Insignia oficial de bienvenida a OBERON", isUnlocked: () => true },
        { id: "badge_voltaria", icon: "⚡", name: "Conquistador de Voltaria", desc: "Supera el Boss Checkpoint del Mundo Eléctrico", isUnlocked: (prog) => Boolean(prog.career && prog.career.bossBeaten && prog.career.bossBeaten["boss_world_1"]) },
        { id: "badge_kinetix", icon: "⚙️", name: "Engranaje de Kinetix", desc: "Supera el Boss Checkpoint del Mundo Mecánico", isUnlocked: (prog) => Boolean(prog.career && prog.career.bossBeaten && prog.career.bossBeaten["boss_world_2"]) },
        { id: "badge_aethel", icon: "💨", name: "Maestro Neumático", desc: "Supera el Boss Checkpoint del Mundo Neumático", isUnlocked: (prog) => Boolean(prog.career && prog.career.bossBeaten && prog.career.bossBeaten["boss_world_3"]) },
        { id: "badge_machina", icon: "🤖", name: "Arquitecto de Machina", desc: "Supera el Boss Checkpoint del Mundo Robótico", isUnlocked: (prog) => Boolean(prog.career && prog.career.bossBeaten && prog.career.bossBeaten["boss_world_4"]) },
        { id: "badge_lumina", icon: "👁️", name: "Ojo de Lumina", desc: "Supera el Boss Checkpoint del Mundo Visión AOI", isUnlocked: (prog) => Boolean(prog.career && prog.career.bossBeaten && prog.career.bossBeaten["boss_world_5"]) },
        { id: "b_ai_slayer", icon: "⚔️", name: "Derrotador de IA", desc: "Vence a la IA en el duelo 1v1 Battle", isUnlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
        { id: "b_troubleshooter", icon: "🚨", name: "Solucionador de Fallas", desc: "Retira al menos 1 alarma en Survivor Mode", isUnlocked: () => Number(localStorage.getItem("zidong_survivor_wins") || 0) >= 1 },
        { id: "b_overclock", icon: "⭐", name: "Overclock 3★", desc: "Consigue 3 estrellas en cualquier test", isUnlocked: (prog) => Boolean(prog.career && prog.career.nodeStars && Object.values(prog.career.nodeStars).some(s => s >= 3)) }
    ];

    // ESTADO DEL USUARIO
    const career = {
        completedActivities: ["w1_01"],
        assessmentPassed: false,
        nodeStars: { "w1_01": 3 },
        bossBeaten: {}
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
                    career.completedActivities = saved.career.completedActivities || ["w1_01"];
                    career.assessmentPassed = Boolean(saved.career.assessmentPassed);
                    career.nodeStars = saved.career.nodeStars || { "w1_01": 3 };
                    career.bossBeaten = saved.career.bossBeaten || {};
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
                    nodeStars: career.nodeStars,
                    bossBeaten: career.bossBeaten
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
        updateEnergyBatteryDisplay();
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

    function updateEnergyBatteryDisplay() {
        const fill = document.getElementById("homeBatteryFill");
        const valText = document.getElementById("homeBatteryXpValue");
        const rankText = document.getElementById("homeBatteryRank");
        const pctText = document.getElementById("homeBatteryPercent");

        const curRank = getCurrentRank(currentUserData.xp);
        const xpInLevel = Math.max(0, currentUserData.xp - curRank.minXP);
        const levelRange = Math.max(1, curRank.maxXP - curRank.minXP);
        const pct = Math.min(100, Math.max(5, Math.round((xpInLevel / levelRange) * 100)));

        if (fill) fill.style.width = `${pct}%`;
        if (valText) valText.textContent = `${Number(currentUserData.xp).toLocaleString("en-US")} XP`;
        if (rankText) rankText.textContent = `Rango 0${curRank.id}: ${curRank.name}`;
        if (pctText) pctText.textContent = `${pct}% de carga`;
    }

    // EDICIÓN DE NOMBRE (1 SOLA VEZ)
    window.editUserNameOnce = () => {
        const alreadyChanged = localStorage.getItem("zidong_name_changed") === "true";
        if (alreadyChanged) {
            triggerHaptic("error");
            alert(`🔒 No puedes modificar tu nombre de nuevo.\nEl sistema ya registró tu identidad como: "${currentUserData.name}".`);
            return;
        }

        const warningMsg = `⚠️ ¡ATENCIÓN! REGLA DE PLANTA:\n\nSolo tienes permitido registrar tu nombre UNA SOLA VEZ en el sistema.\n\nPiénsalo bien: tal y como lo escribas ahora, así serás conocido en los 5 mundos.\n\n¿Deseas continuar?`;
        
        if (!confirm(warningMsg)) return;

        const newName = prompt("Escribe tu nombre y apellido definitivo:", currentUserData.name);
        if (!newName || newName.trim().length < 2) {
            alert("Operación cancelada: Nombre no válido.");
            return;
        }

        const cleanName = newName.trim();
        currentUserData.name = cleanName;
        currentUserData.initials = getInitials(cleanName);
        localStorage.setItem("zidong_user_name", cleanName);
        localStorage.setItem("zidong_name_changed", "true");

        triggerHaptic("win");
        updateUser
// Cierre de seguridad para el Splash Screen Oberon
window.addEventListener("load", () => {
    setTimeout(() => {
        const splash = document.getElementById("oberonSplashScreen");
        if (splash && splash.style.display !== "none") {
            splash.style.opacity = "0";
            setTimeout(() => { splash.style.display = "none"; }, 500);
        }
    }, 6200);
});
