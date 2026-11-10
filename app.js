/* ==========================================================================
   ZIDONG CORE - SISTEMA INDUSTRIAL INTEGRAL (APP.JS DEFINITIVO V35)
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
    window.triggerHaptic = triggerHaptic;

    const STORAGE_KEY = "zidong_core_progress_v10";

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

    const MEDALS_DB = [
        { id: "b_practicante", icon: "🔰", name: "Practicante de Automatización", desc: "Insignia oficial de bienvenida a OBERON", isUnlocked: () => true },
        { id: "badge_voltaria", icon: "⚡", name: "Conquistador de Voltaria", desc: "Supera el Boss Checkpoint del Mundo Eléctrico", isUnlocked: () => Boolean(career.bossBeaten && career.bossBeaten["boss_world_1"]) },
        { id: "badge_kinetix", icon: "⚙️", name: "Engranaje de Kinetix", desc: "Supera el Boss Checkpoint del Mundo Mecánico", isUnlocked: () => Boolean(career.bossBeaten && career.bossBeaten["boss_world_2"]) },
        { id: "badge_aethel", icon: "💨", name: "Maestro Neumático", desc: "Supera el Boss Checkpoint del Mundo Neumático", isUnlocked: () => Boolean(career.bossBeaten && career.bossBeaten["boss_world_3"]) },
        { id: "badge_machina", icon: "🤖", name: "Arquitecto de Machina", desc: "Supera el Boss Checkpoint del Mundo Robótico", isUnlocked: () => Boolean(career.bossBeaten && career.bossBeaten["boss_world_4"]) },
        { id: "badge_lumina", icon: "👁️", name: "Ojo de Lumina", desc: "Supera el Boss Checkpoint del Mundo Visión AOI", isUnlocked: () => Boolean(career.bossBeaten && career.bossBeaten["boss_world_5"]) },
        { id: "b_ai_slayer", icon: "⚔️", name: "Derrotador de IA", desc: "Vence a la IA en el duelo 1v1 Battle", isUnlocked: () => Number(localStorage.getItem("zidong_vs_wins") || 0) >= 1 },
        { id: "b_troubleshooter", icon: "🚨", name: "Solucionador de Fallas", desc: "Retira al menos 1 alarma en Survivor Mode", isUnlocked: () => Number(localStorage.getItem("zidong_survivor_wins") || 0) >= 1 },
        { id: "b_overclock", icon: "⭐", name: "Overclock 3★", desc: "Consigue 3 estrellas en cualquier test", isUnlocked: () => Object.values(career.nodeStars || {}).some(s => s >= 3) }
    ];

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
    window.awardXP = awardXP;

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
        updateUserDisplay();
        updateProfile();
        saveProgress();

        alert(`✅ Nombre registrado con éxito: "${cleanName}".\nEste cambio ha quedado bloqueado permanentemente.`);
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

    // COMPANION
    function getCompanionMessages() {
        const rawName = (currentUserData.name || "New user").trim();
        const isChilaquil = rawName.toLowerCase() === "chilaquil";
        const namePhrase = isChilaquil
            ? `Chilaquil... ¡jajaja te la creíste! Ahora sí te queda con ganas ese nombre 🐶🌶️`
            : `${rawName}... te quedaría mejor Chilaquil 🐶🔥`;

        return [
            namePhrase,
            `En 线 (cable), el radical izquierdo 纟 significa seda/fibra. Indica siempre el material. 🧵`,
            `En 机 (máquina), 木 es madera y 几 es mesa: el concepto original de telar industrial. ⚙️`,
            `El carácter 电 (diàn) originalmente era el dibujo de un rayo cayendo de las nubes. ⚡`,
            `En chino no hay conjugaciones de verbos enredadas. Solo pones partículas como 了. 💡`,
            `El radical 钅 (metal) está en herramientas: 铁 (hierro), 钻 (broca), 钉 (perno). 🛠️`,
            `¡Terminal OBERON en línea! Modo Survivor experto sin pistas: +3s por alarma retirada. 🚨`
        ];
    }

    let lastMsgIndex = -1;
    window.interactWithCompanion = function() {
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
    };

    // MISIONES DIARIAS MODAL
    window.toggleDailyMissionsModal = function() {
        const modal = document.getElementById("dailyMissionsModal");
        if (modal) {
            modal.style.display = modal.style.display === "flex" ? "none" : "flex";
        }
    };
    window.closeMissionsModal = function(e) {
        if (e.target.id === "dailyMissionsModal") {
            document.getElementById("dailyMissionsModal").style.display = "none";
        }
    };

    // EXPOSICIÓN GLOBAL DE NAVEGACIÓN Y ACCIONES
    window.openCriticalMode = function() {
        if (typeof window.navigateTo === "function") window.navigateTo("arcade");
        const sel = document.getElementById("cf-selector");
        const arena = document.getElementById("cf-game-arena");
        const collapse = document.getElementById("cf-collapse-screen");
        if (sel) sel.style.display = "block";
        if (arena) arena.style.display = "none";
        if (collapse) collapse.style.display = "none";
    };

    // CAREER PLANETS MENU
    function renderCareerPlanetsMenu() {
        const container = document.getElementById("careerPlanetsGrid");
        if (!container) return;

        container.replaceChildren();

        WORLDS_CONFIG.forEach((world) => {
            const planetCard = document.createElement("div");
            planetCard.className = `planet-menu-item ${world.planetClass}`;

            const totalAct = world.activities.length;
            const completedInWorld = world.activities.filter(a => career.completedActivities.includes(a.id)).length;

            planetCard.innerHTML = `
                <div class="planet-sphere-wrapper">
                    <div class="planet-sphere"><span class="planet-core-icon">${world.icon}</span></div>
                    <div class="planet-orbit-ring" style="border-color:${world.color}88;"></div>
                </div>
                <div class="planet-menu-meta">
                    <span class="planet-tag" style="color:${world.color};">${world.title}</span>
                    <h4>${world.planetName}</h4>
                    <p>${world.subtitle}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                        <span class="planet-enter-badge">EXPLORAR MUNDO →</span>
                        <small style="color:${world.color}; font-weight:800; font-size:10px;">${completedInWorld}/${totalAct} NIVELES</small>
                    </div>
                </div>
            `;

            planetCard.onclick = () => {
                if (window.ZidongAudio && window.ZidongAudio.playPlanetChime) window.ZidongAudio.playPlanetChime();
                openWorldDetails(world);
            };
            container.appendChild(planetCard);
        });
    }

    function openWorldDetails(world) {
        if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");

        const titleEl = document.getElementById("selectedWorldTitle");
        const subEl = document.getElementById("selectedWorldSubtitle");
        const iconEl = document.getElementById("selectedWorldIcon");
        const stream = document.getElementById("selectedWorldStream");

        if (titleEl) titleEl.textContent = world.title;
        if (subEl) subEl.textContent = `${world.planetName} · ${world.subtitle}`;
        if (iconEl) iconEl.textContent = world.icon;

        if (!stream) return;
        stream.replaceChildren();

        world.activities.forEach((act, aIdx) => {
            const isCompleted = career.completedActivities.includes(act.id);
            const stars = (career.nodeStars && career.nodeStars[act.id]) || (isCompleted ? 3 : 0);
            const nodeEl = document.createElement("div");
            nodeEl.className = `path-step ${aIdx % 2 === 0 ? "left" : "right"}`;

            nodeEl.innerHTML = `
                <div class="path-node ${isCompleted ? "completed" : "current"}"><span>${isCompleted ? "✓" : act.hanzi}</span></div>
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

        if (world.boss) {
            const isBossBeaten = Boolean(career.bossBeaten && career.bossBeaten[world.boss.id]);
            const bossNode = document.createElement("div");
            bossNode.className = "path-step left";
            bossNode.innerHTML = `
                <div class="path-node assessment ${isBossBeaten ? "completed" : "current"}" style="border-color:${world.color};"><span>${isBossBeaten ? "✓" : "🏅"}</span></div>
                <div class="path-label">
                    <strong style="color:${world.color};">${world.boss.name}</strong>
                    <small>Secuencia en orden español · Sin pistas en Hanzi</small>
                    <span class="node-action" style="color:${world.color};">${isBossBeaten ? "CERTIFICADO ✓" : "INICIAR CHECKPOINT FINAL →"}</span>
                </div>
            `;
            bossNode.style.cursor = "pointer";
            bossNode.onclick = () => startBossCheckpoint(world);
            stream.appendChild(bossNode);
        }
    }

    function openActivity(act) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        startHanzi4Phases(act);
    }

    // 4 FASES PEDAGÓGICAS
    function startHanzi4Phases(act) {
        const card = document.querySelector("#level01 .recognition-card");
        if (!card) return;

        function renderPhase1() {
            const allMeanings = ["Electricidad", "Máquina / Motor", "Línea / Cable", "Fuerza / Potencia", "Control / PLC", "Eje / Flecha", "Presión Bar", "Cilindro neumático", "Aire / Neumática", "Válvula solenoide"];
            const wrongOpts = allMeanings.filter(m => m !== act.meaning).sort(() => 0.5 - Math.random()).slice(0, 2);
            const options = [act.meaning, ...wrongOpts].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar"><span class="step-dot active">1. Significado</span><span class="step-dot">2. Pronunciación</span><span class="step-dot">3. Compuesta</span><span class="step-dot">4. Alarma HMI</span></div>
                <span class="tag" style="border-color:var(--cyan); color:var(--cyan); margin:6px 0 4px 0;">FASE 1 DE 4 · IDENTIFICACIÓN</span>
                <div class="recognition-hanzi">${act.hanzi}</div>
                <h3 style="font-size:13.5px; margin-bottom:12px; color:#fff;">¿Cuál es el significado técnico de este carácter?</h3>
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
                    grid.querySelectorAll("button").forEach(b => b.style.pointerEvents = "none");
                    if (opt === act.meaning) {
                        triggerHaptic("success");
                        btn.classList.add("btn-correct");
                        setTimeout(renderPhase2, 350);
                    } else {
                        triggerHaptic("error");
                        btn.classList.add("btn-wrong");
                        setTimeout(renderPhase1, 450);
                    }
                };
                grid.appendChild(btn);
            });
        }

        function renderPhase2() {
            const dummyPinyins = ["diàn", "jī", "xiàn", "lì", "kòng", "zhóu", "zhuǎn", "qì", "fá", "shǒu", "guāng", "jìng"].filter(p => p !== act.pinyin);
            const shuffledP = dummyPinyins.sort(() => 0.5 - Math.random()).slice(0, 2);
            const options = [act.pinyin, ...shuffledP].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar"><span class="step-dot done">✓</span><span class="step-dot active">2. Pronunciación</span><span class="step-dot">3. Compuesta</span><span class="step-dot">4. Alarma HMI</span></div>
                <span class="tag" style="border-color:#a78bfa; color:#a78bfa; margin:6px 0 4px 0;">FASE 2 DE 4 · LECTURA FONÉTICA</span>
                <div class="recognition-hanzi">${act.hanzi}</div>
                <h3 style="font-size:13.5px; margin-bottom:12px; color:#fff;">¿Cómo se pronuncia en mandarín técnico?</h3>
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
                    grid.querySelectorAll("button").forEach(b => b.style.pointerEvents = "none");
                    if (opt === act.pinyin) {
                        triggerHaptic("success");
                        btn.classList.add("btn-correct");
                        setTimeout(renderPhase3, 350);
                    } else {
                        triggerHaptic("error");
                        btn.classList.add("btn-wrong");
                        setTimeout(renderPhase2, 450);
                    }
                };
                grid.appendChild(btn);
            });
        }

        function renderPhase3() {
            const chars = act.compound.split("");
            const targetChar = chars.find(c => c !== act.hanzi) || act.hanzi;
            const dummyPool = ["缆", "箱", "压", "电", "机", "线", "阀", "器", "门", "轴", "气", "光", "头"].filter(c => c !== targetChar);
            const blockOptions = [targetChar, ...dummyPool.sort(() => 0.5 - Math.random()).slice(0, 2)].sort(() => 0.5 - Math.random());

            card.innerHTML = `
                <div class="phase-stepper-bar"><span class="step-dot done">✓</span><span class="step-dot done">✓</span><span class="step-dot active">3. Compuesta</span><span class="step-dot">4. Alarma HMI</span></div>
                <span class="tag" style="border-color:#ffaa00; color:#ffaa00; margin:6px 0 4px 0;">FASE 3 DE 4 · PALABRA COMPUESTA</span>
                <p style="font-size:10.5px; color:var(--muted); margin:4px 0;">FORMA EL TÉRMINO DE PLANTA:</p>
                <h2 style="color:var(--cyan); margin: 4px 0 12px 0;">${act.compoundMeaning}</h2>
                <div class="cf-slots-dock" style="margin-bottom:14px;"><div class="cf-slot filled">${act.hanzi}</div><div class="cf-slot empty" id="slotTarget">_</div></div>
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
                        setTimeout(renderPhase4, 400);
                    } else {
                        triggerHaptic("error");
                        b.style.opacity = "0.2";
                        b.style.pointerEvents = "none";
                    }
                };
                bGrid.appendChild(b);
            });
        }

        function renderPhase4() {
            card.innerHTML = `
                <div class="phase-stepper-bar"><span class="step-dot done">✓</span><span class="step-dot done">✓</span><span class="step-dot done">✓</span><span class="step-dot active">4. Escáner HMI</span></div>
                <span class="tag" style="border-color:#00f59b; color:#00f59b; margin:6px 0 4px 0;">FASE 4 DE 4 · ESCÁNER EN PISO</span>
                <p style="font-size:12px; color:#ffffff; font-weight:700; margin:6px 0 10px 0;">Identifica el componente <strong style="color:var(--cyan);">"${act.meaning}"</strong> dentro del texto de la alarma HMI:</p>
                <div class="hmi-alarm-scanner-box">
                    <div class="hmi-screen-header"><small>HMI RUNTIME · ALARM MONITOR</small><span class="alarm-led-red">●</span></div>
                    <div class="hmi-tokens-container" id="alarmTokensGrid"></div>
                </div>
            `;

            const tokensGrid = card.querySelector("#alarmTokensGrid");
            act.alarmSentence.split("").forEach((c) => {
                const tokenBtn = document.createElement("button");
                tokenBtn.className = "hmi-char-token";
                tokenBtn.textContent = c;
                tokenBtn.onclick = () => {
                    if (c === act.alarmTarget) {
                        triggerHaptic("win");
                        tokenBtn.classList.add("token-hit");
                        if (!career.completedActivities.includes(act.id)) career.completedActivities.push(act.id);
                        if (!career.nodeStars) career.nodeStars = {};
                        career.nodeStars[act.id] = 3;
                        awardXP(act.reward);

                        setTimeout(() => {
                            alert(`🌟 ¡NIVEL APROBADO! (+${act.reward} XP)\nHas dominado las 4 fases de "${act.hanzi}" (${act.meaning}).`);
                            if (typeof window.navigateTo === "function") window.navigateTo("worldDetailsView");
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

    function startBossCheckpoint(world) {
        if (typeof window.navigateTo === "function") window.navigateTo("level01");
        const card = document.querySelector("#level01 .recognition-card");
        if (!card || !world.boss) return;

        const boss = world.boss;
        const sequence = boss.sequence;
        let currentStepIndex = 0;

        function renderBossSequenceView() {
            const chipsHtml = sequence.map((s, idx) => {
                let statusClass = "seq-target-chip";
                if (idx < currentStepIndex) statusClass += " done-step";
                else if (idx === currentStepIndex) statusClass += " active-step";
                return `<span class="${statusClass}">${idx + 1}. ${s.esName}</span>`;
            }).join("");

            const currentTarget = sequence[currentStepIndex];

            card.innerHTML = `
                <span class="tag" style="border-color:${world.color}; color:${world.color}; margin-bottom:8px;">${boss.name} · SECUENCIA EN ORDEN</span>
                <p style="font-size:11px; color:var(--muted); margin-bottom:6px;">SELECCIONA EN ESTE ORDEN EXACTO:</p>
                <div class="boss-target-sequence-shelf">${chipsHtml}</div>
                <p style="font-size:12.5px; color:#ffffff; font-weight:800; margin:6px 0 12px 0;">Toca en la alarma el Hanzi que corresponde a: <strong style="color:var(--gold); font-size:14px;">"${currentTarget.esName}"</strong></p>
                <div class="hmi-alarm-scanner-box">
                    <div class="hmi-screen-header"><small>CHECKPOINT MASTER SCANNER</small><span class="alarm-led-red">●</span></div>
                    <div class="hmi-tokens-container" id="bossTokensGrid"></div>
                </div>
            `;

            const tokensGrid = card.querySelector("#bossTokensGrid");
            boss.alarmSentence.split("").forEach(c => {
                const b = document.createElement("button");
                b.className = "hmi-char-token";
                b.textContent = c;
                b.onclick = () => {
                    if (c === currentTarget.targetHanzi) {
                        triggerHaptic("success");
                        b.classList.add("token-hit");
                        currentStepIndex++;

                        if (currentStepIndex >= sequence.length) {
                            triggerHaptic("win");
                            if (!career.bossBeaten) career.bossBeaten = {};
                            career.bossBeaten[boss.id] = true;
                            awardXP(boss.reward);

                            setTimeout(() => {
                                alert(`🏆 ¡CHECKPOINT CONQUISTADO! (+${boss.reward} XP)\nHas desbloqueado la medalla "${boss.badgeName}".`);
                                renderBadgesGrid();
                                if (typeof window.navigateTo === "function") window.navigateTo("career");
                            }, 450);
                        } else {
                            setTimeout(renderBossSequenceView, 350);
                        }
                    } else {
                        triggerHaptic("error");
                        b.classList.add("token-miss");
                        setTimeout(() => b.classList.remove("token-miss"), 300);
                        alert(`⚠️ ¡Orden incorrecto! Debes identificar primero: "${currentTarget.esName}".`);
                    }
                };
                tokensGrid.appendChild(b);
            });
        }

        renderBossSequenceView();
    }

// =============================================
// ZIDONG CORE 2.0
// MOTOR 1V1 - SISTEMA DE TRES NIVELES
// =============================================

const VS_DIFFICULTIES = {
    EASY: {
        name: "Simulador de Enlace",
        badge: "NIVEL 1 · HANZI SIMPLE",
        prob: 0.82,
        points: 100,
        winBonus: 100
    },

    MEDIUM: {
        name: "Servocontrolador Overclock",
        badge: "NIVEL 2 · PALABRAS INDUSTRIALES",
        prob: 0.85,
        points: 100,
        winBonus: 150
    },

    HARD: {
        name: "Protocolo Centinela IA",
        badge: "NIVEL 3 · ORDENAR PALABRAS",
        prob: 0.88,
        points: 100,
        winBonus: 250
    }
};


// =============================================
// VARIABLES DE SESIÓN
// =============================================

let selectedVsDiffKey = "MEDIUM";

let vsTimer = null;
let vsTimeLeft = 20;

let myVsPoints = 0;
let rivalVsPoints = 0;

let vsCurrentQuestion = null;
let vsSelectedChars = [];

let vsRoundLocked = false;
let vsSessionActive = false;


// =============================================
// BANCO DE HANZI - NIVEL 1
// =============================================

const VS_HANZI_DATA = [

    { hanzi: "电", pinyin: "diàn", es: "Electricidad" },
    { hanzi: "机", pinyin: "jī", es: "Máquina" },
    { hanzi: "线", pinyin: "xiàn", es: "Cable / Línea" },
    { hanzi: "力", pinyin: "lì", es: "Fuerza" },
    { hanzi: "控", pinyin: "kòng", es: "Control" },
    { hanzi: "压", pinyin: "yā", es: "Presión" },
    { hanzi: "气", pinyin: "qì", es: "Aire / Gas" },
    { hanzi: "阀", pinyin: "fá", es: "Válvula" },
    { hanzi: "传", pinyin: "chuán", es: "Transmitir" },
    { hanzi: "感", pinyin: "gǎn", es: "Sensar" },
    { hanzi: "热", pinyin: "rè", es: "Calor" },
    { hanzi: "冷", pinyin: "lěng", es: "Frío" }

];


// =============================================
// BANCO DE PALABRAS - NIVEL 2 Y 3
// =============================================

const VS_WORD_DATA = [

    {
        hanzi: "电缆",
        pinyin: "diàn lǎn",
        es: "Cable eléctrico"
    },

    {
        hanzi: "电机",
        pinyin: "diàn jī",
        es: "Motor eléctrico"
    },

    {
        hanzi: "电源",
        pinyin: "diàn yuán",
        es: "Fuente de alimentación"
    },

    {
        hanzi: "机器",
        pinyin: "jī qì",
        es: "Máquina"
    },

    {
        hanzi: "控制",
        pinyin: "kòng zhì",
        es: "Control"
    },

    {
        hanzi: "气压",
        pinyin: "qì yā",
        es: "Presión neumática"
    },

    {
        hanzi: "传感器",
        pinyin: "chuán gǎn qì",
        es: "Sensor"
    },

    {
        hanzi: "机器人",
        pinyin: "jī qì rén",
        es: "Robot"
    },

    {
        hanzi: "维修",
        pinyin: "wéi xiū",
        es: "Mantenimiento / Reparación"
    },

    {
        hanzi: "视觉",
        pinyin: "shì jué",
        es: "Visión artificial"
    },

    {
        hanzi: "压力",
        pinyin: "yā lì",
        es: "Presión"
    },

    {
        hanzi: "温度",
        pinyin: "wēn dù",
        es: "Temperatura"
    }

];


// =============================================
// FUNCIONES AUXILIARES
// =============================================

function vsShuffle(array) {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];

    }

    return result;
}


function vsRandomItem(array) {

    return array[Math.floor(Math.random() * array.length)];

}


function vsUpdateScores() {

    const myScoreEl = document.getElementById("vsMyScore");
    const rivalScoreEl = document.getElementById("vsRivalScore");

    if (myScoreEl) {
        myScoreEl.textContent = `${myVsPoints} PTS`;
    }

    if (rivalScoreEl) {
        rivalScoreEl.textContent = `${rivalVsPoints} PTS`;
    }

}


function vsGetInstruction() {

    const stage = document.getElementById("vsStageCard");
    const grid = document.getElementById("vsOptionsGrid");

    if (!stage || !grid) return null;

    let instruction = document.getElementById("vsInstruction");

    if (!instruction) {

        instruction = document.createElement("p");

        instruction.id = "vsInstruction";

        instruction.style.cssText = `
            color: var(--cyan);
            font-size: 12px;
            font-weight: 800;
            margin: 8px 0;
        `;

        stage.insertBefore(instruction, grid);

    }

    return instruction;

}


// =============================================
// ABRIR MENÚ 1V1
// =============================================

window.openVsMode = function() {

    stopVsSession();

    if (typeof triggerHaptic === "function") {
        triggerHaptic("success");
    }

    if (typeof window.navigateTo === "function") {
        window.navigateTo("vsBattle");
    }

    const diffSelector = document.getElementById("vsDifficultySelector");
    const arena = document.getElementById("vsBattleArenaContainer");
    const defeat = document.getElementById("vsDefeatScreen");

    if (diffSelector) {
        diffSelector.style.setProperty("display", "block", "important");
    }

    if (arena) {
        arena.style.setProperty("display", "none", "important");
    }

    if (defeat) {
        defeat.style.setProperty("display", "none", "important");
    }

};


// =============================================
// INICIAR DIFICULTAD
// =============================================

window.start1v1WithDifficulty = function(diffKey) {

    if (!VS_DIFFICULTIES[diffKey]) {
        console.error("Dificultad 1v1 desconocida:", diffKey);
        return;
    }

    stopVsSession();

    selectedVsDiffKey = diffKey;

    const diff = VS_DIFFICULTIES[diffKey];

    const selector = document.getElementById("vsDifficultySelector");
    const arena = document.getElementById("vsBattleArenaContainer");
    const defeat = document.getElementById("vsDefeatScreen");

    if (selector) {
        selector.style.setProperty("display", "none", "important");
    }

    if (defeat) {
        defeat.style.setProperty("display", "none", "important");
    }

    if (arena) {
        arena.style.setProperty("display", "block", "important");
    }

    const rivalName = document.getElementById("vsRivalName");
    const rivalAvatar = document.getElementById("vsRivalAvatar");
    const badge = document.getElementById("vsDiffBadge");

    if (rivalName) {
        rivalName.textContent = diff.name;
    }

    if (rivalAvatar) {
        rivalAvatar.textContent =
            diffKey === "HARD" ? "⚡" :
            diffKey === "MEDIUM" ? "🤖" : "⚙️";
    }

    if (badge) {
        badge.textContent = diff.badge;
    }

    myVsPoints = 0;
    rivalVsPoints = 0;

    vsTimeLeft = 20;

    vsSessionActive = true;
    vsRoundLocked = false;

    vsUpdateScores();

    const seconds = document.getElementById("vsSeconds");

    if (seconds) {
        seconds.textContent = vsTimeLeft;
    }

    const timerBar = document.getElementById("vsTimerBar");

    if (timerBar) {
        timerBar.style.width = "100%";
    }

    startVsRound();

    startVsTimer();

};


// =============================================
// MOTOR PRINCIPAL DE RONDAS
// =============================================

function startVsRound() {

    if (!vsSessionActive || vsTimeLeft <= 0) return;

    vsRoundLocked = false;

    vsSelectedChars = [];

    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = vsGetInstruction();

    if (!display || !grid || !instruction) {

        console.error("No se encontraron los elementos de la arena 1v1.");

        return;

    }

    grid.replaceChildren();

    if (selectedVsDiffKey === "EASY") {

        loadVsLevel1SingleHanzi();

    }

    else if (selectedVsDiffKey === "MEDIUM") {

        loadVsLevel2CompoundWord();

    }

    else if (selectedVsDiffKey === "HARD") {

        loadVsLevel3OrderHanzi();

    }

}


// =============================================
// NIVEL 1 - RECONOCER HANZI
// =============================================

function loadVsLevel1SingleHanzi() {

    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = vsGetInstruction();

    const correct = vsRandomItem(VS_HANZI_DATA);

    const wrongOptions = vsShuffle(
        VS_HANZI_DATA.filter(item => item.hanzi !== correct.hanzi)
    ).slice(0, 3);

    const options = vsShuffle([correct, ...wrongOptions]);

    vsCurrentQuestion = correct;

    display.textContent = correct.hanzi;

    display.style.fontSize = "64px";

    instruction.textContent =
        "Selecciona el significado correcto del carácter.";

    options.forEach(option => {

        const button = document.createElement("button");

        button.type = "button";

        button.textContent = option.es;

        button.style.cssText = `
            min-height: 55px;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: var(--surface-light);
            color: #fff;
            font-weight: 800;
            cursor: pointer;
        `;

        button.addEventListener("click", () => {

            submitVsAnswer(option.hanzi === correct.hanzi, button);

        });

        grid.appendChild(button);

    });

}


// =============================================
// NIVEL 2 - RECONOCER PALABRAS
// =============================================

function loadVsLevel2CompoundWord() {

    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = vsGetInstruction();

    const correct = vsRandomItem(VS_WORD_DATA);

    const wrongOptions = vsShuffle(
        VS_WORD_DATA.filter(item => item.hanzi !== correct.hanzi)
    ).slice(0, 3);

    const options = vsShuffle([correct, ...wrongOptions]);

    vsCurrentQuestion = correct;

    display.textContent = correct.hanzi;

    display.style.fontSize = "46px";

    instruction.textContent =
        "Identifica el significado de esta palabra industrial.";

    options.forEach(option => {

        const button = document.createElement("button");

        button.type = "button";

        button.textContent = option.es;

        button.style.cssText = `
            min-height: 55px;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: var(--surface-light);
            color: #fff;
            font-weight: 800;
            cursor: pointer;
        `;

        button.addEventListener("click", () => {

            submitVsAnswer(option.hanzi === correct.hanzi, button);

        });

        grid.appendChild(button);

    });

}


// =============================================
// NIVEL 3 - ORDENAR CARACTERES
// =============================================

function loadVsLevel3OrderHanzi() {

    const display = document.getElementById("vsHanziDisplay");
    const grid = document.getElementById("vsOptionsGrid");
    const instruction = vsGetInstruction();

    const correct = vsRandomItem(VS_WORD_DATA);

    vsCurrentQuestion = correct;

    display.textContent = correct.es;

    display.style.fontSize = "23px";

    instruction.textContent =
        "Construye la palabra seleccionando los caracteres en orden.";

    // Caracteres correctos
    const correctChars = Array.from(correct.hanzi);

    // Caracteres adicionales para confundir
    const extraChars = ["电", "机", "气", "控", "力", "压", "感", "线", "热", "冷"];

    const availableChars = [...new Set([
        ...correctChars,
        ...vsShuffle(extraChars).filter(char => !correctChars.includes(char)).slice(0, 3)
    ])];

    const shuffledChars = vsShuffle(availableChars);

    // Área donde se construye la palabra
    const answerBox = document.createElement("div");

    answerBox.id = "vsBuildAnswer";

    answerBox.style.cssText = `
        min-height: 48px;
        margin: 12px 0;
        padding: 10px;
        border: 1px dashed var(--cyan);
        border-radius: 12px;
        color: #fff;
        font-family: 'Noto Sans SC';
        font-size: 26px;
        letter-spacing: 5px;
        background: rgba(39,216,232,0.08);
    `;

    answerBox.textContent = "＿＿＿＿";

    grid.before(answerBox);

    // Botones de caracteres
    shuffledChars.forEach(char => {

        const button = document.createElement("button");

        button.type = "button";

        button.textContent = char;

        button.dataset.char = char;

        button.style.cssText = `
            min-height: 58px;
            font-family: 'Noto Sans SC';
            font-size: 27px;
            border-radius: 12px;
            border: 1px solid var(--cyan);
            background: var(--surface-light);
            color: #fff;
            font-weight: 900;
            cursor: pointer;
        `;

        button.addEventListener("click", () => {

            if (vsRoundLocked || !vsSessionActive) return;

            if (button.disabled) return;

            button.disabled = true;

            vsSelectedChars.push(char);

            answerBox.textContent = vsSelectedChars.join("");

            if (vsSelectedChars.length === correctChars.length) {

                const assembled = vsSelectedChars.join("");

                submitVsAnswer(assembled === correct.hanzi);

            }

        });

        grid.appendChild(button);

    });

    // Botón para borrar selección
    const resetButton = document.createElement("button");

    resetButton.type = "button";

    resetButton.textContent = "↶ BORRAR";

    resetButton.style.cssText = `
        grid-column: 1 / -1;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--cyan);
        font-weight: 800;
        cursor: pointer;
    `;

    resetButton.addEventListener("click", () => {

        if (vsRoundLocked || !vsSessionActive) return;

        vsSelectedChars = [];

        answerBox.textContent = "＿＿＿＿";

        grid.querySelectorAll("button[data-char]").forEach(button => {
            button.disabled = false;
        });

    });

    grid.appendChild(resetButton);

}


// =============================================
// VALIDAR RESPUESTAS
// =============================================

function submitVsAnswer(isCorrect, selectedButton = null) {

    if (!vsSessionActive || vsRoundLocked) return;

    vsRoundLocked = true;

    const instruction = vsGetInstruction();

    const grid = document.getElementById("vsOptionsGrid");

    if (grid) {

        grid.querySelectorAll("button").forEach(button => {
            button.disabled = true;
        });

    }

    if (isCorrect) {

        myVsPoints += VS_DIFFICULTIES[selectedVsDiffKey].points;

        if (instruction) {
            instruction.textContent = "✓ ¡CORRECTO! +100 PTS";
            instruction.style.color = "var(--green)";
        }

        if (selectedButton) {
            selectedButton.style.border = "2px solid var(--green)";
            selectedButton.style.background = "rgba(0,245,155,0.15)";
        }

        if (typeof triggerHaptic === "function") {
            triggerHaptic("success");
        }

    } else {

        rivalVsPoints += 50;

        if (instruction) {
            instruction.textContent = "✗ INCORRECTO. La IA aprovecha el error.";
            instruction.style.color = "var(--red)";
        }

        if (selectedButton) {
            selectedButton.style.border = "2px solid var(--red)";
        }

        if (typeof triggerHaptic === "function") {
            triggerHaptic("error");
        }

    }

    vsUpdateScores();

    setTimeout(() => {

        if (!vsSessionActive || vsTimeLeft <= 0) return;

        startVsRound();

    }, 850);

}


// =============================================
// TEMPORIZADOR Y RESPUESTAS DE LA IA
// =============================================

function startVsTimer() {

    stopVsSession();

    vsTimer = setInterval(() => {

        if (!vsSessionActive) return;

        vsTimeLeft--;

        const seconds = document.getElementById("vsSeconds");
        const timerBar = document.getElementById("vsTimerBar");

        if (seconds) {
            seconds.textContent = vsTimeLeft;
        }

        if (timerBar) {

            timerBar.style.width =
                `${Math.max(0, (vsTimeLeft / 20) * 100)}%`;

        }

        // La IA intenta responder cada 5 segundos
        if (vsTimeLeft > 0 && vsTimeLeft % 5 === 0) {

            const diff = VS_DIFFICULTIES[selectedVsDiffKey];

            if (Math.random() < diff.prob) {

                rivalVsPoints += 100;

                vsUpdateScores();

            }

        }

        if (vsTimeLeft <= 0) {

            finishVsBattle();

        }

    }, 1000);

}


// =============================================
// FINALIZAR BATALLA
// =============================================

function finishVsBattle() {

    if (!vsSessionActive) return;

    stopVsSession();

    const diff = VS_DIFFICULTIES[selectedVsDiffKey];

    const win = myVsPoints >= rivalVsPoints;

    if (win) {

        if (typeof triggerHaptic === "function") {
            triggerHaptic("win");
        }

        if (typeof awardXP === "function") {
            awardXP(diff.winBonus);
        }

        const currentWins =
            Number(localStorage.getItem("zidong_vs_wins") || 0) + 1;

        localStorage.setItem("zidong_vs_wins", currentWins);

        alert(
            `🏆 ¡VICTORIA!\n\n` +
            `Superaste a "${diff.name}"\n\n` +
            `${myVsPoints} vs ${rivalVsPoints} PTS\n\n` +
            `+${diff.winBonus} XP`
        );

        if (typeof renderBadgesGrid === "function") {
            renderBadgesGrid();
        }

        if (typeof updateProfile === "function") {
            updateProfile();
        }

        if (typeof window.navigateTo === "function") {
            window.navigateTo("dashboard");
        }

    } else {

        if (typeof triggerHaptic === "function") {
            triggerHaptic("error");
        }

        const arena = document.getElementById("vsBattleArenaContainer");

        const defeat = document.getElementById("vsDefeatScreen");

        if (arena) {
            arena.style.setProperty("display", "none", "important");
        }

        if (defeat) {
            defeat.style.setProperty("display", "block", "important");
        }

        const scores = document.getElementById("vsDefeatScores");

        if (scores) {

            scores.textContent =
                `Tú: ${myVsPoints} PTS vs ${diff.name}: ${rivalVsPoints} PTS`;

        }

    }

}


// =============================================
// DETENER SESIÓN
// =============================================

function stopVsSession() {

    vsSessionActive = false;

    if (vsTimer) {

        clearInterval(vsTimer);

        vsTimer = null;

    }

}

window.stopVsSession = stopVsSession;
