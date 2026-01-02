import type {
  Book,
  BookSearchParams,
  BookSearchResult,
  GoogleBooksClientOptions,
  GoogleBooksError,
  GoogleBooksSearchResponse,
  GoogleBooksVolume,
} from './types'

const GOOGLE_BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1'
const DEFAULT_MAX_RESULTS = 10

/**
 * Transform a GoogleBooksVolume to our simplified Book type
 */
export function transformVolumeToBook(volume: GoogleBooksVolume): Book {
  const { volumeInfo, saleInfo } = volume

  // Get ISBN, preferring ISBN-13
  let isbn: string | undefined
  if (volumeInfo.industryIdentifiers) {
    const isbn13 = volumeInfo.industryIdentifiers.find(
      (id) => id.type === 'ISBN_13'
    )
    const isbn10 = volumeInfo.industryIdentifiers.find(
      (id) => id.type === 'ISBN_10'
    )
    isbn = isbn13?.identifier || isbn10?.identifier
  }

  // Get thumbnail URL and ensure HTTPS
  let thumbnail = volumeInfo.imageLinks?.thumbnail
  if (thumbnail && thumbnail.startsWith('http:')) {
    thumbnail = thumbnail.replace('http:', 'https:')
  }

  return {
    id: volume.id,
    title: volumeInfo.title,
    subtitle: volumeInfo.subtitle,
    authors: volumeInfo.authors || [],
    publisher: volumeInfo.publisher,
    publishedDate: volumeInfo.publishedDate,
    description: volumeInfo.description,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories || [],
    averageRating: volumeInfo.averageRating,
    ratingsCount: volumeInfo.ratingsCount,
    thumbnail,
    language: volumeInfo.language,
    previewLink: volumeInfo.previewLink,
    infoLink: volumeInfo.infoLink,
    isbn,
    saleability: saleInfo?.saleability,
    isEbook: saleInfo?.isEbook,
    country: saleInfo?.country,
  }
}

/**
 * Google Books API Client
 */
export class GoogleBooksClient {
  private apiKey: string
  private baseUrl: string

  constructor(options: GoogleBooksClientOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl || GOOGLE_BOOKS_API_BASE_URL
  }

  /**
   * Search for books
   */
  async search(params: BookSearchParams): Promise<BookSearchResult> {
    const {
      query,
      startIndex = 0,
      maxResults = DEFAULT_MAX_RESULTS,
      orderBy,
      printType,
      langRestrict,
      country,
    } = params

    const searchParams = new URLSearchParams({
      q: query,
      startIndex: String(startIndex),
      maxResults: String(maxResults),
      key: this.apiKey,
    })

    if (orderBy) {
      searchParams.set('orderBy', orderBy)
    }

    if (printType) {
      searchParams.set('printType', printType)
    }

    if (langRestrict) {
      searchParams.set('langRestrict', langRestrict)
    }

    if (country) {
      searchParams.set('country', country)
    }

    const url = `${this.baseUrl}/volumes?${searchParams.toString()}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Google Books API error: ${response.status} ${response.statusText}`
      )
    }

    const data: GoogleBooksSearchResponse = await response.json()

    const books = (data.items || []).map(transformVolumeToBook)
    const totalItems = data.totalItems || 0
    const hasMore = startIndex + books.length < totalItems

    return {
      books,
      totalItems,
      startIndex,
      hasMore,
    }
  }

  /**
   * Get a book by its ID
   */
  async getById(id: string, country?: string): Promise<Book> {
    const searchParams = new URLSearchParams({
      key: this.apiKey,
    })

    if (country) {
      searchParams.set('country', country)
    }

    const url = `${this.baseUrl}/volumes/${id}?${searchParams.toString()}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Google Books API error: ${response.status} ${response.statusText}`
      )
    }

    const volume: GoogleBooksVolume = await response.json()
    return transformVolumeToBook(volume)
  }
}

/**
 * Helper function: Search books with API key
 */
export async function searchBooks(
  query: string,
  apiKey: string,
  options?: Partial<BookSearchParams>
): Promise<BookSearchResult> {
  const client = new GoogleBooksClient({ apiKey })
  return client.search({ query, ...options })
}

/**
 * Helper function: Get book by ID with API key
 */
export async function getBookById(
  id: string,
  apiKey: string,
  country?: string
): Promise<Book> {
  const client = new GoogleBooksClient({ apiKey })
  return client.getById(id, country)
}

/**
 * Helper function: Get books by country (for recommendations)
 */
export async function getBooksByCountry(
  country: string,
  apiKey: string,
  options?: {
    category?: 'bestsellers' | 'fiction' | 'nonfiction' | 'technology' | string
    maxResults?: number
  }
): Promise<BookSearchResult> {
  const client = new GoogleBooksClient({ apiKey })

  // Build query based on category
  let query = '*'
  if (options?.category && options.category !== 'bestsellers') {
    query = `subject:${options.category}`
  }

  return client.search({
    query,
    country,
    maxResults: options?.maxResults || DEFAULT_MAX_RESULTS,
    orderBy: 'relevance',
  })
}
