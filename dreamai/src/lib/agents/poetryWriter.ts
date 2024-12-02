// lib/agents/poetryWriter.ts
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { DreamAnalysis } from '../types';

const POETRY_SYSTEM_PROMPT = `You are a skilled poet who transforms dream symbolism into evocative verse.
Create poetry with:
1. Rich metaphors
2. Rhythmic flow
3. Emotional depth
4. Symbolic resonance`;

export class PoetryWriter {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.9,
    });
  }

  async generatePoem(analysis: DreamAnalysis): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(
      `${POETRY_SYSTEM_PROMPT}\n\nTheme: {theme}\nSymbols: {symbols}\n\nCreate a poem that captures the essence of this dream.`
    );
    const chain = prompt.pipe(this.model);
    const response = await chain.invoke({
      theme: analysis.theme,
      symbols: analysis.symbols.join(", ")
    });
    
    return String(response.content)
  }
}