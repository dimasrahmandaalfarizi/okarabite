import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center bg-[#FFF9F0] rounded-3xl border border-[#EFE4DC]">
          <img
            src="/biscuit.png"
            alt="OkaraBite Biscuit"
            className="w-48 h-48 object-contain drop-shadow-xl mb-4 animate-pulse"
          />
          <h3 className="text-lg font-bold text-[#4A2E18] mb-1">
            OkaraBite Upcycled Biscuit
          </h3>
          <p className="text-xs text-[#6E5D53] max-w-xs">
            Model 3D dialihkan ke pratinjau gambar photorealistic.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
