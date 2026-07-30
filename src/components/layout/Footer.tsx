import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Code2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Zap,
  Shield,
  Search,
  Copy,
  Check,
  Sparkles,
  Send,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const TECH_ITEMS = [
  { icon: Zap, labelKey: 'card_1_titulo', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { icon: Code2, labelKey: 'card_2_titulo', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: Shield, labelKey: 'card_3_titulo', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: Search, labelKey: 'card_4_titulo', color: 'text-purple-400', bg: 'bg-purple-400/10' },
]

const Footer = () => {
  const { t } = useTranslation()
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  return (
    <footer className="relative border-t border-foreground/10 bg-background/90 backdrop-blur-xl pt-16 pb-8 z-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-40">
        <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-accent-cyan/10 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-accent-magenta/10 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BANNER ELITE CANALES DE EMAIL */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl border border-foreground/10 bg-gradient-to-r from-accent-cyan/5 via-purple-500/5 to-accent-magenta/5 backdrop-blur-2xl relative overflow-hidden group shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Canales Oficiales Directos
              </div>
              <h3 className="font-montserrat text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Comunícate con Nosotros{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
                  Elite
                </span>
              </h3>
              <p className="text-primary-secondary text-sm mt-1 max-w-xl">
                Atención personalizada e inmediata para consultas generales, soporte y nuevos
                proyectos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
              {/* Card Contacto */}
              <div className="relative group/card flex items-center justify-between gap-4 p-4 rounded-2xl border border-foreground/10 bg-background/80 hover:border-accent-cyan/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.18)] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center border border-accent-cyan/20 group-hover/card:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-cyan block">
                      Contacto & Soporte
                    </span>
                    <a
                      href="mailto:Contacto@exepaginasweb.com"
                      className="text-sm font-bold text-foreground hover:text-accent-cyan transition-colors tracking-tight"
                    >
                      Contacto@exepaginasweb.com
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard('Contacto@exepaginasweb.com')}
                  className="p-2.5 rounded-xl bg-foreground/5 hover:bg-accent-cyan/20 hover:text-accent-cyan text-primary-secondary transition-colors"
                  title="Copiar correo"
                  aria-label="Copiar correo de contacto"
                >
                  {copiedEmail === 'Contacto@exepaginasweb.com' ? (
                    <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Card Ventas */}
              <div className="relative group/card flex items-center justify-between gap-4 p-4 rounded-2xl border border-foreground/10 bg-background/80 hover:border-accent-magenta/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.18)] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-magenta/10 text-accent-magenta flex items-center justify-center border border-accent-magenta/20 group-hover/card:scale-110 transition-transform">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-magenta block">
                      Ventas & Cotizaciones
                    </span>
                    <a
                      href="mailto:Ventas@exepaginasweb.com"
                      className="text-sm font-bold text-foreground hover:text-accent-magenta transition-colors tracking-tight"
                    >
                      Ventas@exepaginasweb.com
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard('Ventas@exepaginasweb.com')}
                  className="p-2.5 rounded-xl bg-foreground/5 hover:bg-accent-magenta/20 hover:text-accent-magenta text-primary-secondary transition-colors"
                  title="Copiar correo"
                  aria-label="Copiar correo de ventas"
                >
                  {copiedEmail === 'Ventas@exepaginasweb.com' ? (
                    <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="w-8 h-8 text-accent-cyan" />
              <span className="font-montserrat font-black text-2xl tracking-tight text-foreground">
                ExeSistemas<span className="text-accent-cyan">WEB</span>
              </span>
            </div>
            <p className="text-primary-secondary mb-6 max-w-sm leading-relaxed">
              {t('footer.descripcion')}
            </p>
            {/* Tech badges compactas */}
            <div className="flex flex-wrap gap-2 mb-6">
              {TECH_ITEMS.map((item, i) => {
                const Icon = item.icon
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.bg} ${item.color} border border-foreground/5`}
                  >
                    <Icon className="w-3 h-3" />
                    {t(`techstack.${item.labelKey}`)}
                  </span>
                )
              })}
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ExeDevCentral"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-foreground/5 border border-foreground/5 text-foreground hover:bg-accent-cyan/20 hover:border-accent-cyan/50 hover:text-accent-cyan transition-all"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.instagram.com/exequiel.echevarria/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-foreground/5 border border-foreground/5 text-foreground hover:bg-accent-magenta/20 hover:border-accent-magenta/50 hover:text-accent-magenta transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/exequiel-echevarria/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-foreground/5 border border-foreground/5 text-foreground hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
              {t('footer.navegacion')}
            </h4>
            <ul className="space-y-4">
              <li className="group">
                <a
                  href="#products"
                  className="text-primary-secondary hover:text-accent-cyan transition-all group-hover:translate-x-1 inline-block"
                >
                  {t('footer.nav_sistemas')}
                </a>
              </li>
              <li className="group">
                <a
                  href="#features"
                  className="text-primary-secondary hover:text-accent-cyan transition-all group-hover:translate-x-1 inline-block"
                >
                  {t('footer.nav_caracteristicas')}
                </a>
              </li>
              <li className="group">
                <a
                  href="#demo"
                  className="text-primary-secondary hover:text-accent-cyan transition-all group-hover:translate-x-1 inline-block"
                >
                  {t('footer.nav_demo')}
                </a>
              </li>
              <li className="group">
                <a
                  href="#contact"
                  className="text-primary-secondary hover:text-accent-cyan transition-all group-hover:translate-x-1 inline-block"
                >
                  {t('footer.nav_contacto')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">
              {t('footer.soporte_legal')}
            </h4>
            <ul className="space-y-4">
              <li className="group">
                <Link
                  to="/terminos"
                  className="text-primary-secondary hover:text-foreground transition-all group-hover:translate-x-1 inline-block"
                >
                  {t('footer.terminos')}
                </Link>
              </li>
              <li className="group">
                <Link
                  to="/privacidad"
                  className="text-primary-secondary hover:text-foreground transition-all group-hover:translate-x-1 inline-block"
                >
                  {t('footer.privacidad')}
                </Link>
              </li>
              <li className="pt-4 flex items-center gap-3 text-foreground font-medium">
                <a
                  href="mailto:Contacto@exepaginasweb.com"
                  className="flex items-center gap-3 hover:text-accent-cyan transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Mail size={14} className="text-accent-cyan" />
                  </div>
                  Contacto@exepaginasweb.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-secondary text-sm">
            © {new Date().getFullYear()} ExeSistemasWEB. {t('footer.derechos')}
          </p>
          <p className="text-primary-secondary text-sm flex items-center gap-1.5">
            Built &amp; maintained by{' '}
            <a
              href="https://github.com/ExeDevCentral"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan hover:text-foreground transition-colors font-medium"
            >
              ExeDevCentral
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
