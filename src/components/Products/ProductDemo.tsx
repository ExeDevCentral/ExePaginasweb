import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, Check, CreditCard, Search, ShoppingCart, BarChart3, PawPrint, Users } from 'lucide-react'
import { useState } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'

interface ProductDemoProps {
  isOpen: boolean
  onClose: () => void
  productType: 'padel' | 'kiosco' | 'veterinaria' | 'crm'
}

const ProductDemo = ({ isOpen, onClose, productType }: ProductDemoProps) => {
  const [activeTab, setActiveTab] = useState('calendar')
  const modalRef = useFocusTrap(isOpen)

  // Demo data for each product type
  const demoData = {
    padel: {
      title: 'Demo - Sistema Canchas de Pádel',
      tabs: [
        { id: 'calendar', label: 'Calendario', icon: Calendar },
        { id: 'bookings', label: 'Reservas', icon: Clock },
        { id: 'payments', label: 'Pagos', icon: CreditCard },
      ],
      content: {
        calendar: (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="text-primary-secondary font-medium pb-2">{day}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i + 1
                const hasBooking = [3, 5, 8, 12, 15, 19, 22, 26, 29].includes(day)
                return (
                  <div 
                    key={day} 
                    className={`p-2 rounded-lg text-sm ${
                      day > 30 ? 'opacity-30' : 
                      hasBooking ? 'bg-accent-cyan/20 text-accent-cyan' : 
                      'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {day <= 30 ? day : day - 30}
                    {hasBooking && <div className="w-1 h-1 rounded-full bg-accent-cyan mx-auto mt-1" />}
                  </div>
                )
              })}
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 text-accent-cyan">Turnos Disponibles - Hoy</h3>
              <div className="space-y-2">
                {['16:00 - Libre', '17:00 - Reservado', '18:00 - Libre', '19:00 - Reservado', '20:00 - Libre', '21:00 - Libre'].map((slot, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-sm">{slot}</span>
                    <button className="px-3 py-1 text-xs rounded-full bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 transition-colors">
                      {slot.includes('Libre') ? 'Reservar' : 'Ver detalle'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
        bookings: (
          <div className="space-y-3">
            {[
              { name: 'Juan Pérez', date: 'Hoy 18:00', court: 'Cancha 1', status: 'confirmed' },
              { name: 'María López', date: 'Hoy 20:00', court: 'Cancha 2', status: 'pending' },
              { name: 'Carlos Ruiz', date: 'Mañana 17:00', court: 'Cancha 1', status: 'confirmed' },
              { name: 'Ana García', date: 'Mañana 19:00', court: 'Cancha 3', status: 'confirmed' },
            ].map((booking, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta flex items-center justify-center">
                    <User size={18} className="text-primary-bg" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{booking.name}</p>
                    <p className="text-xs text-primary-secondary">{booking.date} • {booking.court}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {booking.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        ),
        payments: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 rounded-xl p-4">
                <p className="text-xs text-primary-secondary mb-1">Ingresos Hoy</p>
                <p className="text-2xl font-bold text-accent-cyan">$45.200</p>
              </div>
              <div className="bg-gradient-to-br from-accent-magenta/20 to-accent-magenta/5 rounded-xl p-4">
                <p className="text-xs text-primary-secondary mb-1">Pendiente Cobro</p>
                <p className="text-2xl font-bold text-accent-magenta">$12.800</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary-secondary">Últimos Pagos</h3>
              {[
                { name: 'Juan Pérez', amount: '$8.500', method: 'Mercado Pago', time: '18:05' },
                { name: 'María López', amount: '$6.200', method: 'Efectivo', time: '17:30' },
                { name: 'Carlos Ruiz', amount: '$10.000', method: 'Transferencia', time: '16:45' },
              ].map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check size={14} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{payment.name}</p>
                      <p className="text-xs text-primary-secondary">{payment.method} • {payment.time}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-accent-cyan">{payment.amount}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    },
    kiosco: {
      title: 'Demo - Sistema Kiosco',
      tabs: [
        { id: 'pos', label: 'Venta', icon: ShoppingCart },
        { id: 'stock', label: 'Stock', icon: Search },
        { id: 'reports', label: 'Reportes', icon: BarChart3 },
      ],
      content: {
        pos: (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Bebidas', 'Snacks', 'Almacén', 'Limpieza', 'Perfumería'].map(cat => (
                <button key={cat} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm whitespace-nowrap transition-colors">
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Coca-Cola', 'Papas Lays', 'Arroz 1kg', 'Leche', 'Pan molido', 'Detergente'].map(item => (
                <div key={item} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-center cursor-pointer transition-colors">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r from-accent-cyan/30 to-accent-magenta/30 flex items-center justify-center">
                    <ShoppingCart size={18} className="text-accent-cyan" />
                  </div>
                  <p className="text-xs font-medium">{item}</p>
                  <p className="text-[10px] text-primary-secondary">$1.200</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-xl font-bold text-accent-cyan">$7.200</span>
              </div>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg font-semibold hover:shadow-lg transition-all">
                Cobrar
              </button>
            </div>
          </div>
        ),
        stock: (
          <div className="space-y-3">
            {[
              { name: 'Coca-Cola 2L', stock: 24, min: 10, status: 'ok' },
              { name: 'Papas Lays', stock: 8, min: 15, status: 'low' },
              { name: 'Arroz Gallo 1kg', stock: 32, min: 20, status: 'ok' },
              { name: 'Leche La Serenísima', stock: 5, min: 12, status: 'low' },
              { name: 'Pan molido Bimbo', stock: 18, min: 10, status: 'ok' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-primary-secondary">Mínimo: {item.min}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${item.status === 'low' ? 'text-red-400' : 'text-green-400'}`}>
                    {item.stock} un.
                  </p>
                  {item.status === 'low' && (
                    <span className="text-[10px] text-red-400">⚠️ Bajo stock</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ),
        reports: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 rounded-xl p-4">
                <p className="text-xs text-primary-secondary mb-1">Ventas Hoy</p>
                <p className="text-2xl font-bold text-accent-cyan">$125.400</p>
              </div>
              <div className="bg-gradient-to-br from-accent-magenta/20 to-accent-magenta/5 rounded-xl p-4">
                <p className="text-xs text-primary-secondary mb-1">Ticket Promedio</p>
                <p className="text-2xl font-bold text-accent-magenta">$3.200</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">Productos Más Vendidos</h3>
              <div className="space-y-2">
                {[
                  { name: 'Coca-Cola 2L', sold: 45 },
                  { name: 'Papas Lays', sold: 32 },
                  { name: 'Leche', sold: 28 },
                ].map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm">{product.name}</span>
                    <span className="text-sm font-semibold text-accent-cyan">{product.sold} un.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
    },
    veterinaria: {
      title: 'Demo - Sistema Veterinaria',
      tabs: [
        { id: 'agenda', label: 'Agenda', icon: Calendar },
        { id: 'pets', label: 'Mascotas', icon: PawPrint },
        { id: 'vaccines', label: 'Vacunas', icon: Check },
      ],
      content: {
        agenda: (
          <div className="space-y-3">
            {[
              { pet: 'Firulais', owner: 'Juan Pérez', time: '10:00', type: 'Consulta general' },
              { pet: 'Michi', owner: 'María López', time: '11:30', type: 'Vacunación' },
              { pet: 'Rocky', owner: 'Carlos Ruiz', time: '15:00', type: 'Control' },
              { pet: 'Luna', owner: 'Ana García', time: '16:30', type: 'Baño y corte' },
            ].map((appointment, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-yellow/30 to-orange-500/30 flex items-center justify-center">
                  <PawPrint size={20} className="text-accent-yellow" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{appointment.pet}</p>
                  <p className="text-xs text-primary-secondary">{appointment.owner} • {appointment.type}</p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-accent-cyan/20 text-accent-cyan">
                  {appointment.time}
                </span>
              </div>
            ))}
          </div>
        ),
        pets: (
          <div className="space-y-3">
            {[
              { name: 'Firulais', type: 'Perro', owner: 'Juan Pérez', lastVisit: '15/01/2025' },
              { name: 'Michi', type: 'Gato', owner: 'María López', lastVisit: '10/01/2025' },
              { name: 'Rocky', type: 'Perro', owner: 'Carlos Ruiz', lastVisit: '08/01/2025' },
            ].map((pet, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-yellow/30 to-orange-500/30 flex items-center justify-center">
                    <PawPrint size={18} className="text-accent-yellow" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{pet.name}</p>
                    <p className="text-xs text-primary-secondary">{pet.type} • {pet.owner}</p>
                  </div>
                </div>
                <span className="text-xs text-primary-secondary">Última: {pet.lastVisit}</span>
              </div>
            ))}
          </div>
        ),
        vaccines: (
          <div className="space-y-3">
            {[
              { pet: 'Firulais', vaccine: 'Séxtuple', date: '15/01/2025', next: '15/07/2025' },
              { pet: 'Michi', vaccine: 'Triple Felina', date: '10/01/2025', next: '10/01/2026' },
              { pet: 'Rocky', vaccine: 'Antirrábica', date: '08/01/2025', next: '08/01/2026' },
            ].map((vaccine, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <p className="font-semibold text-sm">{vaccine.pet}</p>
                  <p className="text-xs text-primary-secondary">{vaccine.vaccine} • Aplicada: {vaccine.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary-secondary">Próxima</p>
                  <p className="text-sm font-semibold text-accent-cyan">{vaccine.next}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
    },
    crm: {
      title: 'Demo - CRM Simple',
      tabs: [
        { id: 'clients', label: 'Clientes', icon: Users },
        { id: 'sales', label: 'Ventas', icon: BarChart3 },
        { id: 'tasks', label: 'Tareas', icon: Check },
      ],
      content: {
        clients: (
          <div className="space-y-3">
            {[
              { name: 'Juan Pérez', email: 'juan@email.com', totalSpent: '$125.000', lastContact: 'Hoy' },
              { name: 'María López', email: 'maria@email.com', totalSpent: '$89.500', lastContact: 'Ayer' },
              { name: 'Carlos Ruiz', email: 'carlos@email.com', totalSpent: '$67.200', lastContact: 'Hace 3 días' },
              { name: 'Ana García', email: 'ana@email.com', totalSpent: '$45.800', lastContact: 'Hace 1 semana' },
            ].map((client, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400/30 to-accent-cyan/30 flex items-center justify-center">
                    <User size={18} className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{client.name}</p>
                    <p className="text-xs text-primary-secondary">{client.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent-cyan">{client.totalSpent}</p>
                  <p className="text-xs text-primary-secondary">{client.lastContact}</p>
                </div>
              </div>
            ))}
          </div>
        ),
        sales: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 rounded-xl p-4">
                <p className="text-xs text-primary-secondary mb-1">Ventas Mes</p>
                <p className="text-2xl font-bold text-accent-cyan">$327.500</p>
              </div>
              <div className="bg-gradient-to-br from-accent-magenta/20 to-accent-magenta/5 rounded-xl p-4">
                <p className="text-xs text-primary-secondary mb-1">Clientes Activos</p>
                <p className="text-2xl font-bold text-accent-magenta">48</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">Últimas Ventas</h3>
              {[
                { client: 'Juan Pérez', amount: '$15.000', product: 'Sistema Web' },
                { client: 'María López', amount: '$8.500', product: 'Landing Page' },
                { client: 'Carlos Ruiz', amount: '$12.000', product: 'E-commerce' },
              ].map((sale, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{sale.client}</p>
                    <p className="text-xs text-primary-secondary">{sale.product}</p>
                  </div>
                  <span className="font-semibold text-accent-cyan">{sale.amount}</span>
                </div>
              ))}
            </div>
          </div>
        ),
        tasks: (
          <div className="space-y-3">
            {[
              { task: 'Enviar propuesta a nuevo cliente', due: 'Hoy', priority: 'high' },
              { task: 'Seguimiento Juan Pérez', due: 'Mañana', priority: 'medium' },
              { task: 'Actualizar base de datos', due: 'Esta semana', priority: 'low' },
              { task: 'Reunión con María López', due: 'Próxima semana', priority: 'medium' },
            ].map((task, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  task.priority === 'high' ? 'border-red-400' :
                  task.priority === 'medium' ? 'border-yellow-400' : 'border-green-400'
                }`}>
                  <Check size={12} className="text-primary-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{task.task}</p>
                  <p className="text-xs text-primary-secondary">Vence: {task.due}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] rounded-full ${
                  task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
            ))}
          </div>
        ),
      },
    },
  }

  const currentDemo = demoData[productType]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-primary-bg to-primary-bg/95 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-primary-text">{currentDemo.title}</h2>
                  <p className="text-sm text-primary-secondary mt-1">Demo interactiva - Explorá las funcionalidades</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={20} className="text-primary-secondary" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 px-6">
                {currentDemo.tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-accent-cyan'
                          : 'text-primary-secondary hover:text-primary-text'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-magenta"
                          layoutId="activeTab"
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentDemo.content[activeTab as keyof typeof currentDemo.content]}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <p className="text-xs text-primary-secondary">
                  Esta es una demo interactiva. El sistema real incluye todas estas funcionalidades y más.
                </p>
                <a
                  href="#contact"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Solicitar este sistema
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