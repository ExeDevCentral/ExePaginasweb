import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-black/80 backdrop-blur-xl border-t border-white/10 py-16 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          
          {/* Logo y Eslogan */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="inline-block group">
              <h2 className="font-montserrat text-3xl font-black text-white tracking-tighter leading-none">
                EXE<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] group-hover:from-[#FF00FF] group-hover:to-[#00FFFF] transition-all duration-500">PAGINASWEB</span>
              </h2>
            </Link>
            <p className="font-inter text-gray-400 text-base max-w-md leading-relaxed">
              Diseño de vanguardia y automatización de procesos para negocios que buscan liderar su sector en la era digital.
            </p>
          </div>

          {/* Enlaces Legales */}
          <div className="space-y-6">
            <h3 className="font-montserrat font-bold text-white text-xs uppercase tracking-[0.3em] opacity-40">
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/terminos" 
                  className="font-inter text-gray-300 hover:text-[#00FFFF] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FFFF]/0 group-hover:bg-[#00FFFF] transition-all duration-300" />
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacidad" 
                  className="font-inter text-gray-300 hover:text-[#FF00FF] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF00FF]/0 group-hover:bg-[#FF00FF] transition-all duration-300" />
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Sede / Info */}
          <div className="space-y-6">
            <h3 className="font-montserrat font-bold text-white text-xs uppercase tracking-[0.3em] opacity-40">
              Sede
            </h3>
            <div className="font-inter text-gray-300 space-y-2">
              <p className="text-sm">España</p>
              <p className="text-[#00FFFF] hover:underline cursor-pointer transition-all text-sm">contacto@exepaginasweb.com</p>
            </div>
          </div>

        </div>

        {/* Divider con degradado sutil */}
        <div className="mt-16 mb-8 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Créditos finales */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-inter text-gray-500 text-xs tracking-wide">
            © {new Date().getFullYear()} EXEPAGINASWEB. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex items-center gap-8">
             <span className="text-gray-600 font-montserrat text-[10px] tracking-[0.4em] uppercase">Premium Experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;