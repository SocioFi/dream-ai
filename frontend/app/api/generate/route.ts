import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { type, dream, theme } = await req.json()

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:8000'
    const response = await fetch(`${backendUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, dream, theme }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate content')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { 
        output: "I apologize, but I encountered an error generating the content. Please try again."
      },
      { status: 500 }
    )
  }
}
