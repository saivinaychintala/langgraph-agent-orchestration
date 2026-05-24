'use client'

import { useWorkflowStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { LLMProvider } from '@/types/workflow'

const providers: Array<{ id: LLMProvider; name: string }> = [
  { id: 'ollama', name: 'Ollama (Local)' },
  { id: 'openai', name: 'OpenAI' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'gemini', name: 'Google Gemini' },
]

export function ProviderSelector() {
  const { provider, setProvider, isRunning } = useWorkflowStore()

  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs text-foreground-subtle">Provider</label>
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value as LLMProvider)}
        disabled={isRunning}
        className={cn(
          "bg-background-muted border border-default rounded-md px-3 py-2 text-sm",
          "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors"
        )}
      >
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}
