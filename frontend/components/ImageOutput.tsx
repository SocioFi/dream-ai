import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface ImageOutputProps {
  imageUrl: string
}

export function ImageOutput({ imageUrl }: ImageOutputProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Generated Image</h2>
        <Image
          src={imageUrl}
          alt="Dream-inspired generated image"
          width={500}
          height={500}
          className="w-full h-auto rounded-lg"
        />
      </CardContent>
    </Card>
  )
}
