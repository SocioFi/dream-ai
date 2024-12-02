// components/OutputDisplay.tsx
import Image from 'next/image';
import { DreamAnalysis } from '@/lib/types';

interface OutputDisplayProps {
  output: {
    background: string;
    analysis: DreamAnalysis;
    result: string | { url: string };
    type: 'story' | 'poetry' | 'image';
  };
}

export default function OutputDisplay({ output }: OutputDisplayProps) {
  return (
    <div className="relative mt-8 p-8 rounded-lg overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={output.background}
          alt="Dream background"
          fill
          className="object-cover opacity-40"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6 p-4 bg-black/50 rounded">
          <h3 className="text-xl font-semibold mb-2">Dream Analysis</h3>
          <p>Theme: {output.analysis.theme}</p>
          <p>Interpretation: {output.analysis.interpretation}</p>
        </div>
        
        <div className="p-4 bg-black/50 rounded">
          {output.type === 'image' ? (
            <Image
              src={(output.result as { url: string }).url}
              alt="Generated dream image"
              width={512}
              height={512}
              className="rounded"
            />
          ) : (
            <div className="prose prose-invert">
              {output.result as string}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}