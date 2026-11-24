/* OBERON ACADEMY · Currículo v1.0
   Las mnemotecnias se identifican como tales; la etimología solo se afirma cuando es fiable.
*/
(() => {
  'use strict';
  const lesson = (id, unitId, unitNumber, title, objective, phases, instructions, exercises, tags=[]) => ({
    id, unitId, unitNumber, title, objective, status: 'planned', phases,
    practice: { instructions, exercises: exercises.map((q,i)=>({id:`${id}-q${i+1}`,tag:q.tag||tags[i]||'fundamentals',...q})) }
  });
  const simple = (title, text, key='') => ({title,text,key});
  const p = (discovery, anatomy, memory, etymology, pronunciation, examples=[]) => ({discovery,anatomy,memory,etymology,pronunciation,examples});
  const ready = (x) => ({...x,status:'ready'});
  const units = [
    {id:'foundations',number:'01',icon:'🧭',title:'Fundamentos del mandarín',description:'Conoce el idioma, aprende a leer Pinyin y domina los sonidos y tonos.',lessons:[
      ready(lesson('u01l01','foundations','01','Un idioma, dos sistemas','Distinguirás entre caracteres chinos, palabras y Pinyin.',p(
        simple('¿Qué estás aprendiendo?','El mandarín estándar (普通话, Pǔtōnghuà) es una variedad estándar del chino. Se escribe normalmente con caracteres chinos, llamados 汉字 (Hànzì). El Pinyin es una herramienta para representar su pronunciación con letras latinas.','Hanzi = escritura; Pinyin = guía de pronunciación. No son dos idiomas.'),
        {title:'Tres piezas del sistema',items:[{label:'汉字 Hànzì','detail':'Los caracteres que ves escritos. Un carácter suele aportar una sílaba y una unidad de significado, pero no siempre equivale a una palabra completa.'},{label:'拼音 Pīnyīn','detail':'Sistema oficial de romanización del chino estándar. Usa letras latinas y marcas de tono.'},{label:'Palabra','detail':'Puede tener uno o varios caracteres. 你好 (nǐ hǎo) es una expresión de dos caracteres.'}]},
        simple('🧠 Asociación visual','Piensa en Hanzi como el plano escrito y en Pinyin como una guía para pronunciarlo. Es una comparación para recordar, no el origen histórico de los caracteres.'),
        {available:false,note:'En esta lección no atribuimos un origen pictográfico a 汉, 字 o 拼音. Más adelante estudiaremos etimologías concretas solo cuando estén documentadas.'},
        {title:'Primera lectura',examples:[{hanzi:'你好',pinyin:'nǐ hǎo',tone:'3 + 3',meaning:'hola'},{hanzi:'中国',pinyin:'Zhōngguó',tone:'1 + 2',meaning:'China'},{hanzi:'人',pinyin:'rén',tone:'2',meaning:'persona'}],note:'Observa que el Pinyin lleva marcas de tono. No omitas esas marcas al estudiar.'},
        [{hanzi:'你好',pinyin:'nǐ hǎo',meaning:'hola'},{hanzi:'中国',pinyin:'Zhōngguó',meaning:'China'}]),
        'Relaciona cada elemento con su función.',[
          {question:'¿Qué representa el Pinyin?',options:['La traducción al español','La pronunciación mediante letras latinas','El orden de los trazos'],answer:1,explanation:'El Pinyin representa la pronunciación del chino estándar con letras latinas y marcas tonales.',tag:'pinyin'},
          {question:'¿Cómo se llaman los caracteres chinos?',options:['Hanzi (汉字)','Pinyin (拼音)','Tonos (声调)'],answer:0,explanation:'汉字 (Hànzì) significa caracteres chinos.',tag:'hanzi'},
          {question:'¿Cuál de estos es una palabra escrita con dos caracteres?',options:['人','你好','rén'],answer:1,explanation:'你好 se escribe con dos caracteres: 你 y 好.',tag:'hanzi'}
        ],['pinyin','hanzi','words'])),
      ready(lesson('u01l02','foundations','01','Código Pinyin','Leerás sílabas en Pinyin y reconocerás sus marcas de tono.',p(
        simple('No es español disfrazado','Las letras del Pinyin representan sonidos del mandarín. Algunas se parecen a las del español, pero otras tienen valores distintos. La ü y combinaciones como zh, ch, sh y x requieren atención.' ,'Lee Pinyin según sus reglas, no según la pronunciación española.'),
        {title:'Partes de una sílaba',items:[{label:'Inicial','detail':'Consonante o grupo consonántico que comienza la sílaba; puede no existir.'},{label:'Final','detail':'La parte que sigue a la inicial: puede incluir vocales y una consonante nasal.'},{label:'Tono','detail':'Marca la altura o el movimiento tonal de la sílaba. Se escribe sobre una vocal.'}]},
        simple('🧠 Asociación visual','Imagina cada sílaba como un código de tres datos: inicio + final + tono. Es un recurso didáctico, no una regla histórica.'),
        {available:false,note:'El alfabeto Pinyin es un sistema moderno de romanización; aquí no hay una etimología de caracteres que explicar.'},
        {title:'Lee con atención',examples:[{hanzi:'妈',pinyin:'mā',tone:'1',meaning:'mamá'},{hanzi:'你',pinyin:'nǐ',tone:'3',meaning:'tú'},{hanzi:'好',pinyin:'hǎo',tone:'3',meaning:'bien / bueno'}],note:'Las marcas ā, á, ǎ y à indican tonos. La letra sin marca puede aparecer en sílabas de tono neutro.'},
        [{hanzi:'妈',pinyin:'mā',meaning:'mamá'},{hanzi:'你',pinyin:'nǐ',meaning:'tú'}]),
        'Elige la lectura correcta de cada concepto.',[
          {question:'¿Qué indica la marca ǎ en hǎo?',options:['Tercer tono','Segundo tono','Tono neutro'],answer:0,explanation:'El acento carón (ˇ) representa el tercer tono en Pinyin.',tag:'pinyin'},
          {question:'¿Cuál es el Pinyin de 妈?',options:['mà','mā','má'],answer:1,explanation:'妈 se pronuncia mā, con primer tono.',tag:'pinyin'},
          {question:'¿Qué parte puede faltar en una sílaba?',options:['El tono','La inicial','La final'],answer:1,explanation:'Hay sílabas que comienzan directamente con una final, sin consonante inicial.',tag:'syllables'}
        ],['pinyin','pinyin','syllables'])),
      ready(lesson('u01l03','foundations','01','Arquitectura sonora','Separarás iniciales, finales y sílabas completas.',p(
        simple('Construye el sonido','Muchas sílabas del mandarín se analizan como inicial + final + tono. Por ejemplo, mā tiene la inicial m, la final a y el primer tono. Algunas sílabas no tienen inicial.' ,'m + a + primer tono = mā (妈).'),
        {title:'Ejemplos de análisis',items:[{label:'mā','detail':'Inicial m + final a + primer tono.'},{label:'hǎo','detail':'Inicial h + final ao + tercer tono.'},{label:'ài','detail':'Sin inicial + final ai + cuarto tono.'}]},
        simple('🧠 Asociación visual','Piensa en una sílaba como una pieza modular: comienzo, terminación y tono. La analogía ayuda a analizar; no significa que el idioma se arme siempre de forma mecánica.'),
        {available:false,note:'Las letras del Pinyin son convenciones de transcripción. No se presenta aquí una historia etimológica.'},
        {title:'Escucha y compara',examples:[{hanzi:'妈',pinyin:'mā',tone:'1',meaning:'mamá'},{hanzi:'好',pinyin:'hǎo',tone:'3',meaning:'bien'},{hanzi:'爱',pinyin:'ài',tone:'4',meaning:'amor / amar'}],note:'Escucha cada sílaba y localiza su inicio y final. La pronunciación real debe aprenderse con audio, no solo leyendo.'},
        [{hanzi:'妈',pinyin:'mā',meaning:'mamá'},{hanzi:'好',pinyin:'hǎo',meaning:'bien'}]),
        'Analiza las partes de cada sílaba.',[
          {question:'En mā, ¿cuál es la inicial?',options:['a','m','ā'],answer:1,explanation:'La inicial es m; a es la final y el macrón marca el primer tono.',tag:'syllables'},
          {question:'En hǎo, ¿cuál es la final?',options:['h','ao','ǎ'],answer:1,explanation:'La final es ao; h es la inicial y el tercer tono se marca con ˇ.',tag:'syllables'},
          {question:'¿Qué estructura tiene ài?',options:['Inicial a + final i','Sin inicial + final ai','Inicial i + final a'],answer:1,explanation:'ài no tiene inicial; su final es ai y lleva cuarto tono.',tag:'syllables'}
        ],['syllables','syllables','syllables'])),
      ready(lesson('u01l04','foundations','01','Los cuatro tonos','Distinguirás los cuatro tonos principales del mandarín.',p(
        simple('El tono cambia la palabra','En mandarín, el tono forma parte de la pronunciación de una sílaba. Si cambias el tono, puedes cambiar el significado. No basta con pronunciar las consonantes y vocales correctamente.' ,'mā, má, mǎ y mà no son la misma palabra.'),
        {title:'Los cuatro tonos',items:[{label:'1.º mā (妈)','detail':'Alto y sostenido. La voz se mantiene en una altura relativamente alta.'},{label:'2.º má (麻)','detail':'Ascendente. La voz sube, parecido al final de una pregunta en español.'},{label:'3.º mǎ (马)','detail':'Bajo; en pronunciación aislada suele descender y luego subir. En el habla conectada puede realizarse de forma más breve y baja.'},{label:'4.º mà (骂)','detail':'Descendente y enérgico. La voz cae con claridad.'}]},
        simple('🧠 Asociación visual','Imagina cuatro rutas en un radar: línea, subida, valle y caída. Es una ayuda para recordar el contorno, no una descripción exacta de cada realización en conversación.'),
        {available:false,note:'Los tonos son una característica fonológica del mandarín; no tienen una etimología de carácter.'},
        {title:'Mismo sonido base, tonos distintos',examples:[{hanzi:'妈',pinyin:'mā',tone:'1',meaning:'mamá'},{hanzi:'麻',pinyin:'má',tone:'2',meaning:'cáñamo'},{hanzi:'马',pinyin:'mǎ',tone:'3',meaning:'caballo'},{hanzi:'骂',pinyin:'mà',tone:'4',meaning:'regañar / insultar'}],note:'Usamos la misma secuencia m+a para que el oído se concentre en el tono. Pulsa Escuchar y compara.'},
        [{hanzi:'妈',pinyin:'mā',meaning:'mamá'},{hanzi:'麻',pinyin:'má',meaning:'cáñamo'},{hanzi:'马',pinyin:'mǎ',meaning:'caballo'},{hanzi:'骂',pinyin:'mà',meaning:'regañar'}]),
        'Identifica el tono y su movimiento.',[
          {question:'¿Cuál es el primer tono?',options:['Alto y sostenido','Ascendente','Descendente'],answer:0,explanation:'El primer tono se mantiene alto y relativamente estable.',tag:'tones'},
          {question:'¿Qué carácter corresponde a mǎ?',options:['妈','麻','马'],answer:2,explanation:'马 (mǎ) significa caballo y lleva tercer tono.',tag:'tones'},
          {question:'¿Qué ocurre si cambias el tono de una sílaba?',options:['Nunca cambia nada','Puede cambiar el significado','Se convierte automáticamente en otra inicial'],answer:1,explanation:'El tono es distintivo: puede diferenciar palabras que comparten sonidos segmentales.',tag:'tones'}
        ],['tones','tones','tones'])),
      ready(lesson('u01l05','foundations','01','Control tonal','Aplicarás el tono neutro y tres reglas frecuentes de cambio tonal.',p(
        simple('Los tonos también se adaptan','Los tonos escritos en Pinyin representan la forma léxica, pero la pronunciación en una frase puede cambiar por reglas de tono. Aprenderás tres patrones frecuentes sin perder de vista el tono original.' ,'Aprende primero el tono de cada palabra; después aprende cómo cambia al hablar.'),
        {title:'Tres patrones importantes',items:[{label:'Dos terceros tonos','detail':'Cuando un tercer tono va antes de otro tercer tono, el primero normalmente se pronuncia como segundo tono. 你好 se pronuncia aproximadamente como ní hǎo; el Pinyin suele conservar nǐ hǎo para mostrar el tono léxico.'},{label:'不 bù','detail':'不 suele cambiar a bú antes de una sílaba de cuarto tono: bú shì (不是). En otros contextos conserva bù.'},{label:'一 yī','detail':'一 cambia de tono según lo que sigue: yí antes de cuarto tono (一个 yí ge) y yì antes de primer, segundo o tercer tono (一天 yì tiān). En aislamiento es yī.'},{label:'Tono neutro','detail':'Es ligero y breve, sin marca tonal. En palabras como māma (妈妈), la segunda sílaba suele ser neutra.'}]},
        simple('🧠 Asociación visual','Piensa en los tonos léxicos como el ajuste guardado y en el sandhi como el ajuste que se aplica al hablar. Es una analogía de memoria, no una regla lingüística formal.'),
        {available:false,note:'Los cambios tonales son procesos fonológicos del habla. No se explican mediante el origen gráfico de los caracteres.'},
        {title:'Observa el cambio',examples:[{hanzi:'你好',pinyin:'nǐ hǎo',tone:'3 + 3; primero suena 2',meaning:'hola'},{hanzi:'不是',pinyin:'bú shì',tone:'2 + 4 en pronunciación conectada',meaning:'no ser / no es'},{hanzi:'妈妈',pinyin:'māma',tone:'1 + neutro',meaning:'mamá'}],note:'En Pinyin didáctico suele conservarse el tono léxico en la escritura aunque la pronunciación conectada cambie.'},
        [{hanzi:'你好',pinyin:'nǐ hǎo',meaning:'hola'},{hanzi:'不是',pinyin:'bú shì',meaning:'no es'},{hanzi:'妈妈',pinyin:'māma',meaning:'mamá'}]),
        'Aplica las reglas a ejemplos frecuentes.',[
          {question:'¿Cómo suele sonar el primer tercer tono en 你好?',options:['Como primer tono','Como segundo tono','Como cuarto tono'],answer:1,explanation:'En la secuencia de dos terceros tonos, el primero cambia normalmente a segundo tono en el habla.',tag:'tone_sandhi'},
          {question:'¿Cómo se pronuncia 不 antes de 是 (cuarto tono)?',options:['bù shì','bú shì','bǔ shì'],answer:1,explanation:'不 cambia normalmente a bú antes de una sílaba de cuarto tono.',tag:'tone_sandhi'},
          {question:'¿Qué caracteriza al tono neutro?',options:['Es largo y alto','Es breve y ligero','Siempre desciende con fuerza'],answer:1,explanation:'El tono neutro es átono, breve y ligero; no lleva marca tonal en Pinyin.',tag:'neutral_tone'}
        ],['tone_sandhi','tone_sandhi','neutral_tone'])),
      ready(lesson('u01l06','foundations','01','Escucha y reconocimiento','Integrarás Pinyin, tonos y significado en una práctica de escucha guiada.',p(
        simple('Del símbolo al oído','Para reconocer una palabra, combina tres pistas: los sonidos de la sílaba, el tono y el contexto. Escucha primero sin mirar el Pinyin; después compara lo que oíste con la forma escrita.' ,'Escucha → identifica el tono → comprueba el Pinyin → relaciona el significado.'),
        {title:'Rutina de escucha',items:[{label:'1. Escucha','detail':'Reproduce la sílaba o palabra sin leer su Pinyin.'},{label:'2. Identifica','detail':'Decide si el tono es alto, ascendente, bajo o descendente.'},{label:'3. Comprueba','detail':'Revela el Pinyin y compara tu respuesta.'},{label:'4. Repite','detail':'Escucha otra vez y repite en voz alta, sin exigir reconocimiento automático de voz.'}]},
        simple('🧠 Asociación visual','Imagina que eres operador de un radar: primero detectas una señal, después clasificas su patrón y finalmente confirmas el código.'),
        {available:false,note:'Esta lección entrena percepción auditiva; no atribuye orígenes históricos a las palabras.'},
        {title:'Palabras de práctica',examples:[{hanzi:'你好',pinyin:'nǐ hǎo',tone:'3 + 3; primero suena 2',meaning:'hola'},{hanzi:'中国',pinyin:'Zhōngguó',tone:'1 + 2',meaning:'China'},{hanzi:'谢谢',pinyin:'xièxie',tone:'4 + neutro',meaning:'gracias'}],note:'La voz del dispositivo puede variar según el motor de síntesis instalado. Úsala como apoyo; para precisión fonética, compara con audio de hablantes nativos.'},
        [{hanzi:'你好',pinyin:'nǐ hǎo',meaning:'hola'},{hanzi:'中国',pinyin:'Zhōngguó',meaning:'China'},{hanzi:'谢谢',pinyin:'xièxie',meaning:'gracias'}]),
        'Usa las pistas de escritura y pronunciación para elegir.',[
          {question:'Escucha la palabra y elige su significado.',audio:'谢谢',options:['你好','谢谢','中国'],answer:1,explanation:'谢谢 (xièxie) significa gracias; la segunda sílaba suele ser neutra.',tag:'listening'},
          {question:'En Zhōngguó, ¿qué tonos aparecen?',options:['1 + 2','2 + 3','4 + 4'],answer:0,explanation:'中 zhōng lleva primer tono y 国 guó lleva segundo tono.',tag:'tones'},
          {question:'¿Cuál es el mejor orden para entrenar escucha?',options:['Leer traducción y adivinar','Escuchar, identificar, comprobar y repetir','Memorizar letras sin escuchar'],answer:1,explanation:'Primero escucha, luego identifica, comprueba y repite. Así entrenas el oído junto con la lectura.',tag:'listening'}
        ],['listening','tones','listening']))
    ]},
    {id:'anatomy',number:'02',icon:'🧩',title:'Anatomía de los Hanzi',description:'Observa trazos, radicales, componentes y formas de los caracteres.',lessons:[['Trazos básicos','Reconocerás los trazos fundamentales.'],['Orden de escritura','Aplicarás reglas comunes de orden de trazos.'],['Radicales','Identificarás componentes que ayudan a clasificar caracteres.'],['Componentes','Separarás caracteres en partes visuales.'],['Estructuras','Reconocerás estructuras izquierda-derecha y arriba-abajo.'],['Construcción guiada','Practicarás la composición visual de caracteres.'],['Lectura de formas','Distinguirás caracteres visualmente parecidos.']]},
    {id:'logic',number:'03',icon:'🔬',title:'La lógica de los caracteres',description:'Descubre pistas de significado, sonido y familias de caracteres.',lessons:[['Pictográficos','Estudiarás caracteres que representan formas o imágenes.'],['Indicativos','Reconocerás caracteres que expresan ideas abstractas.'],['Compuestos semánticos','Explorarás caracteres formados por componentes de significado.'],['Semántico y fonético','Identificarás componentes que sugieren significado y sonido.'],['Familias de caracteres','Agruparás caracteres relacionados.'],['Asociaciones visuales','Crearás mnemotecnias sin confundirlas con etimología.'],['Etimología fiable','Consultarás orígenes documentados de caracteres seleccionados.']]},
    {id:'words',number:'04',icon:'🧱',title:'Construcción de palabras',description:'Aprende cómo se combinan los caracteres para formar conceptos.',lessons:[['Carácter y palabra','Distinguirás carácter, morfema y palabra.'],['Palabras de dos caracteres','Leerás combinaciones frecuentes.'],['Vocabulario cotidiano','Ampliarás palabras de uso diario.'],['Inferir significados','Usarás componentes y contexto como pistas.'],['Formar expresiones','Combinarás vocabulario en expresiones útiles.']]},
    {id:'grammar',number:'05',icon:'📝',title:'Gramática del mandarín',description:'Entiende el orden de las palabras y cómo construir ideas.',lessons:[['Orden básico','Construirás oraciones sujeto-verbo-objeto.'],['Pronombres','Usarás pronombres personales.'],['Verbos y tiempo','Expresarás acciones y referencias temporales.'],['Negación','Usarás 不 y 没 en contextos básicos.'],['Preguntas','Formarás preguntas sencillas.'],['Cantidad y medida','Usarás números y clasificadores frecuentes.']]},
    {id:'communication',number:'06',icon:'🗣️',title:'Comunicación real',description:'Lleva lo aprendido a conversaciones y situaciones de trabajo.',lessons:[['Saludos y presentación','Saludarás y dirás quién eres.'],['Necesidades','Pedirás ayuda y expresarás necesidades.'],['Instrucciones','Comprenderás instrucciones sencillas.'],['Problemas en planta','Describirás una falla básica de máquina.'],['Conversación laboral','Integrarás vocabulario en un diálogo de trabajo.']]}
  ];
  // Genera las 30 lecciones futuras como datos bloqueados; no se presentan como contenido terminado.
  units.slice(1).forEach(u=>{u.lessons=u.lessons.map((item,i)=>lesson(`${'u'+u.number.replace(/^0/,'')+'l'+String(i+1).padStart(2,'0')}`,u.id,u.number,item[0],item[1],p(simple('Contenido en desarrollo','Esta lección se habilitará cuando sus explicaciones, ejemplos y ejercicios estén completos.'),{title:'Sección pendiente',items:[{label:'Estado','detail':'En preparación.'}]},simple('Asociación visual','Pendiente.'),{available:false,note:'No se afirma ninguna etimología en esta vista.'},{title:'Pronunciación',examples:[],note:'Se añadirá al completar la lección.'},[]),'Esta lección aún no está disponible.',[]))});
  window.OBERON_ACADEMY_CURRICULUM={version:1,units};
})();
