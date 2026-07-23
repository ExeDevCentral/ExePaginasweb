import React, { useRef, useCallback, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import BookingModal from './BookingModal'

interface Service {
  id: string
  nombre: string
  descripcion: string
  precio: number
  moneda: string
  duracion: string
  icono: string
  color: string
  popular?: boolean
}

const SERVICES: Service[] = [
  {
    id: 'corte-clasico',
    nombre: 'Corte Clásico',
    descripcion: 'Corte profesional con tijera y máquina. Incluye lavado y secado.',
    precio: 3500,
    moneda: 'ARS',
    duracion: '30 min',
    icono: '✂️',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'coloracion',
    nombre: 'Coloración',
    descripcion: 'Tinte profesional personalizado. Incluye lavado y treatamiento.',
    precio: 12000,
    moneda: 'ARS',
    duracion: '90 min',
    icono: '🎨',
    color: 'from-pink-400 to-fuchsia-500',
    popular: true,
  },
  {
    id: 'manicuria',
    nombre: 'Manicuría',
    descripcion: 'Manicuría completa con esmaltado semipermanente.',
    precio: 4500,
    moneda: 'ARS',
    duracion: '45 min',
    icono: '💅',
    color: 'from-purple-400 to-indigo-500',
  },
  {
    id: 'facial',
    nombre: 'Facial Deep Clean',
    descripcion: 'Limpieza profunda facial con extracción y máscara hidratante.',
    precio: 8000,
    moneda: 'ARS',
    duracion: '60 min',
    icono: '✨',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'masaje',
    nombre: 'Masaje Descontracturante',
    descripcion: 'Masaje terapéutico para aliviar tensiones musculares.',
    precio: 7000,
    moneda: 'ARS',
    duracion: '50 min',
    icono: '💆',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'combo-novia',
    nombre: 'Combo Novia',
    descripcion: 'Pack completo: cabello, maquillaje, uñas y faciaL.',
    precio: 35000,
    moneda: 'ARS',
    duracion: '3 horas',
    icono: '👰',
    color: 'from-rose-400 to-pink-500',
    popular: true,
  },
]

function ServiceCard({
  service,
  index,
  onSelect,
}: {
  service: Service
  index: number
  onSelect: (s: Service) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(smoothY, [0, 1], [8, -8])
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8])
  const glareX = useTransform(smoothX, [0, 1], [0, 100])
  const glareY = useTransform(smoothY, [0, 1], [0, 100])

  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12), transparent 60%)`
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    },
    [mouseX, mouseY]
  )

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(service)}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        perspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className="relative cursor-pointer group"
    >
      <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 h-full overflow-hidden transition-[border-color] duration-300 group-hover:border-white/20">
        {/* Glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: glareBg }}
        />

        {/* Popular badge */}
        {service.popular && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-accent-magenta/20 border border-accent-magenta/30 text-[10px] text-accent-magenta font-bold uppercase tracking-wider">
            Popular
          </div>
        )}

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {service.icono}
        </div>

        {/* Content */}
        <h3 className="text-white font-bold text-sm mb-1.5 group-hover:text-accent-cyan transition-colors">
          {service.nombre}
        </h3>
        <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-2">
          {service.descripcion}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <span className="text-white font-black text-lg">
              ${service.precio.toLocaleString('es-AR')}
            </span>
            <span className="text-white/30 text-xs ml-1">{service.moneda}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <Clock size={12} />
            <span>{service.duracion}</span>
          </div>
        </div>

        {/* CTA arrow */}
        <motion.div
          className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-accent-cyan/20 group-hover:text-accent-cyan transition-all duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <ArrowRight size={14} />
        </motion.div>

        {/* Bottom glow on hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-b-2xl`}
        />
      </div>
    </motion.div>
  )
}

export default function ServiceSelector() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSelect = useCallback((service: Service) => {
    setSelectedService(service)
    setModalOpen(true)
  }, [])

  return (
    <div className="relative mt-14 w-full max-w-5xl mx-auto z-10">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-8"
      >
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan/60 mb-2">
          Elegí tu servicio
        </p>
        <p className="text-white/20 text-xs">Hacé click en cualquiera para reservar</p>
      </motion.div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} onSelect={handleSelect} />
        ))}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService}
      />
    </div>
  )
}
