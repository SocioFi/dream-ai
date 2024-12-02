// lib/types/index.ts
export type DreamAnalysis = {
    theme: string;
    interpretation: string;
    symbols: string[];
  };
  
  export type OutputChoice = 'story' | 'poetry' | 'image';
  
  export type DreamOutput = {
    background: string;
    analysis: DreamAnalysis;
    result: string | { url: string };
    type: OutputChoice;
  };