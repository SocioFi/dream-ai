// components/ChoiceSelector.tsx
export default function ChoiceSelector({
    onSelect
  }: {
    onSelect: (choice: 'story' | 'poetry' | 'image') => void;
  }) {
    return (
      <div className="flex gap-4 justify-center mt-8">
        <button
          onClick={() => onSelect('story')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Generate Story
        </button>
        <button
          onClick={() => onSelect('poetry')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Generate Poetry
        </button>
        <button
          onClick={() => onSelect('image')}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Generate Image
        </button>
      </div>
    );
  }