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
  owner: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 font-bold',
  admin: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 font-bold',
  member: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30 font-bold',
  viewer: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30 font-bold',
}

interface Props {
  tenantId: string
}

export default function WorkGroupsPanel({ tenantId }: Readonly<Props>) {
  const { t } = useTranslation()
  const { data: groups = [], isLoading: groupsLoading } = useWorkGroups(tenantId)
  const { data: members = [], isLoading: membersLoading } = useWorkMembers(tenantId)

  const createGroup = useCreateWorkGroup()
  const createMember = useCreateWorkMember()
  const deleteMember = useDeleteWorkMember()

  const [showNewGroup, setShowNewGroup] = useState(false)
  const [showNewMember, setShowNewMember] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')

  const rolLabels = useMemo<Record<WorkMemberRol, string>>(
    () => ({
      owner: t('workgroups.rol_owner', 'Propietario'),
      admin: t('workgroups.rol_admin', 'Administrador'),
      member: t('workgroups.rol_member', 'Miembro'),
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
        color: '#6366f1',
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
        header: t('workgroups.col_miembro', 'Miembro'),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xs font-black text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm">
              {row.original.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {row.original.nombre}
              </p>
              {row.original.telefono && (
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {row.original.telefono}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: t('workgroups.col_email', 'Email'),
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1.5 font-medium">
            <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: 'rol',
        header: t('workgroups.col_rol', 'Rol'),
        cell: ({ row }) => (
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              ROL_COLORS[row.original.rol]
            }`}
          >
            {rolLabels[row.original.rol]}
          </span>
        ),
      },
      {
        accessorKey: 'work_group_id',
        header: t('workgroups.col_grupo', 'Grupo'),
        cell: ({ row }) => {
          const grp = groups.find((g) => g.id === row.original.work_group_id)
          return (
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {grp ? grp.nombre : t('workgroups.sin_grupo', 'Sin grupo')}
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
            className="p-1.5 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
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
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            {t('workgroups.titulo', 'Grupos de Trabajo')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            {members.length} {t('workgroups.miembros_en', 'miembros en')} {groups.length}{' '}
            {t('workgroups.grupos_trabajo', 'grupos de trabajo')}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowNewMember((prev) => !prev)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-300/80 dark:border-white/15 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{t('workgroups.invitar', 'Invitar')}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowNewGroup((prev) => !prev)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs sm:text-sm font-black hover:opacity-90 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{t('workgroups.nuevo_grupo', 'Nuevo Grupo')}</span>
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
            <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/5 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-cyan-700 dark:text-cyan-300">
                {t('workgroups.nuevo_grupo_titulo', 'Nuevo Grupo de Trabajo')}
              </h3>
              <input
                type="text"
                placeholder={t(
                  'workgroups.nombre_grupo_placeholder',
                  'Nombre del grupo (ej: Soporte, Desarrollo)'
                )}
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
                autoFocus
              />
              <input
                type="text"
                placeholder={t('workgroups.descripcion_opcional', 'Descripción (opcional)')}
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewGroup(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {t('common.cancelar', 'Cancelar')}
                </button>
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || createGroup.isPending}
                  className="px-5 py-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-sm font-black disabled:opacity-50 shadow-sm"
                >
                  {createGroup.isPending
                    ? t('common.creando', 'Creando...')
                    : t('common.crear', 'Crear')}
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
                toast.success(t('workgroups.miembro_invitado', 'Miembro invitado'))
              } catch {
                toast.error(t('workgroups.error_invitar', 'Error al invitar'))
              }
            }}
            onCancel={() => setShowNewMember(false)}
          />
        )}
      </AnimatePresence>

      {/* Members DataTable */}
      {members.length > 0 ? (
        <DataTable
          columns={columns}
          data={members}
          searchPlaceholder={t(
            'workgroups.buscar_miembros',
            'Buscar miembros por nombre o email...'
          )}
          pageSize={5}
          emptyMessage={t('workgroups.sin_miembros', 'No se encontraron miembros coincidentes.')}
        />
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-white/15 bg-white/90 dark:bg-slate-950/80 rounded-3xl p-8 shadow-sm">
          <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {t('workgroups.arma_equipo', 'Armá tu equipo')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto font-medium">
            {t(
              'workgroups.arma_equipo_desc',
              'Creá grupos de trabajo e invitá miembros para gestionar solicitudes.'
            )}
          </p>
        </div>
      )}
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
  const { t } = useTranslation()
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
    <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/5 p-6 space-y-4 shadow-sm">
      <h3 className="text-base font-black text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        <span>{t('workgroups.invitar_miembro', 'Invitar Miembro')}</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <input
          type="text"
          placeholder={t('workgroups.nombre_completo', 'Nombre completo')}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
          autoFocus
        />
        <input
          type="email"
          placeholder={t('workgroups.email_placeholder', 'Email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
        />
        <input
          type="tel"
          placeholder={t('workgroups.telefono_opcional', 'Teléfono (opcional)')}
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value as WorkMemberRol)}
          className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
        >
          <option value="member">{t('workgroups.rol_member', 'Miembro')}</option>
          <option value="admin">{t('workgroups.rol_admin', 'Administrador')}</option>
          <option value="viewer">{t('workgroups.rol_viewer', 'Observador')}</option>
        </select>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm sm:col-span-2"
        >
          <option value="">{t('workgroups.sin_grupo_asignado', 'Sin grupo asignado')}</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          {t('common.cancelar', 'Cancelar')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!nombre.trim() || !email.trim()}
          className="px-5 py-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-sm font-black disabled:opacity-50 shadow-sm"
        >
          {t('workgroups.invitar', 'Invitar')}
        </button>
      </div>
    </div>
  )
}
