export type WorkMemberRol = 'owner' | 'admin' | 'member' | 'viewer'

export interface WorkMember {
  id: string
  tenant_id: string
  work_group_id: string | null
  user_id: string | null
  email: string
  nombre: string
  telefono: string | null
  rol: WorkMemberRol
  avatar_url: string | null
  activo: boolean
  ultimaconexion_at: string | null
  created_at: string
  updated_at: string
}

export interface WorkMemberWithGroup extends WorkMember {
  work_group?: {
    id: string
    nombre: string
    color: string
  } | null
}
