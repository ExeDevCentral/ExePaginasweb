import { motion } from 'framer-motion'
import { Calendar, ShoppingCart, PawPrint, Users, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProductDemo from './ProductDemo'
import ProductCard from './ProductCard'

const Products = () => {
  const { t } = useTranslation()
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoType, setDemoType] = useState<'padel' | 'kiosco' | 'veterinaria' | 'crm'>('padel')

  const openDemo = (type: 'padel' | 'kiosco' | 'veterinaria' | 'crm') => {
    setDemoType(type)
    setDemoOpen(true)
  }
  const products = [
    {
      icon: Calendar,
      features: ['', '', '', '', ''],
      price: '$300-500 USD',
      color: 'from-accent-cyan to-blue-600',
      demoLink: '#demo-padel',
      tKey: 'padel',
    },
    {
      icon: ShoppingCart,
      features: ['', '', '', '', ''],
      price: '$200-400 USD',
      color: 'from-accent-magenta to-indigo-600',
      demoLink: '#demo-kiosco',
      tKey: 'kiosco',
    },
    {
      icon: PawPrint,
      features: ['', '', '', '', ''],
      price: '$400-600 USD',
      color: 'from-amber-500 to-amber-700',
      demoLink: '#demo-veterinaria',
      tKey: 'veterinaria',
    },
    {
      icon: Users,
      features: ['', '', '', '', ''],
      price: '$250-400 USD',
      color: 'from-emerald-500 to-teal-700',
      demoLink: '#demo-crm',
      tKey: 'crm',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05,
      },
    },
  }

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-transparent">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-magenta rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent-cyan/80">
            {t('products.seccion_titulo')}
          </p>
          <h2 className="font-montserrat text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            <span className="text-gradient-animated">{t('products.heading')}</span>
          </h2>
          <p className="text-lg text-primary-secondary max-w-3xl mx-auto leading-relaxed">
            {t('products.descripcion')}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.tKey}
              product={product}
              onOpenDemo={() =>
                openDemo(product.demoLink.replace('#demo-', '') as typeof demoType)
              }
            />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-primary-secondary mb-6 max-w-2xl mx-auto">
            {t('products.cta_personalizado')}
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-accent-cyan/30 text-accent-cyan font-semibold text-lg hover:bg-accent-cyan/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('products.cta_boton')} <ArrowRight size={20} />
          </motion.a>
        </motion.div>
      </div>

      {/* Product Demo Modal */}
      <ProductDemo isOpen={demoOpen} onClose={() => setDemoOpen(false)} productType={demoType} />
    </section>
  )
}

export default Products
