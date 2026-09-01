'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Mail, Phone, Trash2, UserPlus } from 'lucide-react'
import { useWorkGroups, useCreateWorkGroup } from '../../hooks/useWorkGroups'
import {
  useWorkMembers,
  useCreateWorkMember,
  useDeleteWorkMember,
} from '../../hooks/useWorkMembers'
import type { WorkGroup } from '../../core/domain/entities/WorkGroup'
import type { WorkMember, WorkMemberRol } from '../../core/domain/entities/WorkMember'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DataTable } from '../shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

const ROL_COLORS: Record<WorkMemberRol, string> = {
  owner: 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold',
  admin: 'bg-[#4361EE]/10 text-[#38BDF8] border-[#4361EE]/20 font-bold',
  member: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold',
  viewer: 'bg-slate-500/10 text-slate-400 border-slate-500/20 font-bold',
}

interface Props {
  tenantId: string
}

export default function WorkGroupsPanel({ tenantId }: Readonly<Props>) {
  const { t } = useTranslation()
  const { data: groups = [], isLoading: groupsLoading } = useWorkGroups(tenantId)
  const { data: dbMembers = [], isLoading: membersLoading } = useWorkMembers(tenantId)

  const createGroup = useCreateWorkGroup()
  const createMember = useCreateWorkMember()
  const deleteMember = useDeleteWorkMember()

  const [showNewGroup, setShowNewGroup] = useState(false)
  const [showNewMember, setShowNewMember] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')

  const defaultMembers: WorkMember[] = useMemo(
    () => [
      {
        id: 'member-owner',
        tenant_id: tenantId,
        user_id: null,
        work_group_id: null,
        nombre: 'Administrador Principal (Propietario)',
        email: 'admin@exepaginasweb.com',
        telefono: '+54 9 341 687-4786',
        rol: 'owner',
        avatar_url: null,
        activo: true,
        ultimaconexion_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'member-support',
        tenant_id: tenantId,
        user_id: null,
        work_group_id: null,
        nombre: 'Equipo de Soporte & Mantenimiento ExeSistemasWEB',
        email: 'soporte@exepaginasweb.com',
        telefono: null,
        rol: 'admin',
        avatar_url: null,
        activo: true,
        ultimaconexion_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'member-bot',
        tenant_id: tenantId,
        user_id: null,
        work_group_id: null,
        nombre: 'Sistema Automatizado de Reservas & Citas',
        email: 'sistema@exepaginasweb.com',
        telefono: null,
        rol: 'member',
        avatar_url: null,
        activo: true,
        ultimaconexion_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    [tenantId]
  )

  const members = dbMembers.length > 0 ? dbMembers : defaultMembers

  const rolLabels = useMemo<Record<WorkMemberRol, string>>(
    () => ({
      owner: t('workgroups.rol_owner', 'Propietario'),
      admin: t('workgroups.rol_admin', 'Administrador'),
      member: t('workgroups.rol_member', 'Miembro / Operador'),
      viewer: t('workgroups.rol_viewer', 'Observador'),
    }),
    [t]
  )

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return
    try {
      await createGroup.mutateAsync({
        tenant_id: tenantId,
        nombre: newGroupName.trim(),
        descripcion: newGroupDesc.trim() || null,
        color: '#4361EE',
        icono: 'users',
        activo: true,
      })
      setNewGroupName('')
      setNewGroupDesc('')
      setShowNewGroup(false)
      toast.success(t('workgroups.grupo_creado', 'Grupo creado'), {
        description: `"${newGroupName}" fue creado correctamente`,
      })
    } catch (e) {
      toast.error(t('common.error', 'Error'), {
        description: e instanceof Error ? e.message : 'No se pudo crear el grupo',
      })
    }
  }

  const handleDeleteMember = useCallback(
    async (member: WorkMember) => {
      if (!confirm(`¿Eliminar a ${member.nombre}?`)) return
      try {
        await deleteMember.mutateAsync(member.id)
        toast.success(t('workgroups.miembro_eliminado', 'Miembro eliminado'))
      } catch (e) {
        toast.error(t('common.error', 'Error'), {
          description: e instanceof Error ? e.message : 'No se pudo eliminar',
        })
      }
    },
    [deleteMember, t]
  )

  const columns = useMemo<ColumnDef<WorkMember, unknown>[]>(
    () => [
      {
        accessorKey: 'nombre',
        header: t('workgroups.col_miembro', 'Miembro / Personal'),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4361EE] to-[#38BDF8] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
              {row.original.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">{row.original.nombre}</p>
              {row.original.telefono && (
                <p className="text-[11px] text-[#8C9BB0] flex items-center gap-1 font-mono mt-0.5">
                  <Phone className="w-3 h-3 text-[#38BDF8]" />
                  {row.original.telefono}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: t('workgroups.col_email', 'Email de Contacto'),
        cell: ({ row }) => (
          <span className="text-xs text-[#8C9BB0] font-mono flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#64748B]" />
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: 'rol',
        header: t('workgroups.col_rol', 'Nivel de Acceso'),
        cell: ({ row }) => (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
              ROL_COLORS[row.original.rol]
            }`}
          >
            ● {rolLabels[row.original.rol]}
          </span>
        ),
      },
      {
        accessorKey: 'work_group_id',
        header: t('workgroups.col_grupo', 'Sede / Área'),
        cell: ({ row }) => {
          const grp = groups.find((g) => g.id === row.original.work_group_id)
          return (
            <span className="text-xs font-medium text-slate-300">
              {grp ? grp.nombre : 'Sede Principal'}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: t('workgroups.col_acciones', 'Acciones'),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleDeleteMember(row.original)}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-[#64748B] hover:text-rose-400 transition-colors"
            title={t('workgroups.eliminar_miembro', 'Eliminar miembro')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ),
      },
    ],
    [groups, handleDeleteMember, t, rolLabels]
  )

  if (groupsLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('workgroups.titulo', 'Equipo de Trabajo & Sedes')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            Personal autorizado para administrar turnos, atención de clientes y canales de soporte.
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowNewMember((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1E2638] bg-[#151B28] hover:bg-[#1C2438] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#38BDF8]" />
            <span>Invitar Miembro</span>
          </button>
          <button
            type="button"
            onClick={() => setShowNewGroup((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Sede / Grupo</span>
          </button>
        </div>
      </div>

      {/* Forms */}
      <AnimatePresence>
        {showNewGroup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[#1E2638] bg-[#151B28] p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#38BDF8]" />
                <span>Crear Nueva Sede o Área de Trabajo</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre de la sede (ej. Sede Centro, Consultorios Norte)"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-[#1E2638] bg-[#111622] text-xs text-white placeholder:text-[#64748B] focus:border-[#4361EE] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Descripción opcional"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-[#1E2638] bg-[#111622] text-xs text-white placeholder:text-[#64748B] focus:border-[#4361EE] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewGroup(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#8C9BB0] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || createGroup.isPending}
                  className="px-4 py-2 rounded-xl bg-[#4361EE] text-white text-xs font-semibold disabled:opacity-50"
                >
                  Guardar Sede
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showNewMember && (
          <NewMemberForm
            tenantId={tenantId}
            groups={groups}
            onSubmit={async (data) => {
              try {
                await createMember.mutateAsync(data)
                setShowNewMember(false)
                toast.success('Miembro invitado correctamente')
              } catch {
                toast.error('No se pudo invitar al miembro')
              }
            }}
            onCancel={() => setShowNewMember(false)}
          />
        )}
      </AnimatePresence>

      {/* Members DataTable */}
      <DataTable
        columns={columns}
        data={members}
        searchPlaceholder="Buscar miembros por nombre o email..."
        pageSize={5}
        emptyMessage="No se encontraron miembros coincidentes."
      />
    </div>
  )
}

function NewMemberForm({
  tenantId,
  groups,
  onSubmit,
  onCancel,
}: Readonly<{
  tenantId: string
  groups: WorkGroup[]
  onSubmit: (data: Omit<WorkMember, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}>) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [rol, setRol] = useState<WorkMemberRol>('member')
  const [groupId, setGroupId] = useState<string>('')

  const handleSubmit = async () => {
    if (!nombre.trim() || !email.trim()) return
    await onSubmit({
      tenant_id: tenantId,
      work_group_id: groupId || null,
      user_id: null,
      email: email.trim(),
      nombre: nombre.trim(),
      telefono: telefono.trim() || null,
      rol,
      avatar_url: null,
      activo: true,
      ultimaconexion_at: null,
    })
  }

  return (
    <div className="rounded-2xl border border-[#1E2638] bg-[#151B28] p-5 space-y-4 shadow-sm">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-[#38BDF8]" />
        <span>Invitar Nuevo Miembro o Empleado</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Nombre y Apellido"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-[#1E2638] bg-[#111622] text-xs text-white placeholder:text-[#64748B] focus:border-[#4361EE] focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email de acceso"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-[#1E2638] bg-[#111622] text-xs text-white placeholder:text-[#64748B] focus:border-[#4361EE] focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Teléfono / WhatsApp"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-[#1E2638] bg-[#111622] text-xs text-white placeholder:text-[#64748B] focus:border-[#4361EE] focus:outline-none"
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value as WorkMemberRol)}
          className="px-3.5 py-2 rounded-xl border border-[#1E2638] bg-[#111622] text-xs text-white focus:border-[#4361EE] focus:outline-none"
        >
          <option value="member">Miembro / Operador de Turnos</option>
          <option value="admin">Administrador de Sede</option>
          <option value="viewer">Observador (Solo Lectura)</option>
        </select>
        {groups.length > 0 && (
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#1E2638] bg-[#111622] text-xs text-white focus:border-[#4361EE] focus:outline-none sm:col-span-2"
          >
            <option value="">Sede Principal (Por Defecto)</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-xs text-[#8C9BB0] hover:text-white"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!nombre.trim() || !email.trim()}
          className="px-4 py-2 rounded-xl bg-[#4361EE] text-white text-xs font-semibold disabled:opacity-50"
        >
          Enviar Invitación
        </button>
      </div>
    </div>
  )
}
