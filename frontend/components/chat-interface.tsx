'use client'

import { useState } from 'react'
import { SendHorizontal, Loader2 } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface Message {
  role: 'assistant' | 'user'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Dream AI Psychologist. Share your dreams with me, and I'll help you understand their deeper meaning. You can ask for analysis, stories, poems, or visual interpretations - just let me know what interests you!"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    }
    setInput('')

    // Add user message to chat
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      })
      
      if (!response.ok) throw new Error('Failed to get response')
      
      const data = await response.json()
      
      // Update background image if provided
      if (data.background_image) {
        setBackgroundImage(data.background_image)
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your message. Please try again."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="flex flex-col h-screen bg-gray-900 relative"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : undefined}
    >
      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white bg-opacity-90'
                    : 'bg-gray-700 text-gray-100 bg-opacity-90'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 bg-opacity-90 rounded-lg px-4 py-3 text-gray-100">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-700 bg-gray-800 bg-opacity-90 p-4 relative z-10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your dream or ask about dream interpretation..."
            className="w-full bg-gray-700 text-gray-100 placeholder:text-gray-400 pr-12 py-6 rounded-lg"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-gray-600 p-2"
            disabled={isLoading}
          >
            <SendHorizontal className="h-5 w-5 text-gray-300" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
