import { useTranslation } from 'react-i18next'
import { Code2, Github, Instagram, Linkedin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <footer className="relative border-t border-foreground/10 bg-background/90 backdrop-blur-xl pt-20 pb-8 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="w-8 h-8 text-accent-cyan" />
              <span className="font-montserrat font-black text-2xl tracking-tight text-foreground">
                ExeSistemas<span className="text-accent-cyan">WEB</span>
              </span>
            </div>
            <p className="text-primary-secondary mb-8 max-w-sm leading-relaxed">
              {t('footer.descripcion')}
            </p>
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
              <li>
                <a
                  href="#products"
                  className="text-primary-secondary hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_sistemas')}
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-primary-secondary hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_caracteristicas')}
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-primary-secondary hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_demo')}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-primary-secondary hover:text-accent-cyan transition-colors"
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
              <li>
                <Link
                  to="/terminos"
                  className="text-primary-secondary hover:text-foreground transition-colors"
                >
                  {t('footer.terminos')}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidad"
                  className="text-primary-secondary hover:text-foreground transition-colors"
                >
                  {t('footer.privacidad')}
                </Link>
              </li>
              <li className="pt-4 flex items-center gap-3 text-foreground font-medium">
                <a
                  href="#contact"
                  className="flex items-center gap-3 hover:text-accent-cyan transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Mail size={14} className="text-accent-cyan" />
                  </div>
                  {t('footer.contacto_form')}
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
              className="text-accent-cyan hover:text-foreground transition-colors"
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
