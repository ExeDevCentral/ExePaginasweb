
import { Component, ErrorInfo, ReactNode } from 'react'

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
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 text-red-900 h-screen font-mono overflow-auto">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                    <p className="mb-4">Expected React to load, but a runtime error occurred:</p>
                    <pre className="bg-red-100 p-4 rounded border border-red-200 whitespace-pre-wrap">
                        {this.state.error?.toString()}
                    </pre>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
