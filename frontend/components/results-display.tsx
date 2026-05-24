'use client'

import { useWorkflowStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ResultsDisplay() {
  const { messages, finalAnswer, error } = useWorkflowStore()

  if (messages.length === 0 && !finalAnswer && !error) {
    return null
  }

  return (
    <div className="space-y-4">
      {messages.map((message, idx) => (
        <div
          key={idx}
          className={cn(
            "p-4 bg-background-muted border border-muted rounded-md",
            "animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
          )}
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-accent font-mono font-medium uppercase">
              {message.agent}
            </span>
            <span className="text-xs text-foreground-subtle">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
        </div>
      ))}

      {finalAnswer && (
        <div className="p-6 bg-success-subtle border border-success rounded-md animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
          <h3 className="text-sm font-semibold text-success-foreground mb-3">
            Final Answer
          </h3>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{finalAnswer}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-error-subtle border border-error rounded-md animate-in fade-in-50 duration-300">
          <p className="text-sm text-error-foreground font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
