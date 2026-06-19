import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User as UserIcon, Mail, Trash2 } from 'lucide-react'
import { SupabaseUserRepository } from '../../core/infra/repositories/SupabaseUserRepository'
import { User as UserEntity } from '../../core/domain/entities/User'

const userRepository = new SupabaseUserRepository()

const UserManagement = () => {
  const [users, setUsers] = useState<UserEntity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await userRepository.getAll()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-primary-bg/60 backdrop-blur-md border border-accent-cyan/20 rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-montserrat font-black text-white">
            Gestión de <span className="text-accent-cyan">Usuarios</span>
          </h2>
          <p className="text-primary-secondary text-sm">Control central de accesos y roles</p>
        </div>
        <div className="bg-accent-cyan/10 px-4 py-2 rounded-full border border-accent-cyan/30 text-accent-cyan text-xs font-bold uppercase tracking-widest">
          {users.length} Usuarios Activos
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-primary-secondary text-xs uppercase tracking-tighter">
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Fecha Registro</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 animate-pulse text-accent-cyan">
                  Cargando base de datos...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <td className="px-4 py-4 rounded-l-2xl border-l border-y border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-magenta rounded-full flex items-center justify-center text-primary-bg font-bold">
                        {user.fullName?.charAt(0) || <UserIcon size={18} />}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {user.fullName || 'Sin nombre'}
                        </p>
                        <p className="text-primary-secondary text-xs flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-y border-white/5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin'
                          ? 'bg-accent-magenta/20 text-accent-magenta border border-accent-magenta/30'
                          : 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-y border-white/5 text-primary-secondary text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 rounded-r-2xl border-r border-y border-white/5 text-right">
                    <button
                      className="p-2 text-primary-secondary hover:text-accent-magenta transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
