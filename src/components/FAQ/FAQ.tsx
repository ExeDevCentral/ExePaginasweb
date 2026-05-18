import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'


interface FAQ {
  question: string
  answer: string
  categories: string[]
}

const faqs: FAQ[] = [
  {
    question: '¿Tengo que pagar un mantenimiento mensual?',
    answer: 'Depende del plan que elijas. Ofrecemos opciones de pago único para webs informativas, y opciones de suscripción para sistemas complejos que requieren bases de datos, actualizaciones y soporte técnico continuo.',
    categories: ['planes']
  },
  {
    question: '¿El código y la web me pertenecen?',
    answer: 'Sí. A diferencia de plataformas cerradas como Shopify o Wix, nosotros desarrollamos a medida. Si en el futuro decides migrar, la web te pertenece 100%.',
    categories: ['propiedad']
  },
  {
    question: '¿Cuánto tardan en entregar un proyecto?',
    answer: 'Una landing page premium como esta suele estar lista en 5 a 7 días hábiles. Sistemas más complejos con panel de administración (como el sistema de turnos) toman entre 2 y 3 semanas.',
    categories: ['tiempos']
  },
  {
    question: '¿Ustedes se encargan del dominio y el hosting?',
    answer: 'Sí, nos encargamos de todo el aspecto técnico. Te asesoramos para configurar tu dominio (.com o .com.ar) y alojamos tu web en servidores ultrarrápidos de nivel global.',
    categories: ['servicios']
  }
]

const categories = [
  { id: 'planes', label: 'Planes' },
  { id: 'propiedad', label: 'Propiedad' },
  { id: 'tiempos', label: 'Tiempos' },
  { id: 'servicios', label: 'Servicios' }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}


const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const contentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' }
}


const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? 'planes')
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

  const faqCount = useMemo(() => faqs.length, [])

  const filteredFaqs = useMemo(
    () => faqs.filter(faq => faq.categories.includes(activeCategory)),
    [activeCategory]
  )

  return (
    <section className="h-auto bg-[#0a0b14] overflow-hidden">
      <div className="h-auto max-w-5xl w-screen mx-auto text-white py-16 px-4 sm:px-6 lg:px-8">
        {/* Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(900px circle at 20% 10%, rgba(34,211,238,0.14), transparent 45%), radial-gradient(700px circle at 80% 30%, rgba(99,102,241,0.10), transparent 55%)'
          }}
        />

        <motion.div
          className="relative max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.p
              className="text-purple-500 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Let's answer some questions
            </motion.p>

            <motion.h2
              className="text-4xl font-bold mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              FAQs
            </motion.h2>

            <motion.div
              className="flex flex-wrap justify-center gap-2"
              variants={itemVariants}
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setOpenQuestion(null)
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors
                  ${activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1a1b23] text-gray-400 hover:bg-[#2a2b33]'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  type="button"
                >
                  {category.label}
                </motion.button>
              ))}
            </motion.div>

            <div className="mt-10 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
              {faqCount} respuestas claras, sin rodeos.
            </div>
          </motion.div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openQuestion === index

                return (
                  <motion.div
                    key={`${activeCategory}-${index}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    className="border border-[#2a2b33] rounded-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenQuestion(isOpen ? null : index)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1a1b23] transition-colors"
                    >
                      <span className="text-gray-200">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Plus className="w-5 h-5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={contentVariants}
                          className="overflow-hidden"
                        >
                          <div className="p-4 text-gray-400 bg-[#1a1b23]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ


