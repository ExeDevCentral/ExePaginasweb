import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SalonBloomButton } from './SalonBloomButton';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTypewriter } from '../../hooks/useTypewriter';
import { HERO_TYPEWRITER_TEXT, PARTICLES_CONFIG } from './constants';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [particlesInit, setParticlesInit] = useState(false);

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

  useEffect(() => {
    if (!particlesInit) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setParticlesInit(true);
      });
    }
  }, [particlesInit]);

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

      {/* Componente de partículas con configuración premium */}
      {particlesInit && (
        <Particles
          id="tsparticles"
          options={PARTICLES_CONFIG} 
        />
      )}

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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-montserrat font-black text-white tracking-tighter leading-none mb-6">
            SISTEMAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">WEB</span>
            <br />
            <span className="text-4xl md:text-6xl opacity-90">A MEDIDA</span>
          </h1>
          
<p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-secondary font-inter mb-10 min-h-[1.5em]">
            {typedText}
            <span className="animate-pulse border-r-2 border-accent-cyan ml-1"></span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <SalonBloomButton href="#products" onClick={handleScrollToProducts} />
            <motion.a
              href="#contact"
              className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SOLICITAR PRESUPUESTO
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;