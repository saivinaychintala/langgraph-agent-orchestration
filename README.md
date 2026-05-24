# LangGraph Agent Orchestration System

A demonstration of AI agent orchestration using LangGraph with support for multiple LLM providers (OpenAI, Anthropic, Google Gemini, and Ollama for local models).

## Overview

This project showcases a supervisor-worker pattern for AI agent orchestration, where a supervisor agent coordinates between specialized worker agents (researcher and analyzer) to complete complex tasks. Built with TypeScript, LangGraph, and LangChain.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Supervisor Agent                     │
│          (Routes tasks to workers)                   │
└───────┬─────────────────────────────┬───────────────┘
        │                             │
        ▼                             ▼
┌───────────────────┐        ┌───────────────────┐
│  Research Agent   │        │  Analyzer Agent   │
│  - Web search     │        │  - Data analysis  │
│  - Information    │        │  - Insights       │
│    gathering      │        │  - Statistics     │
└───────────────────┘        └───────────────────┘
```

## Features

- **Multi-Agent Orchestration**: Supervisor-worker delegation pattern
- **Multiple LLM Providers**: 
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic (Claude 3)
  - Google Gemini (gemini-2.5-flash, gemini-2.5-pro)
  - Ollama (Local models: llama2, mistral, llama3, etc.)
- **Tool Calling**: Web search, calculator, data analyzer
- **State Persistence**: MongoDB-backed checkpointing
- **Type-Safe**: Full TypeScript implementation
- **RESTful API**: Express server with CORS support
- **Docker Ready**: Docker Compose with Ollama and MongoDB

## Tech Stack

| Category | Technology |
|----------|------------|
| **Orchestration** | LangGraph, LangChain |
| **LLMs** | OpenAI, Anthropic, Google Gemini, Ollama |
| **Backend** | Node.js, Express, TypeScript |
| **Frontend** | Next.js 16, React 19, Tailwind CSS, Zustand |
| **Database** | MongoDB |
| **Tools** | Zod for validation |
| **DevOps** | Docker, Docker Compose |

## Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB (or use Docker Compose)
- Ollama (for local LLMs) - [Install Ollama](https://ollama.ai)

### Installation

```bash
# Clone the repository
git clone https://github.com/saivinaychintala/langgraph-agent-orchestration.git
cd langgraph-agent-orchestration

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Create .env file
cd ..
cp .env.example backend/.env

# Edit backend/.env with your configuration
```

### Running with Ollama (Local LLMs)

1. **Install and start Ollama**:
```bash
# Install Ollama from https://ollama.ai

# Pull a model
ollama pull llama3

# Start Ollama server (runs on http://localhost:11434)
ollama serve
```

2. **Start MongoDB**:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or install MongoDB locally
```

3. **Start the backend**:
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`.

4. **Start the frontend** (optional):
```bash
cd frontend
npm run dev
```

The UI will be available at `http://localhost:3002`.

5. **Test the API** (or use the web UI):
```bash
curl -X POST http://localhost:3001/api/run \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Research AI agents and analyze the trends",
    "provider": "ollama",
    "model": "llama3"
  }'
```

### Running with Docker Compose

```bash
# Start all services (MongoDB + Ollama + Backend)
docker-compose up -d

# Pull Ollama model
docker exec -it langgraph-ollama ollama pull llama3

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Running the CLI Demo

```bash
cd backend
npm run demo
```

## API Documentation

### POST /api/run

Execute a workflow with a query.

**Request**:
```json
{
  "query": "Research the latest trends in AI agents and provide analysis",
  "provider": "ollama",
  "model": "llama2"
}
```

**Response**:
```json
{
  "success": true,
  "threadId": "uuid-here",
  "query": "...",
  "provider": "ollama",
  "model": "llama2",
  "result": {
    "finalAnswer": "## Analysis Results...",
    "researchData": "...",
    "analysisResult": "...",
    "messageCount": 6
  }
}
```

### GET /api/providers

List available LLM providers and models.

**Response**:
```json
{
  "providers": [
    {
      "id": "ollama",
      "name": "Ollama (Local)",
      "models": ["llama3", "llama2", "mistral", "qwen3.5", "codellama"],
      "requiresApiKey": false
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "models": ["gpt-4", "gpt-3.5-turbo"],
      "requiresApiKey": true
    },
    {
      "id": "anthropic",
      "name": "Anthropic",
      "models": ["claude-3-sonnet-20240229"],
      "requiresApiKey": true
    }
  ]
}
```

### GET /health

Health check endpoint.

## Project Structure

```
langgraph-agent-orchestration/
├── backend/
│   ├── src/
│   │   ├── agents/           # Agent implementations
│   │   │   ├── supervisor.ts # Routes tasks
│   │   │   ├── researcher.ts # Research agent
│   │   │   └── analyzer.ts   # Analysis agent
│   │   ├── tools/            # Tool implementations
│   │   │   ├── search.ts     # Web search tool
│   │   │   ├── calculator.ts # Math calculator
│   │   │   └── analyzer.ts   # Data analyzer
│   │   ├── graphs/           # LangGraph definitions
│   │   │   └── workflow.ts   # Main workflow graph
│   │   ├── config/           # Configuration
│   │   │   ├── llm.ts        # LLM provider config
│   │   │   └── database.ts   # MongoDB config
│   │   ├── types/            # TypeScript types
│   │   │   └── state.ts      # State interfaces
│   │   └── server.ts         # Express API server
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── examples/
│   └── demo.ts               # CLI demo script
├── docker-compose.yml        # Docker services
├── .env.example              # Environment template
├── .gitignore
└── README.md
```

## LangGraph Workflow

The workflow implements a supervisor-worker pattern:

1. **Supervisor Agent**: Receives the query and decides which worker to route to
2. **Researcher Agent**: Uses web search tool to gather information
3. **Analyzer Agent**: Analyzes the data and provides insights
4. **Supervisor**: Decides if more work is needed or if the task is complete

The graph supports:
- **Conditional routing** based on supervisor decisions
- **State persistence** with MongoDB checkpointing
- **Tool calling** for external data sources
- **Message history** for context

## Environment Variables

```bash
# LLM Provider (ollama, openai, anthropic)
LLM_PROVIDER=ollama
LLM_MODEL=llama3

# API Keys (optional for Ollama)
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_gemini_key

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434

# MongoDB
MONGODB_URI=mongodb://localhost:27017/langgraph-agent-orchestration

# Server
PORT=3000
NODE_ENV=development
```

## Using Different LLM Providers

### Ollama (Local)

```bash
# No API key needed
curl -X POST http://localhost:3000/api/run \
  -H "Content-Type: application/json" \
  -d '{"query": "...", "provider": "ollama", "model": "llama3"}'
```

### OpenAI

```bash
# Set OPENAI_API_KEY in .env
curl -X POST http://localhost:3000/api/run \
  -H "Content-Type: application/json" \
  -d '{"query": "...", "provider": "openai", "model": "gpt-4"}'
```

### Anthropic

```bash
# Set ANTHROPIC_API_KEY in .env
curl -X POST http://localhost:3000/api/run \
  -H "Content-Type: application/json" \
  -d '{"query": "...", "provider": "anthropic", "model": "claude-3-sonnet-20240229"}'
```

### Google Gemini

```bash
# Set GOOGLE_API_KEY in .env
curl -X POST http://localhost:3000/api/run \
  -H "Content-Type: application/json" \
  -d '{"query": "...", "provider": "gemini", "model": "gemini-2.5-flash"}'
```

## Development

```bash
# Install dependencies
cd backend
npm install

# Run in development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

## Frontend

The project includes a modern web UI built with:
- **Next.js 16** + **React 19** (App Router)
- **Tailwind CSS** with ABL platform design system
- **Zustand** for state management
- **Dark theme** with violet accents

### Features
- Interactive query form with provider selection
- Real-time agent execution status
- Animated workflow results display
- Error handling and loading states
- Mobile responsive design

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3002` to use the web interface.

For more details, see [frontend/README.md](frontend/README.md).

## Alignment with Professional Experience

This project demonstrates skills from my work at Kore.ai on the Agentic AI Platform:

- **LangGraph orchestration** - similar to supervisor/worker delegation patterns
- **Multi-LLM provider support** - OpenAI, Anthropic, Google, Groq integration experience
- **State management** - MongoDB checkpointing like graph checkpointing in production
- **TypeScript backend** - NestJS patterns translated to Express
- **Tool calling** - similar to runtime orchestration and tool execution
- **Real-time execution** - workflow monitoring and progress tracking

## License

MIT

## Author

Vinay Chintala - [GitHub](https://github.com/saivinaychintala) | [LinkedIn](https://linkedin.com/in/yourprofile)
