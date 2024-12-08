import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { message } = await req.json()

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:800'
    const response = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      throw new Error('Failed to process chat message')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { 
        response: "I apologize, but I encountered an error processing your message. Please try again.",
        background_image: null
      },
      { status: 500 }
    )
  }
}
