import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SalonBloomButton } from './SalonBloomButton';
import { useTypewriter } from '../../hooks/useTypewriter';
import { HERO_TYPEWRITER_TEXT } from './constants';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Generar partículas fluidas estables
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.8 + 0.2,
    duration: Math.random() * 5 + 3,
    color: i % 2 === 0 ? 'bg-accent-cyan' : 'bg-accent-magenta',
    xMove: Math.random() * 30 - 15
  })), []);

  // Usamos el hook personalizado para el efecto typewriter
  const { typedText } = useTypewriter(HERO_TYPEWRITER_TEXT, { 
    typingSpeed: 100, // Escritura muy pausada y tranquila
    endDelay: 1000
  });
  useEffect(() => {
    let isMounted = true;
    if (videoRef.current) {
      // Asegurar que autoplay funcione en navegadores modernos (muted es obligatorio)
      videoRef.current.play().catch((err) => {
        if (isMounted) {
          console.warn("Autoplay bloqueado o error de video:", err);
        }
      });
    }
    return () => { isMounted = false; };
  }, []);



  const handleScrollToProducts = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Fallback de gradiente si el video falla o carga */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-primary-bg via-black to-accent-magenta/20 transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      {/* Componente de partículas con framer-motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-1.5 h-1.5 ${particle.color} rounded-full blur-[1px]`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, particle.xMove, 0],
              scale: [particle.scale, particle.scale * 1.5, particle.scale],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setVideoError(true)}
          poster="/assets/images/hero-placeholder.webp" // Sugerencia: Añadir imagen de carga
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-40' : 'opacity-0'
          }`}
        >
          <source src="/assets/videos/hero-bg.webm" type="video/webm" />
          <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
          {/* No añadir divs dentro del video, solo fuentes o tracks */}
        </video>
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* H1 visible inmediatamente para Lighthouse LCP */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-montserrat font-black text-white tracking-tighter leading-none mb-6">
          SISTEMAS QUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">ESCALAN</span>
          <br />
          <span className="text-4xl md:text-6xl opacity-90">TU NEGOCIO</span>
        </h1>
        
        {/* Resto animado con motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          
          {/* Contenedor relativo para evitar saltos de diseño (CLS) */}
          <div className="relative mb-10">
            {/* Texto invisible que reserva el espacio total desde el inicio */}
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-inter opacity-0 select-none pointer-events-none" aria-hidden="true">
              {HERO_TYPEWRITER_TEXT}
            </p>
            {/* Texto animado que se superpone perfectamente */}
            <p className="absolute inset-0 max-w-2xl mx-auto text-lg md:text-xl text-primary-secondary font-inter">
              {typedText}
              <span className="animate-pulse border-r-2 border-accent-cyan ml-1"></span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <SalonBloomButton href="#products" onClick={handleScrollToProducts} />
            <motion.a
              href="#contact"
              className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              INICIAR PROYECTO
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;