'use client'

import { useState, useEffect, useCallback } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

type OutputType = 'story' | 'poetry' | 'image'

interface DreamState {
  theme?: string
  backgroundImage?: string
  output?: string
  outputType?: OutputType
}

export default function DreamInterface() {
  const [dream, setDream] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [state, setState] = useState<DreamState>({})
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (state.backgroundImage) {
      setBgStyle({
        backgroundImage: `url(${state.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      })
    }
  }, [state.backgroundImage])

  const analyzeDream = useCallback(async () => {
    if (!dream.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/analyze-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream }),
      })
      
      if (!response.ok) throw new Error('Failed to analyze dream')
      
      const data = await response.json()
      setState({
        theme: data.theme,
        backgroundImage: data.backgroundImage,
      })
    } catch (error) {
      console.error('Error:', error)
      // Optionally, add user-facing error handling here
    } finally {
      setIsLoading(false)
    }
  }, [dream])

  const generateOutput = async (type: OutputType) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          dream,
          theme: state.theme,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to generate output')
      
      const data = await response.json()
      setState(prev => ({
        ...prev,
        output: data.output,
        outputType: type,
      }))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main 
      className="min-h-screen relative flex flex-col items-center px-4 py-8"
      style={bgStyle}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
          Dream AI
        </h1>

        <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10">
          <Textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="Share your dream..."
            className="bg-transparent border-white/20 text-white placeholder:text-white/50 min-h-[100px] resize-none"
          />
          <Button
            onClick={analyzeDream}
            disabled={isLoading || dream.trim() === ''}
            className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors duration-200 ease-in-out"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Dream...
              </>
            ) : (
              'Analyze Dream'
            )}
          </Button>
        </div>

        {state.theme && (
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Dream Theme</h2>
            <p className="text-white/90 text-lg">{state.theme}</p>
          </div>
        )}

        {state.theme && (
          <div className="text-center space-y-4">
            <h3 className="text-xl text-white font-semibold drop-shadow">
              What would you like to generate?
            </h3>
            <div className="flex justify-center gap-4">
              {(['story', 'poetry', 'image'] as const).map((type) => (
                <Button
                  key={type}
                  onClick={() => generateOutput(type)}
                  disabled={isLoading}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        )}

        {state.output && (
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Generated {state.outputType?.charAt(0).toUpperCase()}{state.outputType?.slice(1)}
            </h2>
            {state.outputType === 'image' ? (
              <Image
                src={state.output}
                alt="Generated dream image"
                width={1024}
                height={1024}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <p className="text-white/90 whitespace-pre-wrap">
                {state.output}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

