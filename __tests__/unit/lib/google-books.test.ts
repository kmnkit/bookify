import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type {
  Book,
  BookSearchParams,
  BookSearchResult,
  GoogleBooksSearchResponse,
  GoogleBooksVolume,
} from '@/lib/google-books/types'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Import after setting up mocks
import {
  GoogleBooksClient,
  searchBooks,
  getBookById,
  getBooksByCountry,
  transformVolumeToBook,
} from '@/lib/google-books/client'

// Sample mock data
const mockVolume: GoogleBooksVolume = {
  kind: 'books#volume',
  id: 'test-book-id',
  selfLink: 'https://www.googleapis.com/books/v1/volumes/test-book-id',
  volumeInfo: {
    title: 'Test Book Title',
    subtitle: 'A Test Subtitle',
    authors: ['Author One', 'Author Two'],
    publisher: 'Test Publisher',
    publishedDate: '2024-01-15',
    description: 'This is a test book description.',
    pageCount: 300,
    categories: ['Fiction', 'Technology'],
    averageRating: 4.5,
    ratingsCount: 100,
    imageLinks: {
      thumbnail: 'https://books.google.com/thumbnail.jpg',
      smallThumbnail: 'https://books.google.com/small-thumbnail.jpg',
    },
    language: 'en',
    previewLink: 'https://books.google.com/preview',
    infoLink: 'https://books.google.com/info',
    industryIdentifiers: [
      { type: 'ISBN_13', identifier: '9781234567890' },
      { type: 'ISBN_10', identifier: '1234567890' },
    ],
  },
  saleInfo: {
    country: 'JP',
    saleability: 'FOR_SALE',
    isEbook: false,
  },
}

const mockSearchResponse: GoogleBooksSearchResponse = {
  kind: 'books#volumes',
  totalItems: 100,
  items: [mockVolume],
}

describe('GoogleBooksClient', () => {
  let client: GoogleBooksClient

  beforeEach(() => {
    vi.clearAllMocks()
    client = new GoogleBooksClient({ apiKey: 'test-api-key' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should create client with default base URL', () => {
      const testClient = new GoogleBooksClient({ apiKey: 'test-key' })
      expect(testClient).toBeDefined()
    })

    it('should create client with custom base URL', () => {
      const testClient = new GoogleBooksClient({
        apiKey: 'test-key',
        baseUrl: 'https://custom-api.example.com',
      })
      expect(testClient).toBeDefined()
    })
  })

  describe('search', () => {
    it('should search books with query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const result = await client.search({ query: 'javascript' })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=javascript')
      )
      expect(result.books).toHaveLength(1)
      expect(result.totalItems).toBe(100)
    })

    it('should include pagination parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      await client.search({
        query: 'react',
        startIndex: 10,
        maxResults: 20,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('startIndex=10')
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('maxResults=20')
      )
    })

    it('should include orderBy parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      await client.search({
        query: 'python',
        orderBy: 'newest',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('orderBy=newest')
      )
    })

    it('should include language restriction', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      await client.search({
        query: 'programming',
        langRestrict: 'ja',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('langRestrict=ja')
      )
    })

    it('should include country for sale info', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      await client.search({
        query: 'cooking',
        country: 'JP',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('country=JP')
      )
    })

    it('should return empty array when no items found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            kind: 'books#volumes',
            totalItems: 0,
          }),
      })

      const result = await client.search({ query: 'nonexistent-book-xyz' })

      expect(result.books).toEqual([])
      expect(result.totalItems).toBe(0)
      expect(result.hasMore).toBe(false)
    })

    it('should calculate hasMore correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const result = await client.search({
        query: 'test',
        startIndex: 0,
        maxResults: 10,
      })

      expect(result.hasMore).toBe(true) // 100 totalItems, at index 0 with 10 results
    })

    it('should handle API error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      })

      await expect(client.search({ query: '' })).rejects.toThrow()
    })

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(client.search({ query: 'test' })).rejects.toThrow(
        'Network error'
      )
    })

    it('should include API key in request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      await client.search({ query: 'test' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('key=test-api-key')
      )
    })
  })

  describe('getById', () => {
    it('should fetch book by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVolume),
      })

      const book = await client.getById('test-book-id')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/volumes/test-book-id')
      )
      expect(book.id).toBe('test-book-id')
      expect(book.title).toBe('Test Book Title')
    })

    it('should include country parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVolume),
      })

      await client.getById('test-book-id', 'JP')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('country=JP')
      )
    })

    it('should handle book not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(client.getById('nonexistent-id')).rejects.toThrow()
    })
  })
})

describe('transformVolumeToBook', () => {
  it('should transform GoogleBooksVolume to Book', () => {
    const book = transformVolumeToBook(mockVolume)

    expect(book.id).toBe('test-book-id')
    expect(book.title).toBe('Test Book Title')
    expect(book.subtitle).toBe('A Test Subtitle')
    expect(book.authors).toEqual(['Author One', 'Author Two'])
    expect(book.publisher).toBe('Test Publisher')
    expect(book.publishedDate).toBe('2024-01-15')
    expect(book.description).toBe('This is a test book description.')
    expect(book.pageCount).toBe(300)
    expect(book.categories).toEqual(['Fiction', 'Technology'])
    expect(book.averageRating).toBe(4.5)
    expect(book.ratingsCount).toBe(100)
    expect(book.language).toBe('en')
    expect(book.isbn).toBe('9781234567890')
    expect(book.isEbook).toBe(false)
  })

  it('should handle missing optional fields', () => {
    const minimalVolume: GoogleBooksVolume = {
      kind: 'books#volume',
      id: 'minimal-id',
      selfLink: 'https://example.com',
      volumeInfo: {
        title: 'Minimal Book',
      },
    }

    const book = transformVolumeToBook(minimalVolume)

    expect(book.id).toBe('minimal-id')
    expect(book.title).toBe('Minimal Book')
    expect(book.authors).toEqual([])
    expect(book.categories).toEqual([])
    expect(book.subtitle).toBeUndefined()
    expect(book.thumbnail).toBeUndefined()
  })

  it('should prefer ISBN-13 over ISBN-10', () => {
    const volumeWithISBN: GoogleBooksVolume = {
      kind: 'books#volume',
      id: 'isbn-test',
      selfLink: 'https://example.com',
      volumeInfo: {
        title: 'ISBN Test',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '1234567890' },
          { type: 'ISBN_13', identifier: '9789876543210' },
        ],
      },
    }

    const book = transformVolumeToBook(volumeWithISBN)
    expect(book.isbn).toBe('9789876543210')
  })

  it('should extract thumbnail from imageLinks', () => {
    const book = transformVolumeToBook(mockVolume)
    expect(book.thumbnail).toBe('https://books.google.com/thumbnail.jpg')
  })

  it('should use https for thumbnail URLs', () => {
    const volumeWithHttpThumbnail: GoogleBooksVolume = {
      kind: 'books#volume',
      id: 'http-test',
      selfLink: 'https://example.com',
      volumeInfo: {
        title: 'HTTP Test',
        imageLinks: {
          thumbnail: 'http://books.google.com/thumbnail.jpg',
        },
      },
    }

    const book = transformVolumeToBook(volumeWithHttpThumbnail)
    expect(book.thumbnail).toBe('https://books.google.com/thumbnail.jpg')
  })
})

describe('searchBooks helper function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should search books with default options', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    const result = await searchBooks('test query', 'test-api-key')

    expect(result.books).toHaveLength(1)
    expect(mockFetch).toHaveBeenCalled()
  })

  it('should pass search parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    await searchBooks('test', 'key', {
      startIndex: 20,
      maxResults: 15,
      langRestrict: 'ja',
    })

    const calledUrl = mockFetch.mock.calls[0][0]
    expect(calledUrl).toContain('startIndex=20')
    expect(calledUrl).toContain('maxResults=15')
    expect(calledUrl).toContain('langRestrict=ja')
  })
})

describe('getBookById helper function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get book by ID', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVolume),
    })

    const book = await getBookById('test-id', 'test-api-key')

    expect(book.id).toBe('test-book-id')
  })
})

describe('getBooksByCountry helper function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should search books filtered by country', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    await getBooksByCountry('JP', 'test-api-key')

    const calledUrl = mockFetch.mock.calls[0][0]
    expect(calledUrl).toContain('country=JP')
  })

  it('should use country-specific query for bestsellers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    await getBooksByCountry('JP', 'test-api-key', {
      category: 'bestsellers',
    })

    const calledUrl = mockFetch.mock.calls[0][0]
    expect(calledUrl).toContain('country=JP')
  })

  it('should filter by specific category', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    await getBooksByCountry('US', 'test-api-key', {
      category: 'fiction',
    })

    const calledUrl = mockFetch.mock.calls[0][0]
    // URL encoded: subject:fiction becomes subject%3Afiction
    expect(calledUrl).toContain('subject%3Afiction')
  })
})
