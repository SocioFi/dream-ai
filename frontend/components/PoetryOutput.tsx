import { Card, CardContent } from "@/components/ui/card"

interface PoetryOutputProps {
  poem: string
}

export function PoetryOutput({ poem }: PoetryOutputProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Generated Poem</h2>
        <p className="whitespace-pre-wrap font-serif italic">{poem}</p>
      </CardContent>
    </Card>
  )
}

