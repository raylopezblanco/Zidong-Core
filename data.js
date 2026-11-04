// ========================================================
// HANZI INDUSTRIAL - BASE DE DATOS TÉCNICA
// ========================================================

const vocabulary = [
    // ----------------------------------------------------
    // TEMA: ALARMAS Y SEGURIDAD (alarmas)
    // ----------------------------------------------------
    {
        hanzi: "警", pinyin: "jǐng", meaning: "Alerta / Advertencia", level: 1, topic: "alarmas",
        parts: [{ char: "敬 (jìng)", desc: "Respeto/Atención" }, { char: "言 (yán)", desc: "Palabra/Aviso" }],
        summary: "Dar aviso verbal o señal de peligro. Núcleo de 报警 (alarma)."
    },
    {
        hanzi: "停", pinyin: "tíng", meaning: "Parar / Detener", level: 1, topic: "alarmas",
        parts: [{ char: "亻 (rén)", desc: "Persona" }, { char: "亭 (tíng)", desc: "Pabellón/Parada" }],
        summary: "Persona que se detiene en un pabellón. Base de 急停 (paro de emergencia)."
    },
    {
        hanzi: "安", pinyin: "ān", meaning: "Seguro / Tranquilo", level: 1, topic: "alarmas",
        parts: [{ char: "宀 (mián)", desc: "Techo/Protección" }, { char: "女 (nǚ)", desc: "Paz bajo techo" }],
        summary: "Protección bajo techo. Base de 安全 (seguridad)."
    },
    {
        hanzi: "锁", pinyin: "suǒ", meaning: "Cerradura / Candado / Traba", level: 1, topic: "alarmas",
        parts: [{ char: "钅 (jīn)", desc: "Metal" }, { char: "𧴪", desc: "Cadena o pasador metálico" }],
        summary: "Enclavamiento físico o de seguridad. Base de 解锁 (desbloqueo) y 锁死 (bloqueado)."
    },
    {
        hanzi: "门", pinyin: "mén", meaning: "Puerta / Acceso", level: 1, topic: "alarmas",
        parts: [{ char: "门", desc: "Marco de una puerta de dos hojas" }],
        summary: "Acceso físico de cabina o celda (安全门, 龙门)."
    },
    {
        hanzi: "鸣", pinyin: "míng", meaning: "Zumbido / Sonido de alarma", level: 1, topic: "alarmas",
        parts: [{ char: "口 (kǒu)", desc: "Boca / Sonido" }, { char: "鸟 (niǎo)", desc: "Canto o tono agudo" }],
        summary: "Emisión sonora acústica. Base de 蜂鸣器 (buzzer)."
    },
    {
        hanzi: "报警", pinyin: "bàojǐng", meaning: "Alarma activa", level: 2, topic: "alarmas",
        parts: [{ char: "报", desc: "Reportar" }, { char: "警", desc: "Alerta" }],
        summary: "Ecuación: [Reportar] + [Alerta] = Condición de alarma de máquina."
    },
    {
        hanzi: "急停", pinyin: "jítíng", meaning: "Paro de Emergencia (E-Stop)", level: 2, topic: "alarmas",
        parts: [{ char: "急", desc: "Urgente" }, { char: "停", desc: "Detener" }],
        summary: "Ecuación: [Urgente] + [Detener] = Botón o circuito de Paro de Emergencia."
    },
    {
        hanzi: "安全门", pinyin: "ānquán mén", meaning: "Puerta de seguridad / Enclavamiento", level: 2, topic: "alarmas",
        parts: [{ char: "安全", desc: "Seguridad" }, { char: "门", desc: "Puerta" }],
        summary: "Ecuación: [Seguridad] + [Puerta] = Puerta con switch de interlock (左前, 右后)."
    },
    {
        hanzi: "解锁", pinyin: "jiěsuǒ", meaning: "Desbloquear / Quitar interlock", level: 2, topic: "alarmas",
        parts: [{ char: "解", desc: "Liberar / Soltar" }, { char: "锁", desc: "Candado / Traba" }],
        summary: "Ecuación: [Liberar] + [Candado] = Botón para desenergizar seguros y abrir cabina."
    },
    {
        hanzi: "蜂鸣器", pinyin: "fēngmíngqì", meaning: "Buzzer / Bocina de alarma acústica", level: 2, topic: "alarmas",
        parts: [{ char: "蜂", desc: "Abeja" }, { char: "鸣", desc: "Zumbido" }, { char: "器", desc: "Aparato" }],
        summary: "Ecuación: [Zumbido de abeja] + [Aparato] = Alarma sonora de panel."
    },

    // ----------------------------------------------------
    // TEMA: MECÁNICA Y ACTUADORES (mecanica)
    // ----------------------------------------------------
    {
        hanzi: "电", pinyin: "diàn", meaning: "Electricidad / Eléctrico", level: 1, topic: "mecanica",
        parts: [{ char: "申 (shēn)", desc: "Rayo" }, { char: "乚", desc: "Tierra" }],
        summary: "Energía eléctrica. Base de motores y actuadores eléctricos (电机, 电缸)."
    },
    {
        hanzi: "机", pinyin: "jī", meaning: "Máquina / Mecanismo", level: 1, topic: "mecanica",
        parts: [{ char: "木 (mù)", desc: "Madera / Estructura" }, { char: "几 (jī)", desc: "Soporte" }],
        summary: "Mecanismo electromecánico con movimiento."
    },
    {
        hanzi: "组", pinyin: "zǔ", meaning: "Grupo / Ensamble (piezas unidas)", level: 1, topic: "mecanica",
        parts: [{ char: "纟 (sī)", desc: "Seda (atar partes)" }, { char: "且 (qiě)", desc: "Soporte" }],
        summary: "Unir componentes móviles sobre un eje. Núcleo de 模组 (módulo móvil)."
    },
    {
        hanzi: "缸", pinyin: "gāng", meaning: "Cilindro / Actuador", level: 1, topic: "mecanica",
        parts: [{ char: "缶 (fǒu)", desc: "Vasija cilíndrica" }, { char: "工 (gōng)", desc: "Trabajo" }],
        summary: "Cuerpo cilíndrico de empuje (电缸 = cilindro eléctrico, 气缸 = neumático)."
    },
    {
        hanzi: "龙", pinyin: "lóng", meaning: "Dragón / Puente elevado", level: 1, topic: "mecanica",
        parts: [{ char: "龙", desc: "Figura alargada sobre caballetes" }],
        summary: "Estructura elevada sobre dos postes. Base del pórtico 龙门 (Gantry)."
    },
    {
        hanzi: "推", pinyin: "tuī", meaning: "Empujar / Avance lineal", level: 1, topic: "mecanica",
        parts: [{ char: "扌(shǒu)", desc: "Mano" }, { char: "隹 (zhuī)", desc: "Avanzar recto" }],
        summary: "Acción de empuje lineal de un pistón o eje (侧推 = empuje lateral)."
    },
    {
        hanzi: "臂", pinyin: "bì", meaning: "Brazo", level: 1, topic: "mecanica",
        parts: [{ char: "辟", desc: "Fonética" }, { char: "月 / 肉", desc: "Cuerpo" }],
        summary: "Elemento articulado de manipulación (机械臂)."
    },
    {
        hanzi: "直", pinyin: "zhí", meaning: "Recto / Directo", level: 1, topic: "mecanica",
        parts: [{ char: "十", desc: "Alineación" }, { char: "目", desc: "Ojo directo" }],
        summary: "Alineación y movimiento sin desviación (直线)."
    },
    {
        hanzi: "线", pinyin: "xiàn", meaning: "Línea / Trayectoria", level: 1, topic: "mecanica",
        parts: [{ char: "纟", desc: "Seda continua" }, { char: "戋", desc: "Trazo recto" }],
        summary: "Línea de producción o eje recto (直线模组)."
    },
    {
        hanzi: "龙门", pinyin: "lóngmén", meaning: "Gantry / Estructura pórtico", level: 2, topic: "mecanica",
        parts: [{ char: "龙", desc: "Dragón / Puente" }, { char: "门", desc: "Puerta" }],
        summary: "Ecuación: [Puente] + [Pórtico] = Gantry con servomotores superiores (龙门Z1)."
    },
    {
        hanzi: "电缸", pinyin: "diàngāng", meaning: "Cilindro eléctrico / Actuador", level: 2, topic: "mecanica",
        parts: [{ char: "电", desc: "Eléctrico" }, { char: "缸", desc: "Cilindro" }],
        summary: "Ecuación: [Eléctrico] + [Cilindro] = Servocilindro lineal de empuje."
    },
    {
        hanzi: "电机", pinyin: "diànjī", meaning: "Motor eléctrico / Servomotor", level: 2, topic: "mecanica",
        parts: [{ char: "电", desc: "Electricidad" }, { char: "机", desc: "Máquina" }],
        summary: "Ecuación: [Electricidad] + [Máquina] = Motor / Servomotor."
    },
    {
        hanzi: "模组", pinyin: "mózǔ", meaning: "Módulo mecatrónico (Ensamble móvil)", level: 2, topic: "mecanica",
        parts: [{ char: "模", desc: "Molde estándar" }, { char: "组", desc: "Ensamble (seda 纟)" }],
        summary: "Ecuación: [Molde] + [Grupo] = Actuador o eje ensamblado con movimiento."
    },
    {
        hanzi: "机械臂", pinyin: "jīxièbì", meaning: "Brazo robótico articulado", level: 2, topic: "mecanica",
        parts: [{ char: "机械", desc: "Mecánico" }, { char: "臂", desc: "Brazo" }],
        summary: "Ecuación: [Mecánico] + [Brazo] = Manipulador de piezas."
    },
    {
        hanzi: "直线", pinyin: "zhíxiàn", meaning: "Línea recta / Lineal", level: 2, topic: "mecanica",
        parts: [{ char: "直", desc: "Recto" }, { char: "线", desc: "Línea" }],
        summary: "Ecuación: [Recto] + [Línea] = Guía lineal o servomotor directo."
    },

    // ----------------------------------------------------
    // TEMA: OPERACIÓN, MENÚS Y PRUEBAS (operacion)
    // ----------------------------------------------------
    {
        hanzi: "使", pinyin: "shǐ", meaning: "Comandar / Poner a trabajar", level: 1, topic: "operacion",
        parts: [{ char: "亻", desc: "Persona" }, { char: "吏", desc: "Oficial que ordena" }],
        summary: "Mandar una señal de activación. Base de 使能 (Enable)."
    },
    {
        hanzi: "能", pinyin: "néng", meaning: "Poder / Capacidad / Habilitar", level: 1, topic: "operacion",
        parts: [{ char: "厶", desc: "Fuerza propia" }, { char: "月", desc: "Músculo" }],
        summary: "Capacidad de encender un driver. Base de 使能 (Enable)."
    },
    {
        hanzi: "未", pinyin: "wèi", meaning: "Aún no / NO (Negación técnica)", level: 1, topic: "operacion",
        parts: [{ char: "木 con trazo superior", desc: "Árbol que aún no madura" }],
        summary: "Prefijo clave de falla en HMI: 未使能 (No habilitado / Disabled)."
    },
    {
        hanzi: "测", pinyin: "cè", meaning: "Medir / Sondear / Test", level: 1, topic: "operacion",
        parts: [{ char: "氵(shuǐ)", desc: "Agua (nivel)" }, { char: "则 (zé)", desc: "Regla/Norma" }],
        summary: "Medir parámetros según norma. Núcleo de 测试 (test)."
    },
    {
        hanzi: "视", pinyin: "shì", meaning: "Ver / Inspección visual", level: 1, topic: "operacion",
        parts: [{ char: "礻", desc: "Señal" }, { char: "见 (jiàn)", desc: "Mirar con ojo atento" }],
        summary: "Cámara o sistema de visión artificial (视觉)."
    },
    {
        hanzi: "块", pinyin: "kuài", meaning: "Bloque / Tarjeta compacta", level: 1, topic: "operacion",
        parts: [{ char: "土", desc: "Tierra compacta" }, { char: "夬", desc: "Pieza sólida" }],
        summary: "Ladrillo o bloque funcional electrónico (模块)."
    },
    {
        hanzi: "使能", pinyin: "shǐnéng", meaning: "Habilitar / Enable (Servo On)", level: 2, topic: "operacion",
        parts: [{ char: "使", desc: "Comandar" }, { char: "能", desc: "Capacidad" }],
        summary: "Ecuación: [Comandar] + [Poder] = Habilitación de potencia en servocontrolador."
    },
    {
        hanzi: "未使能", pinyin: "wèi shǐnéng", meaning: "No habilitado / Disabled (Servo Off)", level: 2, topic: "operacion",
        parts: [{ char: "未", desc: "No / Aún no" }, { char: "使能", desc: "Habilitar" }],
        summary: "Ecuación: [NO] + [Habilitar] = Driver sin señal de Enable en el bus."
    },
    {
        hanzi: "测试", pinyin: "cèshì", meaning: "Prueba / Test de producto", level: 2, topic: "operacion",
        parts: [{ char: "测", desc: "Medir" }, { char: "试", desc: "Probar" }],
        summary: "Ecuación: [Medir] + [Probar] = Rutina de validación eléctrica o funcional."
    },
    {
        hanzi: "视觉", pinyin: "shìjué", meaning: "Visión artificial / Cámara HMI", level: 2, topic: "operacion",
        parts: [{ char: "视", desc: "Ver" }, { char: "觉", desc: "Detectar" }],
        summary: "Ecuación: [Ver] + [Sensar] = Menú de cámaras e inspección por visión."
    },
    {
        hanzi: "模块", pinyin: "mókuài", meaning: "Módulo electrónico / Bloque funcional", level: 2, topic: "operacion",
        parts: [{ char: "模", desc: "Molde estándar" }, { char: "块", desc: "Ladrillo sólido (tierra 土)" }],
        summary: "Ecuación: [Molde] + [Bloque] = Tarjetas I/O de PLC o bloques funcionales."
    }
];

// ========================================================
// ESCENARIOS HMI (MODO ESCÁNER)
// ========================================================
const scannerScenarios = [
    {
        id: "s1",
        topic: "mecanica",
        rawText: "W201: 龙门 Z1 未使能",
        tokens: [
            { text: "W201: ", isTarget: false },
            { text: "龙门", isTarget: true, hanzi: "龙门" },
            { text: " Z1 ", isTarget: false },
            { text: "未使能", isTarget: true, hanzi: "未使能" }
        ],
        targetHanzi: "龙门",
        prompt: "Localiza el término que significa: Gantry / Estructura pórtico"
    },
    {
        id: "s2",
        topic: "operacion",
        rawText: "W107: 侧推 电缸 7 未使能",
        tokens: [
            { text: "W107: 侧推 ", isTarget: false },
            { text: "电缸", isTarget: true, hanzi: "电缸" },
            { text: " 7 ", isTarget: false },
            { text: "未使能", isTarget: true, hanzi: "未使能" }
        ],
        targetHanzi: "未使能",
        prompt: "Localiza la condición de error: No habilitado / Disabled (Servo Off)"
    },
    {
        id: "s3",
        topic: "mecanica",
        rawText: "W105: 侧推 电缸 5 未使能",
        tokens: [
            { text: "W105: 侧推 ", isTarget: false },
            { text: "电缸", isTarget: true, hanzi: "电缸" },
            { text: " 5 ", isTarget: false },
            { text: "未使能", isTarget: true, hanzi: "未使能" }
        ],
        targetHanzi: "电缸",
        prompt: "Identifica el actuador lineal: Cilindro eléctrico"
    },
    {
        id: "s4",
        topic: "alarmas",
        rawText: "护栏安全门: 按下对应侧护栏 解锁 按钮 解锁",
        tokens: [
            { text: "护栏", isTarget: false },
            { text: "安全门", isTarget: true, hanzi: "安全门" },
            { text: ": 按下对应侧护栏 ", isTarget: false },
            { text: "解锁", isTarget: true, hanzi: "解锁" },
            { text: " 按钮 ", isTarget: false },
            { text: "解锁", isTarget: true, hanzi: "解锁" }
        ],
        targetHanzi: "安全门",
        prompt: "Encuentra el dispositivo de interlock: Puerta de seguridad"
    },
    {
        id: "s5",
        topic: "alarmas",
        rawText: "护栏安全门: 按下对应侧护栏 解锁 按钮",
        tokens: [
            { text: "护栏", isTarget: false },
            { text: "安全门", isTarget: true, hanzi: "安全门" },
            { text: ": 按下对应侧护栏 ", isTarget: false },
            { text: "解锁", isTarget: true, hanzi: "解锁" },
            { text: " 按钮", isTarget: false }
        ],
        targetHanzi: "解锁",
        prompt: "Identifica el comando de seguridad: Desbloquear / Quitar interlock"
    },
    {
        id: "s6",
        topic: "alarmas",
        rawText: "设备状态: 报警中 | 蜂鸣器 激活",
        tokens: [
            { text: "设备状态: ", isTarget: false },
            { text: "报警", isTarget: true, hanzi: "报警" },
            { text: "中 | ", isTarget: false },
            { text: "蜂鸣器", isTarget: true, hanzi: "蜂鸣器" },
            { text: " 激活", isTarget: false }
        ],
        targetHanzi: "蜂鸣器",
        prompt: "Localiza el dispositivo acústico: Buzzer / Bocina de alarma"
    },
    {
        id: "s7",
        topic: "operacion",
        rawText: "菜单导航: 测试机设备 | 视觉 控制",
        tokens: [
            { text: "菜单导航: ", isTarget: false },
            { text: "测试", isTarget: true, hanzi: "测试" },
            { text: "机设备 | ", isTarget: false },
            { text: "视觉", isTarget: true, hanzi: "视觉" },
            { text: " 控制", isTarget: false }
        ],
        targetHanzi: "视觉",
        prompt: "Encuentra el subsistema de cámaras: Visión artificial"
    }
];