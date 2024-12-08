import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { dream } = await req.json()
    console.log('Analyzing dream:', dream)

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:8000'
    console.log('Backend URL:', backendUrl)

    const response = await fetch(`${backendUrl}/api/analyze-dream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ dream }),
      cache: 'no-store'
    })

    console.log('API response status:', response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`Failed to analyze dream: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('API response data:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error analyzing dream:', error)
    return NextResponse.json(
      { 
        theme: "I apologize, but I encountered an error analyzing your dream. Please try again."
      },
      { status: 500 }
    )
  }
}
