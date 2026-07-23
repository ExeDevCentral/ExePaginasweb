import { useState } from 'react'
import { Copy, Check, Wallet } from 'lucide-react'

interface TransferInstructionsProps {
  planTitle: string
  planPrice: string
  projectType: string
}

export default function TransferInstructions({
  planTitle,
  planPrice,
  projectType,
}: TransferInstructionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('Exeq90')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

      <a
        href={`https://wa.me/5493416874786?text=¡Hola%20Exequiel!%20Acabo%20de%20realizar%20la%20transferencia%20para%20el%20plan%20*${encodeURIComponent(planTitle)}*%20(${encodeURIComponent(planPrice)}%20ARS/mes)%20del%20proyecto%20*${encodeURIComponent(projectType)}*.%20Aquí%20tienes%20el%20comprobante.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-accent-cyan to-accent-cyan/80 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/25"
      >
        <Wallet className="w-4 h-4" />
        Enviar Comprobante por WhatsApp
      </a>
    </div>
  )
}
