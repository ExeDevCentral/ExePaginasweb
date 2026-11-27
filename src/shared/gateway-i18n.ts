/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Diccionario editorial minimalista en 7 idiomas para el Umbral (/).
 * Capa hoja: sin dependencias hacia components/ ni faces/.
 */
import type { SupportedLang } from '@/core/i18n/languageDetector'

export interface GatewayCopy {
  footerCopyright: string
  headerRole: string
  directContact: string
  languageMenuLabel: string
  autoDetectedTag: string
  heroBefore: string
  heroPill: string
  heroAfter: string
  heroSubtitle: string
  selectorAria: string
  classicTag: string
  classicTitle: string
  classicDesc: string
  classicMeta: string
  classicCta: string
  classicOpening: string
  v2Tag: string
  v2Title: string
  v2Desc: string
  v2Meta: string
  v2Cta: string
  v2Opening: string
  footerKeyboard: string
  phases: {
    trust: string
    security: string
    predictability: string
    stability: string
  }
}

export const GATEWAY_COPY: Record<SupportedLang, GatewayCopy> = {
  es: {
    footerCopyright: '© 2025 Exequiel Echevarria — ExePaginasWeb',
    headerRole: 'Exequiel Echevarría · Arquitectura de Software',
    directContact: 'Contacto directo',
    languageMenuLabel: 'Idioma',
    autoDetectedTag: 'Auto',
    heroBefore: 'Sistemas web',
    heroPill: 'est. 2025',
    heroAfter: 'escritos sin intermediarios.',
    heroSubtitle:
      'Dos lecturas del mismo estudio. Elegí cómo recorrerlo hoy; guardamos tu preferencia y podés cambiar de vista en cualquier momento.',
    selectorAria: 'Selector de versión del sitio',
    classicTag: '01 — /classic',
    classicTitle: 'Estudio Interactivo',
    classicDesc:
      'Recorrido visual completo con demos operativas en vivo, casos reales en producción, cotizador interactivo y asistente técnico integrado.',
    classicMeta: 'Portafolio · Demos · Cotizador · Tienda',
    classicCta: 'Entrar al estudio',
    classicOpening: 'Abriendo...',
    v2Tag: '02 — /v2',
    v2Title: 'Matriz Directa & Precios',
    v2Desc:
      'Hoja técnica sobre papel claro: tabla comparativa de alcance, plazos reales de entrega, 7 idiomas y armado de brief en un clic sin rodeos.',
    v2Meta: 'Alcance claro · 7 idiomas · Brief directo',
    v2Cta: 'Abrir matriz directa',
    v2Opening: 'Abriendo...',
    footerKeyboard: 'Teclado: [1] · [2]',
    phases: {
      trust: 'Confianza',
      security: 'Seguridad',
      predictability: 'Previsibilidad',
      stability: 'Estabilidad',
    },
  },
  en: {
    footerCopyright: '© 2025 Exequiel Echevarria — ExePaginasWeb',
    headerRole: 'Exequiel Echevarría · Software Architecture',
    directContact: 'Direct contact',
    languageMenuLabel: 'Language',
    autoDetectedTag: 'Auto',
    heroBefore: 'Web systems',
    heroPill: 'est. 2025',
    heroAfter: 'written without middlemen.',
    heroSubtitle:
      'Two readings of the same studio. Choose how to explore today; we remember your preference and you can switch anytime.',
    selectorAria: 'Site version selector',
    classicTag: '01 — /classic',
    classicTitle: 'Interactive Studio',
    classicDesc:
      'Full visual tour with live operational demos, real production systems, interactive quoter, and built-in technical assistant.',
    classicMeta: 'Portfolio · Demos · Quoter · Store',
    classicCta: 'Enter studio',
    classicOpening: 'Opening...',
    v2Tag: '02 — /v2',
    v2Title: 'Direct Matrix & Pricing',
    v2Desc:
      'Technical sheet on light paper: scope comparison matrix, clear delivery timelines, 7 languages, and one-click brief export.',
    v2Meta: 'Clear scope · 7 languages · Direct brief',
    v2Cta: 'Open direct matrix',
    v2Opening: 'Opening...',
    footerKeyboard: 'Keyboard: [1] · [2]',
    phases: {
      trust: 'Trust',
      security: 'Security',
      predictability: 'Predictability',
      stability: 'Stability',
    },
  },
  'pt-BR': {
    footerCopyright: '© 2025 Exequiel Echevarria — ExePaginasWeb',
    headerRole: 'Exequiel Echevarría · Arquitetura de Software',
    directContact: 'Contato direto',
    languageMenuLabel: 'Idioma',
    autoDetectedTag: 'Auto',
    heroBefore: 'Sistemas web',
    heroPill: 'est. 2025',
    heroAfter: 'escritos sem intermediários.',
    heroSubtitle:
      'Duas leituras do mesmo estúdio. Escolha como navegar hoje; salvamos sua preferência para alternar quando quiser.',
    selectorAria: 'Seletor de versão do site',
    classicTag: '01 — /classic',
    classicTitle: 'Estúdio Interativo',
    classicDesc:
      'Experiência visual completa com demos operacionais ao vivo, casos reais em produção, orçador interativo e assistente técnico.',
    classicMeta: 'Portfólio · Demos · Orçador · Loja',
    classicCta: 'Entrar no estúdio',
    classicOpening: 'Abrindo...',
    v2Tag: '02 — /v2',
    v2Title: 'Matriz Direta & Preços',
    v2Desc:
      'Folha técnica em fundo claro: matriz comparativa de escopo, prazos reais de entrega, 7 idiomas e resumo copiável em um clique.',
    v2Meta: 'Escopo claro · 7 idiomas · Brief direto',
    v2Cta: 'Abrir matriz direta',
    v2Opening: 'Abrindo...',
    footerKeyboard: 'Teclado: [1] · [2]',
    phases: {
      trust: 'Confiança',
      security: 'Segurança',
      predictability: 'Previsibilidade',
      stability: 'Estabilidade',
    },
  },
  de: {
    footerCopyright: '© 2025 Exequiel Echevarria — ExePaginasWeb',
    headerRole: 'Exequiel Echevarría · Softwarearchitektur',
    directContact: 'Direktkontakt',
    languageMenuLabel: 'Sprache',
    autoDetectedTag: 'Auto',
    heroBefore: 'Websysteme',
    heroPill: 'est. 2025',
    heroAfter: 'ohne Zwischenhändler gebaut.',
    heroSubtitle:
      'Zwei Perspektiven desselben Studios. Wählen Sie Ihren Einstieg; Ihre Auswahl wird gespeichert und ist jederzeit wechselbar.',
    selectorAria: 'Auswahl der Website-Version',
    classicTag: '01 — /classic',
    classicTitle: 'Interaktives Studio',
    classicDesc:
      'Vollständige visuelle Tour mit Live-Demos, produktiven Systemen, interaktivem Kalkulator und integriertem Technik-Assistenten.',
    classicMeta: 'Portfolio · Demos · Kalkulator · Shop',
    classicCta: 'Studio öffnen',
    classicOpening: 'Wird geöffnet...',
    v2Tag: '02 — /v2',
    v2Title: 'Direktmatrix & Preise',
    v2Desc:
      'Technisches Datenblatt auf hellem Grund: Leistungsmatrix, klare Lieferzeiten, 7 Sprachen und Ein-Klick-Briefing-Export.',
    v2Meta: 'Klarer Umfang · 7 Sprachen · Direktes Brief',
    v2Cta: 'Direktmatrix öffnen',
    v2Opening: 'Wird geöffnet...',
    footerKeyboard: 'Tastatur: [1] · [2]',
    phases: {
      trust: 'Vertrauen',
      security: 'Sicherheit',
      predictability: 'Planbarkeit',
      stability: 'Stabilität',
    },
  },
  fr: {
    footerCopyright: '© 2025 Exequiel Echevarria — ExePaginasWeb',
    headerRole: 'Exequiel Echevarría · Architecture Logicielle',
    directContact: 'Contact direct',
    languageMenuLabel: 'Langue',
    autoDetectedTag: 'Auto',
    heroBefore: 'Systèmes web',
    heroPill: 'est. 2025',
    heroAfter: 'écrits sans intermédiaires.',
    heroSubtitle:
      'Deux lectures du même studio. Choisissez votre parcours ; votre préférence est enregistrée et modifiable à tout moment.',
    selectorAria: 'Sélecteur de version du site',
    classicTag: '01 — /classic',
    classicTitle: 'Studio Interactif',
    classicDesc:
      'Parcours visuel complet avec démos opérationnelles en direct, systèmes en production, devis interactif et assistant technique.',
    classicMeta: 'Portfolio · Démos · Devis · Boutique',
    classicCta: 'Entrer dans le studio',
    classicOpening: 'Ouverture...',
    v2Tag: '02 — /v2',
    v2Title: 'Matrice Directe & Tarifs',
    v2Desc:
      'Fiche technique sur papier clair : matrice de portée, délais réels de livraison, 7 langues et export de brief en un clic.',
    v2Meta: 'Portée claire · 7 langues · Brief direct',
    v2Cta: 'Ouvrir la matrice',
    v2Opening: 'Ouverture...',
    footerKeyboard: 'Clavier : [1] · [2]',
    phases: {
      trust: 'Confiance',
      security: 'Sécurité',
      predictability: 'Prévisibilité',
      stability: 'Stabilité',
    },
  },
  ar: {
    footerCopyright: '© 2025 Exequiel Echevarria — ExePaginasWeb',
    headerRole: 'Exequiel Echevarría · هندسة البرمجيات',
    directContact: 'تواصل مباشر',
    languageMenuLabel: 'اللغة',
    autoDetectedTag: 'تلقائي',
    heroBefore: 'أنظمة ويب',
    heroPill: 'تأسس 2025',
    heroAfter: 'مكتوبة دون وسطاء.',
    heroSubtitle:
      'قراءتان لنفس الاستوديو. اختر طريقة التصفح اليوم؛ نحفظ تفضيلك ويمكنك التبديل في أي وقت.',
    selectorAria: 'محدد نسخة الموقع',
    classicTag: '01 — /classic',
    classicTitle: 'الاستوديو التفاعلي',
    classicDesc:
      'جولة بصرية كاملة مع عروض حية، أنظمة فعلية قيد التشغيل، حاسبة تسعير تفاعلية ومساعد تقني مدمج.',
    classicMeta: 'الأعمال · العروض · التسعير · المتجر',
    classicCta: 'دخول الاستوديو',
    classicOpening: 'جارٍ الفتح...',
    v2Tag: '02 — /v2',
    v2Title: 'المصفوفة المباشرة والأسعار',
    v2Desc:
      'ورقة تقنية بخلفية فاتحة: جدول مقارنة للنطاق، مواعيد تسليم واضحة، 7 لغات وتصدير موجز بنقرة واحدة.',
    v2Meta: 'نطاق واضح · 7 لغات · موجز مباشر',
    v2Cta: 'فتح المصفوفة المباشرة',
    v2Opening: 'جارٍ الفتح...',
    footerKeyboard: 'لوحة المفاتيح: [1] · [2]',
    phases: {
      trust: 'الثقة',
      security: 'الأمان',
      predictability: 'الوضوح',
      stability: 'الاستقرار',
    },
  },
  'zh-CN': {
    footerCopyright: '© 2025 Exequiel Echevarria — ExePaginasWeb',
    headerRole: 'Exequiel Echevarría · 软件架构',
    directContact: '直接联系',
    languageMenuLabel: '语言',
    autoDetectedTag: '自动',
    heroBefore: 'Web 系统',
    heroPill: 'est. 2025',
    heroAfter: '无中间商直接构建。',
    heroSubtitle: '同一工作室的两种浏览方式。选择今天的体验；我们会记住您的偏好，随时可切换。',
    selectorAria: '网站版本选择',
    classicTag: '01 — /classic',
    classicTitle: '交互式工作室',
    classicDesc: '完整视觉导览：实时系统演示、真实生产案例、交互式报价器与内置技术助手。',
    classicMeta: '作品集 · 演示 · 报价 · 商店',
    classicCta: '进入工作室',
    classicOpening: '正在打开...',
    v2Tag: '02 — /v2',
    v2Title: '直接矩阵与定价',
    v2Desc: '浅色技术规格页：服务范围对比矩阵、明确交付周期、7 种语言支持与一键导出需求摘要。',
    v2Meta: '范围清晰 · 7 种语言 · 一键摘要',
    v2Cta: '打开直接矩阵',
    v2Opening: '正在打开...',
    footerKeyboard: '快捷键：[1] · [2]',
    phases: {
      trust: '信任',
      security: '安全',
      predictability: '可预期',
      stability: '稳定',
    },
  },
}
