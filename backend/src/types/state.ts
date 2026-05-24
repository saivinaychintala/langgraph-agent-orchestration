import { BaseMessage } from '@langchain/core/messages';

export interface AgentState {
  messages: BaseMessage[];
  next: string;
  query: string;
  researchData?: string;
  analysisResult?: string;
  finalAnswer?: string;
}

export interface WorkflowConfig {
  threadId: string;
  provider: 'openai' | 'anthropic' | 'ollama';
  model?: string;
}

export interface WorkflowResult {
  threadId: string;
  status: 'completed' | 'in_progress' | 'error';
  messages: BaseMessage[];
  finalAnswer?: string;
  error?: string;
}
