// components/DreamInput.tsx
import { useState } from 'react';

export default function DreamInput({ onSubmit }: { onSubmit: (dream: string) => void }) {
  const [dream, setDream] = useState('');

  return (
    <div className="max-w-2xl mx-auto">
      <textarea
        className="w-full h-32 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        placeholder="Describe your dream..."
        value={dream}
        onChange={(e) => setDream(e.target.value)}
      />
      <button
        onClick={() => onSubmit(dream)}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Analyze Dream
      </button>
    </div>
  );
}
