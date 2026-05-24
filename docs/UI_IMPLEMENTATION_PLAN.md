# Angular UI Implementation Plan - ABL-Style

## Overview
Create a minimal Angular UI for the LangGraph Agent Orchestration system styled exactly like the ABL platform:
- **Dark theme** with violet-tinted neutrals
- **Design tokens** (CSS custom properties)
- **Utility-first CSS** (minimal custom CSS)
- **Tailwind CSS** for styling
- **Standalone components** (modern Angular)
- **Signals** for state management

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── query-form/           # Main query input form
│   │   │   ├── agent-status/         # Agent status indicators
│   │   │   ├── results-display/      # Query results & logs
│   │   │   ├── provider-selector/    # LLM provider dropdown
│   │   │   └── workflow-visualizer/  # Optional: graph visualization
│   │   ├── services/
│   │   │   ├── api.service.ts        # Backend API calls
│   │   │   └── workflow.service.ts   # Workflow state management
│   │   ├── models/
│   │   │   └── workflow.types.ts     # TypeScript interfaces
│   │   ├── app.component.ts
│   │   └── app.config.ts
│   ├── assets/
│   │   └── icons/                    # SVG icons
│   └── styles/
│       ├── tokens.css                # Design tokens from ABL
│       ├── utilities.css             # Utility classes from ABL
│       └── globals.css               # Global styles
├── angular.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Design Tokens (tokens.css)

Copy the exact design system from ABL:

### Color System
```css
:root {
  /* Background colors — violet-tinted neutrals */
  --background: 260 2% 4%;           /* Near black */
  --background-subtle: 260 2% 7%;    /* Slightly lighter */
  --background-muted: 260 2% 10%;    /* Card backgrounds */
  --background-elevated: 260 2% 12.5%; /* Elevated surfaces */

  /* Foreground colors */
  --foreground: 260 1% 98%;          /* Primary text */
  --foreground-muted: 260 2% 64%;    /* Secondary text */
  --foreground-subtle: 260 2% 45%;   /* Tertiary text */

  /* Border colors */
  --border: 260 2% 15%;              /* Default borders */
  --border-muted: 260 2% 12%;        /* Subtle borders */

  /* Accent colors — Violet */
  --accent: 252 56% 60%;
  --accent-foreground: 0 0% 100%;

  /* Status colors */
  --success: 142.1 76.2% 36.3%;
  --warning: 45.4 93.4% 47.5%;
  --error: 0 72.2% 50.6%;
  --info: 187.2 85.7% 53.3%;
  --purple: 262.1 83.3% 57.8%;       /* For AI/LLM */
}
```

### Spacing Scale (4px base)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

### Typography
```css
--font-sans: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
```

## Utility Classes (utilities.css)

Copy essential utilities from ABL:
- `.glass` - Frosted glass effect
- `.card-hover` - Card hover animations
- `.skeleton` - Loading skeletons
- `.animate-fade-in-up` - Entrance animations
- `.text-muted`, `.text-subtle` - Text colors
- `.bg-background-*` - Background colors
- `.border-default` - Border utilities

## Components

### 1. Query Form Component
**Purpose**: Main input for user queries

**Template** (minimal HTML):
```html
<div class="flex flex-col gap-4 p-6 bg-background-elevated border border-default rounded-lg">
  <label class="text-sm text-muted">Query</label>
  <textarea 
    [(ngModel)]="query"
    placeholder="Ask about AI trends..."
    class="bg-background-muted border border-default rounded-md p-3 text-base focus:border-accent"></textarea>
  
  <div class="flex gap-4 items-end">
    <app-provider-selector [(selected)]="provider" />
    <button 
      (click)="runQuery()"
      class="px-6 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90">
      Run Query
    </button>
  </div>
</div>
```

**Component** (TypeScript):
```typescript
@Component({
  selector: 'app-query-form',
  standalone: true,
  imports: [FormsModule, ProviderSelectorComponent],
  templateUrl: './query-form.component.html'
})
export class QueryFormComponent {
  query = signal('');
  provider = signal<LLMProvider>('ollama');
  private apiService = inject(ApiService);
  
  async runQuery() {
    const result = await this.apiService.runWorkflow({
      query: this.query(),
      provider: this.provider()
    });
    // Emit result
  }
}
```

### 2. Provider Selector Component
**Purpose**: Dropdown for LLM provider selection

```html
<div class="flex flex-col gap-1">
  <label class="text-xs text-subtle">Provider</label>
  <select 
    [(ngModel)]="selected"
    class="bg-background-muted border border-default rounded-md p-2 text-sm">
    <option value="ollama">Ollama (Local)</option>
    <option value="openai">OpenAI</option>
    <option value="anthropic">Anthropic</option>
    <option value="gemini">Google Gemini</option>
  </select>
</div>
```

### 3. Agent Status Component
**Purpose**: Display agent execution status

```html
<div class="flex items-center gap-2 p-3 bg-purple-subtle border border-purple rounded-md">
  <div class="w-2 h-2 bg-purple rounded-full animate-pulse"></div>
  <span class="text-sm text-purple">{{ agentName }} is running...</span>
</div>
```

### 4. Results Display Component
**Purpose**: Show workflow results and logs

```html
<div class="space-y-4">
  @for (message of messages(); track message.id) {
    <div class="p-4 bg-background-muted border border-muted rounded-md animate-fade-in-up">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs text-accent font-mono">{{ message.agent }}</span>
        <span class="text-xs text-subtle">{{ message.timestamp }}</span>
      </div>
      <p class="text-sm text-foreground">{{ message.content }}</p>
    </div>
  }
</div>
```

## API Service

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3001/api';

  runWorkflow(config: WorkflowConfig): Observable<WorkflowResult> {
    return this.http.post<WorkflowResult>(`${this.baseUrl}/run`, config);
  }

  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.baseUrl}/providers`);
  }

  healthCheck(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(`${this.baseUrl}/health`);
  }
}
```

## TypeScript Models

```typescript
export type LLMProvider = 'openai' | 'anthropic' | 'ollama' | 'gemini';

export interface WorkflowConfig {
  query: string;
  provider: LLMProvider;
  model?: string;
}

export interface AgentMessage {
  id: string;
  agent: 'supervisor' | 'researcher' | 'analyzer';
  content: string;
  timestamp: string;
}

export interface WorkflowResult {
  success: boolean;
  messages: AgentMessage[];
  finalAnswer?: string;
  error?: string;
}
```

## Tailwind Configuration

```javascript
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        accent: 'hsl(var(--accent))',
        // ... map all design tokens
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  }
}
```

## Layout (App Component)

```html
<div class="min-h-screen bg-background text-foreground">
  <!-- Header -->
  <header class="border-b border-default p-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <h1 class="text-xl font-semibold">LangGraph Agent Orchestration</h1>
      <div class="flex items-center gap-4">
        <span class="text-xs text-subtle">Backend: {{ backendStatus() }}</span>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto p-6">
    <div class="grid grid-cols-1 gap-6">
      <app-query-form (onSubmit)="handleQuery($event)" />
      <app-results-display [messages]="workflowMessages()" />
    </div>
  </main>
</div>
```

## Dependencies

```json
{
  "dependencies": {
    "@angular/animations": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/core": "^18.0.0",
    "@angular/forms": "^18.0.0",
    "@angular/platform-browser": "^18.0.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@angular/cli": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0"
  }
}
```

## Implementation Phases

### Phase 1: Foundation (30 min)
1. ✅ Create Angular project with standalone components
2. ✅ Copy design tokens (tokens.css, utilities.css)
3. ✅ Configure Tailwind CSS
4. ✅ Set up API service with proper types

### Phase 2: Core Components (45 min)
1. ✅ Query Form Component
2. ✅ Provider Selector Component  
3. ✅ Results Display Component
4. ✅ Agent Status Component

### Phase 3: Integration (30 min)
1. ✅ Connect components to API service
2. ✅ Implement workflow state management with signals
3. ✅ Add loading states and error handling

### Phase 4: Polish (15 min)
1. ✅ Add animations (fade-in, slide-up)
2. ✅ Responsive layout (mobile-friendly)
3. ✅ Test with real backend

## Key Principles (ABL Style)

1. **No custom CSS classes** - Use utility classes only
2. **Design tokens everywhere** - Never hardcode colors/spacing
3. **Minimal JavaScript** - Lean on CSS for animations
4. **Signals over RxJS** - Modern Angular patterns
5. **Standalone components** - No NgModules
6. **Type safety** - Strict TypeScript everywhere
7. **HSL colors** - Match ABL's hsl(var(--token)) pattern
8. **4px spacing grid** - All spacing multiples of 4px

## Example: Card Component Style

```html
<!-- ❌ BAD: Custom CSS -->
<div class="my-custom-card">...</div>

<!-- ✅ GOOD: Utility classes -->
<div class="p-4 bg-background-elevated border border-default rounded-lg hover:border-accent transition-default">
  ...
</div>
```

## Visual Reference

The UI should look like:
- **ABL Studio**: Dark theme, violet accents, monochrome
- **Vercel Dashboard**: Clean, minimal, utility-focused
- **Linear App**: Elegant, fast animations

## Success Criteria

1. ✅ Uses ABL design tokens exactly
2. ✅ Zero custom CSS (only utilities)
3. ✅ Fast animations (spring easing)
4. ✅ Works with all 4 LLM providers
5. ✅ Mobile responsive
6. ✅ < 1000 lines of code total
