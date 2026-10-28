/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Wallet, Mail, Loader2, LogIn, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import { Copy as CopyData, Check as CheckData } from 'lucide'
import { useAuthSession } from '../../core/auth/AuthSessionProvider'
import HudButton from '../HudButton'

interface TransferInstructionsProps {
  planSlug: string
  planTitle: string
  planPrice: string
  projectType: string
}

export default function TransferInstructions({
  planSlug,
  planTitle,
  planPrice,
  projectType,
}: TransferInstructionsProps) {
  const router = useRouter()
  const { session } = useAuthSession()
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState('')
  const [idempotencyKey] = useState(() => crypto.randomUUID())

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email)
  }, [session])

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('Exeq90')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenWhatsApp = () => {
    const message = `¡Hola%20Exequiel!%20Acabo%20de%20realizar%20la%20transferencia%20para%20el%20plan%20*${encodeURIComponent(planTitle)}*%20(${encodeURIComponent(planPrice)}%20ARS/mes)%20del%20proyecto%20*${encodeURIComponent(projectType)}*.%20Aquí%20tienes%20el%20comprobante.`
    window.open(`https://wa.me/5493416874786?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  const handleLoginRedirect = () => {
    const targetEmail = email.trim()
    const redirectUrl = '/dashboard?tab=invoices'
    const loginPath = targetEmail
      ? `/login?email=${encodeURIComponent(targetEmail)}&redirectTo=${encodeURIComponent(redirectUrl)}`
      : `/login?redirectTo=${encodeURIComponent(redirectUrl)}`
    router.push(loginPath)
  }

  const handleSubscribe = async () => {
    if (!session?.access_token || !session.user.email) {
      handleLoginRedirect()
      return
    }

    setError('')
    setRegistering(true)
    try {
      const resp = await fetch('/api/register-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          email: session.user.email,
          fullName: session?.user?.user_metadata?.full_name ?? null,
          planSlug,
          planNombre: planTitle,
          tipoProyecto: projectType,
        }),
      })
      const data = (await resp.json().catch(() => ({}))) as { error?: string }
      if (!resp.ok) {
        setError(data?.error || 'No se pudo registrar la suscripción.')
        setRegistering(false)
        return
      }
      setRegistered(true)
    } catch (err) {
      console.error('Error registering transfer subscription:', err)
      setError('Error de conexión. Probá de nuevo.')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Datos bancarios para transferencia */}
      <div className="bg-zinc-800/5 dark:bg-gradient-to-br dark:from-white/[0.04] dark:to-transparent border border-zinc-200 dark:border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-accent-cyan/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Plataforma</span>
          <span className="text-accent-cyan font-bold bg-accent-cyan/10 px-2 py-0.5 rounded-lg border border-accent-cyan/20">
            Personal Pay
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Titular</span>
          <span className="text-foreground font-medium">Exequiel Echevarria</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Alias</span>
          <div className="flex items-center gap-2">
            <span className="text-foreground font-mono font-bold bg-zinc-800/10 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-white/5">
              Exeq90
            </span>
            <button
              type="button"
              onClick={handleCopyAlias}
              className="p-2 bg-zinc-800/10 hover:bg-zinc-800/20 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg border border-zinc-200 dark:border-white/10 text-foreground hover:text-accent-cyan transition-all cursor-pointer"
              title="Copiar Alias"
            >
              <MorphIcon
                icon={copied ? CheckData : CopyData}
                size={16}
                color={copied ? '#4ade80' : 'currentColor'}
                spring="snappy"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Estado no autenticado */}
      {!session && !registered && (
        <div className="bg-zinc-800/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
            <LogIn className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
            <span>
              Iniciá sesión o registrate con tu email para activar tu suscripción y adjuntar tu
              comprobante desde tu panel.
            </span>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="transfer-email"
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <Mail className="w-3.5 h-3.5" />
              Email para tu cuenta y suscripción
            </label>
            <input
              id="transfer-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="tu@email.com"
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-zinc-300 dark:border-white/10 text-sm text-foreground outline-none focus:border-accent-cyan transition-colors"
            />
          </div>

          {error && <p className="text-xs text-accent-magenta">{error}</p>}

          <HudButton
            type="button"
            variant="primary"
            onClick={handleLoginRedirect}
            className="w-full justify-center"
            icon={<LogIn className="w-4 h-4" />}
          >
            Iniciar Sesión para Suscribirme
          </HudButton>
        </div>
      )}

      {/* Estado autenticado previo a registrar */}
      {session && !registered && (
        <div className="space-y-3">
          <div className="bg-zinc-800/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-accent-cyan" />
              Cuenta vinculada:
            </span>
            <span className="font-semibold text-foreground truncate max-w-[200px]">
              {session.user.email}
            </span>
          </div>

          {error && <p className="text-xs text-accent-magenta">{error}</p>}

          <HudButton
            type="button"
            variant="primary"
            onClick={handleSubscribe}
            disabled={registering}
            className="w-full justify-center"
            icon={
              registering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )
            }
          >
            {registering ? 'Procesando suscripción...' : 'Confirmar Suscripción'}
          </HudButton>
        </div>
      )}

      {/* Estado registrado exitosamente */}
      {registered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <p className="text-lg font-bold text-foreground">¡Suscripción confirmada!</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
              Registramos tu solicitud para el plan <strong>{planTitle}</strong>. Ya podés ingresar
              a tu panel para adjuntar tu comprobante de pago.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <HudButton
              type="button"
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => router.push('/dashboard?tab=invoices')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Ir al Dashboard a adjuntar comprobante
            </HudButton>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />O enviar comprobante por WhatsApp
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
