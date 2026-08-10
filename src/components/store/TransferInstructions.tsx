import { useEffect, useState } from 'react'
import { Copy, Check, Wallet, Mail, Loader2 } from 'lucide-react'
import { useAuthSession } from '../../core/auth/AuthSessionProvider'

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
  const { session } = useAuthSession()
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user?.email) setEmail(session.user.email)
  }, [session])

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('Exeq90')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegisterAndWhatsApp = async () => {
    const targetEmail = email.trim()
    if (!targetEmail) {
      setError('Ingresá tu email para registrar la transferencia.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      setError('Ingresá un email válido.')
      return
    }

    setError('')
    setRegistering(true)
    try {
      const resp = await fetch('/api/register-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          fullName: session?.user?.user_metadata?.full_name ?? null,
          planSlug,
          planNombre: planTitle,
          tipoProyecto: projectType,
        }),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) {
        setError(data?.error || 'No se pudo registrar la transferencia.')
        setRegistering(false)
        return
      }
      setRegistered(true)
      const message = `¡Hola%20Exequiel!%20Acabo%20de%20realizar%20la%20transferencia%20para%20el%20plan%20*${encodeURIComponent(planTitle)}*%20(${encodeURIComponent(planPrice)}%20ARS/mes)%20del%20proyecto%20*${encodeURIComponent(projectType)}*.%20Aquí%20tienes%20el%20comprobante.`
      window.open(`https://wa.me/5493416874786?text=${message}`, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('Error registering transfer:', err)
      setError('Error de conexión. Probá de nuevo.')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="space-y-4">
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
              className="p-2 bg-zinc-800/10 hover:bg-zinc-800/20 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg border border-zinc-200 dark:border-white/10 text-foreground hover:text-accent-cyan transition-all"
              title="Copiar Alias"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400 animate-pulse" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {!registered && (
        <div className="bg-zinc-800/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 space-y-2">
          <label
            htmlFor="transfer-email"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Mail className="w-4 h-4" />
            Email para registrar tu pago
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
          {error && <p className="text-xs text-accent-magenta">{error}</p>}
        </div>
      )}

      <button
        type="button"
        onClick={handleRegisterAndWhatsApp}
        disabled={registering}
        className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-accent-cyan to-accent-cyan/80 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/25 disabled:opacity-60"
      >
        {registering ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            {registered ? 'Volver a abrir WhatsApp' : 'Registrar y enviar comprobante por WhatsApp'}
          </>
        )}
      </button>

      {registered && (
        <p className="text-xs text-green-500 font-medium text-center">
          Transferencia registrada. Te esperamos en WhatsApp con el comprobante.
        </p>
      )}
    </div>
  )
}
