// app/api/dream/route.ts
import { NextRequest } from 'next/server';
import { DreamAnalyzer } from '@/lib/agents/dreamAnalyzer';
import { StoryWriter } from '@/lib/agents/storyWriter';
import { PoetryWriter } from '@/lib/agents/poetryWriter';
import { ImageGenerator } from '@/lib/agents/imageGenerator';

export async function POST(req: NextRequest) {
  try {
    const { dream, choice } = await req.json();
    
    // Initialize agents
    const analyzer = new DreamAnalyzer();
    const storyWriter = new StoryWriter();
    const poetryWriter = new PoetryWriter();
    const imageGenerator = new ImageGenerator();
    
    // Analyze dream
    const analysis = await analyzer.analyzeDream(dream);
    
    // Generate background
    const background = await imageGenerator.generateImage({
      ...analysis,
      theme: `atmospheric, dreamy interpretation of ${analysis.theme}`
    });
    
    // Generate output based on choice
    let result;
    
    
    switch (choice) {
      case 'story':
        result = await storyWriter.generateStory(analysis);
        break;
      case 'poetry':
        result = await poetryWriter.generatePoem(analysis);
        break;
      case 'image':
        result = { url: await imageGenerator.generateImage(analysis) };
        break;
      default:
        throw new Error('Invalid choice');
    }
    
    return Response.json({
      background,
      analysis,
      result,
      type:choice
    });
    
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Failed to process dream' },
      { status: 500 }
    );
  }
}