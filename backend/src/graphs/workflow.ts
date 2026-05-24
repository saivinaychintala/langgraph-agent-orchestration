import { StateGraph, END, START, Annotation } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { MemorySaver } from '@langchain/langgraph';
import { AgentState } from '../types/state.js';
import { supervisorAgent } from '../agents/supervisor.js';
import { researcherAgent } from '../agents/researcher.js';
import { analyzerAgent } from '../agents/analyzer.js';
import { getLLM, LLMConfig } from '../config/llm.js';

// Define the state annotation
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  next: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => 'supervisor',
  }),
  query: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  researchData: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),
  analysisResult: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),
  finalAnswer: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
  }),
});

export function createWorkflow(llmConfig: LLMConfig) {
  const llm = getLLM(llmConfig);

  // Create the graph
  const workflow = new StateGraph(StateAnnotation)
    .addNode('supervisor', async (state: typeof StateAnnotation.State) => 
      supervisorAgent(state as AgentState, llm)
    )
    .addNode('researcher', async (state: typeof StateAnnotation.State) => 
      researcherAgent(state as AgentState, llm)
    )
    .addNode('analyzer', async (state: typeof StateAnnotation.State) => 
      analyzerAgent(state as AgentState, llm)
    );

  // Add edges
  workflow.addEdge(START, 'supervisor');
  
  // Conditional routing from supervisor
  workflow.addConditionalEdges(
    'supervisor',
    (state: typeof StateAnnotation.State) => state.next,
    {
      researcher: 'researcher',
      analyzer: 'analyzer',
      finish: END,
    }
  );

  // After research, go back to supervisor
  workflow.addEdge('researcher', 'supervisor');
  
  // After analysis, go back to supervisor
  workflow.addEdge('analyzer', 'supervisor');

  // Compile with checkpointer
  const checkpointer = new MemorySaver();
  const app = workflow.compile({ checkpointer });

  return app;
}

export async function runWorkflow(
  query: string,
  llmConfig: LLMConfig,
  threadId: string
) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Starting workflow for query: "${query}"`);
  console.log(`   Provider: ${llmConfig.provider}, Model: ${llmConfig.model || 'default'}`);
  console.log(`   Thread ID: ${threadId}`);
  console.log(`${'='.repeat(60)}\n`);

  const app = createWorkflow(llmConfig);

  const initialState: Partial<typeof StateAnnotation.State> = {
    query,
    messages: [],
    next: 'supervisor',
  };

  const config = {
    configurable: { thread_id: threadId },
  };

  const result = await app.invoke(initialState, config);

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Workflow completed!');
  console.log(`${'='.repeat(60)}\n`);

  return result;
}
