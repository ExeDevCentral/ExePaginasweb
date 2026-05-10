import { motion } from 'framer-motion';
import React from 'react';

interface SalonBloomButtonProps {
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const SalonBloomButton: React.FC<SalonBloomButtonProps> = ({ href, onClick }) => {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group p-[2px] rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
    >
      {/* Gradiente animado en el borde */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-spin-slow opacity-70 group-hover:opacity-100 transition-opacity" />
      
      {/* Cuerpo del botón con Glassmorphism */}
      <div className="relative px-8 py-4 bg-black/80 backdrop-blur-xl rounded-full flex items-center gap-3">
        <span className="text-white font-montserrat font-bold tracking-widest text-sm md:text-base">
          EXPLORAR SALÓN BLOOM
        </span>
        
        {/* Icono animado */}
        <motion.svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="stroke-pink-400 group-hover:stroke-cyan-400 transition-colors"
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <path d="M5 12h14m-7-7l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </div>

      {/* Efecto de resplandor interno */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-500" />
    </motion.a>
  );
};

export default SalonBloomButton;