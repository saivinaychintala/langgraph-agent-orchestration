import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { AgentState } from '../types/state.js';
import { dataAnalyzerTool } from '../tools/index.js';

const ANALYZER_PROMPT = `You are an analysis agent. Your job is to analyze data and provide insights.
Use the data_analyzer tool if needed to get statistics and insights.
Provide a clear, structured analysis with key findings.`;

export async function analyzerAgent(
  state: AgentState,
  llm: BaseChatModel
): Promise<Partial<AgentState>> {
  console.log('📊 Analyzer: Analyzing data...');

  const dataToAnalyze = state.researchData || state.query;

  const messages = [
    new SystemMessage(ANALYZER_PROMPT),
    new HumanMessage(`Analyze the following and provide insights:\n\n${dataToAnalyze.substring(0, 1000)}`),
  ];

  const response = await llm.invoke(messages);

  let analysisResult = response.content.toString();

  // Execute analyzer tool directly if we have text data
  if (dataToAnalyze.length > 50) {
    console.log('📊 Analyzer: Using analysis tools...');
    const result = await dataAnalyzerTool.invoke({ 
      text: dataToAnalyze.substring(0, 1000),
      analysisType: 'all' 
    });
    analysisResult += `\n\nAnalysis Results:\n${result}`;
  }

  console.log('📊 Analyzer: Analysis completed');

  // Create final answer combining research and analysis
  const finalAnswer = `## Analysis Results\n\n${analysisResult}\n\n${state.researchData ? `## Research Data\n\n${state.researchData.substring(0, 500)}...` : ''}`;

  return {
    analysisResult,
    finalAnswer,
    messages: [...state.messages, new AIMessage(`Analysis completed`)],
  };
}
