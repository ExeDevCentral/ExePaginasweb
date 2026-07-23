import { ServiceCatalog } from '../entities/ServiceCatalog'

export interface IServiceCatalogRepository {
  listActive(): Promise<ServiceCatalog[]>
  listAll(): Promise<ServiceCatalog[]>
  getBySlug(slug: string): Promise<ServiceCatalog | null>
  getById(id: string): Promise<ServiceCatalog | null>
  create(data: Omit<ServiceCatalog, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceCatalog>
  update(id: string, data: Partial<ServiceCatalog>): Promise<ServiceCatalog>
  delete(id: string): Promise<void>
}
