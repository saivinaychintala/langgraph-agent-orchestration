export type LLMProvider = 'openai' | 'anthropic' | 'ollama' | 'gemini';

export interface WorkflowConfig {
  query: string;
  provider: LLMProvider;
  model?: string;
}

export interface AgentMessage {
  agent: 'supervisor' | 'researcher' | 'analyzer';
  content: string;
  timestamp: string;
}

export interface WorkflowResult {
  success: boolean;
  threadId: string;
  query: string;
  provider: string;
  model?: string;
  result: {
    finalAnswer?: string;
    messages: AgentMessage[];
  };
  error?: string;
}

export interface Provider {
  id: LLMProvider;
  name: string;
  models: string[];
  requiresApiKey: boolean;
}
