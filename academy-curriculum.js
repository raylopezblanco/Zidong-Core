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


  // Unidad 01 · Lecciones 03–06 completas.
  const readyLesson = (index, data) => Object.assign(units[0].lessons[index], {status:'ready', duration:15, ...data});
  readyLesson(2, {
    objective:'Separar iniciales y finales y reconocer contrastes básicos del sistema sonoro del mandarín.',
    phases:{
      discovery:{title:'Una sílaba tiene arquitectura',text:'En Pinyin, muchas sílabas se analizan como inicial + final + tono. La inicial es el comienzo consonántico; la final contiene el núcleo vocálico y, a veces, una terminación. Algunas sílabas empiezan directamente con una final, sin consonante inicial.',key:'No leas letra por letra como español: identifica el bloque sonoro completo.'},
      anatomy:{title:'Iniciales y finales',items:[{label:'Iniciales',detail:'Consonantes al inicio: b, p, m, f, d, t, n, l, g, k, h, j, q, x, zh, ch, sh, r, z, c, s.'},{label:'Finales simples',detail:'Vocales y formas básicas: a, o, e, i, u, ü.'},{label:'Finales compuestas',detail:'Combinaciones como ai, ei, ao, ou, an, en, ang, eng, ong; también hay finales con i, u o ü.'}]},
      memory:{title:'Construye el sonido por capas',text:'En mā: m es la inicial, a la final y el macrón indica primer tono. En ài no hay inicial consonántica: la final ai lleva cuarto tono. Esta división es una herramienta para estudiar la pronunciación.'},
      etymology:{available:false,note:'Esta lección describe la organización fonológica del Pinyin; no atribuye orígenes históricos a las letras.'},
      pronunciation:{title:'Contrastes que debes escuchar',examples:[{hanzi:'妈',pinyin:'mā',tone:1,meaning:'m + a · mamá'},{hanzi:'大',pinyin:'dà',tone:4,meaning:'d + a · grande'},{hanzi:'好',pinyin:'hǎo',tone:3,meaning:'h + ao · bueno / bien'},{hanzi:'爱',pinyin:'ài',tone:4,meaning:'sin inicial consonántica + ai · amar'},{hanzi:'书',pinyin:'shū',tone:1,meaning:'sh + u · libro'}],note:'Escucha el sonido completo. Las letras b/p, d/t y g/k representan contrastes de aspiración; no equivalen exactamente a las parejas del español.'},
      examples:[{hanzi:'朋友',pinyin:'péngyou',meaning:'amigo · observa p + eng y y + ou (la segunda sílaba suele ser neutra)'},{hanzi:'老师',pinyin:'lǎoshī',meaning:'profesor · l + ao y sh + i'},{hanzi:'工作',pinyin:'gōngzuò',meaning:'trabajo · g + ong y z + uo'}]},
    practice:{instructions:'Identifica la inicial y la final de cada sílaba.',exercises:[
      {id:'sound_q1',tag:'initial',type:'choice',question:'En mā, ¿cuál es la inicial?',options:['m','a','ā'],answer:0,explanation:'m es el sonido consonántico inicial.'},
      {id:'sound_q2',tag:'final',type:'choice',question:'En hǎo, ¿cuál es la final?',options:['h','ao','ǎ'],answer:1,explanation:'ao es la final; h es la inicial.'},
      {id:'sound_q3',tag:'zero_initial',type:'choice',question:'¿Cuál de estas sílabas no tiene inicial consonántica?',options:['mā','ài','shū'],answer:1,explanation:'ài comienza directamente con la final ai.'},
      {id:'sound_q4',tag:'syllable',type:'choice',question:'¿Qué análisis corresponde a gōng?',options:['g inicial + ong final + primer tono','ong inicial + g final','g + o + n + g, cada letra por separado'],answer:0,explanation:'Se analiza como inicial g, final ong y tono 1.'},
      {id:'sound_q5',tag:'pronunciation',type:'choice',question:'¿Cómo conviene leer Pinyin?',options:['Letra por letra con reglas españolas','Como bloques sonoros con reglas del mandarín','Ignorando las vocales'],answer:1,explanation:'La sílaba es una unidad sonora; aprende sus correspondencias propias.'}]},
    reinforcement:{initial:[{question:'En shū, la inicial es…',options:['sh','u'],answer:0}],final:[{question:'En hǎo, la final es…',options:['h','ao'],answer:1}],zero_initial:[{question:'ài tiene…',options:['una inicial consonántica','ninguna inicial consonántica'],answer:1}],syllable:[{question:'gōng se analiza como…',options:['g + ong + tono','o + n + g por separado'],answer:0}],pronunciation:[{question:'Pinyin se aprende como…',options:['bloques sonoros','letras españolas aisladas'],answer:0}]}
  });
  readyLesson(3, {
    objective:'Reconocer las cuatro marcas tonales y asociarlas con el contorno de la voz.', duration:15,
    phases:{discovery:{title:'El tono también es parte de la sílaba',text:'El mandarín estándar usa cuatro tonos léxicos principales y un tono neutro. La marca tonal en Pinyin indica cómo se comporta la voz. No es decoración: puede distinguir palabras que comparten los mismos sonidos segmentales.',key:'ma, mā, má, mǎ y mà no son intercambiables.'},
    anatomy:{title:'Las cuatro marcas',items:[{label:'1.º tono · ¯',detail:'Alto y sostenido: mā.'},{label:'2.º tono · ´',detail:'Ascendente: má, parecido a una pregunta breve.'},{label:'3.º tono · ˇ',detail:'Bajo; en pronunciación aislada suele presentar una curva descendente-ascendente: mǎ.'},{label:'4.º tono · `',detail:'Descendente, firme y breve: mà.'}]},
    memory:{title:'Una montaña rusa de la voz',text:'Imagina una línea: primer tono plano arriba; segundo sube; tercero baja y puede volver a subir; cuarto cae con decisión. El dibujo ayuda a recordar, pero la escucha y la práctica son esenciales.'},
    etymology:{available:false,note:'Las marcas tonales son convenciones modernas de transcripción, no partes históricas del carácter chino.'},
    pronunciation:{title:'La familia ma',examples:[{hanzi:'妈',pinyin:'mā',tone:1,meaning:'mamá · alto y sostenido'},{hanzi:'麻',pinyin:'má',tone:2,meaning:'cáñamo · ascendente'},{hanzi:'马',pinyin:'mǎ',tone:3,meaning:'caballo · bajo con curva'},{hanzi:'骂',pinyin:'mà',tone:4,meaning:'regañar · descendente'}],note:'Pulsa cada ejemplo para escuchar la voz disponible en tu navegador. La síntesis de voz puede no reproducir perfectamente los tonos.'},
    examples:[{hanzi:'一',pinyin:'yī',meaning:'uno · primer tono'},{hanzi:'人',pinyin:'rén',meaning:'persona · segundo tono'},{hanzi:'我',pinyin:'wǒ',meaning:'yo · tercer tono'},{hanzi:'是',pinyin:'shì',meaning:'ser / sí · cuarto tono'}]},
    practice:{instructions:'Relaciona cada marca con su contorno tonal.',exercises:[{id:'tone_q1',tag:'tone1',type:'choice',question:'¿Cómo suena el primer tono?',options:['Alto y sostenido','Ascendente','Descendente'],answer:0,explanation:'El primer tono se mantiene alto y estable.'},{id:'tone_q2',tag:'tone2',type:'choice',question:'¿Qué marca corresponde al segundo tono?',options:['ˇ','´','`'],answer:1,explanation:'El acento agudo marca el segundo tono.'},{id:'tone_q3',tag:'tone3',type:'choice',question:'¿Qué sílaba tiene tercer tono?',options:['mā','má','mǎ'],answer:2,explanation:'El carón marca el tercer tono.'},{id:'tone_q4',tag:'tone4',type:'choice',question:'¿Cuál es el cuarto tono?',options:['mà','mǎ','mā'],answer:0,explanation:'El acento grave marca el cuarto tono.'},{id:'tone_q5',tag:'tone_meaning',type:'choice',question:'¿Por qué importa el tono?',options:['Puede distinguir significados','Solo cambia el estilo de escritura','Indica plural'],answer:0,explanation:'El tono forma parte de la pronunciación de la palabra.'}]},
    reinforcement:{tone1:[{question:'El macrón en mā marca…',options:['primer tono','tercer tono'],answer:0}],tone2:[{question:'má lleva…',options:['segundo tono','cuarto tono'],answer:0}],tone3:[{question:'mǎ lleva…',options:['tercer tono','primer tono'],answer:0}],tone4:[{question:'mà lleva…',options:['cuarto tono','segundo tono'],answer:0}],tone_meaning:[{question:'El tono puede cambiar…',options:['el significado','el número de trazos'],answer:0}]}
  });
  readyLesson(4, {
    objective:'Comprender el tono neutro y aplicar el cambio tonal más frecuente del tercer tono.', duration:15,
    phases:{discovery:{title:'Los tonos cambian según el contexto',text:'Además de los cuatro tonos, algunas sílabas se pronuncian con tono neutro: son más ligeras y breves. También hay cambios de pronunciación condicionados por los tonos vecinos. La escritura Pinyin normalmente conserva el tono léxico subyacente en muchos materiales didácticos.',key:'Aprende primero la forma de diccionario y después observa cómo se pronuncia en una frase.'},
    anatomy:{title:'Dos fenómenos útiles',items:[{label:'Tono neutro',detail:'Una sílaba sin marca tonal, ligera y breve. Ejemplo frecuente: la segunda sílaba de māma (妈妈). No significa ausencia total de altura tonal.'},{label:'Tercer tono + tercer tono',detail:'Cuando dos terceros tonos van seguidos, el primero normalmente se pronuncia como segundo tono. 你好 se pronuncia nǐ hǎo en forma citada, pero en habla conectada suele sonar ní hǎo.'},{label:'Cambio de 不',detail:'不 bù suele cambiar a bú antes de una sílaba de cuarto tono: bú shì (不是). Es un patrón que estudiarás más adelante.'}]},
    memory:{title:'La voz se adapta al flujo',text:'Piensa en los tonos como el patrón base de cada sílaba. Al hablar en cadena, algunas pronunciaciones se ajustan para que la secuencia sea natural. No cambies todas las marcas por intuición: aprende reglas concretas.'},
    etymology:{available:false,note:'Los cambios tonales son fenómenos de pronunciación y no cambios en la escritura histórica de los caracteres.'},
    pronunciation:{title:'Escucha las formas en contexto',examples:[{hanzi:'妈妈',pinyin:'māma',tone:1,meaning:'mamá · segunda sílaba neutra'},{hanzi:'你好',pinyin:'nǐ hǎo',tone:3,meaning:'hola · dos terceros tonos; el primero cambia en habla conectada'},{hanzi:'不是',pinyin:'bú shì',tone:2,meaning:'no ser / no es · 不 cambia antes de cuarto tono'}],note:'Las transcripciones de pronunciación conectada pueden mostrar cambios que no se reflejan igual en la forma léxica o de diccionario.'},
    examples:[{hanzi:'什么',pinyin:'shénme',meaning:'qué · me suele ser neutra'},{hanzi:'学生',pinyin:'xuésheng',meaning:'estudiante · sheng suele ser neutra'},{hanzi:'很好',pinyin:'hěn hǎo',meaning:'muy bien · observa la secuencia de tonos'}]},
    practice:{instructions:'Identifica los patrones de pronunciación conectada.',exercises:[{id:'sandhi_q1',tag:'neutral',type:'choice',question:'¿Cómo suele ser una sílaba de tono neutro?',options:['Ligera y breve','Siempre muy larga','Siempre descendente'],answer:0,explanation:'El tono neutro suele ser más corto y ligero.'},{id:'sandhi_q2',tag:'third_change',type:'choice',question:'¿Qué suele ocurrir con dos terceros tonos seguidos?',options:['El primero se pronuncia como segundo','Ambos desaparecen','El segundo se vuelve primero'],answer:0,explanation:'El primer tercer tono cambia a segundo en esta secuencia.'},{id:'sandhi_q3',tag:'bu_change',type:'choice',question:'不 bù antes de un cuarto tono suele pronunciarse…',options:['bú','bǔ','bū'],answer:0,explanation:'不 cambia a segundo tono antes de una sílaba de cuarto tono.'},{id:'sandhi_q4',tag:'orthography',type:'choice',question:'¿Debes confundir el cambio de pronunciación con un cambio de carácter?',options:['No, el carácter se mantiene','Sí, siempre cambia el Hanzi','El Pinyin deja de existir'],answer:0,explanation:'El sandhi afecta la pronunciación en contexto, no sustituye el carácter.'},{id:'sandhi_q5',tag:'context',type:'choice',question:'¿Qué conviene aprender primero?',options:['Tono léxico y después reglas de contexto','Solo la pronunciación rápida','Ignorar las marcas tonales'],answer:0,explanation:'Primero domina las formas base y luego aplica los cambios regulares.'}]},
    reinforcement:{neutral:[{question:'El tono neutro suele ser…',options:['breve y ligero','siempre largo'],answer:0}],third_change:[{question:'En dos terceros tonos seguidos, cambia…',options:['el primero a segundo','el segundo a cuarto'],answer:0}],bu_change:[{question:'不 antes de cuarto tono suena normalmente…',options:['bú','bǔ'],answer:0}],orthography:[{question:'El sandhi cambia principalmente…',options:['la pronunciación','el carácter escrito'],answer:0}],context:[{question:'Primero domina…',options:['los tonos base','solo frases rápidas'],answer:0}]}
  });
  readyLesson(5, {
    objective:'Leer y escuchar sílabas y palabras frecuentes, relacionando Hanzi, Pinyin y tono.', duration:15,
    phases:{discovery:{title:'Del código a palabras reales',text:'Ahora reunirás lo aprendido: iniciales, finales, marcas tonales y pronunciación conectada. La meta no es traducir cada letra, sino reconocer sílabas completas y relacionarlas con caracteres y significados.',key:'Mira el Hanzi, intenta leer el Pinyin y confirma escuchando.'},
    anatomy:{title:'Rutina de escucha en tres pasos',items:[{label:'1 · Observa',detail:'Identifica las marcas tonales y separa las sílabas.'},{label:'2 · Predice',detail:'Lee cada bloque según las reglas del Pinyin; no uses automáticamente las reglas del español.'},{label:'3 · Comprueba',detail:'Escucha el audio y repite prestando atención al contorno tonal y a la unión entre sílabas.'}]},
    memory:{title:'Entrena como un explorador',text:'Primero escucha sin mirar el significado; después revisa Hanzi y Pinyin. Repite en sesiones cortas. Si confundes dos sonidos, vuelve a compararlos en pares, sin acelerar.'},
    etymology:{available:false,note:'Esta práctica se centra en lectura y escucha; no presenta etimologías no verificadas.'},
    pronunciation:{title:'Banco de escucha',examples:[{hanzi:'你好',pinyin:'nǐ hǎo',tone:3,meaning:'hola · saludo'},{hanzi:'谢谢',pinyin:'xièxie',tone:4,meaning:'gracias · segunda sílaba neutra'},{hanzi:'再见',pinyin:'zàijiàn',tone:4,meaning:'adiós · dos cuartos tonos'},{hanzi:'中国',pinyin:'Zhōngguó',tone:1,meaning:'China · primer y segundo tono'},{hanzi:'工作',pinyin:'gōngzuò',tone:1,meaning:'trabajo · primer y cuarto tono'}],note:'Toca cada palabra para escucharla. Si el dispositivo no tiene una voz zh-CN instalada, la voz disponible puede sonar poco natural.'},
    examples:[{hanzi:'我叫…',pinyin:'Wǒ jiào…',meaning:'Me llamo…'},{hanzi:'我是学生',pinyin:'Wǒ shì xuésheng',meaning:'Soy estudiante'},{hanzi:'你好，谢谢！',pinyin:'Nǐ hǎo, xièxie!',meaning:'¡Hola, gracias!'}]},
    practice:{instructions:'Demuestra que puedes interpretar sílabas y tonos en ejemplos familiares.',exercises:[{id:'listen_q1',tag:'recognition',type:'choice',question:'¿Qué significa 你好 (nǐ hǎo)?',options:['Hola','Gracias','Adiós'],answer:0,explanation:'你好 es un saludo que significa hola.'},{id:'listen_q2',tag:'recognition',type:'choice',question:'¿Cuál es el Pinyin de 中国?',options:['Zhōngguó','Zàijiàn','Xièxie'],answer:0,explanation:'中国 se romaniza Zhōngguó.'},{id:'listen_q3',tag:'tones',type:'choice',question:'En 谢谢 (xièxie), ¿cómo suele pronunciarse la segunda sílaba?',options:['Tono neutro','Primer tono','Cuarto tono'],answer:0,explanation:'La segunda sílaba de 谢谢 suele ser neutra.'},{id:'listen_q4',tag:'syllable',type:'choice',question:'¿Qué análisis corresponde a zài?',options:['z inicial + ai final + cuarto tono','ai inicial + z final','z inicial + a final + primer tono'],answer:0,explanation:'z es la inicial, ai la final y el acento grave indica cuarto tono.'},{id:'listen_q5',tag:'method',type:'choice',question:'¿Cuál es una buena rutina para estudiar una palabra nueva?',options:['Observar, predecir y escuchar','Memorizar solo la traducción','Ignorar el tono'],answer:0,explanation:'La rutina conecta escritura, lectura y escucha.'}]},
    reinforcement:{recognition:[{question:'你好 significa…',options:['hola','adiós'],answer:0}],tones:[{question:'La segunda sílaba de xièxie suele ser…',options:['neutra','cuarto tono'],answer:0}],syllable:[{question:'zài contiene…',options:['z + ai + cuarto tono','ai + z'],answer:0}],method:[{question:'Una rutina útil es…',options:['observar, predecir y escuchar','ignorar el audio'],answer:0}]}
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
