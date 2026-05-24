'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useWorkflowStore } from '@/lib/store'
import { ProviderSelector } from './provider-selector'

export function QueryForm() {
  const [query, setQuery] = useState('')
  const { isRunning, provider, startWorkflow, addMessage, setCurrentAgent, completeWorkflow, failWorkflow } = useWorkflowStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isRunning) return

    startWorkflow()
    
    try {
      const res = await fetch('http://localhost:3001/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, provider }),
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to run workflow')
      }

      const result = await res.json()
      
      if (result.success && result.result) {
        // Add messages to store
        if (result.result.messages && Array.isArray(result.result.messages)) {
          result.result.messages.forEach((msg: any) => {
            addMessage({
              agent: msg.agent,
              content: msg.content,
              timestamp: msg.timestamp || new Date().toISOString()
            })
          })
        }
        
        // Set final answer
        if (result.result.finalAnswer) {
          completeWorkflow(result.result.finalAnswer)
        } else {
          completeWorkflow('Workflow completed successfully')
        }
      } else {
        throw new Error(result.error || 'Workflow failed')
      }
    } catch (error) {
      failWorkflow(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-background-elevated border border-default rounded-lg">
      <label className="text-sm text-foreground-muted font-medium">Query</label>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about AI trends, quantum computing, or any research topic..."
        rows={4}
        disabled={isRunning}
        className={cn(
          "bg-background-muted border border-default rounded-md px-3 py-2 text-sm",
          "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors resize-none"
        )}
      />
      
      <div className="flex gap-4 items-end">
        <ProviderSelector />
        <button
          type="submit"
          disabled={isRunning || !query.trim()}
          className={cn(
            "px-6 py-2.5 text-sm font-medium rounded-md",
            "bg-accent text-accent-foreground",
            "hover:opacity-90 shadow-sm",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "flex items-center gap-2"
          )}
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running...
            </>
          ) : (
            'Run Query'
          )}
        </button>
      </div>
    </form>
  )
}
