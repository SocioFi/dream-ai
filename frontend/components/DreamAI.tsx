'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import Image from 'next/image'

interface DreamState {
  dreamText: string
  dreamTheme: string
  generatedContent?: string
  backgroundImage?: string
  isAnalyzing: boolean
  currentScreen: 'input' | 'output'
  contentType?: 'text' | 'image'
  lastGenerationType?: 'story' | 'image' | 'poem'
  isImageLoading: boolean
  error?: string
}

const defaultContainerStyle = {
  backgroundImage: 'linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}

const ImageSkeleton = () => (
  <div className="w-full aspect-square rounded-lg bg-white/10 animate-pulse flex items-center justify-center">
    <svg className="w-12 h-12 text-cyan-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
)

export default function DreamAI() {
  const [state, setState] = useState<DreamState>({
    dreamText: '',
    dreamTheme: '',
    isAnalyzing: false,
    currentScreen: 'input',
    isImageLoading: false
  })

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    console.log('Text changed:', newText)
    setState(prev => {
      const newState = { ...prev, dreamText: newText }
      console.log('New state:', newState)
      return newState
    })
  }

  const generateBackgroundImage = async (theme: string) => {
    try {
      setState(prev => ({ ...prev, isImageLoading: true }))
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'image',
          dream: state.dreamText,
          theme: theme + ' as an ethereal, abstract background with soft colors and flowing elements'
        })
      })

      if (!response.ok) throw new Error('Failed to generate background')
      
      const data = await response.json()
      setState(prev => ({
        ...prev,
        backgroundImage: data.output,
        isImageLoading: false
      }))
    } catch (error) {
      console.error('Error generating background:', error)
      setState(prev => ({ ...prev, isImageLoading: false }))
    }
  }

  const handleAnalyzeDream = async () => {
    console.log('Analyze button clicked, current dream text:', state.dreamText)
    
    if (!state.dreamText?.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter your dream first' }))
      return
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: undefined }))
    
    try {
      const response = await fetch('/api/analyze-dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ dream: state.dreamText })
      })

      if (!response.ok) {
        throw new Error(`Failed to analyze dream: ${response.status} ${response.statusText}`)
        
      }
      
      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        dreamTheme: data.theme,
        currentScreen: 'output',
        error: undefined
      }))
      
      // Generate background image based on the theme
      await generateBackgroundImage(data.theme)
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'An error occurred while analyzing the dream'
      }))
    } finally {
      setState(prev => ({ ...prev, isAnalyzing: false }))
    }
  }

  const handleGenerate = async (type: 'story' | 'image' | 'poem') => {
    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true, 
      lastGenerationType: type,
      isImageLoading: type === 'image'
    }))
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          dream: state.dreamText,
          theme: state.dreamTheme
        })
      })

      if (!response.ok) throw new Error('Failed to generate content')
      
      const data = await response.json()
      setState(prev => ({
        ...prev,
        generatedContent: data.output,
        contentType: type === 'image' ? 'image' : 'text',
        isImageLoading: false
      }))
    } catch (error) {
      console.error('Error generating content:', error)
      setState(prev => ({ ...prev, isImageLoading: false }))
    } finally {
      setState(prev => ({ ...prev, isAnalyzing: false }))
    }
  }

  const handleRegenerate = () => {
    if (state.lastGenerationType) {
      handleGenerate(state.lastGenerationType)
    }
  }

  const handleReset = () => {
    setState({
      dreamText: '',
      dreamTheme: '',
      isAnalyzing: false,
      currentScreen: 'input',
      isImageLoading: false
    })
  }

  const containerStyle = {
    ...defaultContainerStyle,
    ...(state.backgroundImage && {
      backgroundImage: `url(${state.backgroundImage})`
    })
  }

  if (state.currentScreen === 'input') {
    return (
      <div className="min-h-screen p-6 from-blue-900 to-purple-900" suppressHydrationWarning style={containerStyle}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <Card className="relative z-10 max-w-2xl mx-auto bg-black/30 backdrop-blur-sm border-none text-cyan-300">
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-center text-cyan-200">Dream AI</h1>
            
            <div className="space-y-4">
              <p className="text-sm text-cyan-100">
                Hi, I am dream ai, a multi agentic agent to bring your dream
                to reality. Share your dream.
              </p>
              
              <textarea
                value={state.dreamText}
                onChange={handleTextChange}
                placeholder="Enter your dream here..."
                className="w-full min-h-[100px] bg-black/20 border border-cyan-500/30 text-cyan-100 placeholder:text-cyan-500/50 focus:border-cyan-400 rounded-md p-2"
              />

              {/* Debug: Display current dream text */}
              <div className="text-xs text-cyan-400/50">
                Current dream text: {state.dreamText || '(empty)'}
              </div>

              <Button
                onClick={handleAnalyzeDream}
                disabled={state.isAnalyzing}
                className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-500/30 hover:border-cyan-400"
              >
                {state.isAnalyzing ? 'Analyzing Dream...' : 'Analyze Dream'}
              </Button>

              {state.error && (
                <p className="text-red-400 text-sm mt-2">{state.error}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" suppressHydrationWarning style={containerStyle}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <Card className="relative z-10 max-w-2xl mx-auto bg-black/30 backdrop-blur-sm border-none text-cyan-300">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-cyan-200">Dream AI</h1>
            <Button
              onClick={handleReset}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-500/30 hover:border-cyan-400"
            >
              Analyze Another Dream
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-cyan-200">Dream Theme</h2>
              <p className="text-sm text-cyan-100">{state.dreamTheme}</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-medium text-cyan-200">What do you want to generate</h2>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleGenerate('story')}
                  disabled={state.isAnalyzing}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-500/30 hover:border-cyan-400"
                >
                  Story
                </Button>
                <Button
                  onClick={() => handleGenerate('image')}
                  disabled={state.isAnalyzing}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-500/30 hover:border-cyan-400"
                >
                  Image
                </Button>
                <Button
                  onClick={() => handleGenerate('poem')}
                  disabled={state.isAnalyzing}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-500/30 hover:border-cyan-400"
                >
                  Poem
                </Button>
              </div>
            </div>

            {(state.generatedContent || state.isImageLoading) && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-cyan-200">Generated Content</h2>
                  <Button
                    onClick={handleRegenerate}
                    disabled={state.isAnalyzing}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-500/30 hover:border-cyan-400"
                  >
                    {state.isAnalyzing ? 'Regenerating...' : 'Regenerate'}
                  </Button>
                </div>
                {state.contentType === 'image' ? (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                    {state.isImageLoading ? (
                      <ImageSkeleton />
                    ) : (
                      <Image
                        src={state.generatedContent!}
                        alt="Generated dream visualization"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onLoadingComplete={() => {
                          setState(prev => ({ ...prev, isImageLoading: false }))
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-black/20 rounded-lg p-4 border border-cyan-500/30">
                    <p className="whitespace-pre-wrap text-cyan-100">{state.generatedContent}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
