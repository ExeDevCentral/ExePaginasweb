import { motion } from 'framer-motion'
import { Calendar, ShoppingCart, PawPrint, Users, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import ProductDemo from './ProductDemo'

const Products = () => {
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoType, setDemoType] = useState<'padel' | 'kiosco' | 'veterinaria' | 'crm'>('padel')

  const openDemo = (type: 'padel' | 'kiosco' | 'veterinaria' | 'crm') => {
    setDemoType(type)
    setDemoOpen(true)
  }
  const products = [
    {
      icon: Calendar,
      title: 'Sistema para Canchas de Pádel',
      description: 'Gestioná turnos, reservas y pagos de forma automática. Ideal para clubes y canchas privadas.',
      features: ['Reservas online 24/7', 'Calendario en tiempo real', 'Pagos con Mercado Pago', 'Panel de administración', 'Recordatorios por WhatsApp'],
      price: '$300-500 USD',
      color: 'from-accent-cyan to-blue-500',
      demoLink: '#demo-padel',
    },
    {
      icon: ShoppingCart,
      title: 'Sistema para Kioscos',
      description: 'Controlá stock, ventas y cuentas corrientes con una interfaz rápida y sencilla.',
      features: ['Control de stock', 'Ventas rápidas (POS)', 'Reportes diarios', 'Cuenta corriente/fiado', 'Código de barras'],
      price: '$200-400 USD',
      color: 'from-accent-magenta to-pink-500',
      demoLink: '#demo-kiosco',
    },
    {
      icon: PawPrint,
      title: 'Sistema para Veterinarias',
      description: 'Fichas médicas, agenda de turnos y recordatorios automáticos para mantener a las mascotas sanas.',
      features: ['Fichas de mascotas', 'Historial médico', 'Agenda de turnos', 'Recordatorios automáticos', 'Control de vacunas'],
      price: '$400-600 USD',
      color: 'from-accent-yellow to-orange-500',
      demoLink: '#demo-veterinaria',
    },
    {
      icon: Users,
      title: 'CRM Simple',
      description: 'Gestioná clientes, seguimientos y ventas en un solo lugar. Perfecto para negocios locales.',
      features: ['Gestión de clientes', 'Seguimiento de ventas', 'Recordatorios', 'Reportes básicos', 'Multiusuario'],
      price: '$250-400 USD',
      color: 'from-green-400 to-accent-cyan',
      demoLink: '#demo-crm',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <section
      id="products"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent-cyan/80">Productos</p>
          <h2 className="font-montserrat text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            <span className="text-gradient-animated">Sistemas a Medida</span>
          </h2>
          <p className="text-xl text-primary-secondary max-w-3xl mx-auto leading-relaxed">
            Elegí la solución que mejor se adapta a tu negocio. Todos incluyen hosting, 
            soporte y actualizaciones durante el primer mes.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {products.map((product) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.title}
                className="group relative"
                variants={cardVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full p-8 bg-gradient-to-br from-primary-bg/80 to-primary-bg/40 backdrop-blur-sm border border-white/10 rounded-3xl hover:border-white/20 transition-all duration-300 overflow-hidden">
                  {/* Gradient accent on hover */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-500`}></div>

                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${product.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <Icon className="w-full h-full text-primary-bg" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 font-montserrat text-primary-text group-hover:text-accent-cyan transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="text-primary-secondary mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-primary-secondary">
                        <CheckCircle className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/8">
                    <div>
                      <p className="text-xs text-primary-secondary uppercase tracking-wider mb-1">Inversión</p>
                      <p className="text-xl font-bold text-accent-cyan">{product.price}</p>
                    </div>
          <motion.button
            onClick={() => openDemo(product.demoLink.replace('#demo-', '') as typeof demoType)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg text-sm font-semibold shadow-lg shadow-accent-cyan/20 transition-all hover:shadow-accent-cyan/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Demo <ExternalLink size={14} />
          </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
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
            ¿Necesitás algo más específico? También desarrollamos sistemas personalizados 
            para otros tipos de negocios.
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-accent-cyan/30 text-accent-cyan font-semibold text-lg hover:bg-accent-cyan/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Consultar por sistema personalizado <ArrowRight size={20} />
          </motion.a>
        </motion.div>
      </div>

      {/* Product Demo Modal */}
      <ProductDemo 
        isOpen={demoOpen} 
        onClose={() => setDemoOpen(false)} 
        productType={demoType} 
      />
    </section>
  )
}

export default Products
