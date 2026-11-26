/* OBERON · BANCO DE PREGUNTAS
   Cada ítem incluye explicación; minRank indica la certificación mínima donde aparece. */
(() => {
 'use strict';
 const bank = [
  {id:'c201',minRank:2,category:'Pinyin',type:'choice',q:'¿Qué representa el Pinyin?',o:['La pronunciación con letras latinas','El orden de los trazos','Solo el significado'],a:0,e:'El Pinyin representa la pronunciación del mandarín; no sustituye a los Hanzi.'},
  {id:'c202',minRank:2,category:'Hanzi',type:'choice',q:'¿Qué son los Hanzi?',o:['Los tonos','Los caracteres chinos','Las letras latinas'],a:1,e:'Hanzi es el nombre de los caracteres chinos.'},
  {id:'c203',minRank:2,category:'Tonos',type:'choice',q:'¿Qué puede cambiar al cambiar el tono de una sílaba?',o:['El significado','El número de trazos siempre','El orden de la oración'],a:0,e:'Los tonos distinguen sílabas y pueden cambiar el significado.'},
  {id:'c204',minRank:2,category:'Pinyin',type:'choice',q:'En mā, ¿cuál es la inicial?',o:['a','m','ā'],a:1,e:'La inicial es m; a es la final y el macrón marca el primer tono.'},
  {id:'c205',minRank:2,category:'Pinyin',type:'choice',q:'En hǎo, ¿cuál es la final?',o:['h','ao','ǎ'],a:1,e:'La inicial es h y la final es ao.'},
  {id:'c206',minRank:2,category:'Tonos',type:'choice',q:'¿Qué tono indica el macrón de mā?',o:['Primer tono','Segundo tono','Cuarto tono'],a:0,e:'El macrón indica el primer tono, alto y sostenido.'},
  {id:'c207',minRank:2,category:'Hanzi',type:'choice',q:'¿Cuál de estos ejemplos está escrito en Hanzi?',o:['nǐ hǎo','你好','ni hao'],a:1,e:'你好 está escrito con caracteres chinos.'},
  {id:'c208',minRank:2,category:'Pronunciación',type:'choice',q:'¿Cómo conviene leer las letras de Pinyin?',o:['Siempre como español','Siempre como inglés','Con las reglas propias del Pinyin'],a:2,e:'Pinyin tiene reglas de pronunciación propias.'},
  {id:'c209',minRank:2,category:'Tonos',type:'choice',q:'¿Cuál es el cuarto tono?',o:['Ascendente','Descendente','Alto y sostenido'],a:1,e:'El cuarto tono es descendente y marcado.'},
  {id:'c210',minRank:2,category:'Pinyin',type:'choice',q:'¿Qué parte puede faltar en una sílaba?',o:['La final','El tono','La inicial consonántica'],a:2,e:'Algunas sílabas comienzan directamente con una final.'},
  {id:'c301',minRank:3,category:'Gramática',type:'choice',q:'¿Cuál es el orden básico frecuente de una oración sencilla?',o:['Verbo + objeto + sujeto','Sujeto + verbo + objeto','Objeto + sujeto + verbo'],a:1,e:'Una estructura básica frecuente es sujeto + verbo + objeto.'},
  {id:'c302',minRank:3,category:'Gramática',type:'choice',q:'¿Qué partícula suele colocarse al final para formar una pregunta sí/no?',o:['吗 (ma)','的 (de)','了 (le)'],a:0,e:'吗 al final convierte una afirmación en pregunta sí/no.'},
  {id:'c303',minRank:3,category:'Gramática',type:'choice',q:'¿Qué expresa 的 (de) en 我的机器?',o:['Negación','Posesión o relación descriptiva','Una pregunta'],a:1,e:'的 conecta posesión o descripción: 我的机器, mi máquina.'},
  {id:'c304',minRank:3,category:'Gramática',type:'choice',q:'¿Qué expresa 不 (bù) en una frase básica?',o:['Negación','Plural','Pasado obligatorio'],a:0,e:'不 se usa para negar acciones o estados habituales, entre otros usos.'},
  {id:'c305',minRank:3,category:'Vocabulario',type:'choice',q:'¿Qué significa 你好 (nǐ hǎo)?',o:['Gracias','Hola','Adiós'],a:1,e:'你好 es un saludo: hola.'},
  {id:'c306',minRank:3,category:'Vocabulario',type:'choice',q:'¿Qué significa 中国 (Zhōngguó)?',o:['China','Máquina','Trabajo'],a:0,e:'中国 significa China.'},
  {id:'c307',minRank:3,category:'Gramática',type:'choice',q:'En 我今天工作, ¿qué indica 今天?',o:['Hoy','Ayer','Máquina'],a:0,e:'今天 significa hoy; el tiempo puede aparecer antes de la acción.'},
  {id:'c308',minRank:3,category:'Gramática',type:'choice',q:'¿Qué indica 在 (zài) en 我在工厂?',o:['Dónde ocurre o se encuentra algo','Una negación','Posesión'],a:0,e:'在 puede indicar ubicación: estoy en la fábrica.'},
  {id:'c401',minRank:4,category:'Comprensión',type:'choice',q:'Un compañero pregunta 你忙吗？. ¿Qué está preguntando?',o:['¿Estás ocupado?','¿Dónde está la máquina?','¿Ya terminó?'],a:0,e:'你忙吗？ significa ¿estás ocupado?' },
  {id:'c402',minRank:4,category:'Gramática',type:'choice',q:'¿Qué expresa 了 (le) en 修好了?',o:['Que algo ya quedó reparado','Que algo está lejos','Una pregunta'],a:0,e:'En este ejemplo 了 ayuda a indicar que la acción quedó completada.'},
  {id:'c403',minRank:4,category:'Vocabulario',type:'choice',q:'¿Qué significa 机器 (jīqì)?',o:['Trabajador','Máquina','Fábrica'],a:1,e:'机器 significa máquina.'},
  {id:'c404',minRank:4,category:'Vocabulario',type:'choice',q:'¿Qué significa 工厂 (gōngchǎng)?',o:['Fábrica','Sensor','Electricidad'],a:0,e:'工厂 significa fábrica.'},
  {id:'c405',minRank:4,category:'Comprensión',type:'choice',q:'Si lees 我在工厂, ¿dónde está la persona?',o:['En la fábrica','En casa','En la máquina'],a:0,e:'我在工厂 significa estoy en la fábrica.'},
  {id:'c406',minRank:4,category:'Gramática',type:'choice',q:'¿Qué función cumple 个 (gè) en 一个工人?',o:['Clasificador','Verbo','Tono'],a:0,e:'个 es un clasificador común que acompaña cantidades y sustantivos.'},
  {id:'c407',minRank:4,category:'Comprensión',type:'choice',q:'¿Qué comunica 这是传感器?',o:['Esto es un sensor','No hay sensor','¿Dónde está el sensor?'],a:0,e:'这是传感器 significa esto es un sensor.'},
  {id:'c408',minRank:4,category:'Gramática',type:'choice',q:'¿Qué estructura aparece en 机器很新?',o:['Sujeto + 很 + adjetivo','Pregunta con 吗','Negación con 不'],a:0,e:'很 puede aparecer antes de un adjetivo: 机器很新, la máquina es nueva.'}
  ,{id:'c501',minRank:5,category:'Mundo eléctrico',type:'choice',q:'En el Mundo Eléctrico, ¿qué significa 电 (diàn)?',o:['Electricidad / voltaje','Válvula','Operador'],a:0,e:'电 significa electricidad o voltaje.'}
  ,{id:'c502',minRank:5,category:'Mundo eléctrico',type:'choice',q:'¿Qué significa 线 (xiàn) en el vocabulario del mundo eléctrico?',o:['Cableado / línea','Presión','Programa'],a:0,e:'线 significa línea o cableado.'}
  ,{id:'c503',minRank:5,category:'Mundo mecánico',type:'choice',q:'¿Qué significa 机 (jī)?',o:['Máquina / mecanismo','Aire','Seguridad'],a:0,e:'机 significa máquina o mecanismo.'}
  ,{id:'c504',minRank:5,category:'Mundo mecánico',type:'choice',q:'¿Qué significa 修 (xiū)?',o:['Reparación / mantenimiento','Pinza','Circuito'],a:0,e:'修 se relaciona con mantenimiento o reparación.'}
  ,{id:'c505',minRank:5,category:'Mundo neumático',type:'choice',q:'¿Qué significa 阀 (fá)?',o:['Válvula','Voltaje','Movimiento'],a:0,e:'阀 significa válvula.'}
  ,{id:'c506',minRank:5,category:'Mundo neumático',type:'choice',q:'¿Qué significa 压 (yā)?',o:['Presión','Máquina','Operador'],a:0,e:'压 significa presión.'}
  ,{id:'c601',minRank:6,category:'Mundo robótica',type:'choice',q:'En el Mundo Robótica, ¿qué significa 人 (rén)?',o:['Humano / operador','Pinza','Programa'],a:0,e:'人 significa persona o humano; en el mundo se usa como operador.'}
  ,{id:'c602',minRank:6,category:'Mundo robótica',type:'choice',q:'¿Qué significa 安 (ān) en el vocabulario del mundo robótica?',o:['Seguridad / interlock','Cableado','Presión'],a:0,e:'安 se asocia aquí con seguridad o interlock.'}
  ,{id:'c603',minRank:6,category:'Mundo eléctrico',type:'choice',q:'La frase 24V控制回路断路 indica que se detectó…',o:['Circuito abierto en el lazo de control de 24V','Temperatura alta en el módulo','Una válvula cerrada'],a:0,e:'La oración del Mundo Eléctrico describe un circuito abierto en el lazo de control de 24V.'}
  ,{id:'c604',minRank:6,category:'Mundo eléctrico',type:'choice',q:'主控柜与PLC通讯恢复正常 comunica que…',o:['La comunicación entre gabinete principal y PLC volvió a la normalidad','El motor dejó de moverse','La presión aumentó'],a:0,e:'La frase del mundo eléctrico indica que la comunicación con el PLC se restableció.'}
  ,{id:'c605',minRank:6,category:'Mundo mecánico',type:'choice',q:'¿Qué significa 动 (dòng)?',o:['Movimiento / accionamiento','Sensor','Fábrica'],a:0,e:'动 significa movimiento o accionamiento.'}
  ,{id:'c606',minRank:6,category:'Mundo neumático',type:'choice',q:'¿Qué significa 气 (qì) en el Mundo Neumático?',o:['Aire / neumática','Electricidad','Rutina'],a:0,e:'气 significa aire o gas; el mundo lo aplica a neumática.'}
  ,{id:'c701',minRank:7,category:'Integración técnica',type:'choice',q:'Una alarma contiene 变频器功率模组温度偏高. ¿Qué condición reporta?',o:['Temperatura alta del módulo de potencia del VFD','Circuito abierto de 24V','Comunicación restablecida'],a:0,e:'La frase del Mundo Eléctrico informa que la temperatura del módulo de potencia del variador está alta.'}
  ,{id:'c702',minRank:7,category:'Integración técnica',type:'choice',q:'¿Qué indica 线束组件已通过导通测试?',o:['El ensamble de arnés aprobó la prueba de continuidad','La válvula perdió presión','El robot terminó la rutina'],a:0,e:'La frase del Mundo Eléctrico indica que el ensamble de arnés pasó la prueba de continuidad.'}
  ,{id:'c703',minRank:7,category:'Integración técnica',type:'choice',q:'检测到24V控制回路断路 y 主控柜与PLC通讯恢复正常 describen, respectivamente…',o:['Una falla de circuito y una comunicación restablecida','Dos condiciones normales','Dos problemas neumáticos'],a:0,e:'La primera frase informa circuito abierto; la segunda, comunicación restablecida.'}
  ,{id:'c704',minRank:7,category:'Mundo robótica',type:'choice',q:'¿Qué significa 爪 (zhǎo) en el contexto de la celda robótica?',o:['Gripper / pinza','Operador','Programa'],a:0,e:'爪 significa garra; el mundo lo aplica a gripper o pinza.'}
  ,{id:'c705',minRank:7,category:'Mundo robótica',type:'choice',q:'¿Qué significa 程 (chéng) en el vocabulario del mundo robótica?',o:['Programa / rutina','Seguridad','Cable'],a:0,e:'程 se utiliza aquí para programa o rutina.'}
  ,{id:'c706',minRank:7,category:'Mundo neumático',type:'choice',q:'¿Qué significa 缸 (gāng) en el Mundo Neumático?',o:['Cilindro neumático','Válvula','Presión'],a:0,e:'缸 significa cilindro; en este mundo se aplica a cilindro neumático.'}

 ];
 window.OBERON_CERTIFICATION_BANK = bank;
})();