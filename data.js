// ========================================================
// ZÌDÒNG CORE - BANCO TÉCNICO Y NIVELES DE MODO CARRERA
// ========================================================

// 1. CARACTERES SIMPLES / RADICALES (Niveles 1-1 a 1-5)
const baseHanzi = [
    { id: 1, hanzi: "电", pinyin: "diàn", meaning: "Electricidad / Señal eléctrica", desc: "El rayo cayendo. Base de cables, relevadores y sensores." },
    { id: 2, hanzi: "线", pinyin: "xiàn", meaning: "Cable / Línea de conexión", desc: "Hilo de seda + hilo conductor. El camino físico de la señal." },
    { id: 3, hanzi: "气", pinyin: "qì", meaning: "Aire / Neumática", desc: "Flujo de gas o vapor. Energía neumática en cilindros de ensamble." },
    { id: 4, hanzi: "缸", pinyin: "gāng", meaning: "Cilindro / Pistón lineal", desc: "Recipiente rígido donde actúa el aire a presión." },
    { id: 5, hanzi: "门", pinyin: "mén", meaning: "Puerta / Acceso físico", desc: "Dos hojas de acceso. Base de enclavamientos e interlocks." }
];

// 2. TÉRMINOS COMPLEJOS / UNIÓN (Niveles 1-6 a 1-10)
const compoundTerms = [
    {
        hanzi: "电线",
        pinyin: "diànxiàn",
        meaning: "Cable Eléctrico",
        components: [
            { char: "电", desc: "Electricidad" },
            { char: "线", desc: "Cable / Hilo" }
        ],
        explanation: "电 (Electricidad) + 线 (Cable) = Cable conductor de energía o señales en gabinetes."
    },
    {
        hanzi: "气缸",
        pinyin: "qìgāng",
        meaning: "Cilindro Neumático",
        components: [
            { char: "气", desc: "Aire comprimido" },
            { char: "缸", desc: "Cilindro actuador" }
        ],
        explanation: "气 (Aire) + 缸 (Cilindro) = Actuador neumático lineal que empuja o sujeta piezas."
    },
    {
        hanzi: "安全门",
        pinyin: "ānquánmén",
        meaning: "Puerta de Seguridad",
        components: [
            { char: "安全", desc: "Seguridad" },
            { char: "门", desc: "Puerta" }
        ],
        explanation: "Enclavamiento con interlock monitoreado por relevador de seguridad en celdas robóticas."
    },
    {
        hanzi: "输入",
        pinyin: "shūrù",
        meaning: "Entrada (Input / I)",
        components: [
            { char: "输", desc: "Transportar señal" },
            { char: "入", desc: "Entrar" }
        ],
        explanation: "Señal de sensor o pulsador que entra a las tarjetas del PLC."
    },
    {
        hanzi: "急停",
        pinyin: "jítíng",
        meaning: "Paro de Emergencia (E-Stop)",
        components: [
            { char: "急", desc: "Urgente" },
            { char: "停", desc: "Detener" }
        ],
        explanation: "Corte inmediato de energía en actuadores mediante circuito de relevadores de seguridad."
    }
];

// 3. VOCABULARIO POR ÁREAS DE AUTOMATIZACIÓN
const vocabulary = [
    { hanzi: "输入", pinyin: "shūrù", meaning: "Entrada (Input / I)", topic: "plc", parts: [{char:"输",desc:"Enviar"},{char:"入",desc:"Entrar"}], summary: "Señal física o lógica hacia la CPU del PLC." },
    { hanzi: "输出", pinyin: "shūchū", meaning: "Salida (Output / Q)", topic: "plc", parts: [{char:"输",desc:"Enviar"},{char:"出",desc:"Salir"}], summary: "Comando del PLC a válvulas o contactores." },
    { hanzi: "通讯", pinyin: "tōngxùn", meaning: "Comunicación de Red", topic: "plc", parts: [{char:"通",desc:"Conectar"},{char:"讯",desc:"Datos"}], summary: "Enlace Profinet o Ethernet/IP entre dispositivos." },

    { hanzi: "电压", pinyin: "diànyā", meaning: "Voltaje / Tensión", topic: "electricidad", parts: [{char:"电",desc:"Electricidad"},{char:"压",desc:"Presión"}], summary: "Diferencia de potencial en gabinetes de control." },
    { hanzi: "接地", pinyin: "jiēdì", meaning: "Puesta a Tierra (GND)", topic: "electricidad", parts: [{char:"接",desc:"Conectar"},{char:"地",desc:"Tierra"}], summary: "Descarga de protección y filtro de ruido." },
    { hanzi: "继电器", pinyin: "jìdiànqì", meaning: "Relevador / Relé", topic: "electricidad", parts: [{char:"继",desc:"Transmitir"},{char:"电",desc:"Eléctrico"},{char:"器",desc:"Dispositivo"}], summary: "Conmutador electromagnético de aislamiento." },

    { hanzi: "气缸", pinyin: "qìgāng", meaning: "Cilindro Neumático", topic: "mantenimiento", parts: [{char:"气",desc:"Aire"},{char:"缸",desc:"Pistón"}], summary: "Actuador de movimiento lineal en celdas." },
    { hanzi: "伺服", pinyin: "sìfú", meaning: "Servomotor", topic: "mantenimiento", parts: [{char:"伺",desc:"Vigilar"},{char:"服",desc:"Obedecer"}], summary: "Motor de alta precisión con lazo cerrado y encoder." },
    { hanzi: "润滑", pinyin: "rùnhuá", meaning: "Lubricación", topic: "mantenimiento", parts: [{char:"润",desc:"Aceitar"},{char:"滑",desc:"Deslizar"}], summary: "Mantenimiento preventivo en guías lineales." },

    { hanzi: "寻迹", pinyin: "xúnjì", meaning: "Guiado de Ruta AGV", topic: "agv", parts: [{char:"寻",desc:"Rastrear"},{char:"迹",desc:"Pista"}], summary: "Navegación por cinta magnética o código QR." },
    { hanzi: "避障", pinyin: "bìzhàng", meaning: "Evasión de Obstáculos", topic: "agv", parts: [{char:"避",desc:"Evitar"},{char:"障",desc:"Bloqueo"}], summary: "Detección por sensor láser LiDAR perimetral." },

    { hanzi: "急停", pinyin: "jítíng", meaning: "Paro de Emergencia", topic: "seguridad", parts: [{char:"急",desc:"Urgente"},{char:"停",desc:"Paro"}], summary: "Parada crítica mediante relevador de seguridad." },
    { hanzi: "光栅", pinyin: "guāngshān", meaning: "Cortina Óptica de Luz", topic: "seguridad", parts: [{char:"光",desc:"Luz"},{char:"栅",desc:"Barrera"}], summary: "Barrera fotoeléctrica de protección humana." },

    { hanzi: "检测", pinyin: "jiǎncè", meaning: "Inspección / Prueba", topic: "calidad", parts: [{char:"检",desc:"Revisar"},{char:"测",desc:"Medir"}], summary: "Verificación de ensamble por sensores." },
    { hanzi: "不良", pinyin: "bùliáng", meaning: "Rechazo / Pieza NG", topic: "calidad", parts: [{char:"不",desc:"No"},{char:"良",desc:"Bueno"}], summary: "Pieza fuera de tolerancia rechazada." }
];

// 4. SIMULACIONES DE ALARMAS DE PLANTA (Vinculadas a la palabra del día)
const hmiSimulations = [
    {
        keyword: "输入",
        code: "HMI ALARM // E-102 [ESTACIÓN DE ENTRADA]",
        alarmText: "输入信号丢失",
        pinyin: "shūrù xìnhào diūshī",
        question: "La HMI reporta 'Falta de Señal de Entrada'. ¿Qué acción técnica debes realizar?",
        correctOption: "Verificar alimentación 24V y sensor de presencia en terminal de entrada del PLC",
        distractors: [
            "Reemplazar la fuente de alimentación de potencia del servomotor",
            "Cambiar la bobina del contactor de salida hacia los motores",
            "Lubricar las guías lineales del eje de movimiento principal"
        ]
    },
    {
        keyword: "急停",
        code: "HMI ALARM // S-001 [CIRCUITO DE SEGURIDAD]",
        alarmText: "急停按钮动作中",
        pinyin: "jítíng ànniǔ dòngzuò zhōng",
        question: "La celda está bloqueada por paro de emergencia. ¿Cuál es el procedimiento?",
        correctOption: "Liberar la seta de paro activada y rearmar el relevador de seguridad mediante botón Reset",
        distractors: [
            "Forzar la marca de software desde la programación del PLC",
            "Cambiar la receta de producción de la pantalla táctil",
            "Desconectar el cable Ethernet del módulo de comunicación"
        ]
    },
    {
        keyword: "气缸",
        code: "HMI ALARM // M-045 [ACTUADOR NEUMÁTICO]",
        alarmText: "气缸伸出超时",
        pinyin: "qìgāng shēnchū chāoshí",
        question: "Alarma: 'Cilindro extendido fuera de tiempo'. ¿Cómo resuelves el problema?",
        correctOption: "Inspeccionar presión neumática (bar) y posición del sensor magnético Reed Switch",
        distractors: [
            "Recalibrar el servocontrolador del eje vertical",
            "Limpiar el lente de la cámara de visión artificial",
            "Aumentar el tiempo de escaneo del programa del PLC"
        ]
    }
];
