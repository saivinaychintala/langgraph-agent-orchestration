import { QueryForm } from '@/components/query-form'
import { AgentStatus } from '@/components/agent-status'
import { ResultsDisplay } from '@/components/results-display'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-default px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              LangGraph Agent Orchestration
            </h1>
            <p className="text-xs text-foreground-muted mt-1">
              Multi-agent AI system with supervisor-worker pattern
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-xs text-foreground-subtle">
                Backend Connected
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          <QueryForm />
          <AgentStatus />
          <ResultsDisplay />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-muted px-4 py-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-foreground-subtle text-center">
            Powered by LangGraph • Supports OpenAI, Anthropic, Gemini, and Ollama
          </p>
        </div>
      </footer>
    </div>
  )
}
