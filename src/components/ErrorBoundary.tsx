import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-root p-8">
          <div className="text-center max-w-md">
            <h1 className="text-sm font-medium text-primary mb-2">Algo deu errado</h1>
            <p className="text-xs text-secondary mb-4">
              Ocorreu um erro ao carregar a aplicação. Verifique se as configurações do Firebase estão corretas.
            </p>
            <pre className="text-xs text-left bg-elevated p-4 rounded-lg overflow-auto max-h-40 text-secondary border border-border">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-accent text-root rounded-md font-medium text-xs hover:bg-white/80 transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
