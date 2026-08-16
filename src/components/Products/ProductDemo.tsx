import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calendar,
  Clock,
  CreditCard,
  ShoppingCart,
  BarChart3,
  Lock,
  Sparkles,
  Printer,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Coffee,
  ShoppingBag,
  Trophy,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { toast } from 'sonner'

interface ProductDemoProps {
  isOpen: boolean
  onClose: () => void
  productType: 'peluqueria' | 'panaderia' | 'ropa' | 'padel'
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    const duration = 800
    const steps = 30
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <>
      {display.toLocaleString('es-AR')}
      {suffix}
    </>
  )
}

const PRODUCT_CONFIG = {
  peluqueria: {
    url: 'https://beauty.exepaginasweb.com/salon-beauty-suite',
    title: 'Sistema de Gestión para Peluquerías & Salones de Belleza',
    themeGradient: 'from-pink-500/20 via-rose-500/10 to-purple-500/20',
    accentColor: 'text-pink-400',
    activeTabClass: 'text-pink-400',
    borderClass: 'border-pink-500/30',
  },
  panaderia: {
    url: 'https://bakery.exepaginasweb.com/panaderia-bakery-pos',
    title: 'Sistema Punto de Venta & Producción para Panaderías',
    themeGradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
    accentColor: 'text-amber-400',
    activeTabClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  ropa: {
    url: 'https://fashion.exepaginasweb.com/fashion-boutique-cloud',
    title: 'Sistema de Control de Stock por Talle & Venta para Ropa',
    themeGradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    accentColor: 'text-emerald-400',
    activeTabClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  padel: {
    url: 'https://app.exepaginasweb.com/padel-club-pro',
    title: 'Sistema de Reservas en Tiempo Real & Luz para Canchas',
    themeGradient: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/20',
    accentColor: 'text-cyan-400',
    activeTabClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
  },
}

const ProductDemo = ({ isOpen, onClose, productType }: ProductDemoProps) => {
  const [activeTab, setActiveTab] = useState('calendar')
  const modalRef = useFocusTrap(isOpen)

  // Interactive States per Rubro
  // 1. Peluquería
  const selectedStylist = 'Sofía Rossi (Estilista Senior)'
  const [appointmentsList, setAppointmentsList] = useState([
    {
      name: 'Valentina Gomez',
      service: 'Corte + Balayage',
      time: '16:00 Hs',
      stylist: 'Sofía Rossi',
      status: 'Confirmado',
    },
    {
      name: 'Camila Rodriguez',
      service: 'Brushing & Nutrición',
      time: '17:30 Hs',
      stylist: 'Sofía Rossi',
      status: 'Pendiente',
    },
    {
      name: 'Lucas Benitez',
      service: 'Corte Barba & Fade',
      time: '18:15 Hs',
      stylist: 'Marcos Barbero',
      status: 'Confirmado',
    },
  ])

  // 2. Panadería
  const [bakeryCart, setBakeryCart] = useState<Array<{ name: string; price: number; qty: number }>>(
    [
      { name: 'Facturas Surtidas (Docena)', price: 4200, qty: 1 },
      { name: 'Pan Felipe (1 kg)', price: 1800, qty: 2 },
    ]
  )

  // 3. Local de Ropa
  const [clothingItems, setClothingItems] = useState([
    {
      code: 'ART-4091',
      name: 'Campera Eco-Cuero Rock',
      size: 'M',
      color: 'Negro',
      price: 45000,
      stock: 12,
    },
    {
      code: 'ART-2044',
      name: 'Jean Wide Leg Vintage',
      size: '38',
      color: 'Azul Gastado',
      price: 32000,
      stock: 5,
    },
    {
      code: 'ART-1088',
      name: 'Remera Oversize Cotton',
      size: 'L',
      color: 'Blanco',
      price: 16000,
      stock: 24,
    },
  ])

  // 4. Pádel
  const [selectedCourtSlot, setSelectedCourtSlot] = useState<Record<string, boolean>>({})

  const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG.padel

  // Default tab sync
  useEffect(() => {
    if (productType === 'peluqueria') setActiveTab('agenda')
    if (productType === 'panaderia') setActiveTab('pos')
    if (productType === 'ropa') setActiveTab('stock')
    if (productType === 'padel') setActiveTab('canchas')
  }, [productType])

  const handleBookStylistAppointment = () => {
    const newApp = {
      name: 'Lucía Fernández',
      service: 'Corte & Peinado',
      time: '19:00 Hs',
      stylist: selectedStylist,
      status: 'Confirmado',
    }
    setAppointmentsList((prev) => [newApp, ...prev])
    toast.success(`¡Turno reservado para Lucía con ${selectedStylist}!`, {
      description: 'Notificación automática enviada por WhatsApp al cliente.',
    })
  }

  const handleBakeryCheckout = () => {
    toast.success('¡Cobro de Mostrador Exitoso!', {
      description: 'Ticket impreso y saldo ingresado a Caja Diaria.',
    })
  }

  const handleAddClothesStock = (code: string) => {
    setClothingItems((prev) =>
      prev.map((item) => (item.code === code ? { ...item, stock: item.stock + 5 } : item))
    )
    toast.success(`+5 unidades ingresadas a Stock (${code})`)
  }

  const handleToggleCourtSlot = (slotKey: string) => {
    setSelectedCourtSlot((prev) => {
      const nextState = !prev[slotKey]
      if (nextState) {
        toast.success(`¡Cancha 1 reservada para ${slotKey}!`, {
          description: 'Seña del 50% recibida por MercadoPago.',
        })
      }
      return { ...prev, [slotKey]: nextState }
    })
  }

  const bakeryTotal = bakeryCart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const demoData = {
    peluqueria: {
      tabs: [
        { id: 'agenda', label: 'Agenda de Turnos & Estilistas', icon: Calendar },
        { id: 'servicios', label: 'Catálogo de Tratamientos', icon: Scissors },
        { id: 'comisiones', label: 'Cierre de Caja & Comisiones', icon: CreditCard },
      ],
      content: {
        agenda: (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl border border-pink-500/30 bg-pink-500/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-pink-300">
                  Barbería & Salón Beauty - Modo En Vivo
                </p>
                <p className="text-[11px] text-slate-300">Estilista activo: {selectedStylist}</p>
              </div>
              <button
                type="button"
                onClick={handleBookStylistAppointment}
                className="px-3.5 py-1.5 rounded-xl bg-pink-500 text-slate-950 font-bold text-xs hover:bg-pink-400 transition-colors"
              >
                + Reservar Nuevo Turno
              </button>
            </div>

            <div className="space-y-2">
              {appointmentsList.map((app, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/15 bg-slate-900/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                      <Scissors className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{app.name}</p>
                      <p className="text-xs text-slate-300">
                        {app.service} · Profesional: {app.stylist}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-pink-400 block">
                      {app.time}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        servicios: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Corte Unisex & Peinado', duration: '45 min', price: '$8.500 ARS' },
              { name: 'Coloración & Balayage', duration: '120 min', price: '$28.000 ARS' },
              { name: 'Tratamiento de Alisado Keratina', duration: '90 min', price: '$22.000 ARS' },
              { name: 'Barbería Premium + Perfilado', duration: '30 min', price: '$6.500 ARS' },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/15 bg-slate-900/60 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-white">{s.name}</p>
                  <p className="text-xs text-slate-300">Duración estimada: {s.duration}</p>
                </div>
                <span className="text-sm font-bold font-mono text-pink-400">{s.price}</span>
              </div>
            ))}
          </div>
        ),
        comisiones: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4.5 rounded-2xl bg-pink-950/60 border border-pink-500/40 shadow-lg">
              <p className="text-xs text-pink-200 uppercase font-extrabold tracking-wider">
                Recaudado Hoy Salón
              </p>
              <p className="text-2xl sm:text-3xl font-black text-pink-400 mt-1.5 font-mono drop-shadow">
                $<AnimatedCounter value={124800} /> ARS
              </p>
            </div>
            <div className="p-4.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 shadow-lg">
              <p className="text-xs text-purple-200 uppercase font-extrabold tracking-wider">
                Comisiones Profesionales
              </p>
              <p className="text-2xl sm:text-3xl font-black text-purple-300 mt-1.5 font-mono drop-shadow">
                $<AnimatedCounter value={49920} /> ARS
              </p>
            </div>
          </div>
        ),
      },
    },
    panaderia: {
      tabs: [
        { id: 'pos', label: 'Terminal de Cobro Rápido (POS)', icon: ShoppingCart },
        { id: 'horneado', label: 'Control de Horneados & Producción', icon: Coffee },
        { id: 'caja', label: 'Arqueo de Caja Diaria', icon: BarChart3 },
      ],
      content: {
        pos: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Productos de Panadería & Confitería:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Facturas Surtidas (Docena)', price: 4200 },
                  { name: 'Pan Felipe / Flauta (1kg)', price: 1800 },
                  { name: 'Torta Selva Negra (1kg)', price: 12500 },
                  { name: 'Empanadas de Carne (Docena)', price: 9800 },
                  { name: 'Sandwiches de Miga (12 un)', price: 11000 },
                  { name: 'Café Doble + 2 Medialunas', price: 2900 },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setBakeryCart((prev) => [
                        ...prev,
                        { name: item.name, price: item.price, qty: 1 },
                      ])
                      toast.success(`Agregado a ticket: ${item.name}`)
                    }}
                    className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-slate-100 group-hover:text-amber-300">
                      {item.name}
                    </p>
                    <p className="text-xs font-mono font-bold text-amber-400 mt-1">
                      ${item.price.toLocaleString('es-AR')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/40 bg-amber-950/60 p-4 flex flex-col justify-between space-y-3 shadow-lg">
              <div>
                <h4 className="text-xs font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4" /> Mostrador de Venta
                </h4>
                <div className="divide-y divide-white/10 mt-3 space-y-2 max-h-36 overflow-y-auto">
                  {bakeryCart.map((i, idx) => (
                    <div key={idx} className="pt-2 flex justify-between text-xs font-medium">
                      <span className="text-slate-200">{i.name}</span>
                      <span className="font-mono font-bold text-amber-400">
                        ${i.price.toLocaleString('es-AR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-amber-200 uppercase font-extrabold">
                    Total Mostrador
                  </span>
                  <span className="text-xl font-black font-mono text-amber-400">
                    ${bakeryTotal.toLocaleString('es-AR')} ARS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleBakeryCheckout}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" /> Imprimir Comprobante
                </button>
              </div>
            </div>
          </div>
        ),
        horneado: (
          <div className="space-y-3">
            {[
              {
                batch: 'Facturas de Manteca',
                status: 'Listo 08:30 Hs',
                qty: '20 Docenas',
                chef: 'Carlos (Maestro Panadero)',
              },
              {
                batch: 'Pan de Campo en Hornos',
                status: 'En Horneado (15 min restantes)',
                qty: '35 kg',
                chef: 'Carlos (Maestro Panadero)',
              },
              {
                batch: 'Bizcochitos de Grasa',
                status: 'Programado 17:00 Hs',
                qty: '15 kg',
                chef: 'Mariana',
              },
            ].map((b, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/15 bg-slate-900/60"
              >
                <div>
                  <p className="text-sm font-bold text-white">{b.batch}</p>
                  <p className="text-xs text-slate-300">
                    Volumen: {b.qty} · Encargado: {b.chef}
                  </p>
                </div>
                <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        ),
        caja: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 shadow-lg">
              <p className="text-xs text-amber-200 uppercase font-extrabold tracking-wider">
                Ventas Totales Hoy
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1.5 font-mono drop-shadow">
                $<AnimatedCounter value={214500} /> ARS
              </p>
            </div>
            <div className="p-4.5 rounded-2xl bg-orange-950/60 border border-orange-500/40 shadow-lg">
              <p className="text-xs text-orange-200 uppercase font-extrabold tracking-wider">
                Encargos de Catering
              </p>
              <p className="text-2xl sm:text-3xl font-black text-orange-400 mt-1.5 font-mono drop-shadow">
                $<AnimatedCounter value={68000} /> ARS
              </p>
            </div>
          </div>
        ),
      },
    },
    ropa: {
      tabs: [
        { id: 'stock', label: 'Stock por Talle & Color', icon: ShoppingBag },
        { id: 'catalogo', label: 'Catálogo de Temporada', icon: Sparkles },
        { id: 'ventas', label: 'Ventas de Sucursal', icon: CreditCard },
      ],
      content: {
        stock: (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/15">
              <span className="text-xs font-bold text-white">
                Matriz de Inventario en Tiempo Real
              </span>
              <button
                type="button"
                onClick={() => handleAddClothesStock('ART-4091')}
                className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                + Ingresar Stock Talle M
              </button>
            </div>

            <div className="space-y-2">
              {clothingItems.map((item) => (
                <div
                  key={item.code}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/15 bg-slate-900/60"
                >
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      {item.code}
                    </span>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-slate-300">
                      Talle: <strong className="text-emerald-300">{item.size}</strong> · Color:{' '}
                      <strong className="text-emerald-300">{item.color}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono text-emerald-400">
                      ${item.price.toLocaleString('es-AR')}
                    </p>
                    <p className="text-xs font-bold text-white">Stock: {item.stock} un.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        catalogo: (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Colección Otoño-Invierno', items: '48 Prendas' },
              { title: 'Línea Denim & Jeans', items: '32 Modelos' },
              { title: 'Accesorios & Calzado', items: '20 Ítems' },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center"
              >
                <ShoppingBag className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">{cat.title}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">{cat.items}</p>
              </div>
            ))}
          </div>
        ),
        ventas: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 shadow-lg">
              <p className="text-xs text-emerald-200 uppercase font-extrabold tracking-wider">
                Ventas de Indumentaria Hoy
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1.5 font-mono drop-shadow">
                $<AnimatedCounter value={418900} /> ARS
              </p>
            </div>
            <div className="p-4.5 rounded-2xl bg-teal-950/60 border border-teal-500/40 shadow-lg">
              <p className="text-xs text-teal-200 uppercase font-extrabold tracking-wider">
                Prendas Vendidas
              </p>
              <p className="text-2xl sm:text-3xl font-black text-teal-300 mt-1.5 font-mono drop-shadow">
                <AnimatedCounter value={27} /> unidades
              </p>
            </div>
          </div>
        ),
      },
    },
    padel: {
      tabs: [
        { id: 'canchas', label: 'Grilla de Canchas en Vivo', icon: Trophy },
        { id: 'reservas', label: 'Control de Señas MercadoPago', icon: Clock },
        { id: 'luces', label: 'Automatización de Luces', icon: Sparkles },
      ],
      content: {
        canchas: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Cancha 1 (Sintético Blindex)', 'Cancha 2 (Sintético Panoramic)'].map((court) => (
                <div
                  key={court}
                  className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">{court}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      ● Iluminación Activa
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {['18:00 Hs', '19:30 Hs', '21:00 Hs', '22:30 Hs'].map((slot) => {
                      const isSelected = selectedCourtSlot[`${court}-${slot}`]
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleToggleCourtSlot(`${court}-${slot}`)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-900/60 border-white/15 text-slate-200 hover:border-cyan-400'
                          }`}
                        >
                          {slot} {isSelected ? '✅' : ''}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        reservas: (
          <div className="space-y-3">
            {[
              {
                player: 'Marcos Alonso',
                court: 'Cancha 1',
                time: '19:30 Hs',
                deposit: '$4.500 ARS (Recibida MP)',
              },
              {
                player: 'Gonzalo Paez',
                court: 'Cancha 2',
                time: '21:00 Hs',
                deposit: '$4.500 ARS (Recibida MP)',
              },
            ].map((r, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/15 bg-slate-900/60"
              >
                <div>
                  <p className="text-sm font-bold text-white">{r.player}</p>
                  <p className="text-xs text-slate-300">
                    {r.court} · Horario: {r.time}
                  </p>
                </div>
                <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  {r.deposit}
                </span>
              </div>
            ))}
          </div>
        ),
        luces: (
          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase">
              Módulo de Encendido Automático de Luces
            </h4>
            <p className="text-xs text-slate-300">
              Las luces de cada cancha se encienden automáticamente 10 minutos antes del turno y se
              apagan al finalizar el horario contratado.
            </p>
          </div>
        ),
      },
    },
  }

  const currentDemo = demoData[productType] || demoData.padel

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            {/* SPECTACULAR RUBRO-SPECIFIC MINI-APP BROWSER FRAME */}
            <div
              role="dialog"
              aria-modal="true"
              data-lenis-prevent
              className={`dark relative w-full max-w-5xl max-h-[92vh] bg-[#0c0d16] text-slate-100 border ${config.borderClass} rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col`}
            >
              {/* Browser Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#131522] border-b border-white/10 select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Cerrar modal"
                      className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 transition-opacity cursor-pointer border-0 p-0"
                      onClick={onClose}
                    />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span
                    className={`ml-3 text-[11px] font-extrabold font-mono ${config.accentColor} bg-white/5 px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> DEMO
                    SANDBOX RUBRO
                  </span>
                </div>

                {/* Simulated URL Bar */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-slate-200 max-w-md w-full justify-center">
                  <Lock className={`w-3 h-3 ${config.accentColor}`} />
                  <span className="truncate">{config.url}</span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar demostración"
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Demo App Header with Custom Rubro Gradient */}
              <div
                className={`p-5 border-b border-white/10 bg-gradient-to-r ${config.themeGradient} flex items-center justify-between bg-slate-900/40`}
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 drop-shadow">
                    <Sparkles className={`w-5 h-5 ${config.accentColor}`} />
                    {config.title}
                  </h2>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    Demostración interactiva en vivo creada para este rubro específico.
                  </p>
                </div>
              </div>

              {/* Demo Tabs Navigation */}
              <div className="flex border-b border-white/10 bg-slate-950/80 px-4 overflow-x-auto">
                {currentDemo.tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all whitespace-nowrap relative cursor-pointer ${
                        isActive
                          ? `${config.activeTabClass} font-extrabold`
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {isActive && (
                        <motion.div
                          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.themeGradient}`}
                          layoutId="activeDemoRubroTab"
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Interactive Sandbox Body */}
              <div data-lenis-prevent className="p-6 overflow-y-auto flex-1 bg-slate-950/50">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentDemo.content[activeTab as keyof typeof currentDemo.content]}
                </motion.div>
              </div>

              {/* Demo Footer CTA */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#131522] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <ShieldCheck className={`w-4 h-4 ${config.accentColor}`} />
                  <span>¿Querés este sistema personalizado con tu marca y dominio propio?</span>
                </div>
                <a
                  href="#contact"
                  onClick={onClose}
                  className={`px-6 py-2.5 rounded-xl bg-gradient-to-r ${config.themeGradient} text-white font-black text-xs hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all border border-white/30 flex items-center gap-2 cursor-pointer`}
                >
                  Solicitar sistema para este rubro <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProductDemo
