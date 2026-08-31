import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseInvoiceRepository } from '../core/infra/repositories/SupabaseInvoiceRepository'
import { queryKeys } from '../core/infra/query/queryKeys'
import { isValidUUID } from '../core/utils/uuid'

const repo = new SupabaseInvoiceRepository()

export function useInvoicesByTenant(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.invoices.byTenant(tenantId),
    queryFn: () => (isValidUUID(tenantId) ? repo.listByTenantId(tenantId!) : Promise.resolve([])),
    enabled: enabled && !!tenantId && isValidUUID(tenantId),
    staleTime: 2 * 60 * 1000,
  })
}

export function useInvoicesByCliente(clienteId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['invoices', 'cliente', clienteId],
    queryFn: () =>
      isValidUUID(clienteId) ? repo.listByClienteId(clienteId!) : Promise.resolve([]),
    enabled: enabled && !!clienteId && isValidUUID(clienteId),
    staleTime: 2 * 60 * 1000,
  })
}

export function useInvoice(id: string | null, enabled = true) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => (isValidUUID(id) ? repo.getById(id!) : Promise.resolve(null)),
    enabled: enabled && !!id && isValidUUID(id),
  })
}

export function useMarkInvoicePaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, pagoId }: { id: string; pagoId: string }) => repo.markAsPaid(id, pagoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.invoices.all })
    },
  })
}
