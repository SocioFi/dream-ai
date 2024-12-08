import { Button } from "@/components/ui/button"

interface UserChoiceProps {
  onChoice: (choice: 'story' | 'poetry' | 'image') => void
  isLoading: boolean
}

export function UserChoice({ onChoice, isLoading }: UserChoiceProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">What would you like to generate?</h2>
      <div className="flex justify-center space-x-4">
        <Button onClick={() => onChoice('story')} disabled={isLoading}>Story</Button>
        <Button onClick={() => onChoice('poetry')} disabled={isLoading}>Poetry</Button>
        <Button onClick={() => onChoice('image')} disabled={isLoading}>Image</Button>
      </div>
    </div>
  )
}

