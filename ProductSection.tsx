import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle2, Zap } from 'lucide-react';
import { Product } from '../../types/store';

const PRODUCTS: Product[] = [
  {
    id: 'plan-landing',
    name: 'Landing Page Pro',
    description: 'Conversión máxima con diseño ultra-rápido y animaciones premium.',
    price: 200,
    category: 'landing',
    features: ['Diseño Responsive', 'SEO Básico', 'Contacto EmailJS', 'Hosting 1 año'],
  },
  {
    id: 'plan-ecommerce',
    name: 'E-commerce Deluxe',
    description: 'Tu tienda online con pasarela de pagos, gestión de stock y panel admin.',
    price: 500,
    category: 'ecommerce',
    features: ['Carrito Avanzado', 'Pagos Online', 'Panel de Control', 'Stock Ilimitado'],
  },
  {
    id: 'plan-system',
    name: 'Sistema a Medida',
    description: 'Software cloud específico para tu negocio (Turnos, CRM, Gestión).',
    price: 850,
    category: 'system',
    features: ['Base de Datos', 'Roles de Usuario', 'Reportes PDF', 'Soporte 24/7'],
  }
];

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (p: Product) => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="relative group bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:border-accent-cyan/50 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-accent-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-accent-cyan/10 rounded-2xl">
            <Zap className="text-accent-cyan w-6 h-6" />
          </div>
          <span className="text-3xl font-black font-montserrat text-white">
            ${product.price}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-montserrat">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{product.description}</p>

        <ul className="space-y-3 mb-8">
          {product.features.map((feat, i) => (
            <li key={i} className="flex items-center text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-accent-magenta mr-3 shrink-0" />
              {feat}
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 group/btn transition-all"
        >
          <ShoppingCart size={18} className="group-hover/btn:animate-bounce" />
          AGREGAR AL CARRITO
        </motion.button>
      </div>
    </motion.div>
  );
};

export const ProductSection = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  return (
    <section className="py-24 px-6 relative overflow-hidden" id="store">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-magenta/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-accent-cyan font-bold tracking-[0.3em] uppercase text-sm mb-4"
          >
            Soluciones Digitales
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black font-montserrat text-white mb-6"
          >
            Elige tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">Nivel</span>
          </motion.h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};