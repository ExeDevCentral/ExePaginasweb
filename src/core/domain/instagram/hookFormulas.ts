/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * 26 Fórmulas Empíricas de Hooks para Reels (Bilingüe ES-AR + EN).
 * Calibradas sobre el estudio de instagram-agent-skill (MIT) y adaptadas
 * a negocios reales, sistemas web y automatizaciones de ExePaginasWeb.
 */

export interface HookFormula {
  id: number
  name: string
  nameEs: string
  templateEs: string
  exampleEs: string
  onScreenEs: string
  bestForEs: string
  trapEs: string
  matchRegex: RegExp
}

export const HOOK_FORMULAS: readonly HookFormula[] = [
  {
    id: 1,
    name: 'Cost Confession',
    nameEs: 'Confesión de Costo',
    templateEs: '{Monto exacto} es lo que {un error puntual} le costó a {negocio/proyecto}.',
    exampleEs: '$180,000 al mes es lo que anotar turnos en cuaderno le costaba a esta cancha.',
    onScreenEs: 'ERROR DE $180,000',
    bestForEs: 'Confianza inmediata. La gente mira hasta el final cuando el costo es real.',
    trapEs:
      'Inventar costos blandos ("me costó mi paz mental"). Usá números reales o {{tu_numero}}.',
    matchRegex:
      /\$\s?\d[\d.,]*\s+(?:es|era|fue|is|was)\b|\b(?:costó|costaba|cost|perdí|perdimos|lost)\b[^.!?]{0,28}\$?\s?\d/i,
  },
  {
    id: 2,
    name: 'Negative Command',
    nameEs: 'Orden Negativa',
    templateEs: 'Dejá de {hábito común}. Hacé {alternativa concreta} en su lugar.',
    exampleEs:
      'Dejá de perder tres horas cobrando señas a mano. Automatizá la reserva con vencimiento.',
    onScreenEs: 'DEJÁ DE COBRAR A MANO',
    bestForEs: 'Guardados y debate. El imperativo frena el pulgar mucho más que una afirmación.',
    trapEs:
      'Ordenar dejar algo que nadie hace. Tiene que ser un hábito real del dueño del negocio.',
    matchRegex:
      /^\s*(?:dej[aá]\s+de|no\s+(?:hagas|uses|pagues|armes|anotes)|nunca\s+|stop|quit|never|don'?t)\b/i,
  },
  {
    id: 3,
    name: 'Nobody Tells You',
    nameEs: 'Nadie Te Dice',
    templateEs: 'Nadie te dice que {verdad incómoda sobre lo que buscan}.',
    exampleEs: 'Nadie te dice que anotar 40 turnos por WhatsApp te cuesta clientes.',
    onScreenEs: 'WHATSAPP TE FRENA VENTAS',
    bestForEs: 'Audiencia fría. Te posiciona como el ingeniero que dice la parte incómoda.',
    trapEs: 'Repetir una obviedad que dicen todas las agencias de marketing.',
    matchRegex:
      /\b(?:nadie\s+(?:te\s+)?(?:dice|cuenta|explica|avisa)|lo\s+que\s+nadie\s+te\s+dice|nobody\s+(?:ever\s+)?(?:tells|says|talks))\b/i,
  },
  {
    id: 4,
    name: 'The Replacement',
    nameEs: 'El Reemplazo',
    templateEs: '{Este sistema} reemplazó {gasto caro} por {fracción del costo}.',
    exampleEs: 'Este panel con SLA reemplazó tres planillas de Excel y dos horas diarias de caja.',
    onScreenEs: '3 PLANILLAS -> 1 PANEL',
    bestForEs: 'Demos de sistemas en vivo y comparativas operativas.',
    trapEs: 'Exagerar el reemplazo. Si automatiza el 70% del flujo, decí el 70%.',
    matchRegex:
      /\b(?:reemplaz[oó]|reemplaza|replaced?|en\s+vez\s+de\s+pagar|instead\s+of\s+paying)\b/i,
  },
  {
    id: 5,
    name: 'Time Collapse',
    nameEs: 'Colapso de Tiempo',
    templateEs: 'Esto antes llevaba {tiempo largo}. Ahora lleva {tiempo corto}.',
    exampleEs: 'Cerrar caja en el restaurante llevaba 50 minutos. En RESTOia lleva 4 minutos.',
    onScreenEs: '50 MIN -> 4 MIN',
    bestForEs: 'Videos de procesos operativos donde el beneficio es velocidad medible.',
    trapEs: 'Prometer saltos irreales ("de 40 horas a 2 segundos") que suenan a mentira.',
    matchRegex:
      /\b(?:antes\s+(?:me\s+|nos\s+)?llevaba|ahora\s+lleva|used\s+to\s+take|now\s+(?:it\s+)?takes?)\b/i,
  },
  {
    id: 6,
    name: 'The Receipt',
    nameEs: 'La Prueba en Pantalla',
    templateEs: 'Corrimos {sistema} durante {N días}. Estos son los números reales.',
    exampleEs: 'Medimos la carga móvil durante 30 días en producción. Mirá el Lighthouse real.',
    onScreenEs: '30 DÍAS · DATOS REALES',
    bestForEs: 'Casos de estudio grabando pantalla real del dashboard o métricas.',
    trapEs: 'Hablar de números sin mostrar la captura o grabación real en pantalla.',
    matchRegex:
      /\b(?:durante\s+\d+\s+(?:d[ií]as|semanas|meses)|estos\s+son\s+los\s+n[uú]meros|for\s+\d+\s+(?:days?|weeks?|months?))\b/i,
  },
  {
    id: 7,
    name: 'Wrong Way, Right Way',
    nameEs: 'Mal Hecho vs Bien Hecho',
    templateEs: 'Estás manejando {proceso} mal, y no es tu culpa. {La solución}.',
    exampleEs:
      'Estás pidiendo presupuestos web a ciegas, y no es tu culpa. Mirá qué exigir primero.',
    onScreenEs: 'QUÉ EXIGIR EN TU WEB',
    bestForEs: 'Educación a clientes B2B sin sonar soberbio gracias al "no es tu culpa".',
    trapEs: 'Omitir la empatía: atacar al cliente hace que deslice hacia arriba.',
    matchRegex:
      /\b(?:est[aá]s\s+\w+ndo\b[^.!?]*\bmal|el\s+error\s+m[aá]s\s+com[uú]n|doing\b[^.!?]*\bwrong|biggest\s+mistake)\b/i,
  },
  {
    id: 8,
    name: 'Insider Leak',
    nameEs: 'Secreto de Arquitectura',
    templateEs: 'Después de {experiencia concreta}, esto es lo que las agencias nunca te muestran.',
    exampleEs:
      'Como arquitecto de software, esto es lo que una plantilla barata esconde en el servidor.',
    onScreenEs: 'LO QUE NO TE MUESTRAN',
    bestForEs: 'Autoridad técnica directa frente a plantillas genéricas.',
    trapEs: 'Prometer un secreto técnico y terminar dando un consejo genérico.',
    matchRegex:
      /\b(?:nunca\s+te\s+(?:muestran|dicen|incluyen)|we\s+never\s+(?:told|said|showed))\b/i,
  },
  {
    id: 9,
    name: 'The Steal',
    nameEs: 'Copiá Esta Estructura',
    templateEs: 'Copiá este {artefacto concreto}. Me llevó {tiempo} dejarlo fino.',
    exampleEs: 'Copiá este flujo de 3 pasos para confirmar turnos por WhatsApp sin perder señas.',
    onScreenEs: 'COPIÁ ESTE FLUJO',
    bestForEs: 'Guardados y reenvíos por DM entre socios de negocios.',
    trapEs: 'No mostrar el diagrama o checklist claro en pantalla para hacer captura.',
    matchRegex: /^\s*(?:copi[aá]|rob[aá]|guard[aá]\s+este|steal\s+(?:this|these|my))\b/i,
  },
  {
    id: 10,
    name: 'If This, Then Watch',
    nameEs: 'Filtro Directo (Si Te Pasa Esto)',
    templateEs: 'Si {situación específica}, estos {segundos} te ahorran meses.',
    exampleEs:
      'Si tu web tarda más de 3 segundos en abrir en 4G, estos 25 segundos te ahorran plata.',
    onScreenEs: '¿WEB LENTA EN CELULAR?',
    bestForEs: 'Calificar leads reales. Menos vistas vacías, más consultas listas para comprar.',
    trapEs: 'Usar una condición demasiado amplia ("Si tenés un negocio...").',
    matchRegex: /^\s*(?:si\s+(?:tu|tus|ten[eé]s|manej[aá]s|cobr[aá]s)|if\s+(?:you|your))\b/i,
  },
  {
    id: 11,
    name: 'Numbered With A Favourite',
    nameEs: 'Lista Corta con Favorito',
    templateEs: '{N} cambios que {resultado}. El número {k} es el que nadie aplica.',
    exampleEs: 'Tres ajustes que duplican reservas móviles. El tercero no cuesta un peso extra.',
    onScreenEs: '3 AJUSTES · MIRÁ EL #3',
    bestForEs: 'Retención hasta la mitad del Reel esperando el punto destacado.',
    trapEs: 'Listas de 8 o 10 puntos: nadie te cree que los 10 sean buenos.',
    matchRegex:
      /^\s*(?:\d+|dos|tres|cuatro|cinco|three|four|five)\s+\w+.*?\b(?:n[uú]mero|tercero|cuarto|number)\b/i,
  },
  {
    id: 12,
    name: 'The Objection',
    nameEs: 'La Objeción Textual',
    templateEs: '"{Objeción exacta del cliente}." Perfecto. Mirá cómo se resuelve igual.',
    exampleEs:
      '"Mis clientes son grandes y no usan apps." Perfecto: por eso la reserva abre sin instalar nada.',
    onScreenEs: '"NO USAN APPS"',
    bestForEs: 'Destrabar la objeción real por la que posponen digitalizar el negocio.',
    trapEs: 'Inventar una objeción falsa en vez de usar la frase exacta del cliente.',
    matchRegex: /^\s*["“'][^"”']{5,120}["”'][,.]?\s*(?:perfecto|bien|bueno|ok|fine|sure)/i,
  },
  {
    id: 13,
    name: 'Before And After, On Screen',
    nameEs: 'Antes y Después en Vivo',
    templateEs: '{Mostrá el antes}. {Mostrá el después}. {Una sola palanca que cambió}.',
    exampleEs: 'Así cotizaban por PDF estático. Así cotizan ahora en vivo en 40 segundos.',
    onScreenEs: 'PDF FIJO vs COTIZADOR VIVO',
    bestForEs: 'Rediseños frontend, velocidad de carga y flujos UX antes/después.',
    trapEs: 'Nombrar cinco cambios a la vez en lugar de aislar la mejora principal.',
    matchRegex:
      /\b(?:antes\b[^.!?]*\bahora|as[ií]\s+era\b[^.!?]*\bas[ií]\s+es|before\b[^.!?]*\bafter)\b/i,
  },
  {
    id: 14,
    name: 'The Callout',
    nameEs: 'Llamado a un Rubro Exacto',
    templateEs: '{Rubro específico}: este es el cuello de botella que están ignorando.',
    exampleEs: 'Dueños de canchas de pádel: este es el hueco por donde pierden turnos los viernes.',
    onScreenEs: 'COMPLEJOS DE PÁDEL',
    bestForEs: 'Reenvíos directos ("che, mirá esto para el complejo").',
    trapEs: 'Llamar a "emprendedores" en general: eso no identifica a nadie.',
    matchRegex:
      /^\s*(?:due[ñn]os\s+de|estudios\s+jur[ií]dicos|cl[ií]nicas|restaurantes|complejos\s+de)[^.!?]{0,35}[:,]/i,
  },
  {
    id: 15,
    name: 'The Flop Record',
    nameEs: 'Iteración Honesta',
    templateEs: 'Las primeras {N} versiones fallaban en esto. En la {N+1} cambiamos una pieza.',
    exampleEs: 'Los primeros 3 prototipos de checkout perdían móvil. Este botón único lo resolvió.',
    onScreenEs: '3 PROTOTIPOS -> EL QUE QUEDÓ',
    bestForEs: 'Mostrar oficio real de ingeniería e iteración de interfaz.',
    trapEs: 'Atribuir la mejora a suerte en vez de explicar el cambio de diseño.',
    matchRegex: /\b(?:primeros?\s+\d+|primeras?\s+\d+|my\s+first\s+\d+)\b/i,
  },
  {
    id: 16,
    name: 'The Verbatim Question',
    nameEs: 'La Pregunta de Todas las Semanas',
    templateEs: '"{Pregunta tal cual la escriben}" — me la hacen todas las semanas.',
    exampleEs: '"¿Conviene abono mensual o pago único para mi web?" Me lo preguntan cada semana.',
    onScreenEs: 'PREGUNTA DE CADA SEMANA',
    bestForEs: 'SEO interno en Instagram y responder dudas reales de preventa.',
    trapEs: 'Reescribir la pregunta en lenguaje técnico que ningún cliente usa.',
    matchRegex:
      /^\s*["“']?[¿?]?(?:c[oó]mo|cu[aá]nto|qu[eé]|por\s+qu[eé]|conviene|how|what|why|should)\b[^?]{3,110}\?/i,
  },
  {
    id: 17,
    name: 'Head To Head',
    nameEs: 'Mano a Mano Técnico',
    templateEs: '{Opción A} contra {Opción B}. Cuál rinde de verdad para un negocio local.',
    exampleEs:
      'WordPress lleno de plugins versus Next.js a medida. Cuál sobrevive cuando entra tráfico.',
    onScreenEs: 'WORDPRESS vs A MEDIDA',
    bestForEs: 'Comentarios de calidad y educación arquitectónica clara.',
    trapEs: 'Terminar con "depende" sin jugarse por un criterio concreto.',
    matchRegex: /\b(?:vs\.?|versus|contra)\b/i,
  },
  {
    id: 18,
    name: 'Cold Open Demo',
    nameEs: 'Demo en Frío (Sin Intro)',
    templateEs: '{Arrancá tocando el sistema en vivo.} Mirá lo que pasa cuando hago clic acá.',
    exampleEs: 'Mirá lo que pasa en el panel en menos de un segundo cuando entra un pago real.',
    onScreenEs: 'MIRÁ ESTO EN VIVO',
    bestForEs: 'Mostrar UI boutique, animaciones fluidas, Linux POS o webhooks reales.',
    trapEs: 'Tardar 10 segundos en llegar a la acción visual.',
    matchRegex: /^\s*(?:mir[aá]\s+(?:lo\s+que\s+pasa|esto|c[oó]mo)|watch\s+(?:what|this|me))\b/i,
  },
  {
    id: 19,
    name: 'The Deadline',
    nameEs: 'Ventana Real',
    templateEs: '{Evento real} arranca en {fecha}. Tené {sistema} listo antes.',
    exampleEs:
      'Antes de subir precios de temporada, dejá el cotizador automático calculando señas.',
    onScreenEs: 'ANTES DE TEMPORADA ALTA',
    bestForEs: 'Urgencia genuina atada a fechas comerciales o cambios técnicos reales.',
    trapEs: 'Falsas urgencias artificiales que destruyen credibilidad.',
    matchRegex: /\b(?:antes\s+de\s+(?:subir|lanzar|que\s+cambie)|cambia\s+el|changes\s+on)\b/i,
  },
  {
    id: 20,
    name: 'Permission',
    nameEs: 'Permiso para Simplificar',
    templateEs: 'No necesitás {lo que todos te quieren vender}. Necesitás {pieza clave}.',
    exampleEs:
      'No necesitás una app en el App Store. Necesitás una web rápida que reserve en dos toques.',
    onScreenEs: 'NO NECESITÁS UNA APP',
    bestForEs: 'Alivio inmediato de presupuesto y altísima tasa de guardados.',
    trapEs: 'Decir qué no necesitan sin darle la alternativa concreta.',
    matchRegex: /\b(?:no\s+necesit[aá]s|you\s+(?:do\s+not|don'?t)\s+need)\b/i,
  },
  {
    id: 21,
    name: 'Mid-Sentence Start',
    nameEs: 'Arranque a Mitad de Escena',
    templateEs: '...y ahí fue cuando {giro concreto del proyecto}.',
    exampleEs:
      '...y ahí vimos que el 78% de sus clientes abandonaba en el tercer paso del formulario.',
    onScreenEs: '78% ABANDONABA EN PASO 3',
    bestForEs: 'Storytelling de diagnósticos y auditorías reales de UX.',
    trapEs: 'No dar contexto antes del segundo 8.',
    matchRegex: /^\s*(?:\.\.\.|…|y\s+ah[ií]\s+(?:fue\s+cuando|vimos)|and\s+that'?s\s+when)/i,
  },
  {
    id: 22,
    name: 'Contrarian Flip',
    nameEs: 'Inversión Contraintuitiva',
    templateEs: '{Creencia popular del rubro, invertida con argumento}.',
    exampleEs: 'Más animaciones en tu landing venden menos.',
    onScreenEs: 'MÁS EFECTOS = MENOS VENTAS',
    bestForEs: 'Debate sobre diseño UI, performance y conversión.',
    trapEs: 'Invertir una frase que nadie cree en primer lugar.',
    matchRegex:
      /^\s*(?:m[aá]s\s+\w+\s+vende[n]?\s+menos|menos\s+\w+\s+vende[n]?\s+m[aá]s|[a-z][\w' ]{2,30}\b(?:is|are)\s+(?:dead|overrated))\b/i,
  },
  {
    id: 23,
    name: 'The Statistic',
    nameEs: 'El Dato Duro',
    templateEs: 'El {N}% de {grupo} {hecho verificable}.',
    exampleEs:
      'El 53% de las visitas móviles cierra la pestaña si tarda más de 3 segundos en cargar.',
    onScreenEs: '53% SE VA EN 3 SEGUNDOS',
    bestForEs: 'Compartidos por mensaje privado con respaldo de métrica pública.',
    trapEs: 'Tirar un porcentaje inventado sin fuente verificable.',
    matchRegex: /^\s*(?:el\s+)?\d[\d,.]*\s?%\s+de\b|^\s*\d[\d,.]*\s?%/i,
  },
  {
    id: 24,
    name: 'The Reveal',
    nameEs: 'Revelación de Interfaz',
    templateEs: 'Esta es la nueva {pieza / interfaz} y corrige {dolor puntual}.',
    exampleEs:
      'Esta es la nueva vista V2 Cloud Utility de ExePaginasWeb: precios y SLA en una pantalla.',
    onScreenEs: 'NUEVA INTERFAZ V2',
    bestForEs: 'Lanzamientos de features nuevas del frontend y demos visuales.',
    trapEs: 'Mostrar pantalla sin decir qué problema del usuario resuelve.',
    matchRegex: /^\s*(?:esta\s+es\s+la\s+nueva|este\s+es\s+el\s+nuevo|this\s+is\s+the\s+new)\b/i,
  },
  {
    id: 25,
    name: "Someone Else's Result",
    nameEs: 'Caso Real en Producción',
    templateEs: 'Un {tipo de negocio} pasó de {estado A} a {estado B} en {tiempo}.',
    exampleEs:
      'Un estudio jurídico pasó de perder consultas fuera de hora a agendar con filtro previo 24/7.',
    onScreenEs: 'AGENDA LEGAL 24/7',
    bestForEs: 'Prueba social concreta por vertical de negocio.',
    trapEs: 'Prometer resultados mágicos anónimos sin explicar el mecanismo.',
    matchRegex:
      /\b(?:un\s+(?:cliente|restaurante|estudio|complejo|negocio)\s+pas[oó]\s+de|there\s+was\s+(?:one|a))\b/i,
  },
  {
    id: 26,
    name: 'The Superlative',
    nameEs: 'La Vía Más Directa',
    templateEs: 'La forma más rápida de {resultado concreto} es {acción específica}.',
    exampleEs:
      'La forma más rápida de bajar ausencias en turnos es pedir seña automática al reservar.',
    onScreenEs: 'CERO AUSENCIAS CON SEÑA',
    bestForEs: 'Videos cortos de 20 segundos con una sola recomendación accionable.',
    trapEs: 'Responder con una abstracción vacía ("ser constante").',
    matchRegex:
      /^\s*(?:la\s+forma\s+m[aá]s\s+(?:r[aá]pida|directa|simple)|el\s+[uú]nico\s+cambio|the\s+(?:fastest|best|only)\s+way)\b/i,
  },
]

const CLASSIFY_ORDER = [
  1, 23, 5, 4, 3, 15, 20, 7, 9, 26, 25, 24, 18, 17, 8, 6, 16, 12, 10, 2, 13, 19, 21, 22, 11, 14,
] as const

export function classifyHookFormula(text: string): HookFormula | null {
  const byId = new Map(HOOK_FORMULAS.map((f) => [f.id, f]))
  for (const id of CLASSIFY_ORDER) {
    const formula = byId.get(id)
    if (formula && formula.matchRegex.test(text)) {
      return formula
    }
  }
  return null
}
