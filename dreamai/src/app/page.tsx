// src/app/page.tsx
'use client';

import { useState } from 'react';
import DreamInput from '@/components/DreamInput';
import ChoiceSelector from '@/components/ChoiceSelector';
import OutputDisplay from '@/components/OutputDisplay';
import { OutputChoice } from '@/lib/types';

type OutputType = {
 background: string;
 analysis: {
   theme: string;
   interpretation: string;
   symbols: string[];
 };
 result: string | { url: string };
 type: OutputChoice;
} | null;

export default function Home() {
 const [dreamDescription, setDreamDescription] = useState('');
 const [output, setOutput] = useState<OutputType>(null);
 const [loading, setLoading] = useState(false);

 const handleDreamSubmit = (dream: string) => {
   setDreamDescription(dream);
 };

 const handleChoiceSelect = async (choice: OutputChoice) => {
   setLoading(true);
   try {
     const response = await fetch('/api/dream', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ dream: dreamDescription, choice }),
     });
     
     if (!response.ok) throw new Error('Failed to process dream');
     
     const data = await response.json();
     setOutput(data);
   } catch (error) {
     console.error('Error:', error);
   } finally {
     setLoading(false);
   }
 };

 return (
   <main className="container mx-auto px-4 py-8">
     <h1 className="text-4xl font-bold text-center mb-12 text-blue-400">
       Dream AI Interpreter
     </h1>
     
     <DreamInput onSubmit={handleDreamSubmit} />
     
     {dreamDescription && <ChoiceSelector onSelect={handleChoiceSelect} />}
     
     {loading && (
       <div className="text-center mt-8">
         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
         <p className="mt-2">Interpreting your dream...</p>
       </div>
     )}
     
     {output && <OutputDisplay output={output} />}
   </main>
 );
}