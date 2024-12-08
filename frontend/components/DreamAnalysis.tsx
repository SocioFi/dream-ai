import Image from 'next/image'

interface DreamAnalysisProps {
  theme: string
  backgroundImage: string
}

export function DreamAnalysis({ theme, backgroundImage }: DreamAnalysisProps) {
  return (
    <div className="relative">
      <Image
        src={backgroundImage}
        alt="Dream-inspired background"
        width={1024}
        height={300}
        className="w-full object-cover"
        style={{ maxHeight: '300px' , objectFit: 'cover'}}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-2xl font-semibold text-center text-white">
          Dream Theme: {theme}
        </p>
      </div>
    </div>
  )
}
