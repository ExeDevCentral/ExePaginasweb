/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { z } from 'zod'

export const AiUserContextSchema = z.object({
  userId: z.string().uuid().nullable(),
  email: z.string().email().nullable(),
  role: z.enum(['anonymous', 'customer', 'staff', 'manager', 'admin']),
  clienteId: z.string().uuid().nullable(),
  tenantId: z.string().uuid().nullable(),
})

export const ToolCallConfirmationSchema = z.object({
  confirmed: z.boolean(),
  runId: z.string().min(1),
  toolCallId: z.string().min(1),
})

export const ToolCallRejectionSchema = z.object({
  confirmed: z.literal(false),
  runId: z.string().min(1),
  toolCallId: z.string().min(1),
  reason: z.string().max(500).nullish(),
})

export const AiChatRequestBodySchema = z.object({
  messages: z.array(
    z
      .object({
        id: z.string().min(1),
        role: z.string().min(1),
        content: z.string().optional(),
        parts: z.array(z.object({ type: z.string().min(1) }).passthrough()).optional(),
      })
      .refine((msg) => msg.content !== undefined || msg.parts !== undefined, {
        message: 'cada mensaje debe incluir content o parts',
      })
  ),
  id: z.string().nullish(),
})

export const StructuredIntentSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('greeting'),
    language: z.enum(['es', 'en']),
  }),
  z.object({
    intent: z.literal('quote_request'),
    language: z.enum(['es', 'en']),
    projectType: z.string().max(200).nullish(),
    email: z.string().email().nullish(),
  }),
  z.object({
    intent: z.literal('get_services'),
    language: z.enum(['es', 'en']),
  }),
  z.object({
    intent: z.literal('get_availability'),
    language: z.enum(['es', 'en']),
    businessName: z.string().max(200).nullish(),
    date: z.string().max(50).nullish(),
  }),
  z.object({
    intent: z.literal('create_reservation'),
    language: z.enum(['es', 'en']),
    businessName: z.string().max(200).nullish(),
    serviceName: z.string().max(200).nullish(),
    date: z.string().max(50).nullish(),
    time: z.string().max(50).nullish(),
  }),
  z.object({
    intent: z.literal('get_ticket_status'),
    language: z.enum(['es', 'en']),
    ticketId: z.string().max(100).nullish(),
  }),
  z.object({
    intent: z.literal('human_handoff'),
    language: z.enum(['es', 'en']),
  }),
  z.object({
    intent: z.literal('out_of_scope'),
    language: z.enum(['es', 'en']),
  }),
])

export type StructuredIntent = z.infer<typeof StructuredIntentSchema>

export const AiToolInputSchemas = {
  getServices: z.object({
    activeOnly: z.boolean().default(true),
  }),

  getPlans: z.object({}),

  getAvailability: z.object({
    businessSlug: z.string().max(100).nullish(),
    date: z.string().max(50).nullish(),
  }),

  createReservation: z.object({
    businessSlug: z.string().min(1).max(100),
    serviceSlug: z.string().min(1).max(100),
    employeeName: z.string().max(200).nullish(),
    date: z.string().min(1).max(50),
    time: z.string().min(1).max(50),
    clienteNombre: z.string().max(200).nullish(),
    clienteEmail: z.string().email().max(255).nullish(),
    clienteTelefono: z.string().max(100).nullish(),
  }),

  createTicket: z.object({
    contactEmail: z.string().email().max(255).nullish(),
    projectType: z.string().max(200).nullish(),
  }),

  getClientStatus: z.object({}),

  getInvoices: z.object({
    limit: z.number().int().min(1).max(50).default(10),
  }),

  getOrders: z.object({
    limit: z.number().int().min(1).max(50).default(10),
  }),
} as const

export type AiToolName = keyof typeof AiToolInputSchemas
