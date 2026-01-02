import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { Book, BookSearchResult } from '@/lib/google-books/types'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Import hook after mocking
import { useBookSearch } from '@/hooks/useBookSearch'

// Sample mock data
const mockBook: Book = {
  id: 'book-1',
  title: 'Test Book',
  authors: ['Test Author'],
  categories: ['Fiction'],
  thumbnail: 'https://example.com/thumb.jpg',
}

const mockSearchResult: BookSearchResult = {
  books: [mockBook],
  totalItems: 50,
  startIndex: 0,
  hasMore: true,
}

const mockApiResponse = {
  kind: 'books#volumes',
  totalItems: 50,
  items: [
    {
      kind: 'books#volume',
      id: 'book-1',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/book-1',
      volumeInfo: {
        title: 'Test Book',
        authors: ['Test Author'],
        categories: ['Fiction'],
        imageLinks: {
          thumbnail: 'https://example.com/thumb.jpg',
        },
      },
    },
  ],
}

describe('useBookSearch hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should start with empty results', () => {
      const { result } = renderHook(() => useBookSearch())

      expect(result.current.books).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.hasMore).toBe(false)
    })

    it('should have search function', () => {
      const { result } = renderHook(() => useBookSearch())

      expect(typeof result.current.search).toBe('function')
    })

    it('should have loadMore function', () => {
      const { result } = renderHook(() => useBookSearch())

      expect(typeof result.current.loadMore).toBe('function')
    })

    it('should have reset function', () => {
      const { result } = renderHook(() => useBookSearch())

      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('search', () => {
    it('should set loading state when searching', async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve(mockApiResponse),
                }),
              100
            )
          )
      )

      const { result } = renderHook(() => useBookSearch())

      act(() => {
        result.current.search('javascript')
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should return books after successful search', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('react')
      })

      expect(result.current.books).toHaveLength(1)
      expect(result.current.books[0].title).toBe('Test Book')
    })

    it('should update hasMore based on results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('python')
      })

      expect(result.current.hasMore).toBe(true)
    })

    it('should clear previous results on new search', async () => {
      // First search
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            kind: 'books#volumes',
            totalItems: 1,
            items: [
              {
                kind: 'books#volume',
                id: 'first-book',
                selfLink: 'https://example.com',
                volumeInfo: { title: 'First Book' },
              },
            ],
          }),
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('first')
      })

      expect(result.current.books[0].id).toBe('first-book')

      // Second search
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            kind: 'books#volumes',
            totalItems: 1,
            items: [
              {
                kind: 'books#volume',
                id: 'second-book',
                selfLink: 'https://example.com',
                volumeInfo: { title: 'Second Book' },
              },
            ],
          }),
      })

      await act(async () => {
        await result.current.search('second')
      })

      expect(result.current.books).toHaveLength(1)
      expect(result.current.books[0].id).toBe('second-book')
    })

    it('should handle empty search query', async () => {
      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('')
      })

      expect(result.current.books).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should trim search query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('  javascript  ')
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=javascript')
      )
    })
  })

  describe('error handling', () => {
    it('should set error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('error-test')
      })

      expect(result.current.error).not.toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('should set error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('network-error')
      })

      expect(result.current.error).toBe('Network error')
    })

    it('should clear error on successful search', async () => {
      // First, cause an error
      mockFetch.mockRejectedValueOnce(new Error('Error'))

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('error')
      })

      expect(result.current.error).not.toBeNull()

      // Then, successful search
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      await act(async () => {
        await result.current.search('success')
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('pagination', () => {
    it('should load more results with loadMore', async () => {
      // Initial search
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('pagination-test')
      })

      expect(result.current.books).toHaveLength(1)

      // Load more
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            kind: 'books#volumes',
            totalItems: 50,
            items: [
              {
                kind: 'books#volume',
                id: 'book-2',
                selfLink: 'https://example.com',
                volumeInfo: { title: 'Book 2' },
              },
            ],
          }),
      })

      await act(async () => {
        await result.current.loadMore()
      })

      expect(result.current.books).toHaveLength(2)
      expect(result.current.books[1].id).toBe('book-2')
    })

    it('should use correct startIndex for pagination', async () => {
      // First search returns 1 book
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('test')
      })

      mockFetch.mockClear()

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            kind: 'books#volumes',
            totalItems: 50,
            items: [],
          }),
      })

      await act(async () => {
        await result.current.loadMore()
      })

      // startIndex should be 1 (0 + 1 book from first search)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('startIndex=1')
      )
    })

    it('should not load more when hasMore is false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            kind: 'books#volumes',
            totalItems: 1,
            items: [
              {
                kind: 'books#volume',
                id: 'only-book',
                selfLink: 'https://example.com',
                volumeInfo: { title: 'Only Book' },
              },
            ],
          }),
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('single')
      })

      expect(result.current.hasMore).toBe(false)

      mockFetch.mockClear()

      await act(async () => {
        await result.current.loadMore()
      })

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should not load more when already loading', async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve(mockApiResponse),
                }),
              100
            )
          )
      )

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('slow')
      })

      mockFetch.mockClear()

      // Start loadMore
      act(() => {
        result.current.loadMore()
      })

      // Try to loadMore again while loading
      act(() => {
        result.current.loadMore()
      })

      // Should only be called once
      expect(mockFetch).toHaveBeenCalledTimes(1)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('reset', () => {
    it('should reset all state', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const { result } = renderHook(() => useBookSearch())

      await act(async () => {
        await result.current.search('test')
      })

      expect(result.current.books).toHaveLength(1)

      act(() => {
        result.current.reset()
      })

      expect(result.current.books).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.hasMore).toBe(false)
      expect(result.current.query).toBe('')
    })
  })

  describe('query state', () => {
    it('should track current query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const { result } = renderHook(() => useBookSearch())

      expect(result.current.query).toBe('')

      await act(async () => {
        await result.current.search('my query')
      })

      expect(result.current.query).toBe('my query')
    })
  })

  describe('totalItems', () => {
    it('should track total items', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const { result } = renderHook(() => useBookSearch())

      expect(result.current.totalItems).toBe(0)

      await act(async () => {
        await result.current.search('test')
      })

      expect(result.current.totalItems).toBe(50)
    })
  })
})
