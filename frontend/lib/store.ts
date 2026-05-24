import { create } from 'zustand'
import type { WorkflowResult, LLMProvider, AgentMessage } from '@/types/workflow'

interface WorkflowState {
  // State
  isRunning: boolean
  currentAgent: 'supervisor' | 'researcher' | 'analyzer' | null
  messages: AgentMessage[]
  finalAnswer: string | null
  error: string | null
  provider: LLMProvider
  
  // Actions
  setProvider: (provider: LLMProvider) => void
  startWorkflow: () => void
  addMessage: (message: AgentMessage) => void
  setCurrentAgent: (agent: 'supervisor' | 'researcher' | 'analyzer' | null) => void
  completeWorkflow: (finalAnswer: string) => void
  failWorkflow: (error: string) => void
  reset: () => void
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  isRunning: false,
  currentAgent: null,
  messages: [],
  finalAnswer: null,
  error: null,
  provider: 'ollama',
  
  setProvider: (provider) => set({ provider }),
  startWorkflow: () => set({ isRunning: true, messages: [], finalAnswer: null, error: null, currentAgent: null }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  completeWorkflow: (finalAnswer) => set({ isRunning: false, finalAnswer, currentAgent: null }),
  failWorkflow: (error) => set({ isRunning: false, error, currentAgent: null }),
  reset: () => set({ 
    isRunning: false, 
    currentAgent: null, 
    messages: [], 
    finalAnswer: null, 
    error: null 
  }),
}))
