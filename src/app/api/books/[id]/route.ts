import { NextRequest, NextResponse } from 'next/server'
import { getBookById } from '@/lib/google-books/client'

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check for API key
  if (!GOOGLE_BOOKS_API_KEY) {
    return NextResponse.json(
      { error: 'Google Books API key not configured' },
      { status: 500 }
    )
  }

  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: 'Book ID is required' },
      { status: 400 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const country = searchParams.get('country')

  try {
    const book = await getBookById(id, GOOGLE_BOOKS_API_KEY, country || undefined)

    return NextResponse.json(book, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Book fetch error:', error)

    // Check if it's a 404 error
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to fetch book',
      },
      { status: 500 }
    )
  }
}
