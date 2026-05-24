import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { AgentState } from '../types/state.js';
import { webSearchTool } from '../tools/index.js';

const RESEARCHER_PROMPT = `You are a research agent. Your job is to search for information and gather relevant data.
Use the web_search tool to find information about the user's query.
Provide a comprehensive summary of what you found.`;

export async function researcherAgent(
  state: AgentState,
  llm: BaseChatModel
): Promise<Partial<AgentState>> {
  console.log('🔍 Researcher: Gathering information...');

  const messages = [
    new SystemMessage(RESEARCHER_PROMPT),
    new HumanMessage(`Research the following: ${state.query}\n\nUse the web_search tool to find information.`),
  ];

  const response = await llm.invoke(messages);

  let researchData = response.content.toString();

  // Execute search tool directly
  console.log('🔍 Researcher: Executing search...');
  const searchResult = await webSearchTool.invoke({ query: state.query });
  researchData += `\n\nSearch Results:\n${searchResult}`;

  console.log('🔍 Researcher: Research completed');

  return {
    researchData,
    messages: [...state.messages, new AIMessage(`Research completed. Found information about: ${state.query}`)],
  };
}
