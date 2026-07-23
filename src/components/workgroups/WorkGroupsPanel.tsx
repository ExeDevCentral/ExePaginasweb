import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Mail, Phone, Trash2, UserPlus, ChevronDown, Search } from 'lucide-react'
import { useWorkGroups } from '../../hooks/useWorkGroups'
import { useWorkMembers } from '../../hooks/useWorkMembers'
import { useCreateWorkGroup, useDeleteWorkGroup } from '../../hooks/useWorkGroups'
import { useCreateWorkMember, useDeleteWorkMember } from '../../hooks/useWorkMembers'
import type { WorkGroup, WorkGroupWithMembers } from '../../core/domain/entities/WorkGroup'
import type { WorkMember, WorkMemberRol } from '../../core/domain/entities/WorkMember'
import { toast } from 'sonner'

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
  const { data: groups = [], isLoading: groupsLoading } = useWorkGroups(tenantId)
  const { data: members = [], isLoading: membersLoading } = useWorkMembers(tenantId)

  const createGroup = useCreateWorkGroup()
  const deleteGroup = useDeleteWorkGroup()
  const createMember = useCreateWorkMember()
  const deleteMember = useDeleteWorkMember()

  const [showNewGroup, setShowNewGroup] = useState(false)
  const [showNewMember, setShowNewMember] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const filteredMembers = members.filter(
    (m: WorkMember) =>
      m.nombre.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase())
  )

  const groupedMembers = groups.map((g: WorkGroup) => ({
    ...g,
    members: filteredMembers.filter((m: WorkMember) => m.work_group_id === g.id),
    member_count: filteredMembers.filter((m: WorkMember) => m.work_group_id === g.id).length,
  }))

  const unassigned = filteredMembers.filter((m: WorkMember) => !m.work_group_id)

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

  const handleDeleteGroup = async (group: WorkGroup) => {
    if (!confirm(`¿Eliminar el grupo "${group.nombre}"? Los miembros quedarán sin asignar.`)) return
    try {
      await deleteGroup.mutateAsync(group.id)
      toast.success('Grupo eliminado')
    } catch (e) {
      toast.error('Error', {
        description: e instanceof Error ? e.message : 'No se pudo eliminar',
      })
    }
  }

  const handleDeleteMember = async (member: WorkMember) => {
    if (!confirm(`¿Eliminar a ${member.nombre}?`)) return
    try {
      await deleteMember.mutateAsync(member.id)
      toast.success('Miembro eliminado')
    } catch (e) {
      toast.error('Error', {
        description: e instanceof Error ? e.message : 'No se pudo eliminar',
      })
    }
  }

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
            Grupos de Trabajo
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {members.length} miembros en {groups.length} grupos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewMember(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invitar
          </button>
          <button
            onClick={() => setShowNewGroup(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-cyan text-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nuevo Grupo
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar miembros..."
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
        />
      </div>

      {/* New Group Form */}
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
      </AnimatePresence>

      {/* New Member Form */}
      <AnimatePresence>
        {showNewMember && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <NewMemberForm
              tenantId={tenantId}
              groups={groups}
              onSubmit={async (data) => {
                await createMember.mutateAsync(data)
                setShowNewMember(false)
                toast.success('Miembro invitado', {
                  description: `${data.nombre} fue agregado al equipo`,
                })
              }}
              onCancel={() => setShowNewMember(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Groups */}
      <div className="space-y-4">
        {groupedMembers.map((group: WorkGroupWithMembers) => (
          <motion.div
            key={group.id}
            layout
            className="rounded-2xl border border-border bg-card/50 overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                <div>
                  <h3 className="text-sm font-bold text-foreground">{group.nombre}</h3>
                  {group.descripcion && (
                    <p className="text-xs text-muted-foreground">{group.descripcion}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {group.members.length} miembros
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteGroup(group)
                  }}
                  className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    selectedGroup === group.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            <AnimatePresence>
              {selectedGroup === group.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 space-y-2">
                    {group.members.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        Sin miembros asignados. Arrastrá miembros aquí o asignalos desde "Sin
                        grupo".
                      </p>
                    ) : (
                      group.members.map((member: WorkMember) => (
                        <MemberRow
                          key={member.id}
                          member={member}
                          onDelete={() => handleDeleteMember(member)}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Unassigned */}
        {unassigned.length > 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4">
            <h3 className="text-sm font-bold text-muted-foreground mb-3">
              Sin grupo asignado ({unassigned.length})
            </h3>
            <div className="space-y-2">
              {unassigned.map((member: WorkMember) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onDelete={() => handleDeleteMember(member)}
                />
              ))}
            </div>
          </div>
        )}

        {groups.length === 0 && members.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground">Armá tu equipo</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Creá grupos de trabajo (ej: Soporte, Desarrollo, Ventas) y agregá miembros para
              gestionar quién atiende qué.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function MemberRow({ member, onDelete }: { member: WorkMember; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-xs font-bold text-accent-cyan">
          {member.nombre.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{member.nombre}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            {member.email}
            {member.telefono && (
              <>
                <span>·</span>
                <Phone className="w-3 h-3" />
                {member.telefono}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${ROL_COLORS[member.rol]}`}
        >
          {ROL_LABELS[member.rol]}
        </span>
        <button
          onClick={onDelete}
          className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
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
