import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Esto es solo para subscriptores o clientes de';
  
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  // Partículas flotantes
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full"
            >
              {/* Partículas flotantes de fondo */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute w-2 h-2 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full opacity-30"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      x: [0, Math.random() * 20 - 10, 0],
                      scale: [particle.scale, particle.scale * 1.2, particle.scale],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              {/* Card glassmorphism */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                {/* Botón cerrar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Icono animado */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="mx-auto w-20 h-20 mb-6 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Lock className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>

                {/* Texto con efecto typewriter */}
                <div className="text-center mb-6">
                  <motion.p
                    className="text-xl text-white mb-2 min-h-[3rem]"
                  >
                    {displayedText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-5 bg-cyan-400 ml-1"
                    />
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      Exesistemas
                    </span>
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </div>

                {/* CTA Button */}
                <motion.a
                  href="#contact"
                  onClick={onClose}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-2xl text-white font-semibold text-center transition-all shadow-lg shadow-purple-500/50"
                >
                  Contactar 🚀
                </motion.a>

                {/* Texto adicional */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="text-center text-sm text-white/60 mt-4"
                >
                  Descubre todo lo que podemos hacer por ti
                </motion.p>
              </div>

              {/* Efecto de brillo */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl -z-10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

