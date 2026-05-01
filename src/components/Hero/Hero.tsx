import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SalonBloomButton } from './SalonBloomButton';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Typewriter effect
  const [typedText, setTypedText] = useState('');
  const fullText = 'Software de gestión, reservas online y automatizaciones inteligentes para potenciar tu negocio local.';

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

const [particlesInit, setParticlesInit] = useState(false);

  useEffect(() => {
    if (!particlesInit) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setParticlesInit(true);
      });
    }
  }, [particlesInit]);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        // Efecto de pausa al final antes de terminar
        setTimeout(() => clearInterval(interval), 1000);
      }
    }, 35); // Un poco más rápido para mejorar el tiempo de lectura percibido
    return () => clearInterval(interval);
  }, [fullText]);

  const handleScrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Fallback de gradiente si el video falla o carga */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-primary-bg via-black to-accent-magenta/20 transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      {/* Componente de partículas */}
      {particlesInit && (
        <Particles
          id="tsparticles"
          options={{
            background: {
              color: {
                value: "#000000", // Fondo negro, ya lo tienes en el hero
              },
              opacity: 0, // Hacemos el fondo de las partículas transparente para ver el video/gradiente
            },
            fpsLimit: 60,
interactivity: {
              events: {
                onClick: {
                  enable: false,
                  mode: "push",
                },
                onHover: {
                  enable: false, // Puedes cambiar a true para efectos interactivos
                  mode: "repulse",
                },
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: ["#00FFFF", "#FF00FF", "#FFFF00"], // Tonos cian, magenta, amarillo para un look neón
              },
              links: {
                enable: false, // Sin líneas que conecten las partículas
              },
              move: {
                direction: "top", // Mover hacia arriba
                enable: true,
                speed: 1, // Velocidad de subida
                random: true,
              },
number: { density: { enable: true }, value: 80 }, // Cantidad de partículas
              opacity: { value: { min: 0.3, max: 0.8 } }, // Opacidad variada
              size: { value: { min: 1, max: 3 } }, // Tamaño variado
            },
            detectRetina: true,
          }}
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