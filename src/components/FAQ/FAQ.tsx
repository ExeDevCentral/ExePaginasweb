import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

interface FAQ {
  qIdx: number
  categories: string[]
}

const faqs: FAQ[] = [
  { qIdx: 1, categories: ['planes'] },
  { qIdx: 2, categories: ['propiedad'] },
  { qIdx: 3, categories: ['tiempos'] },
  { qIdx: 4, categories: ['servicios'] },
]

const catIds = ['planes', 'propiedad', 'tiempos', 'servicios']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const contentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
}

const FAQ = () => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<string>(catIds[0] ?? 'planes')
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

  const faqCount = useMemo(() => faqs.length, [])

  const filteredFaqs = useMemo(
    () => faqs.filter((faq) => faq.categories.includes(activeCategory)),
    [activeCategory]
  )

  return (
    <section className="h-auto overflow-hidden relative z-10">
      <div className="h-auto max-w-5xl w-screen mx-auto text-foreground py-16 px-4 sm:px-6 lg:px-8">
        {/* Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(900px circle at 20% 10%, rgba(34,211,238,0.14), transparent 45%), radial-gradient(700px circle at 80% 30%, rgba(99,102,241,0.10), transparent 55%)',
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
              {t('faq.subtitulo')}
            </motion.p>

            <motion.h2
              className="text-4xl font-bold mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('faq.seccion_titulo')}
            </motion.h2>

            <motion.div className="flex flex-wrap justify-center gap-2" variants={itemVariants}>
              {catIds.map((catId, index) => (
                <motion.button
                  key={catId}
                  onClick={() => {
                    setActiveCategory(catId)
                    setOpenQuestion(null)
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors
                  ${
                    activeCategory === catId
                      ? 'bg-purple-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  type="button"
                >
                  {t(`faq.cat_${catId}`)}
                </motion.button>
              ))}
            </motion.div>

            <div className="mt-10 inline-flex items-center justify-center rounded-full border border-border bg-muted px-4 py-2 text-xs text-foreground/60">
              {t('faq.count_text', { count: faqCount })}
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
                    className="border border-border/50 bg-muted/30 backdrop-blur-sm rounded-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenQuestion(isOpen ? null : index)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-muted transition-colors"
                    >
                      <span className="text-foreground">{t(`faq.q_${faq.qIdx}`)}</span>
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
                          <div className="p-4 text-muted-foreground bg-muted/40 backdrop-blur-sm">
                            {t(`faq.a_${faq.qIdx}`)}
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
