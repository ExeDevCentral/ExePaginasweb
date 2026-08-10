import { Component, ErrorInfo, ReactNode } from 'react'
import { toast } from 'sonner'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    toast.error('Error inesperado', {
      description: error.message || 'Ocurrió un error en la aplicación',
      duration: 5000,
    })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-destructive/10 text-destructive-foreground h-screen font-mono overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">Expected React to load, but a runtime error occurred:</p>
          <pre className="bg-destructive/20 p-4 rounded border border-destructive/30 whitespace-pre-wrap">
            {this.state.error?.toString()}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
