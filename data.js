// ========================================================
// ZÌDÒNG CORE - BANCO DE DATOS TÉCNICO POR ESPECIALIDADES
// ========================================================

const vocabulary = [
    // --- 1. PLC & REDES INDUSTRIALES ---
    {
        hanzi: "输入",
        pinyin: "shūrù",
        meaning: "Entrada (Input / I)",
        level: 1,
        topic: "plc",
        parts: [
            { char: "输", desc: "Transportar / Enviar datos" },
            { char: "入", desc: "Entrar / Hacia adentro" }
        ],
        summary: "Señal física o lógica que ingresa al controlador lógico programable (PLC)."
    },
    {
        hanzi: "输出",
        pinyin: "shūchū",
        meaning: "Salida (Output / Q / O)",
        level: 1,
        topic: "plc",
        parts: [
            { char: "输", desc: "Transportar / Transmitir" },
            { char: "出", desc: "Salir / Activar hacia afuera" }
        ],
        summary: "Señal enviada por el PLC hacia un actuador, bobina o indicador de campo."
    },
    {
        hanzi: "通讯",
        pinyin: "tōngxùn",
        meaning: "Comunicación de Red",
        level: 2,
        topic: "plc",
        parts: [
            { char: "通", desc: "Conectar / Atravesar" },
            { char: "讯", desc: "Mensaje / Información" }
        ],
        summary: "Enlace de red industrial (Profinet, Ethernet/IP, Modbus) entre CPU y periféricos."
    },

    // --- 2. ELECTRICIDAD & POTENCIA ---
    {
        hanzi: "电压",
        pinyin: "diànyā",
        meaning: "Voltaje / Tensión",
        level: 1,
        topic: "electricidad",
        parts: [
            { char: "电", desc: "Electricidad" },
            { char: "压", desc: "Presión / Fuerza potencial" }
        ],
        summary: "Diferencia de potencial eléctrico en gabinetes de control y servodrivers."
    },
    {
        hanzi: "接地",
        pinyin: "jiēdì",
        meaning: "Puesta a Tierra (GND)",
        level: 1,
        topic: "electricidad",
        parts: [
            { char: "接", desc: "Conectar / Unir" },
            { char: "地", desc: "Tierra / Suelo" }
        ],
        summary: "Conexión de protección contra descargas y filtrado de ruido electromagnético."
    },
    {
        hanzi: "继电器",
        pinyin: "jìdiànqì",
        meaning: "Relevador / Relé",
        level: 2,
        topic: "electricidad",
        parts: [
            { char: "继", desc: "Continuar / Transmitir" },
            { char: "电", desc: "Eléctrico" },
            { char: "器", desc: "Dispositivo / Componente" }
        ],
        summary: "Dispositivo electromagnético de conmutación para aislamiento de circuitos de mando."
    },

    // --- 3. MANTENIMIENTO & MECÁNICA ---
    {
        hanzi: "气缸",
        pinyin: "qìgāng",
        meaning: "Cilindro Neumático",
        level: 1,
        topic: "mantenimiento",
        parts: [
            { char: "气", desc: "Aire comprimido / Gas" },
            { char: "缸", desc: "Cilindro / Recipiente lineal" }
        ],
        summary: "Actuador lineal neumático operado por electroválvulas en celdas de ensamble."
    },
    {
        hanzi: "伺服",
        pinyin: "sìfú",
        meaning: "Servomotor / Servo",
        level: 1,
        topic: "mantenimiento",
        parts: [
            { char: "伺", desc: "Vigilar / Esperar comando" },
            { char: "服", desc: "Obedecer con precisión" }
        ],
        summary: "Motor de alta precisión con encoder y lazo cerrado para posicionamiento de ejes."
    },
    {
        hanzi: "润滑",
        pinyin: "rùnhuá",
        meaning: "Lubricación",
        level: 2,
        topic: "mantenimiento",
        parts: [
            { char: "润", desc: "Humedecer / Aceitar" },
            { char: "滑", desc: "Deslizar / Suavizar" }
        ],
        summary: "Mantenimiento preventivo en guías lineales, husillos de bolas y rodamientos."
    },

    // --- 4. AGV / AMR & LOGÍSTICA ---
    {
        hanzi: "寻迹",
        pinyin: "xúnjì",
        meaning: "Guiado / Rastreo de Ruta",
        level: 1,
        topic: "agv",
        parts: [
            { char: "寻", desc: "Buscar / Seguir" },
            { char: "迹", desc: "Rastro / Pista magnética" }
        ],
        summary: "Sistema de navegación por banda magnética, QR o mapeo láser SLAM."
    },
    {
        hanzi: "充电",
        pinyin: "chōngdiàn",
        meaning: "Carga de Batería",
        level: 1,
        topic: "agv",
        parts: [
            { char: "充", desc: "Llenar / Abastecer" },
            { char: "电", desc: "Energía eléctrica" }
        ],
        summary: "Estación de contacto automático o acople inductivo para unidades de transporte móvil."
    },
    {
        hanzi: "避障",
        pinyin: "bìzhàng",
        meaning: "Evasión de Obstáculos",
        level: 2,
        topic: "agv",
        parts: [
            { char: "避", desc: "Evitar / Esquivar" },
            { char: "障", desc: "Obstáculo / Bloqueo" }
        ],
        summary: "Activación de escáneres láser LiDAR de seguridad ante personas u objetos en ruta."
    },

    // --- 5. PRODUCCIÓN & ENSAMBLE ---
    {
        hanzi: "节拍",
        pinyin: "jiépāi",
        meaning: "Tiempo de Ciclo (Takt Time)",
        level: 1,
        topic: "produccion",
        parts: [
            { char: "节", desc: "Ritmo / Segmento" },
            { char: "拍", desc: "Pulso / Golpe de reloj" }
        ],
        summary: "Cadencia objetivo y tiempo de procesamiento por pieza en estaciones automatizadas."
    },
    {
        hanzi: "良率",
        pinyin: "liánglǜ",
        meaning: "Tasa de Rendimiento (Yield)",
        level: 1,
        topic: "produccion",
        parts: [
            { char: "良", desc: "Bueno / Aceptable" },
            { char: "率", desc: "Proporción / Porcentaje" }
        ],
        summary: "Porcentaje de piezas que cumplen especificaciones en la primera corrida sin retrabajo."
    },
    {
        hanzi: "工位",
        pinyin: "gōngwèi",
        meaning: "Estación de Trabajo / Celda",
        level: 2,
        topic: "produccion",
        parts: [
            { char: "工", desc: "Trabajo / Proceso fabril" },
            { char: "位", desc: "Ubicación / Posición" }
        ],
        summary: "Posición fija dentro del transfer mecánico o mesa rotativa de ensamble."
    },

    // --- 6. SEGURIDAD & INTERLOCKS ---
    {
        hanzi: "急停",
        pinyin: "jítíng",
        meaning: "Paro de Emergencia (E-Stop)",
        level: 1,
        topic: "seguridad",
        parts: [
            { char: "急", desc: "Urgente / Crítico" },
            { char: "停", desc: "Detener" }
        ],
        summary: "Corte inmediato de energía en bobinas de actuadores mediante circuito de seguridad."
    },
    {
        hanzi: "光栅",
        pinyin: "guāngshān",
        meaning: "Cortina de Luz Óptica",
        level: 1,
        topic: "seguridad",
        parts: [
            { char: "光", desc: "Luz infrarroja" },
            { char: "栅", desc: "Rejilla / Barrera" }
        ],
        summary: "Sensor de seguridad perimetral para protección de operadores en celdas de robot."
    },
    {
        hanzi: "安全门",
        pinyin: "ānquánmén",
        meaning: "Puerta de Seguridad / Enclavamiento",
        level: 2,
        topic: "seguridad",
        parts: [
            { char: "安全", desc: "Seguro / Protegido" },
            { char: "门", desc: "Puerta / Acceso" }
        ],
        summary: "Acceso con switch interlock magnético o electromecánico monitoreado por relevador de seguridad."
    },

    // --- 7. CALIDAD & VISIÓN ARTIFICIAL ---
    {
        hanzi: "检测",
        pinyin: "jiǎncè",
        meaning: "Inspección / Detección",
        level: 1,
        topic: "calidad",
        parts: [
            { char: "检", desc: "Examinar / Verificar" },
            { char: "测", desc: "Medir / Sondear" }
        ],
        summary: "Medición dimensional o verificación de presencia realizada por sensores y cámaras."
    },
    {
        hanzi: "不良",
        pinyin: "bùliáng",
        meaning: "Defectuoso / Rechazo (NG)",
        level: 1,
        topic: "calidad",
        parts: [
            { char: "不", desc: "No / Negativo" },
            { char: "良", desc: "Bueno / Aceptable" }
        ],
        summary: "Pieza fuera de tolerancia o con fallas visuales enviada a tolva de descarte."
    },
    {
        hanzi: "视觉",
        pinyin: "shìjué",
        meaning: "Visión Artificial (Cámara Cognex/Keyence)",
        level: 2,
        topic: "calidad",
        parts: [
            { char: "视", desc: "Ver / Mirar" },
            { char: "觉", desc: "Percibir / Detectar patrón" }
        ],
        summary: "Sistema de procesamiento de imágenes para inspección de alineación y lectura OCR."
    }
];

const scannerScenarios = [
    {
        topic: "seguridad",
        prompt: "Localiza el comando de PARO DE EMERGENCIA en el reporte:",
        targetHanzi: "急停",
        tokens: [
            { text: "ALARM-01:", isTarget: false },
            { text: "LINEA_4", isTarget: false },
            { text: "急停", isTarget: true, hanzi: "急停" },
            { text: "INTERVENCION", isTarget: false },
            { text: "REQUERIDA", isTarget: false }
        ]
    },
    {
        topic: "seguridad",
        prompt: "Identifica la CORTINA DE LUZ vulnerada:",
        targetHanzi: "光栅",
        tokens: [
            { text: "SEGURIDAD:", isTarget: false },
            { text: "SENSOR", isTarget: false },
            { text: "光栅", isTarget: true, hanzi: "光栅" },
            { text: "BLOQUEO_HAZ", isTarget: false }
        ]
    },
    {
        topic: "mantenimiento",
        prompt: "Ubica la falla del CILINDRO NEUMÁTICO:",
        targetHanzi: "气缸",
        tokens: [
            { text: "ZONA_3", isTarget: false },
            { text: "气缸", isTarget: true, hanzi: "气缸" },
            { text: "TIEMPO_EXCEDIDO", isTarget: false },
            { text: "REVISAR_PRESION", isTarget: false }
        ]
    },
    {
        topic: "mantenimiento",
        prompt: "Localiza la alerta de sobrecarga en el SERVOMOTOR:",
        targetHanzi: "伺服",
        tokens: [
            { text: "EJE_Z", isTarget: false },
            { text: "伺服", isTarget: true, hanzi: "伺服" },
            { text: "SOBRETORQUE", isTarget: false },
            { text: "DRIVER_ERROR", isTarget: false }
        ]
    },
    {
        topic: "plc",
        prompt: "Detecta la condición de pérdida de COMUNICACIÓN DE RED:",
        targetHanzi: "通讯",
        tokens: [
            { text: "PLC_SLAVE", isTarget: false },
            { text: "通讯", isTarget: true, hanzi: "通讯" },
            { text: "TIMEOUT_ERROR", isTarget: false }
        ]
    },
    {
        topic: "agv",
        prompt: "Ubica el sensor de EVASIÓN DE OBSTÁCULOS activado:",
        targetHanzi: "避障",
        tokens: [
            { text: "AGV-02", isTarget: false },
            { text: "避障", isTarget: true, hanzi: "避障" },
            { text: "PARO_PREVENTIVO", isTarget: false }
        ]
    },
    {
        topic: "calidad",
        prompt: "Identifica el marcador de PIEZA DEFECTUOSA (NG):",
        targetHanzi: "不良",
        tokens: [
            { text: "INSPECCION_FINAL:", isTarget: false },
            { text: "不良", isTarget: true, hanzi: "不良" },
            { text: "ACTIVAR_DESCARTE", isTarget: false }
        ]
    }
];
