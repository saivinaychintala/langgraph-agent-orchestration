import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export type LLMProvider = 'openai' | 'anthropic' | 'ollama' | 'gemini';

export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  temperature?: number;
}

export function getLLM(config: LLMConfig): BaseChatModel {
  const { provider, model, temperature = 0 } = config;

  switch (provider) {
    case 'openai':
      return new ChatOpenAI({
        modelName: model || 'gpt-4',
        temperature,
        apiKey: process.env.OPENAI_API_KEY,
      });

    case 'anthropic':
      return new ChatAnthropic({
        modelName: model || 'claude-3-sonnet-20240229',
        temperature,
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

    case 'ollama':
      return new ChatOllama({
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        model: model || 'llama3',
        temperature,
      });

    case 'gemini':
      return new ChatGoogleGenerativeAI({
        model: model || 'gemini-2.5-pro',
        temperature,
        apiKey: process.env.GOOGLE_API_KEY,
      });

    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

export function getDefaultProvider(): LLMProvider {
  return (process.env.LLM_PROVIDER as LLMProvider) || 'ollama';
}

export function getDefaultModel(): string {
  return process.env.LLM_MODEL || 'gemini-2.5-pro';
}
