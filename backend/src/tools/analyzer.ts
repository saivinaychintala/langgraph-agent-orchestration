import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export const dataAnalyzerTool = new DynamicStructuredTool({
  name: 'data_analyzer',
  description: 'Analyzes text data and provides statistics, sentiment, and key insights.',
  schema: z.object({
    text: z.string().describe('The text to analyze'),
    analysisType: z.enum(['summary', 'sentiment', 'statistics', 'all']).optional().describe('Type of analysis to perform'),
  }),
  func: async ({ text, analysisType = 'all' }) => {
    console.log(`📊 Analyzing text (type: ${analysisType})`);
    
    const analysis: Record<string, unknown> = {};

    if (analysisType === 'statistics' || analysisType === 'all') {
      const words = text.split(/\s+/).filter(w => w.length > 0);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const characters = text.length;
      
      analysis.statistics = {
        wordCount: words.length,
        sentenceCount: sentences.length,
        characterCount: characters,
        averageWordLength: (characters / words.length).toFixed(2),
        averageSentenceLength: (words.length / sentences.length).toFixed(2),
      };
    }

    if (analysisType === 'sentiment' || analysisType === 'all') {
      // Simple sentiment analysis (for demo - use proper NLP in production)
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'positive', 'success'];
      const negativeWords = ['bad', 'terrible', 'awful', 'negative', 'fail', 'problem', 'issue'];
      
      const lowerText = text.toLowerCase();
      const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
      const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
      
      let sentiment = 'neutral';
      if (positiveCount > negativeCount) sentiment = 'positive';
      else if (negativeCount > positiveCount) sentiment = 'negative';
      
      analysis.sentiment = {
        overall: sentiment,
        positiveIndicators: positiveCount,
        negativeIndicators: negativeCount,
        confidence: positiveCount + negativeCount > 0 ? 'medium' : 'low',
      };
    }

    if (analysisType === 'summary' || analysisType === 'all') {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, 2).join('. ') + '.';
      
      analysis.summary = {
        text: summary,
        originalLength: text.length,
        summaryLength: summary.length,
        compressionRatio: ((summary.length / text.length) * 100).toFixed(2) + '%',
      };
    }

    return JSON.stringify(analysis, null, 2);
  },
});
