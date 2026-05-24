import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { runWorkflow } from '../backend/src/graphs/workflow.js';
import { LLMConfig } from '../backend/src/config/llm.js';

dotenv.config();

async function runDemo() {
  console.log('\n' + '='.repeat(70));
  console.log('🎭 LangGraph Agent Orchestration - CLI Demo');
  console.log('='.repeat(70) + '\n');

  const demos: Array<{ query: string; config: LLMConfig }> = [
    {
      query: 'Research the latest trends in AI agents and analyze the findings',
      config: { provider: 'ollama', model: 'llama3' },
    },
  ];

  // Run with Ollama by default
  for (const demo of demos) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`📋 Demo Query: ${demo.query}`);
    console.log(`🤖 Provider: ${demo.config.provider} | Model: ${demo.config.model || 'default'}`);
    console.log(`${'─'.repeat(70)}\n`);

    const threadId = uuidv4();
    
    try {
      const result = await runWorkflow(demo.query, demo.config, threadId);

      console.log('\n' + '='.repeat(70));
      console.log('📊 RESULTS');
      console.log('='.repeat(70) + '\n');

      if (result.finalAnswer) {
        console.log('🎯 Final Answer:');
        console.log(result.finalAnswer);
      }

      if (result.researchData) {
        console.log('\n📚 Research Data:');
        console.log(result.researchData.substring(0, 500) + '...');
      }

      if (result.analysisResult) {
        console.log('\n📊 Analysis:');
        console.log(result.analysisResult.substring(0, 500) + '...');
      }

      console.log('\n' + '='.repeat(70));
      console.log(`✅ Demo completed successfully!`);
      console.log(`   Thread ID: ${threadId}`);
      console.log(`   Messages: ${result.messages.length}`);
      console.log('='.repeat(70) + '\n');

    } catch (error) {
      console.error('\n❌ Demo failed:', error);
      console.error('Make sure:');
      console.error('  1. MongoDB is running');
      console.error('  2. Ollama is installed and running (ollama serve)');
      console.error('  3. Required model is pulled (ollama pull llama3)');
      console.error('  4. Environment variables are configured (.env file)\n');
    }

    // Add delay between demos
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎉 All demos completed!');
  console.log('='.repeat(70) + '\n');
}

// Run the demo
runDemo().catch(console.error);
