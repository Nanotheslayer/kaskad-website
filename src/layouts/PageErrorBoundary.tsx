import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useCommunicationsStore } from '../store/communicationsStore'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

interface PageErrorBoundaryProps {
  children: ReactNode
}

interface PageErrorBoundaryState {
  error: Error | null
}

/**
 * Ошибка на странице не роняет весь портал: сайдбар и шапка остаются, вместо страницы —
 * сообщение с возможностью открыть её заново или сбросить сохранённые данные.
 */
export default class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  state: PageErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): PageErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Ошибка на странице портала', error, info.componentStack)
  }

  private retry = () => this.setState({ error: null })

  private resetData = () => {
    useCommunicationsStore.getState().resetUserData()
    this.retry()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <Card className="max-w-xl" role="alert">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} className="mt-0.5 shrink-0 text-brand-red" />
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold text-ink">Не удалось показать страницу</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Попробуйте открыть её заново. Если ошибка повторяется, сбросьте сохранённые данные: созданные вами
              коммуникации и ручные статусы удалятся, демо-данные останутся.
            </p>
            <p className="mt-2 text-xs wrap-break-word text-ink-muted">{error.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={this.retry}>Открыть заново</Button>
              <Button variant="secondary" onClick={this.resetData}>
                <RotateCcw size={16} />
                Сбросить сохранённые данные
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
