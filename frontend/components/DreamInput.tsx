'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface DreamInputProps {
  onSubmit: (dream: string) => void
  isLoading: boolean
}

export function DreamInput({ onSubmit, isLoading }: DreamInputProps) {
  const [dream, setDream] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (dream.trim()) {
      onSubmit(dream)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="Describe your dream..."
        className="w-full h-32 bg-white/10 text-white placeholder-white/50"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Analyzing Dream...' : 'Analyze Dream'}
      </Button>
    </form>
  )
}

