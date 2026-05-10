import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    question: '¿Tengo que pagar un mantenimiento mensual?',
    answer: 'Depende del plan que elijas. Ofrecemos opciones de pago único para webs informativas, y opciones de suscripción para sistemas complejos que requieren bases de datos, actualizaciones y soporte técnico continuo.'
  },
  {
    question: '¿El código y la web me pertenecen?',
    answer: 'Sí. A diferencia de plataformas cerradas como Shopify o Wix, nosotros desarrollamos a medida. Si en el futuro decides migrar, la web te pertenece 100%.'
  },
  {
    question: '¿Cuánto tardan en entregar un proyecto?',
    answer: 'Una landing page premium como esta suele estar lista en 5 a 7 días hábiles. Sistemas más complejos con panel de administración (como el sistema de turnos) toman entre 2 y 3 semanas.'
  },
  {
    question: '¿Ustedes se encargan del dominio y el hosting?',
    answer: 'Sí, nos encargamos de todo el aspecto técnico. Te asesoramos para configurar tu dominio (.com o .com.ar) y alojamos tu web en servidores ultrarrápidos de nivel global.'
  }
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent-cyan/80">FAQ</p>
          <h2 className="font-montserrat text-4xl sm:text-5xl font-black mb-6">Preguntas Frecuentes</h2>
          <p className="text-primary-secondary text-lg">Resolvemos tus dudas antes de arrancar.</p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                className="w-full px-6 py-6 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-bold text-lg pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-6 h-6 text-accent-cyan transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-primary-secondary/80 leading-relaxed pt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
