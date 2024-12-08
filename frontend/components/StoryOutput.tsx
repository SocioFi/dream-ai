import { Card, CardContent } from "@/components/ui/card"

interface StoryOutputProps {
  story: string
}

export function StoryOutput({ story }: StoryOutputProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Generated Story</h2>
        <p className="whitespace-pre-wrap">{story}</p>
      </CardContent>
    </Card>
  )
}

