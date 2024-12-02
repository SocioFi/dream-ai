// lib/config/openai.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  organization: process.env.OPENAI_ORG_ID, // optional
});

export const config = {
  models: {
    chat: "gpt-4",
    image: "dall-e-3"
  },
  maxTokens: 2000,
  temperature: 0.7
};