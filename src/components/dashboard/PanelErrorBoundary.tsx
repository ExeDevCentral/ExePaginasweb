import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  panelName?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class PanelErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[PanelErrorBoundary Error in ${this.props.panelName || 'Panel'}]:`,
      error,
      errorInfo
    )
  }

  private isChunkError = () => {
    const msg = this.state.error?.message || ''
    return (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Expected a JavaScript-or-Wasm module script') ||
      msg.includes('MIME type')
    )
  }

  private handleRetry = () => {
    if (this.isChunkError()) {
      window.location.reload()
      return
    }
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      const chunkError = this.isChunkError()

      return (
        <div className="rounded-3xl border border-rose-500/40 bg-[#090a12]/90 backdrop-blur-2xl p-8 shadow-[0_0_40px_rgba(244,63,94,0.15)] text-center my-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-extrabold text-white">
            {chunkError
              ? 'Se actualizó la aplicación'
              : `Error al cargar el panel ${this.props.panelName ? `(${this.props.panelName})` : ''}`}
          </h3>
          <p className="text-xs text-rose-400 font-mono mt-2 max-w-md mx-auto">
            {chunkError
              ? 'Se ha desplegado una versión más reciente o se interrumpió la conexión. Al pulsar reintentar se actualizarán los componentes.'
              : this.state.error?.message ||
                'Ocurrió un error inesperado al renderizar esta sección.'}
          </p>

          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{chunkError ? 'Actualizar y reintentar' : 'Reintentar cargar sección'}</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default PanelErrorBoundary
