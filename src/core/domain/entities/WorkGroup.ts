import { WorkMember } from './WorkMember'

export interface WorkGroup {
  id: string
  tenant_id: string
  nombre: string
  descripcion: string | null
  color: string
  icono: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface WorkGroupWithMembers extends WorkGroup {
  members: WorkMember[]
  member_count: number
}
