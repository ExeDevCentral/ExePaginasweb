import { motion } from 'framer-motion'
import { Scissors, Coffee, ShoppingBag, Calendar, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProductDemo from './ProductDemo'
import ProductCard from './ProductCard'

const Products = () => {
  const { t } = useTranslation()
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoType, setDemoType] = useState<'peluqueria' | 'panaderia' | 'ropa' | 'padel'>(
    'peluqueria'
  )

  const openDemo = (type: 'peluqueria' | 'panaderia' | 'ropa' | 'padel') => {
    setDemoType(type)
    setDemoOpen(true)
  }

  const products = [
    {
      icon: Scissors,
      features: ['', '', '', '', ''],
      price: '$250-450 USD',
      color: 'from-pink-500 via-rose-500 to-purple-600',
      demoLink: '#demo-peluqueria',
      tKey: 'peluqueria',
    },
    {
      icon: Coffee,
      features: ['', '', '', '', ''],
      price: '$200-400 USD',
      color: 'from-amber-500 via-orange-500 to-yellow-600',
      demoLink: '#demo-panaderia',
      tKey: 'panaderia',
    },
    {
      icon: ShoppingBag,
      features: ['', '', '', '', ''],
      price: '$300-500 USD',
      color: 'from-emerald-400 via-teal-500 to-cyan-600',
      demoLink: '#demo-ropa',
      tKey: 'ropa',
    },
    {
      icon: Calendar,
      features: ['', '', '', '', ''],
      price: '$350-550 USD',
      color: 'from-cyan-400 via-blue-500 to-indigo-600',
      demoLink: '#demo-padel',
      tKey: 'padel',
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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-magenta rounded-full blur-3xl" />
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
              onOpenDemo={() => openDemo(product.tKey as typeof demoType)}
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
