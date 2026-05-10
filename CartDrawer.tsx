import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../../types/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartDrawer = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartDrawerProps) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const phoneNumber = "5493416874786"; // Tu número configurado
    const itemText = items.map(i => `- ${i.name} (x${i.quantity}): $${i.price * i.quantity}`).join('\n');
    const message = `¡Hola ExeSistemasWEB! 👋\n\nMe interesa contratar los siguientes servicios:\n${itemText}\n\n*Total estimado: $${total}*\n\n¿Podemos coordinar una reunión para empezar?`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay / Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0A0A0B] border-l border-white/10 shadow-2xl z-[160] flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-accent-cyan" size={24} />
                <h2 className="text-xl font-black text-white font-montserrat tracking-tight">MI CARRITO</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="text-white" size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={40} className="text-gray-600" />
                  </div>
                  <p className="text-gray-400 font-medium">Tu carrito está vacío</p>
                  <button onClick={onClose} className="mt-4 text-accent-cyan font-bold hover:underline">
                    Explorar planes
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">{item.name}</h3>
                      <p className="text-accent-cyan font-black mb-3">${item.price}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/20">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 px-2 hover:bg-white/10 text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm text-white font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 px-2 hover:bg-white/10 text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-white">${total}</span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,255,0.2)]"
                >
                  FINALIZAR POR WHATSAPP
                </motion.button>
                
                <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
                  Pagos seguros mediante transferencia o tarjeta
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};