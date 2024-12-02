// lib/agents/dreamAnalyzer.ts
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { DreamAnalysis } from '../types';
import { StringOutputParser } from '@langchain/core/output_parsers';

const SYSTEM_PROMPT = `You are an expert dream interpreter with deep knowledge of psychology, symbolism, and archetypal patterns.
Analyze dreams by considering:
1. Major symbols and their cultural/personal significance
2. Emotional undertones
3. Core themes and patterns
4. Potential psychological interpretations

Provide the analysis in JSON format with the following structure:
{
  "theme": "main theme of the dream",
  "interpretation": "detailed interpretation",
  "symbols": ["array", "of", "key", "symbols"]
}`;

export class DreamAnalyzer {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.7,
    });
  }

  async analyzeDream(description: string): Promise<DreamAnalysis> {
    try {
      const prompt = PromptTemplate.fromTemplate(
        `${SYSTEM_PROMPT}\n\nDream: {dream}\n\nProvide analysis in JSON format.`
      );
      
      const chain = prompt.pipe(this.model).pipe(new StringOutputParser());
      
      const response = await chain.invoke({
        dream: description
      });

      try {
        return JSON.parse(response) as DreamAnalysis;
      } catch (parseError) {
        console.error('Error parsing LLM response:', parseError);
        // Provide fallback response if parsing fails
        return {
          theme: description.substring(0, 50) + "...",
          interpretation: "Failed to analyze dream",
          symbols: []
        };
      }
    } catch (error) {
      console.error('Dream analysis error:', error);
      throw error;
    }
  }
}