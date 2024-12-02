// lib/agents/imageGenerator.ts
import { DreamAnalysis } from '../types';
import OpenAI from 'openai';

export class ImageGenerator {
 private openai: OpenAI;

 constructor() {
   // Use non-null assertion since we know API key will be provided
   this.openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY ?? '' // Provide empty string as fallback
   });
 }

 async generateImage(analysis: DreamAnalysis): Promise<string> {
   try {
     const response = await this.openai.images.generate({
       prompt: `Create a surreal, dreamlike image featuring ${analysis.theme} with these elements: ${analysis.symbols.join(", ")}`,
       model: "dall-e-3", 
       n: 1,
       size: "1024x1024",
       style: "vivid",
       quality: "standard",
     });

     // Add null check for response data
     if (!response.data[0]?.url) {
       throw new Error('No image URL returned from API');
     }

     return response.data[0].url;
   } catch (error) {
     console.error('DALL-E Image generation error:', error);
     throw error;
   }
 }

 async generateBackground(theme: string): Promise<string> {
   try {
     const response = await this.openai.images.generate({
       prompt: `Create an abstract, ethereal background based on the theme: ${theme}. Style: soft, dreamy, atmospheric`,
       model: "dall-e-3",
       n: 1,
       size: "1024x1024",
       style: "natural", 
       quality: "standard",
     });

     if (!response.data[0]?.url) {
       throw new Error('No background image URL returned');
     }

     return response.data[0].url;
   } catch (error) {
     console.error('Background generation error:', error);
     throw error;
   }
 }
}