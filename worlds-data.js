/* ==========================================================================
   ZIDONG CORE - WORLDS & HANZI REPOSITORY (SISTEMA ESPACIAL OBERON)
   Definición modular de mundos, planetas, niveles y bosses.
   ========================================================================== */

window.ZidongWorlds = [
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
