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

const ROL_LABELS: Record<WorkMemberRol, string> = {
  owner: 'Propietario',
  admin: 'Administrador',
  member: 'Miembro',
  viewer: 'Observador',
}

const ROL_COLORS: Record<WorkMemberRol, string> = {
  owner: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  member: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

interface Props {
  tenantId: string
}

export default function WorkGroupsPanel({ tenantId }: Props) {
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
      toast.success('Grupo creado', {
        description: `"${newGroupName}" fue creado correctamente`,
      })
    } catch (e) {
      toast.error('Error', {
        description: e instanceof Error ? e.message : 'No se pudo crear el grupo',
      })
    }
  }

  const handleDeleteMember = useCallback(
    async (member: WorkMember) => {
      if (!confirm(`¿Eliminar a ${member.nombre}?`)) return
      try {
        await deleteMember.mutateAsync(member.id)
        toast.success('Miembro eliminado')
      } catch (e) {
        toast.error('Error', {
          description: e instanceof Error ? e.message : 'No se pudo eliminar',
        })
      }
    },
    [deleteMember]
  )

  const columns = useMemo<ColumnDef<WorkMember, any>[]>(
    () => [
      {
        accessorKey: 'nombre',
        header: 'Miembro',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-xs font-bold text-accent-cyan">
              {row.original.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{row.original.nombre}</p>
              {row.original.telefono && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {row.original.telefono}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: 'rol',
        header: 'Rol',
        cell: ({ row }) => (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              ROL_COLORS[row.original.rol]
            }`}
          >
            {ROL_LABELS[row.original.rol]}
          </span>
        ),
      },
      {
        accessorKey: 'work_group_id',
        header: 'Grupo',
        cell: ({ row }) => {
          const grp = groups.find((g) => g.id === row.original.work_group_id)
          return (
            <span className="text-xs font-medium text-muted-foreground">
              {grp ? grp.nombre : 'Sin grupo'}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <button
            onClick={() => handleDeleteMember(row.original)}
            className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-red-400 transition-colors"
            title="Eliminar miembro"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ),
      },
    ],
    [groups, handleDeleteMember]
  )

  if (groupsLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-accent-cyan" />
            {t('workgroups.titulo')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {members.length} miembros en {groups.length} grupos de trabajo
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewMember((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invitar
          </button>
          <button
            onClick={() => setShowNewGroup((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-cyan text-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nuevo Grupo
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
            <div className="rounded-2xl border border-accent-cyan/30 bg-accent-cyan/5 p-4 space-y-3">
              <h3 className="text-sm font-bold text-accent-cyan">Nuevo Grupo de Trabajo</h3>
              <input
                type="text"
                placeholder="Nombre del grupo (ej: Soporte, Desarrollo)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm"
                autoFocus
              />
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowNewGroup(false)}
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || createGroup.isPending}
                  className="px-4 py-1.5 rounded-lg bg-accent-cyan text-foreground text-sm font-bold disabled:opacity-50"
                >
                  {createGroup.isPending ? 'Creando...' : 'Crear'}
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
                toast.success('Miembro invitado')
              } catch {
                toast.error('Error al invitar')
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
          searchPlaceholder="Buscar miembros por nombre o email..."
          pageSize={5}
          emptyMessage="No se encontraron miembros coincidentes."
        />
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl p-6">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">Armá tu equipo</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Creá grupos de trabajo e invitá miembros para gestionar solicitudes.
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
}: {
  tenantId: string
  groups: WorkGroup[]
  onSubmit: (data: Omit<WorkMember, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}) {
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
    <div className="rounded-2xl border border-accent-cyan/30 bg-accent-cyan/5 p-4 space-y-3">
      <h3 className="text-sm font-bold text-accent-cyan flex items-center gap-2">
        <UserPlus className="w-4 h-4" />
        Invitar Miembro
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm"
          autoFocus
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm"
        />
        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm"
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value as WorkMemberRol)}
          className="px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm"
        >
          <option value="member">Miembro</option>
          <option value="admin">Administrador</option>
          <option value="viewer">Observador</option>
        </select>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm sm:col-span-2"
        >
          <option value="">Sin grupo asignado</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!nombre.trim() || !email.trim()}
          className="px-4 py-1.5 rounded-lg bg-accent-cyan text-foreground text-sm font-bold disabled:opacity-50"
        >
          Invitar
        </button>
      </div>
    </div>
  )
}
