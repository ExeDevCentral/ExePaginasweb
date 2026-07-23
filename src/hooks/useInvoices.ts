import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseInvoiceRepository } from '../core/infra/repositories/SupabaseInvoiceRepository'

const repo = new SupabaseInvoiceRepository()

export function useInvoicesByTenant(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['invoices', 'tenant', tenantId],
    queryFn: () => repo.listByTenantId(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useInvoicesByCliente(clienteId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['invoices', 'cliente', clienteId],
    queryFn: () => repo.listByClienteId(clienteId!),
    enabled: enabled && !!clienteId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useInvoice(id: string | null, enabled = true) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => repo.getById(id!),
    enabled: enabled && !!id,
  })
}

export function useMarkInvoicePaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, pagoId }: { id: string; pagoId: string }) => repo.markAsPaid(id, pagoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}
