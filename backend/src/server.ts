import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { runWorkflow } from './graphs/workflow.js';
import { LLMConfig } from './config/llm.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Run workflow endpoint
app.post('/api/run', async (req: Request, res: Response) => {
  try {
    const { query, provider = 'ollama', model } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!['openai', 'anthropic', 'ollama', 'gemini'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider. Must be openai, anthropic, ollama, or gemini' });
    }

    const threadId = uuidv4();
    const llmConfig: LLMConfig = { provider, model };

    console.log(`\n📥 Received request: ${query}`);
    console.log(`   Provider: ${provider}, Model: ${model || 'default'}`);

    const result = await runWorkflow(query, llmConfig, threadId);

    res.json({
      success: true,
      threadId,
      query,
      provider,
      model,
      result: {
        finalAnswer: result.finalAnswer,
        researchData: result.researchData,
        analysisResult: result.analysisResult,
        messageCount: result.messages.length,
      },
    });
  } catch (error) {
    console.error('❌ Error running workflow:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get available providers endpoint
app.get('/api/providers', (req: Request, res: Response) => {
  res.json({
    providers: [
      {
        id: 'ollama',
        name: 'Ollama (Local)',
        models: ['llama3', 'llama2', 'mistral', 'qwen3.5', 'codellama'],
        requiresApiKey: false,
      },
      {
        id: 'openai',
        name: 'OpenAI',
        models: ['gpt-4', 'gpt-3.5-turbo'],
        requiresApiKey: true,
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
        requiresApiKey: true,
      },
      {
        id: 'gemini',
        name: 'Google Gemini',
        models: ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'],
        requiresApiKey: true,
      },
    ],
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🚀 LangGraph Agent Orchestration Server`);
      console.log(`${'='.repeat(60)}`);
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🤖 Default Provider: ${process.env.LLM_PROVIDER || 'gemini'}`);
      console.log(`📚 Default Model: ${process.env.LLM_MODEL || 'gemini-2.5-pro'}`);
      console.log(`${'='.repeat(60)}\n`);
      console.log('Available endpoints:');
      console.log('  GET  /health           - Health check');
      console.log('  GET  /api/providers    - List available LLM providers');
      console.log('  POST /api/run          - Run workflow with query');
      console.log(`\n${'='.repeat(60)}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
