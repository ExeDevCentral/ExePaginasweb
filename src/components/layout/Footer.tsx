import { useTranslation } from 'react-i18next'
import { Code2, Github, Instagram, Linkedin, Mail, Zap, Shield, Search, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

import Logo from './Logo'

const TECH_ITEMS = [
  { icon: Zap, labelKey: 'card_1_titulo', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { icon: Code2, labelKey: 'card_2_titulo', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: Shield, labelKey: 'card_3_titulo', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: Search, labelKey: 'card_4_titulo', color: 'text-purple-400', bg: 'bg-purple-400/10' },
]

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="relative border-t border-foreground/10 bg-background/90 backdrop-blur-xl pt-16 pb-8 z-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-accent-cyan/10 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-accent-magenta/10 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo size={48} className="h-12 w-auto" />
              <span className="font-montserrat font-black text-2xl tracking-tight text-foreground">
                ExePaginas<span className="text-yellow-400">WEB.com</span>
              </span>
            </div>
            <p className="text-primary-secondary mb-6 max-w-sm leading-relaxed text-sm">
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
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/ExeDevCentral"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-card border border-border text-foreground/70 hover:text-accent-cyan hover:border-accent-cyan/50 hover:bg-accent-cyan/5 transition-all duration-300 shadow-sm"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.instagram.com/exequiel.echevarria/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-card border border-border text-foreground/70 hover:text-accent-magenta hover:border-accent-magenta/50 hover:bg-accent-magenta/5 transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/exequiel.echevarria/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-2xl bg-card border border-border text-foreground/70 hover:text-sky-500 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">
              {t('footer.navegacion')}
            </h4>
            <ul className="space-y-3.5 text-sm">
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

          {/* Contacto & Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">
              Canales & Legal
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a
                  href="mailto:Contacto@exepaginasweb.com"
                  className="group flex items-center gap-2.5 text-primary-secondary hover:text-accent-cyan transition-colors"
                >
                  <Mail size={15} className="text-accent-cyan shrink-0" />
                  <span className="break-all font-medium">Contacto@exepaginasweb.com</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:Ventas@exepaginasweb.com"
                  className="group flex items-center gap-2.5 text-primary-secondary hover:text-accent-magenta transition-colors"
                >
                  <Send size={15} className="text-accent-magenta shrink-0" />
                  <span className="break-all font-medium">Ventas@exepaginasweb.com</span>
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/terminos"
                  className="text-primary-secondary hover:text-foreground transition-all inline-block"
                >
                  {t('footer.terminos')}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidad"
                  className="text-primary-secondary hover:text-foreground transition-all inline-block"
                >
                  {t('footer.privacidad')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-secondary text-xs">
            © {new Date().getFullYear()} ExeSistemasWEB. {t('footer.derechos')}
          </p>
          <p className="text-primary-secondary text-xs flex items-center gap-1.5">
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
