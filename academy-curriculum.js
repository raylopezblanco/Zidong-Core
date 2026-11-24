/* OBERON ACADEMY · CURRÍCULO
   Los datos viven aquí; la interfaz y el motor no contienen el temario.
   Una lección puede estar outline (estructura pendiente) o ready (contenido usable).
*/
(() => {
  'use strict';
  const lessonTitles = [
    ['¿Qué es el mandarín?', 'Código Pinyin', 'Arquitectura sonora', 'Las cuatro marcas de tono', 'El tono neutro y el cambio de tono', 'Primeras sílabas y escucha'],
    ['Qué es un Hanzi', 'Trazos básicos', 'Orden de los trazos', 'Radicales: pistas de significado', 'Componentes y piezas', 'Estructuras de los caracteres', 'Laboratorio de construcción'],
    ['Caracteres pictográficos', 'Caracteres indicativos', 'Compuestos semánticos', 'Componentes fonéticos', 'Asociación visual responsable', 'Familias de caracteres', 'Etimología: qué sabemos y qué no'],
    ['Un carácter no siempre es una palabra', 'Palabras de dos caracteres', 'Cómo se combinan significados', 'Vocabulario cotidiano', 'Leer palabras nuevas por contexto'],
    ['Orden básico de la oración', 'Pronombres personales', 'Verbos y acciones', 'Negación con 不 y 没', 'Preguntas básicas', 'Tiempo y expresiones temporales'],
    ['Saludar y presentarte', 'Pedir y confirmar información', 'Expresar necesidades', 'Dar instrucciones sencillas', 'Resolver una situación en el trabajo']
  ];
  const unitMeta = [
    ['foundations','🧭','Fundamentos del mandarín','Conoce los sonidos, el Pinyin y los tonos.',['Pinyin','Pronunciación','Tonos']],
    ['anatomy','🧩','Anatomía de los Hanzi','Comprende trazos, radicales, componentes y estructuras.',['Trazos','Radicales','Estructura']],
    ['logic','🔬','La lógica de los caracteres','Descubre cómo se relacionan significado, sonido y familias.',['Componentes','Familias','Origen']],
    ['words','🧱','Construcción de palabras','Combina caracteres para formar palabras y conceptos.',['Combinaciones','Vocabulario']],
    ['grammar','📝','Gramática funcional','Construye ideas con estructuras reales del mandarín.',['Orden','Preguntas','Negación']],
    ['communication','🗣️','Comunicación real','Utiliza lo aprendido en situaciones cotidianas y laborales.',['Conversación','Instrucciones','Planta']]
  ];
  const units = unitMeta.map((m, ui) => {
    const lessons = lessonTitles[ui].map((title, li) => ({
      id: `U${String(ui+1).padStart(2,'0')}-L${String(li+1).padStart(2,'0')}`,
      title, objective: `Al terminar podrás ${title.toLowerCase()}.`,
      status: (ui === 0 && li === 0) ? 'ready' : 'outline',
      duration: 10,
      phases: null
    }));
    return { id:m[0], number:String(ui+1).padStart(2,'0'), icon:m[1], title:m[2], description:m[3], tags:m[4], lessons };
  });

  // Primera lección funcional de prototipo. El resto conserva su estructura y orden curricular.
  Object.assign(units[0].lessons[0], {
    objective: 'Reconocer qué es el mandarín, cómo se representa y para qué sirve el Pinyin.',
    phases: {
      discovery: {
        title:'Descubrimiento',
        text:'El mandarín se habla mediante sílabas con tonos. En la escritura cotidiana se utilizan caracteres chinos (Hanzi). El Pinyin es un sistema de letras latinas que ayuda a representar la pronunciación; no sustituye a los caracteres.',
        key:'Sonido + tono + carácter = una unidad que aprenderás a reconocer.'
      },
      anatomy: {
        title:'Anatomía de la idea',
        items:[
          {label:'Hanzi',detail:'El carácter escrito que representa una sílaba con significado o función dentro de una palabra.'},
          {label:'Pinyin',detail:'La representación de la pronunciación mediante letras latinas y marcas de tono.'},
          {label:'Tono',detail:'La altura o movimiento de la voz que distingue sílabas en mandarín.'}
        ]
      },
      memory:{
        title:'Asociación para recordar',
        text:'Imagina tres capas de una misma señal: el carácter es el símbolo, el Pinyin es la guía para leerlo y el tono es la melodía. Es una comparación didáctica, no un origen histórico.'
      },
      etymology:{available:false, note:'Esta lección explica conceptos modernos de aprendizaje; no presenta una etimología histórica de caracteres.'},
      pronunciation:{
        title:'Pronunciación y tonos',
        examples:[
          {hanzi:'妈',pinyin:'mā',tone:1,meaning:'mamá · tono alto y sostenido'},
          {hanzi:'麻',pinyin:'má',tone:2,meaning:'cáñamo · tono ascendente'},
          {hanzi:'马',pinyin:'mǎ',tone:3,meaning:'caballo · tono bajo con curva'},
          {hanzi:'骂',pinyin:'mà',tone:4,meaning:'regañar · tono descendente'}
        ],
        note:'Escucha cada ejemplo y observa que cambiar el tono puede cambiar el significado. El audio se ofrece como apoyo; la evaluación no depende de reconocimiento automático de tu voz.'
      },
      examples:[
        {hanzi:'你好',pinyin:'nǐ hǎo',meaning:'Hola'},
        {hanzi:'中国',pinyin:'Zhōngguó',meaning:'China'}
      ]
    },
    practice:{
      instructions:'Comprueba que distingues los tres conceptos principales.',
      exercises:[
        {id:'q1',tag:'pinyin',type:'choice',question:'¿Para qué sirve principalmente el Pinyin?',options:['Para representar la pronunciación con letras latinas','Para reemplazar todos los Hanzi','Para indicar únicamente el significado'],answer:0,explanation:'El Pinyin representa la pronunciación y utiliza marcas para indicar los tonos.'},
        {id:'q2',tag:'tones',type:'choice',question:'¿Qué puede ocurrir si cambia el tono de una sílaba?',options:['Nunca cambia nada','Puede cambiar el significado','El carácter desaparece'],answer:1,explanation:'Los tonos forman parte de la identidad de muchas sílabas del mandarín.'},
        {id:'q3',tag:'hanzi',type:'choice',question:'¿Cuál es la escritura mediante caracteres?',options:['Pinyin','Hanzi','Tono'],answer:1,explanation:'Hanzi es el nombre de los caracteres chinos.'}
      ]
    },
    reinforcement:{
      pinyin:[{question:'El Pinyin representa principalmente…',options:['Pronunciación','Orden de trazos'],answer:0}],
      tones:[{question:'Los tonos ayudan a distinguir…',options:['Significados de sílabas','Colores de caracteres'],answer:0}],
      hanzi:[{question:'Los Hanzi son…',options:['Caracteres chinos','Marcas de puntuación'],answer:0}]
    }
  });


  // Lección 02 · Código Pinyin: primera guía para descifrar sílabas.
  Object.assign(units[0].lessons[1], {
    status: 'ready',
    objective: 'Leer la estructura básica de una sílaba en Pinyin y reconocer iniciales, finales y marcas de tono.',
    duration: 15,
    phases: {
      discovery: {
        title: 'El código que conecta letras y sonidos',
        text: 'Pinyin (拼音, Pīnyīn) es el sistema oficial de romanización del chino estándar. Usa letras latinas para indicar cómo se pronuncian las sílabas. No es español ni inglés escrito con otras palabras: varias letras tienen valores de sonido propios del mandarín.',
        key: 'Pinyin es un mapa de pronunciación: te ayuda a leer el sonido, pero no reemplaza al Hanzi.'
      },
      anatomy: {
        title: 'Las piezas de una sílaba',
        items: [
          {label:'Inicial (声母 shēngmǔ)',detail:'Es el sonido consonántico que puede aparecer al comienzo. Ejemplos: m en mā, n en nǐ y b en bā.'},
          {label:'Final (韵母 yùnmǔ)',detail:'Es la parte vocálica que completa la sílaba. Puede ser una vocal o una combinación: a, ai, an, ang.'},
          {label:'Tono (声调 shēngdiào)',detail:'La marca sobre la vocal indica el tono: mā, má, mǎ y mà tienen la misma base ma, pero tonos diferentes.'}
        ]
      },
      memory: {
        title:'Piensa en una clave de tres partes',
        text:'Imagina que cada sílaba es una clave: primero puede venir una inicial, después una final y encima se indica el tono. Por ejemplo, mā = m + a + primer tono. Es una forma práctica de analizarla; no significa que todas las sílabas tengan siempre una inicial consonántica visible.'
      },
      etymology:{available:false,note:'Pinyin es un sistema moderno de romanización. Esta lección enseña cómo leerlo; no atribuye un origen histórico a las letras ni a los sonidos.'},
      pronunciation:{
        title:'Escucha cómo se arma',
        examples:[
          {hanzi:'妈',pinyin:'mā',tone:1,meaning:'m + a · tono alto y sostenido'},
          {hanzi:'你',pinyin:'nǐ',tone:3,meaning:'n + i · tercer tono'},
          {hanzi:'好',pinyin:'hǎo',tone:3,meaning:'h + ao · tercer tono'},
          {hanzi:'八',pinyin:'bā',tone:1,meaning:'b + a · primer tono'},
          {hanzi:'怕',pinyin:'pà',tone:4,meaning:'p + a · cuarto tono'}
        ],
        note:'Escucha y repite sin prisa. La voz del navegador es una ayuda aproximada; para afinar la pronunciación conviene escuchar audio de hablantes nativos.'
      },
      examples:[
        {hanzi:'妈妈',pinyin:'māma',meaning:'mamá · dos sílabas; la segunda suele pronunciarse con tono neutro'},
        {hanzi:'你好',pinyin:'nǐ hǎo',meaning:'hola · dos sílabas; aquí observa las iniciales n y h'},
        {hanzi:'中国',pinyin:'Zhōngguó',meaning:'China · zh inicial y finales ong / uo'}
      ]
    },
    practice:{
      instructions:'Analiza las piezas del Pinyin. Selecciona una respuesta por pregunta.',
      exercises:[
        {id:'pinyin_q1',tag:'pinyin_definition',type:'choice',question:'¿Qué representa el Pinyin?',options:['La pronunciación del chino estándar con letras latinas','El significado exacto de cada Hanzi','El orden de escritura de los trazos'],answer:0,explanation:'Pinyin es un sistema de romanización que representa la pronunciación.'},
        {id:'pinyin_q2',tag:'syllable_initial',type:'choice',question:'En la sílaba mā, ¿cuál es la inicial?',options:['a','m','ā'],answer:1,explanation:'La inicial es m; la parte final es a y el macrón marca el primer tono.'},
        {id:'pinyin_q3',tag:'syllable_final',type:'choice',question:'En hǎo, ¿cuál es la final?',options:['h','ao','ǎ'],answer:1,explanation:'La inicial es h y la final es ao. La marca sobre la a indica el tercer tono.'},
        {id:'pinyin_q4',tag:'tone_mark',type:'choice',question:'¿Qué información aporta el signo en mā?',options:['Que la sílaba lleva primer tono','Que la palabra está en plural','Que la m debe escribirse en mayúscula'],answer:0,explanation:'El macrón ( ¯ ) sobre la vocal señala el primer tono.'},
        {id:'pinyin_q5',tag:'pinyin_not_english',type:'choice',question:'¿Cómo debes interpretar las letras de Pinyin?',options:['Siempre con los sonidos del español','Siempre con los sonidos del inglés','Con las reglas de pronunciación propias del Pinyin'],answer:2,explanation:'Las letras de Pinyin tienen valores establecidos para representar sonidos del mandarín; no se leen automáticamente como español o inglés.'}
      ]
    },
    reinforcement:{
      pinyin_definition:[{question:'Pinyin es una guía para representar…',options:['La pronunciación','El orden de los trazos'],answer:0}],
      syllable_initial:[{question:'En mā, la inicial es…',options:['m','a'],answer:0}],
      syllable_final:[{question:'En hǎo, la final es…',options:['h','ao'],answer:1}],
      tone_mark:[{question:'El macrón de mā indica…',options:['Primer tono','Cuarto tono'],answer:0}],
      pinyin_not_english:[{question:'Pinyin se lee usando…',options:['Sus propias reglas','Siempre las reglas del inglés'],answer:0}]
    }
  });

  // Metadatos explícitos para que motor e interfaz puedan localizar cada lección.
  units.forEach((unit) => unit.lessons.forEach((lesson) => {
    lesson.unitId = unit.id;
    lesson.unitNumber = unit.number;
  }));

  const mastery = [
    {id:'U01-MASTERY',title:'Prueba de dominio · Fundamentos',objective:'Distinguir Hanzi, Pinyin y tonos en ejemplos nuevos.',requires:units[0].lessons.map(x=>x.id),status:'outline',challenges:[]},
    {id:'U02-MASTERY',title:'Prueba de dominio · Anatomía',objective:'Analizar trazos, componentes y estructura usando elementos ya estudiados.',requires:units[1].lessons.map(x=>x.id),status:'outline',challenges:[]},
    {id:'U03-MASTERY',title:'Prueba de dominio · Lógica',objective:'Razonar sobre componentes y familias con reglas previamente aprendidas.',requires:units[2].lessons.map(x=>x.id),status:'outline',challenges:[]},
    {id:'U04-MASTERY',title:'Prueba de dominio · Palabras',objective:'Interpretar combinaciones de caracteres en contexto.',requires:units[3].lessons.map(x=>x.id),status:'outline',challenges:[]},
    {id:'U05-MASTERY',title:'Prueba de dominio · Gramática',objective:'Construir e interpretar oraciones con estructuras practicadas.',requires:units[4].lessons.map(x=>x.id),status:'outline',challenges:[]},
    {id:'U06-MASTERY',title:'Prueba de dominio · Comunicación',objective:'Resolver una situación comunicativa cotidiana o laboral.',requires:units[5].lessons.map(x=>x.id),status:'outline',challenges:[]}
  ];
  window.OBERON_ACADEMY_CURRICULUM = { version:1, units, mastery };
})();
