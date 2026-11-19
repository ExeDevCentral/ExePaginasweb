/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Argentina Business Hours (Mon–Fri, 08:00–18:00 ART / America/Argentina/Buenos_Aires)
 * + Scoped 7-language dictionary for V2 Cloud Utility (es, en, pt-BR, de, fr, ar, zh-CN).
 */

export type V2Lang = 'es' | 'en' | 'pt-BR' | 'de' | 'fr' | 'ar' | 'zh-CN'

export const V2_LANGUAGES: readonly { code: V2Lang; label: string; short: string }[] = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'pt-BR', label: 'Português (BR)', short: 'PT' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'zh-CN', label: '简体中文', short: 'ZH' },
] as const

export function normalizeV2Lang(raw: string | null | undefined): V2Lang {
  if (!raw) return 'es'
  const match = V2_LANGUAGES.find((item) => item.code.toLowerCase() === raw.toLowerCase())
  if (match) return match.code
  const prefix = raw.split('-')[0]?.toLowerCase()
  if (prefix === 'en') return 'en'
  if (prefix === 'pt') return 'pt-BR'
  if (prefix === 'de') return 'de'
  if (prefix === 'fr') return 'fr'
  if (prefix === 'ar') return 'ar'
  if (prefix === 'zh') return 'zh-CN'
  return 'es'
}

export interface ArtDeskStatus {
  isOpen: boolean
  artTimeFormatted: string
  dayIndex: number // 0 = Sun, 1 = Mon ... 6 = Sat
  hourArt: number
}

/**
 * Evaluates whether the ExePaginasWeb Engineering Desk is currently open:
 * Monday to Friday, 08:00 to 17:59 America/Argentina/Buenos_Aires (ART / UTC-3).
 */
export function getArgentinaDeskStatus(now: Date = new Date()): ArtDeskStatus {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const weekdayStr = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const hourStr = parts.find((p) => p.type === 'hour')?.value ?? '09'
  const minuteStr = parts.find((p) => p.type === 'minute')?.value ?? '00'

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  const dayIndex = dayMap[weekdayStr] ?? 1
  const hourArt = Number.parseInt(hourStr, 10) % 24
  const isWeekday = dayIndex >= 1 && dayIndex <= 5
  const isBusinessHour = hourArt >= 8 && hourArt < 18

  return {
    isOpen: isWeekday && isBusinessHour,
    artTimeFormatted: `${String(hourArt).padStart(2, '0')}:${minuteStr} ART`,
    dayIndex,
    hourArt,
  }
}

export interface V2Copy {
  brandSuffix: string
  switchVersion: string
  ctaActivate: string
  ctaShort: string
  linuxBadge: string
  linuxExploreBtn: string
  heroTitle: string
  heroSubtitle: string
  deskOpenBadge: string
  deskClosedBadge: string
  deskHoursRule: string
  deskClosedNotice: string
  deskOpenNotice: string
  btnVerifyStatus: string
  btnVerifying: string
  btnRequestPrefix: string
  btnReserveSlot: string
  colRecommended: string
  colSelected: string
  colActiveLabel: string
  colCompareLabel: string
  matrixHeaderCol: string
  matrixDeliveryRow: string
  slaBannerLabel: string
  slaCopy: string
  copyBriefBtn: string
  copyBriefDone: string
  footerPrivacy: string
  footerTerms: string
  footerClassic: string
  footerRights: string
  rows: {
    sslEdge: string
    seoSchema: string
    whatsappFunnel: string
    payments: string
    adminPanel: string
    sourceCode: string
    latency: string
  }
  plans: Record<
    string,
    {
      name: string
      tagline: string
      deliveryTime: string
      availability: string
      highlights: readonly [string, string, string]
    }
  >
}

export const V2_COPY: Record<V2Lang, V2Copy> = {
  es: {
    brandSuffix: 'Cloud Utility',
    switchVersion: 'Cambiar versión',
    ctaActivate: 'Activar Servicio',
    ctaShort: 'Contactar',
    linuxBadge: '¡PROBALO! · $0 Licencias',
    linuxExploreBtn: 'Explorar Terminales Linux POS (/linux)',
    heroTitle: 'ExePaginasWeb — Servicios Directos & Matriz Técnica',
    heroSubtitle:
      'Seleccioná una tarjeta o columna para comparar alcances, tiempos de entrega y arquitectura real. Sin vueltas de agencia, 100% código propio.',
    deskOpenBadge: 'Mesa de Ingeniería Activa',
    deskClosedBadge: 'Fuera de Horario · Solo Días Hábiles',
    deskHoursRule: 'Lun a Vie · 08:00 a 18:00 (Hora Argentina · UTC-3)',
    deskClosedNotice:
      'Atención exclusiva en días hábiles (Lun–Vie, 08:00–18:00 ART). Podés dejar tu solicitud en cola prioritaria y te respondemos a primera hora hábil.',
    deskOpenNotice:
      'Mesa técnica en línea ahora. Respuesta directa de Exequiel Echevarría para nuevos proyectos.',
    btnVerifyStatus: 'Verificar estado',
    btnVerifying: 'Verificando...',
    btnRequestPrefix: 'Solicitar',
    btnReserveSlot: 'Dejar en cola prioritaria',
    colRecommended: 'Plan Recomendado',
    colSelected: 'Plan Seleccionado',
    colActiveLabel: 'Columna activa',
    colCompareLabel: 'Comparar en matriz',
    matrixHeaderCol: 'Capacidad / SLA',
    matrixDeliveryRow: 'Entrega & Inversión',
    slaBannerLabel: 'Compromiso de Ingeniería',
    slaCopy: 'Uptime 99.9% · Repositorio 100% tuyo · Contrato claro sin mensualidades ocultas',
    copyBriefBtn: 'Copiar resumen técnico',
    copyBriefDone: 'Resumen copiado',
    footerPrivacy: 'Privacidad',
    footerTerms: 'Términos',
    footerClassic: 'Versión Classic',
    footerRights: '© 2025 Exequiel Echevarría — ExePaginasWeb. Todos los derechos reservados.',
    rows: {
      sslEdge: 'Infraestructura & SSL',
      seoSchema: 'SEO & Posicionamiento',
      whatsappFunnel: 'Conversión WhatsApp',
      payments: 'Pasarelas de Cobro',
      adminPanel: 'Autogestión / Panel',
      sourceCode: 'Propiedad del Código',
      latency: 'Latencia Edge (AR/LATAM)',
    },
    plans: {
      'landing-express': {
        name: 'Landing Express',
        tagline: 'Comercios, estudios y profesionales que necesitan vender rápido.',
        deliveryTime: '72 hs hábiles',
        availability: 'Cupo habilitado',
        highlights: [
          'Carga < 1 segundo mobile-first',
          'Dominio + SSL + Google Maps / SEO base',
          'Botón directo a WhatsApp pre-configurado',
        ],
      },
      'tienda-turnos': {
        name: 'Catálogo / Turnos',
        tagline: 'Negocios que quieren cobrar online y gestionar pedidos o reservas solos.',
        deliveryTime: '7 días hábiles',
        availability: '2 cupos esta semana',
        highlights: [
          'Catálogo o agenda de turnos en tiempo real',
          'Mercado Pago, PayPal o Stripe con webhooks (<1s)',
          'Panel autogestionable con base PostgreSQL',
        ],
      },
      'saas-medida': {
        name: 'Sistema SaaS',
        tagline: 'Empresas y equipos que necesitan software a medida sin ataduras.',
        deliveryTime: 'Sprints a medida',
        availability: 'Evaluación previa',
        highlights: [
          'Arquitectura Full-Stack (Next.js / React + PostgreSQL)',
          'Roles de usuario (RBAC) y trazabilidad en vivo',
          'Código 100% auditable en repositorio propio',
        ],
      },
      'automatizacion-ia': {
        name: 'Automatización IA',
        tagline: 'Bots de atención 24/7 y pipelines que eliminan horas manuales.',
        deliveryTime: '5 días hábiles',
        availability: 'Cupo habilitado',
        highlights: [
          'Asistente IA conectado a tu catálogo o WhatsApp',
          'Clasificación automática de leads y reportes',
          'Monitoreo con logs estructurados',
        ],
      },
      'linux-pos': {
        name: 'Linux POS & PCs',
        tagline:
          'Terminales de cobro blindadas (4.5s boot) y rescate de PCs lentas con $0 en licencias.',
        deliveryTime: '48 hs hábiles',
        availability: 'Demo en vivo',
        highlights: [
          'Terminales POS modo quiosco (480 MB RAM · 4.5s arranque)',
          'Rescate de flotas de PCs lentas con $0 en licencias',
          'Servidor local PostgreSQL Offline-First (vende sin internet)',
        ],
      },
    },
  },
  en: {
    brandSuffix: 'Cloud Utility',
    switchVersion: 'Switch version',
    ctaActivate: 'Activate Service',
    ctaShort: 'Contact',
    linuxBadge: 'TRY IT! · $0 Licensing',
    linuxExploreBtn: 'Explore Linux POS Terminals (/linux)',
    heroTitle: 'ExePaginasWeb — Direct Services & Technical Matrix',
    heroSubtitle:
      'Select any card or column to compare scope, delivery SLA, and live architecture. Zero agency fluff, 100% owned source code.',
    deskOpenBadge: 'Engineering Desk Online',
    deskClosedBadge: 'After Hours · Business Days Only',
    deskHoursRule: 'Mon–Fri · 08:00–18:00 (Argentina Time · UTC-3)',
    deskClosedNotice:
      'Engineering intake operates strictly on business days (Mon–Fri, 08:00–18:00 ART). Queue your request now for first-hour priority review.',
    deskOpenNotice:
      'Engineering desk is live now. Direct technical response from Exequiel Echevarría.',
    btnVerifyStatus: 'Verify status',
    btnVerifying: 'Verifying...',
    btnRequestPrefix: 'Request',
    btnReserveSlot: 'Queue Priority Slot',
    colRecommended: 'Recommended Plan',
    colSelected: 'Selected Plan',
    colActiveLabel: 'Active column',
    colCompareLabel: 'Compare in matrix',
    matrixHeaderCol: 'Capability / SLA',
    matrixDeliveryRow: 'Delivery & Investment',
    slaBannerLabel: 'Engineering Commitment',
    slaCopy: '99.9% Uptime · 100% Owned Repository · Transparent Scope with Zero Lock-in',
    copyBriefBtn: 'Copy technical brief',
    copyBriefDone: 'Brief copied',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerClassic: 'Classic Version',
    footerRights: '© 2025 Exequiel Echevarría — ExePaginasWeb. All rights reserved.',
    rows: {
      sslEdge: 'Infrastructure & SSL',
      seoSchema: 'SEO & Structured Data',
      whatsappFunnel: 'WhatsApp Conversion',
      payments: 'Payment Gateways',
      adminPanel: 'Admin / Self-Service',
      sourceCode: 'Code Ownership',
      latency: 'Edge Latency (LATAM)',
    },
    plans: {
      'landing-express': {
        name: 'Landing Express',
        tagline: 'Businesses & professionals needing fast, high-converting web presence.',
        deliveryTime: '72 business hrs',
        availability: 'Slot open',
        highlights: [
          'Sub-second mobile-first load speed',
          'Domain + SSL + Google Maps / base SEO',
          'Pre-configured 1-click WhatsApp funnel',
        ],
      },
      'tienda-turnos': {
        name: 'Catalog / Bookings',
        tagline: 'Businesses ready to accept online payments and manage orders or slots.',
        deliveryTime: '7 business days',
        availability: '2 slots this week',
        highlights: [
          'Real-time catalog or booking scheduler',
          'Mercado Pago, PayPal or Stripe webhooks (<1s)',
          'PostgreSQL-backed self-service dashboard',
        ],
      },
      'saas-medida': {
        name: 'Custom SaaS',
        tagline: 'Companies requiring custom full-stack software with zero vendor lock-in.',
        deliveryTime: 'Custom sprints',
        availability: 'By scoping call',
        highlights: [
          'Full-Stack Next.js / React + PostgreSQL architecture',
          'Role-Based Access Control (RBAC) & live audit trail',
          '100% auditable source code in your repository',
        ],
      },
      'automatizacion-ia': {
        name: 'AI Automation',
        tagline: '24/7 AI assistants and batch pipelines that cut manual overhead.',
        deliveryTime: '5 business days',
        availability: 'Slot open',
        highlights: [
          'AI assistant wired to your catalog or WhatsApp',
          'Automated lead scoring and reporting',
          'Structured telemetry and error boundaries',
        ],
      },
      'linux-pos': {
        name: 'Linux POS & Fleet',
        tagline: 'Hardened kiosk POS terminals (4.5s boot) & PC fleet rescue with $0 license cost.',
        deliveryTime: '48 business hrs',
        availability: 'Live demo ready',
        highlights: [
          'Kiosk-mode POS terminals (480 MB RAM · 4.5s boot)',
          'Revive slow PC fleets with $0 OS licensing fees',
          'Local PostgreSQL Offline-First node (works without internet)',
        ],
      },
    },
  },
  'pt-BR': {
    brandSuffix: 'Cloud Utility',
    switchVersion: 'Trocar versão',
    ctaActivate: 'Ativar Serviço',
    ctaShort: 'Contato',
    linuxBadge: 'TESTE AGORA · $0 Licenças',
    linuxExploreBtn: 'Explorar Terminais Linux POS (/linux)',
    heroTitle: 'ExePaginasWeb — Serviços Diretos & Matriz Técnica',
    heroSubtitle:
      'Selecione um cartão ou coluna para comparar escopo, prazo de entrega e arquitetura real. Sem burocracia de agência, 100% código próprio.',
    deskOpenBadge: 'Mesa de Engenharia Ativa',
    deskClosedBadge: 'Fora do Horário · Apenas Dias Úteis',
    deskHoursRule: 'Seg a Sex · 08:00 às 18:00 (Horário ART/BRT · UTC-3)',
    deskClosedNotice:
      'Atendimento exclusivo em dias úteis (Seg–Sex, 08:00–18:00). Deixe sua solicitação na fila prioritária para retorno no próximo dia útil.',
    deskOpenNotice:
      'Mesa técnica online agora. Resposta direta de Exequiel Echevarría para novos projetos.',
    btnVerifyStatus: 'Verificar status',
    btnVerifying: 'Verificando...',
    btnRequestPrefix: 'Solicitar',
    btnReserveSlot: 'Entrar na fila prioritária',
    colRecommended: 'Plano Recomendado',
    colSelected: 'Plano Selecionado',
    colActiveLabel: 'Coluna ativa',
    colCompareLabel: 'Comparar na matriz',
    matrixHeaderCol: 'Capacidade / SLA',
    matrixDeliveryRow: 'Entrega & Investimento',
    slaBannerLabel: 'Compromisso de Engenharia',
    slaCopy: 'Uptime 99.9% · Repositório 100% seu · Escopo claro sem taxas ocultas',
    copyBriefBtn: 'Copiar resumo técnico',
    copyBriefDone: 'Resumo copiado',
    footerPrivacy: 'Privacidade',
    footerTerms: 'Termos',
    footerClassic: 'Versão Classic',
    footerRights: '© 2025 Exequiel Echevarría — ExePaginasWeb. Todos os direitos reservados.',
    rows: {
      sslEdge: 'Infraestrutura & SSL',
      seoSchema: 'SEO & Schema.org',
      whatsappFunnel: 'Conversão WhatsApp',
      payments: 'Meios de Pagamento',
      adminPanel: 'Painel Administrativo',
      sourceCode: 'Propriedade do Código',
      latency: 'Latência Edge (LATAM)',
    },
    plans: {
      'landing-express': {
        name: 'Landing Express',
        tagline: 'Comércios e profissionais que precisam vender rápido.',
        deliveryTime: '72h úteis',
        availability: 'Vaga aberta',
        highlights: [
          'Carregamento < 1s focado em celular',
          'Domínio + SSL + Google Maps / SEO base',
          'Botão direto para WhatsApp pré-configurado',
        ],
      },
      'tienda-turnos': {
        name: 'Catálogo / Agenda',
        tagline: 'Negócios que querem cobrar online e gerenciar pedidos sozinhos.',
        deliveryTime: '7 dias úteis',
        availability: '2 vagas na semana',
        highlights: [
          'Catálogo ou agenda em tempo real',
          'Mercado Pago, PayPal ou Stripe via webhooks',
          'Painel próprio com PostgreSQL',
        ],
      },
      'saas-medida': {
        name: 'Sistema SaaS',
        tagline: 'Empresas que precisam de software sob medida sem dependência.',
        deliveryTime: 'Sprints sob medida',
        availability: 'Sob avaliação',
        highlights: [
          'Arquitetura Full-Stack (Next.js / React + PostgreSQL)',
          'Controle de acesso por funções (RBAC)',
          'Código 100% auditável em repositório próprio',
        ],
      },
      'automatizacion-ia': {
        name: 'Automação IA',
        tagline: 'Assistentes 24/7 e pipelines que eliminam tarefas manuais.',
        deliveryTime: '5 dias úteis',
        availability: 'Vaga aberta',
        highlights: [
          'Assistente IA integrado ao catálogo ou WhatsApp',
          'Classificação automática de leads e relatórios',
          'Monitoramento com logs estruturados',
        ],
      },
      'linux-pos': {
        name: 'Linux POS & PCs',
        tagline:
          'Terminais PDV blindados (boot em 4.5s) e resgate de PCs lentos com $0 em licenças.',
        deliveryTime: '48h úteis',
        availability: 'Demo ao vivo',
        highlights: [
          'Terminais PDV modo quiosque (480 MB RAM · boot 4.5s)',
          'Resgate de frotas de PCs lentos com $0 em licenças',
          'Servidor local PostgreSQL Offline-First (opera sem internet)',
        ],
      },
    },
  },
  de: {
    brandSuffix: 'Cloud Utility',
    switchVersion: 'Version wechseln',
    ctaActivate: 'Service aktivieren',
    ctaShort: 'Kontakt',
    linuxBadge: 'JETZT TESTEN · 0 $ Lizenzen',
    linuxExploreBtn: 'Linux POS-Terminals entdecken (/linux)',
    heroTitle: 'ExePaginasWeb — Direkte Services & Technische Matrix',
    heroSubtitle:
      'Wählen Sie eine Karte oder Spalte, um Umfang, Lieferzeit und Live-Architektur zu vergleichen. 100 % eigener Quellcode.',
    deskOpenBadge: 'Engineering Desk Aktiv',
    deskClosedBadge: 'Außerhalb der Geschäftszeiten · Nur Werktags',
    deskHoursRule: 'Mo–Fr · 08:00–18:00 (Argentinien · UTC-3)',
    deskClosedNotice:
      'Projektannahme ausschließlich werktags (Mo–Fr, 08:00–18:00 ART). Reservieren Sie jetzt einen Prioritäts-Slot.',
    deskOpenNotice: 'Engineering Desk ist live. Direkte Antwort von Exequiel Echevarría.',
    btnVerifyStatus: 'Status prüfen',
    btnVerifying: 'Prüfe...',
    btnRequestPrefix: 'Anfragen:',
    btnReserveSlot: 'Prioritäts-Slot sichern',
    colRecommended: 'Empfohlen',
    colSelected: 'Ausgewählt',
    colActiveLabel: 'Aktive Spalte',
    colCompareLabel: 'Vergleichen',
    matrixHeaderCol: 'Leistung / SLA',
    matrixDeliveryRow: 'Lieferzeit & Preis',
    slaBannerLabel: 'Engineering-Garantie',
    slaCopy: '99,9 % Uptime · 100 % Code-Eigentum · Klare Festpreise ohne Bindung',
    copyBriefBtn: 'Briefing kopieren',
    copyBriefDone: 'Kopiert',
    footerPrivacy: 'Datenschutz',
    footerTerms: 'AGB',
    footerClassic: 'Classic-Version',
    footerRights: '© 2025 Exequiel Echevarría — ExePaginasWeb. Alle Rechte vorbehalten.',
    rows: {
      sslEdge: 'Infrastruktur & SSL',
      seoSchema: 'SEO & Schema.org',
      whatsappFunnel: 'WhatsApp-Funnel',
      payments: 'Zahlungsgateways',
      adminPanel: 'Admin-Panel',
      sourceCode: 'Code-Eigentum',
      latency: 'Edge-Latenz',
    },
    plans: {
      'landing-express': {
        name: 'Landing Express',
        tagline: 'Schnelle, konversionsstarke Webpräsenz für Unternehmen.',
        deliveryTime: '72 Werkstd.',
        availability: 'Verfügbar',
        highlights: ['Ladezeit < 1 Sekunde', 'Domain + SSL + Basis-SEO', '1-Klick WhatsApp-CTA'],
      },
      'tienda-turnos': {
        name: 'Katalog / Buchung',
        tagline: 'Online-Zahlungen und Termin- oder Bestellverwaltung.',
        deliveryTime: '7 Werktage',
        availability: '2 Slots frei',
        highlights: [
          'Echtzeit-Katalog / Kalender',
          'PayPal / Stripe Webhooks',
          'PostgreSQL Admin-Panel',
        ],
      },
      'saas-medida': {
        name: 'Custom SaaS',
        tagline: 'Maßgeschneiderte Full-Stack-Plattformen ohne Lock-in.',
        deliveryTime: 'Sprints',
        availability: 'Nach Prüfung',
        highlights: [
          'Next.js / React + PostgreSQL',
          'RBAC & Audit-Logs',
          '100 % eigener Quellcode',
        ],
      },
      'automatizacion-ia': {
        name: 'KI-Automation',
        tagline: '24/7 KI-Assistenten und automatisierte Workflows.',
        deliveryTime: '5 Werktage',
        availability: 'Verfügbar',
        highlights: [
          'KI-Bot für Katalog & WhatsApp',
          'Automatische Lead-Filterung',
          'Strukturierte Logs',
        ],
      },
      'linux-pos': {
        name: 'Linux POS & PCs',
        tagline: 'Kiosk-POS-Terminals (4,5s Boot) & PC-Rettung mit 0 $ Lizenzkosten.',
        deliveryTime: '48 Werkstd.',
        availability: 'Live-Demo',
        highlights: [
          'Kiosk-POS-Terminals (480 MB RAM · 4,5s Start)',
          'PC-Flottenrettung ohne Lizenzgebühren',
          'Lokaler PostgreSQL Offline-First-Server',
        ],
      },
    },
  },
  fr: {
    brandSuffix: 'Cloud Utility',
    switchVersion: 'Changer de version',
    ctaActivate: 'Activer le service',
    ctaShort: 'Contact',
    linuxBadge: 'À ESSAYER · 0 $ Licence',
    linuxExploreBtn: 'Explorer les terminaux Linux POS (/linux)',
    heroTitle: 'ExePaginasWeb — Services Directs & Matrice Technique',
    heroSubtitle:
      'Sélectionnez une carte ou une colonne pour comparer la portée, les délais et l’architecture en direct. 100 % code propriétaire.',
    deskOpenBadge: 'Bureau d’Ingénierie Actif',
    deskClosedBadge: 'Hors Horaires · Jours Ouvrés Uniquement',
    deskHoursRule: 'Lun–Ven · 08:00–18:00 (Heure Argentine · UTC-3)',
    deskClosedNotice:
      'Prise en charge uniquement les jours ouvrés (Lun–Ven, 08:00–18:00 ART). Placez votre demande en file prioritaire.',
    deskOpenNotice: 'Bureau technique en ligne. Réponse directe d’Exequiel Echevarría.',
    btnVerifyStatus: 'Vérifier le statut',
    btnVerifying: 'Vérification...',
    btnRequestPrefix: 'Demander',
    btnReserveSlot: 'Réserver un créneau',
    colRecommended: 'Recommandé',
    colSelected: 'Sélectionné',
    colActiveLabel: 'Colonne active',
    colCompareLabel: 'Comparer',
    matrixHeaderCol: 'Capacité / SLA',
    matrixDeliveryRow: 'Délai & Tarif',
    slaBannerLabel: 'Engagement Ingénierie',
    slaCopy: 'Uptime 99,9 % · Dépôt 100 % à vous · Zéro frais cachés',
    copyBriefBtn: 'Copier le résumé',
    copyBriefDone: 'Copié',
    footerPrivacy: 'Confidentialité',
    footerTerms: 'Conditions',
    footerClassic: 'Version Classic',
    footerRights: '© 2025 Exequiel Echevarría — ExePaginasWeb. Tous droits réservés.',
    rows: {
      sslEdge: 'Infrastructure & SSL',
      seoSchema: 'SEO & Schema.org',
      whatsappFunnel: 'Tunnel WhatsApp',
      payments: 'Paiements en ligne',
      adminPanel: 'Panneau Admin',
      sourceCode: 'Propriété du Code',
      latency: 'Latence Edge',
    },
    plans: {
      'landing-express': {
        name: 'Landing Express',
        tagline: 'Présence web rapide et orientée conversion.',
        deliveryTime: '72h ouvrées',
        availability: 'Disponible',
        highlights: [
          'Chargement < 1s mobile-first',
          'Domaine + SSL + SEO de base',
          'Bouton WhatsApp 1-clic',
        ],
      },
      'tienda-turnos': {
        name: 'Catalogue / RDV',
        tagline: 'Encaissements en ligne et gestion autonome.',
        deliveryTime: '7 jours ouvrés',
        availability: '2 places / sem.',
        highlights: [
          'Catalogue ou agenda temps réel',
          'Stripe / PayPal / MP',
          'Tableau PostgreSQL',
        ],
      },
      'saas-medida': {
        name: 'Système SaaS',
        tagline: 'Logiciel sur mesure sans dépendance d’agence.',
        deliveryTime: 'Sprints dédiés',
        availability: 'Sur étude',
        highlights: [
          'Next.js / React + PostgreSQL',
          'Rôles RBAC & traçabilité',
          'Code 100 % auditable',
        ],
      },
      'automatizacion-ia': {
        name: 'Automatisation IA',
        tagline: 'Assistants 24/7 et pipelines automatisés.',
        deliveryTime: '5 jours ouvrés',
        availability: 'Disponible',
        highlights: ['Assistant IA WhatsApp', 'Qualification auto des leads', 'Logs structurés'],
      },
      'linux-pos': {
        name: 'Linux POS & PCs',
        tagline: 'Terminaux de caisse kiosque (boot 4,5s) et sauvetage de PC avec 0 $ de licence.',
        deliveryTime: '48h ouvrées',
        availability: 'Démo en direct',
        highlights: [
          'Terminaux POS mode kiosque (480 Mo RAM · boot 4,5s)',
          'Flotte PC accélérée avec 0 $ de licences',
          'Serveur local PostgreSQL Offline-First',
        ],
      },
    },
  },
  ar: {
    brandSuffix: 'Cloud Utility',
    switchVersion: 'تغيير النسخة',
    ctaActivate: 'تفعيل الخدمة',
    ctaShort: 'تواصل',
    linuxBadge: 'جرّبه الآن · 0$ تراخيص',
    linuxExploreBtn: 'استكشاف أنظمة Linux POS (/linux)',
    heroTitle: 'ExePaginasWeb — خدمات مباشرة ومصفوفة تقنية',
    heroSubtitle:
      'اختر أي بطاقة أو عمود لمقارنة النطاق ووقت التسليم والبنية التقنية مباشرة. كود مملوك 100% بدون وسطاء.',
    deskOpenBadge: 'مكتب الهندسة متصل الآن',
    deskClosedBadge: 'خارج أوقات العمل · أيام العمل فقط',
    deskHoursRule: 'الإثنين–الجمعة · 08:00–18:00 (توقيت الأرجنتين UTC-3)',
    deskClosedNotice:
      'الاستقبال متاح حصرياً في أيام العمل (الإثنين–الجمعة، 08:00–18:00 ART). يمكنك حجز دورك في قائمة الأولوية.',
    deskOpenNotice: 'فريق الهندسة متاح الآن. رد مباشر من Exequiel Echevarría.',
    btnVerifyStatus: 'فحص الحالة',
    btnVerifying: 'جارٍ الفحص...',
    btnRequestPrefix: 'طلب',
    btnReserveSlot: 'حجز أولوية',
    colRecommended: 'الخطة الموصى بها',
    colSelected: 'الخطة المختارة',
    colActiveLabel: 'العمود النشط',
    colCompareLabel: 'مقارنة',
    matrixHeaderCol: 'القدرة / SLA',
    matrixDeliveryRow: 'التسليم والسعر',
    slaBannerLabel: 'التزام هندسي',
    slaCopy: 'جاهزية 99.9% · ملكية كاملة للكود · بدون رسوم خفية',
    copyBriefBtn: 'نسخ الملخص التقني',
    copyBriefDone: 'تم النسخ',
    footerPrivacy: 'الخصوصية',
    footerTerms: 'الشروط',
    footerClassic: 'النسخة الكلاسيكية',
    footerRights: '© 2025 Exequiel Echevarría — ExePaginasWeb. جميع الحقوق محفوظة.',
    rows: {
      sslEdge: 'البنية التحتية و SSL',
      seoSchema: 'تحسين محركات البحث',
      whatsappFunnel: 'تحويل واتساب',
      payments: 'بوابات الدفع',
      adminPanel: 'لوحة التحكم',
      sourceCode: 'ملكية الكود',
      latency: 'زمن الاستجابة',
    },
    plans: {
      'landing-express': {
        name: 'صفحة هبوط سريعة',
        tagline: 'حضور رقمي فوري للشركات والمهنيين.',
        deliveryTime: '72 ساعة عمل',
        availability: 'متاح اليوم',
        highlights: ['تحميل أقل من ثانية', 'نطاق + SSL + SEO أساسي', 'زر واتساب مباشر'],
      },
      'tienda-turnos': {
        name: 'كتالوج / حجوزات',
        tagline: 'مدفوعات إلكترونية وإدارة طلبات أو مواعيد.',
        deliveryTime: '7 أيام عمل',
        availability: 'مقعدان هذا الأسبوع',
        highlights: ['كتالوج أو جدول فوري', 'Stripe / PayPal / MP', 'لوحة PostgreSQL'],
      },
      'saas-medida': {
        name: 'نظام SaaS مخصص',
        tagline: 'برمجيات مخصصة بالكامل بدون قيود.',
        deliveryTime: 'حسب النطاق',
        availability: 'بعد التقييم',
        highlights: ['Next.js / React + PostgreSQL', 'صلاحيات RBAC', 'كود مملوك 100%'],
      },
      'automatizacion-ia': {
        name: 'أتمتة بالذكاء الاصطناعي',
        tagline: 'مساعدون آليون 24/7 لتقليل العمل اليدوي.',
        deliveryTime: '5 أيام عمل',
        availability: 'متاح',
        highlights: ['بوت ذكي لواتساب', 'فرز تلقائي للعملاء', 'سجلات مراقبة'],
      },
      'linux-pos': {
        name: 'أنظمة Linux POS',
        tagline: 'نقاط بيع محصنة (إقلاع 4.5 ثانية) وإنقاذ أجهزة الكمبيوتر بتكلفة تراخيص 0$.',
        deliveryTime: '48 ساعة عمل',
        availability: 'عرض مباشر',
        highlights: [
          'نقاط بيع بوضع الكشك (480MB RAM · إقلاع 4.5 ثانية)',
          'إحياء الأجهزة البطيئة بدون رسوم تراخيص',
          'خادم محلي PostgreSQL يعمل بدون إنترنت',
        ],
      },
    },
  },
  'zh-CN': {
    brandSuffix: 'Cloud Utility',
    switchVersion: '切换版本',
    ctaActivate: '立即启动服务',
    ctaShort: '联系我们',
    linuxBadge: '强烈推荐 · $0 授权费',
    linuxExploreBtn: '探索 Linux POS 终端架构 (/linux)',
    heroTitle: 'ExePaginasWeb — 直达服务与技术矩阵',
    heroSubtitle: '点击任意卡片或列对比交付周期与真实架构。无外包套路，100% 自主源代码。',
    deskOpenBadge: '工程团队在线',
    deskClosedBadge: '非工作时间 · 仅限工作日',
    deskHoursRule: '周一至周五 · 08:00–18:00（阿根廷时间 UTC-3）',
    deskClosedNotice:
      '工程受理仅限工作日（周一至周五 08:00–18:00 ART）。您可立即提交优先排队，我们将在下个工作日第一时间回复。',
    deskOpenNotice: '工程团队当前在线，由 Exequiel Echevarría 直接响应。',
    btnVerifyStatus: '检测状态',
    btnVerifying: '检测中...',
    btnRequestPrefix: '申请',
    btnReserveSlot: '加入优先队列',
    colRecommended: '推荐方案',
    colSelected: '已选方案',
    colActiveLabel: '当前选中',
    colCompareLabel: '对比矩阵',
    matrixHeaderCol: '能力 / SLA',
    matrixDeliveryRow: '交付与费用',
    slaBannerLabel: '工程承诺',
    slaCopy: '99.9% 可用性 · 100% 源码归属 · 无隐藏月费',
    copyBriefBtn: '复制技术摘要',
    copyBriefDone: '已复制',
    footerPrivacy: '隐私政策',
    footerTerms: '条款',
    footerClassic: '经典版',
    footerRights: '© 2025 Exequiel Echevarría — ExePaginasWeb. 保留所有权利。',
    rows: {
      sslEdge: '基础设施与 SSL',
      seoSchema: 'SEO 与结构化数据',
      whatsappFunnel: 'WhatsApp 转化',
      payments: '支付网关',
      adminPanel: '后台管理',
      sourceCode: '源码归属',
      latency: '边缘延迟',
    },
    plans: {
      'landing-express': {
        name: '极速落地页',
        tagline: '适合需要快速获客的商户与专业人士。',
        deliveryTime: '72 工作小时',
        availability: '今日可接',
        highlights: ['移动端秒开加载', '域名 + SSL + 基础 SEO', '一键 WhatsApp 转化'],
      },
      'tienda-turnos': {
        name: '商品目录 / 预约',
        tagline: '在线收款与自主管理订单或预约。',
        deliveryTime: '7 个工作日',
        availability: '本周余 2 席',
        highlights: ['实时目录或预约系统', 'Stripe / PayPal / MP', 'PostgreSQL 管理后台'],
      },
      'saas-medida': {
        name: '定制 SaaS 系统',
        tagline: '企业级全栈软件开发，零平台锁定。',
        deliveryTime: '按阶段交付',
        availability: '需需求评估',
        highlights: ['Next.js / React + PostgreSQL', 'RBAC 权限与审计', '100% 独立仓库源码'],
      },
      'automatizacion-ia': {
        name: 'AI 自动化',
        tagline: '7×24 智能客服与自动化流水线。',
        deliveryTime: '5 个工作日',
        availability: '可接单',
        highlights: ['WhatsApp AI 助手', '自动线索分级与报表', '结构化日志监控'],
      },
      'linux-pos': {
        name: 'Linux POS 终端',
        tagline: '4.5 秒极速启动收银终端与老旧电脑重生（$0 许可证费）。',
        deliveryTime: '48 工作小时',
        availability: '在线演示',
        highlights: [
          'Kiosk 锁定收银终端（480 MB 内存 · 4.5s 启动）',
          '$0 系统授权费拯救卡顿电脑',
          '本地 PostgreSQL 离线优先服务器（断网可收银）',
        ],
      },
    },
  },
}
