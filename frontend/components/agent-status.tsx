'use client'

import { useWorkflowStore } from '@/lib/store'

const agentNames = {
  supervisor: 'Supervisor Agent',
  researcher: 'Research Agent',
  analyzer: 'Analyzer Agent',
}

export function AgentStatus() {
  const { currentAgent } = useWorkflowStore()

  if (!currentAgent) return null

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-purple-subtle border border-purple rounded-md animate-in fade-in-50 slide-in-from-top-2 duration-300">
      <div className="w-2 h-2 bg-purple rounded-full animate-pulse" />
      <span className="text-sm text-purple-foreground font-medium">
        {agentNames[currentAgent]} is running...
      </span>
    </div>
  )
}
