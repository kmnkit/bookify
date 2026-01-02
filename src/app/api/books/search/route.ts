import { NextRequest, NextResponse } from 'next/server'
import { GoogleBooksClient } from '@/lib/google-books/client'

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY

export async function GET(request: NextRequest) {
  // Check for API key
  if (!GOOGLE_BOOKS_API_KEY) {
    return NextResponse.json(
      { error: 'Google Books API key not configured' },
      { status: 500 }
    )
  }

  const searchParams = request.nextUrl.searchParams

  // Get search parameters
  const query = searchParams.get('q')
  const startIndex = parseInt(searchParams.get('startIndex') || '0', 10)
  const maxResults = parseInt(searchParams.get('maxResults') || '10', 10)
  const orderBy = searchParams.get('orderBy') as 'relevance' | 'newest' | null
  const langRestrict = searchParams.get('langRestrict')
  const country = searchParams.get('country')

  // Validate required parameters
  if (!query || query.trim() === '') {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    )
  }

  // Validate numeric parameters
  if (isNaN(startIndex) || startIndex < 0) {
    return NextResponse.json(
      { error: 'startIndex must be a non-negative number' },
      { status: 400 }
    )
  }

  if (isNaN(maxResults) || maxResults < 1 || maxResults > 40) {
    return NextResponse.json(
      { error: 'maxResults must be between 1 and 40' },
      { status: 400 }
    )
  }

  try {
    const client = new GoogleBooksClient({ apiKey: GOOGLE_BOOKS_API_KEY })

    // Build search parameters
    const searchResult = await client.search({
      query: query.trim(),
      startIndex,
      maxResults,
      orderBy: orderBy || undefined,
      langRestrict: langRestrict || undefined,
      country: country || undefined,
    })

    // Return the raw Google Books API response format for the hook to process
    // This allows the hook to use transformVolumeToBook
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${new URLSearchParams({
        q: query.trim(),
        startIndex: String(startIndex),
        maxResults: String(maxResults),
        key: GOOGLE_BOOKS_API_KEY,
        ...(orderBy && { orderBy }),
        ...(langRestrict && { langRestrict }),
        ...(country && { country }),
      }).toString()}`
    )

    if (!response.ok) {
      throw new Error(
        `Google Books API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Book search error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to search books',
      },
      { status: 500 }
    )
  }
}
