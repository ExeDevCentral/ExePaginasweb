import { motion } from 'framer-motion';
import { Lock, Sparkles, X, Check, ArrowRight, Monitor, Building, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PremiumBackground from './Effects/PremiumBackground';
import { Helmet } from 'react-helmet-async';

const PLANS = [
  {
    id: 'web',
    title: 'Páginas Web',
    description: 'Ideal para presencia online, landings y portfolios.',
    icon: Monitor,
    price: '$29',
    period: '/mes',
    color: 'from-blue-400 to-cyan-400',
    shadow: 'shadow-cyan-500/20',
    border: 'border-cyan-500/30',
    features: [
      'Hosting de alta velocidad incluido',
      'Dominio personalizado (.com / .ar)',
      'Mantenimiento técnico mensual',
      'Certificado SSL (Sitio seguro)',
      'Soporte vía email/WhatsApp'
    ],
    popular: false,
    paypalButtonId: 'L9W2ZUJYWTLPU'
  },
  {
    id: 'small-biz',
    title: 'Negocios Pequeños',
    description: 'Sistemas para kioscos, veterinarias o reservas.',
    icon: Building,
    price: '$79',
    period: '/mes',
    color: 'from-cyan-400 to-purple-500',
    shadow: 'shadow-purple-500/30',
    border: 'border-purple-500/50',
    features: [
      'Todo lo del plan Páginas Web',
      'Panel de control administrativo',
      'Base de datos en tiempo real',
      'Integración Mercado Pago',
      'Sistema de turnos / stock',
      'Soporte prioritario 24/7'
    ],
    popular: true,
    paypalButtonId: 'AY9FHBGCJX2KJ'
  },
  {
    id: 'large-biz',
    title: 'Negocios Grandes',
    description: 'ERPs, franquicias y plataformas a gran escala.',
    icon: Building2,
    price: '$199',
    period: '/mes',
    color: 'from-purple-500 to-pink-500',
    shadow: 'shadow-pink-500/20',
    border: 'border-pink-500/30',
    features: [
      'Todo lo del plan Pequeños',
      'Servidor dedicado escalable',
      'Múltiples sucursales / roles',
      'Integración API (AFIP, etc)',
      'Desarrollo a medida continuo',
      'Account Manager dedicado'
    ],
    popular: false,
    paypalButtonId: 'BSJQQBZJFKY72'
  }
];

export default function StorePage() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Acceso exclusivo para clientes activos de';
  
  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  // Inicializar botones de PayPal
  useEffect(() => {
    const renderPayPalButtons = () => {
      // @ts-ignore - PayPal es inyectado globalmente
      if (window.paypal && window.paypal.HostedButtons) {
        PLANS.forEach(plan => {
          if (plan.paypalButtonId) {
            const containerId = `#paypal-container-${plan.paypalButtonId}`;
            // Evitar renderizado múltiple si ya existe contenido
            const container = document.querySelector(containerId);
            if (container && container.innerHTML === '') {
               // @ts-ignore
              window.paypal.HostedButtons({
                hostedButtonId: plan.paypalButtonId
              }).render(containerId);
            }
          }
        });
      }
    };

    // @ts-ignore
    if (window.paypal) {
      renderPayPalButtons();
    } else {
      const interval = setInterval(() => {
        // @ts-ignore
        if (window.paypal) {
          renderPayPalButtons();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  // Floating particles background (Recuperadas y mejoradas)
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.8 + 0.2,
    duration: Math.random() * 5 + 3,
    color: i % 2 === 0 ? 'bg-accent-cyan' : 'bg-accent-magenta'
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25 } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-primary-bg py-20 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Suscripciones y Tienda | ExeSistemasWEB</title>
      </Helmet>
      
      <PremiumBackground />

      {/* Hero Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none hero-grid opacity-20" />

      {/* Partículas Flotantes */}
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
              x: [0, Math.random() * 30 - 15, 0],
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

      {/* Luces Ambientales */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-magenta/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-24">
        
        {/* Header and Plans Section */}
        <section className="text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent-cyan/80 mb-4">
              Impulsa tu negocio
            </p>
            <h1 className="text-4xl md:text-6xl font-montserrat font-black text-white mb-6">
              Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">Planes</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-secondary max-w-2xl mx-auto mb-16">
              Elige el nivel de servicio que mejor se adapte a tus necesidades. Mantenimiento, servidores y desarrollo continuo en una sola suscripción.
            </p>
          </motion.div>

          {/* Pricing Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                className={`relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border rounded-3xl p-8 flex flex-col text-left transition-all duration-300 hover:bg-white/10 ${plan.border} ${plan.popular ? 'md:-translate-y-4 shadow-2xl ' + plan.shadow : ''}`}
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-0 right-0 flex justify-center"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 blur-md opacity-50 rounded-full" />
                      <span className="relative bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg border border-white/20">
                        ⭐ MÁS ELEGIDO
                      </span>
                    </div>
                  </motion.div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-primary-bg/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                <p className="text-primary-secondary text-sm mb-6 h-10">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-primary-secondary font-medium"> USD{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-primary-secondary/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4 min-h-[50px]">
                  {plan.paypalButtonId ? (
                    <div id={`paypal-container-${plan.paypalButtonId}`} className="w-full relative z-20"></div>
                  ) : (
                    <button
                      onClick={() => window.location.href = '/#contact'}
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 relative z-20
                        ${plan.popular 
                          ? `bg-gradient-to-r ${plan.color} shadow-lg ${plan.shadow} hover:opacity-90` 
                          : 'bg-white/10 hover:bg-white/20 border border-white/10'
                        }
                      `}
                    >
                      Próximamente <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Separator */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Existing Locked Client Area */}
        <section className="flex justify-center pb-20">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full"
          >
            <button
              onClick={() => window.history.back()}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Volver"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="mx-auto w-24 h-24 mb-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Lock className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            <div className="text-center mb-8">
              <motion.p className="text-xl md:text-2xl text-white mb-4 min-h-[4rem]">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-6 bg-cyan-400 ml-1 align-middle"
                />
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Exesistemas
                </span>
                <Sparkles className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>

            <motion.a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/#contact';
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-2xl text-white font-semibold text-lg text-center transition-all shadow-lg shadow-purple-500/50"
            >
              Portal de Clientes 🚀
            </motion.a>
          </motion.div>

          {/* Efecto de brillo detrás del modal de clientes */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </section>

      </div>
    </div>
  );
}
