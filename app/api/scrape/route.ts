import { NextRequest, NextResponse } from 'next/server'
import { scrapeWebsite } from '@/lib/scraper'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { website } = body

    if (!website) {
      return NextResponse.json(
        { error: 'Website URL is required' },
        { status: 400 }
      )
    }

    // Scrape the website
    const result = await scrapeWebsite(website)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        phone: '',
        email: '',
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// Configure API route
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
