import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export const calculatorTool = new DynamicStructuredTool({
  name: 'calculator',
  description: 'Performs mathematical calculations. Supports basic arithmetic operations.',
  schema: z.object({
    expression: z.string().describe('Mathematical expression to evaluate (e.g., "2 + 2", "10 * 5 + 3")'),
  }),
  func: async ({ expression }) => {
    console.log(`🧮 Calculating: ${expression}`);
    
    try {
      // Simple and safe expression evaluation
      // For production, use a proper math parser library
      const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
      
      if (sanitized !== expression) {
        return JSON.stringify({
          error: 'Invalid expression. Only numbers and operators (+, -, *, /, parentheses) are allowed.',
        });
      }

      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      
      return JSON.stringify({
        expression,
        result,
        explanation: `${expression} = ${result}`,
      });
    } catch (error) {
      return JSON.stringify({
        error: 'Failed to evaluate expression',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
});
