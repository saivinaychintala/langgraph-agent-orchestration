import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AgentState } from '../types/state.js';

const SUPERVISOR_PROMPT = `You are a supervisor agent managing a team of specialized agents.
Your team includes:
1. "researcher" - Searches for information on the web
2. "analyzer" - Analyzes data and provides insights
3. "finish" - Call this when the task is complete

Based on the current state and user query, decide which agent should act next.
If research is needed, route to "researcher".
If analysis is needed, route to "analyzer".
If the task is complete and you have a final answer, route to "finish".

Respond with ONLY the name of the next agent: "researcher", "analyzer", or "finish".`;

export async function supervisorAgent(
  state: AgentState,
  llm: BaseChatModel
): Promise<Partial<AgentState>> {
  console.log('🎯 Supervisor: Routing task...');

  const messages = [
    new SystemMessage(SUPERVISOR_PROMPT),
    new HumanMessage(`Current query: ${state.query}
    
Messages so far: ${state.messages.length}
Research completed: ${state.researchData ? 'Yes' : 'No'}
Analysis completed: ${state.analysisResult ? 'Yes' : 'No'}

Who should act next?`),
  ];

  const response = await llm.invoke(messages);
  const next = response.content.toString().trim().toLowerCase();

  console.log(`🎯 Supervisor: Routing to ${next}`);

  return {
    next,
    messages: [...state.messages, response],
  };
}
