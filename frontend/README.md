# LangGraph Agent Orchestration - Frontend

Next.js + React frontend for the LangGraph Agent Orchestration System with a modern dark theme.

## Tech Stack

- **Framework**: Next.js 16 + React 19 (App Router)
- **Styling**: Tailwind CSS with HSL custom properties
- **State Management**: Zustand
- **TypeScript**: Strict mode
- **Icons**: Lucide React
- **Utilities**: clsx + tailwind-merge

## Design System

This UI uses a custom design system featuring:
- Dark theme with cool gray neutrals (HSL 220)
- Violet accents for AI/LLM features
- Semantic color system with alpha modifiers
- 4px spacing grid
- Spring-like animation easings

## Quick Start

### Prerequisites

- Node.js 20+ and npm
- Backend server running on http://localhost:3001

### Installation

```bash
# From project root
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Frontend will run on **http://localhost:3002**

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with Inter font
│   ├── page.tsx            # Main page
│   └── globals.css         # Design tokens and styling
├── components/
│   ├── query-form.tsx      # Main query input form
│   ├── provider-selector.tsx  # LLM provider dropdown
│   ├── results-display.tsx    # Workflow results
│   └── agent-status.tsx       # Agent execution indicator
├── lib/
│   ├── store.ts            # Zustand workflow state
│   └── utils.ts            # cn() utility
├── types/
│   └── workflow.ts         # TypeScript interfaces
└── tailwind.config.ts      # Tailwind configuration
```

## Features

- **Query Form**: Submit queries with provider selection
- **Real-time Status**: See which agent is currently running
- **Animated Results**: Messages fade in with staggered animation
- **Error Handling**: Clear error messages with retry capability
- **Responsive**: Works on mobile, tablet, and desktop

## API Integration

The frontend connects to the backend API at `http://localhost:3001`:

- `POST /api/run` - Execute workflow with query and provider
- `GET /api/providers` - Get available LLM providers
- `GET /health` - Backend health check

## Design Patterns

### Component Pattern

```tsx
'use client'

import { cn } from '@/lib/utils'

export function MyComponent() {
  return (
    <div className={cn(
      "p-4 bg-background-elevated border border-default",
      "hover:border-accent transition-default"
    )}>
      {/* content */}
    </div>
  )
}
```

### HSL Colors with Alpha

```tsx
// ✅ Correct pattern
<div className="bg-background-muted border border-default" />
<div className="bg-purple/10 text-purple" /> {/* Alpha modifier */}

// ❌ Wrong
<div className="bg-gray-900 border-gray-800" />
```

### Zustand State Management

```tsx
import { useWorkflowStore } from '@/lib/store'

export function MyComponent() {
  const { isRunning, startWorkflow } = useWorkflowStore()
  // Use state and actions
}
```

## Environment Variables

None required - API URL is hardcoded to `http://localhost:3001`

For production, create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

And update `query-form.tsx` to use `process.env.NEXT_PUBLIC_API_URL`.

## Available Scripts

- `npm run dev` - Start development server (port 3002)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Testing Locally

1. Start backend: `cd ../backend && npm run dev`
2. Start frontend: `npm run dev`
3. Open http://localhost:3002
4. Enter a query and select a provider
5. Click "Run Query" to test the workflow

## Troubleshooting

### Frontend won't start
- Check if port 3002 is available: `lsof -i :3002`
- Clear Next.js cache: `rm -rf .next`

### Can't connect to backend
- Verify backend is running: `curl http://localhost:3001/health`
- Check CORS settings in `backend/src/server.ts`

### Styling issues
- Clear browser cache
- Check if `globals.css` is loaded in `layout.tsx`
- Verify Tailwind config includes all color tokens

## License

MIT
