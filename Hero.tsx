import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

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

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Fallback de gradiente si el video falla o carga */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-primary-bg via-black to-accent-magenta/20 transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />

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
          <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
          {/* No añadir divs dentro del video, solo fuentes o tracks */}
        </video>
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-montserrat font-bold text-white tracking-tighter"
        >
          EXPERIENCIAS <span className="text-accent-cyan">DIGITALES</span>
        </motion.h1>
      </div>
    </section>
  );
};

export default Hero;