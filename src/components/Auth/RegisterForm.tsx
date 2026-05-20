import React, { useState } from 'react';
import { supabase } from '../../core/auth/supabaseClient';
import { SupabaseUserRepository } from '../../infra/repositories/SupabaseUserRepository';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const userRepository = new SupabaseUserRepository();

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        await userRepository.createProfile({
          id: data.user.id,
          email: data.user.email!,
          fullName,
          role: 'customer',
          createdAt: new Date().toISOString(),
        });
      }
      alert('Registro exitoso. Revisa tu email para confirmar tu cuenta.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-primary-bg/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
    >
      <h2 className="text-3xl font-montserrat font-black text-white mb-6">Crear <span className="text-accent-cyan">Cuenta</span></h2>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-secondary" size={18} />
          <input
            type="text"
            placeholder="Nombre Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-accent-cyan outline-none transition-all placeholder:text-white/20"
            required
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-secondary" size={18} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-accent-cyan outline-none transition-all placeholder:text-white/20"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-secondary" size={18} />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-accent-cyan outline-none transition-all placeholder:text-white/20"
            required
          />
        </div>

        {error && <p className="text-accent-magenta text-xs font-bold bg-accent-magenta/10 p-3 rounded-lg border border-accent-magenta/20">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent-cyan to-accent-magenta py-4 rounded-2xl font-bold text-primary-bg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Registrarse'}
        </button>
      </form>
    </motion.div>
  );
};