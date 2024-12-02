// lib/agents/storyWriter.ts
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { DreamAnalysis } from '../types';

const STORY_SYSTEM_PROMPT = `You are a master storyteller who transforms dream interpretations into engaging narratives.
Focus on:
1. Vivid imagery and sensory details
2. Character development
3. Emotional resonance
4. Thematic depth`;

export class StoryWriter {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.8,
    });
  }

  async generateStory(analysis: DreamAnalysis): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(
      `${STORY_SYSTEM_PROMPT}\n\nTheme: {theme}\nInterpretation: {interpretation}\nSymbols: {symbols}\n\nCreate a short story incorporating these elements.`
    );
    const chain = prompt.pipe(this.model);
    const response = await chain.invoke({
      theme: analysis.theme,
      interpretation: analysis.interpretation,
      symbols: analysis.symbols.join(", ")
    });
    return String(response.content)
  }
}
