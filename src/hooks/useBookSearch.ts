'use client'

import { useState, useCallback, useRef } from 'react'
import type { Book } from '@/lib/google-books/types'
import { transformVolumeToBook } from '@/lib/google-books/client'

const API_BASE_URL = '/api/books/search'
const DEFAULT_MAX_RESULTS = 10

interface UseBookSearchState {
  books: Book[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  query: string
  totalItems: number
}

interface UseBookSearchResult extends UseBookSearchState {
  search: (query: string) => Promise<void>
  loadMore: () => Promise<void>
  reset: () => void
}

export function useBookSearch(): UseBookSearchResult {
  const [state, setState] = useState<UseBookSearchState>({
    books: [],
    isLoading: false,
    error: null,
    hasMore: false,
    query: '',
    totalItems: 0,
  })

  const startIndexRef = useRef(0)
  const loadingRef = useRef(false)
  const currentQueryRef = useRef('')

  const fetchBooks = useCallback(
    async (query: string, startIndex: number = 0, append: boolean = false) => {
      const trimmedQuery = query.trim()

      if (!trimmedQuery) {
        setState((prev) => ({
          ...prev,
          books: append ? prev.books : [],
          error: null,
        }))
        return
      }

      if (loadingRef.current) {
        return
      }

      loadingRef.current = true
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        query: trimmedQuery,
      }))

      try {
        const params = new URLSearchParams({
          q: trimmedQuery,
          startIndex: String(startIndex),
          maxResults: String(DEFAULT_MAX_RESULTS),
        })

        const response = await fetch(`${API_BASE_URL}?${params.toString()}`)

        if (!response.ok) {
          throw new Error(
            `Search failed: ${response.status} ${response.statusText}`
          )
        }

        const data = await response.json()

        const items = data.items || []
        const books: Book[] = items.map(transformVolumeToBook)
        const totalItems = data.totalItems || 0
        const hasMore = startIndex + books.length < totalItems

        startIndexRef.current = startIndex + books.length
        currentQueryRef.current = trimmedQuery

        setState((prev) => ({
          ...prev,
          books: append ? [...prev.books, ...books] : books,
          isLoading: false,
          hasMore,
          totalItems,
        }))
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }))
      } finally {
        loadingRef.current = false
      }
    },
    []
  )

  const search = useCallback(
    async (query: string) => {
      startIndexRef.current = 0
      await fetchBooks(query, 0, false)
    },
    [fetchBooks]
  )

  const loadMore = useCallback(async () => {
    if (!state.hasMore || loadingRef.current) {
      return
    }

    await fetchBooks(currentQueryRef.current, startIndexRef.current, true)
  }, [state.hasMore, fetchBooks])

  const reset = useCallback(() => {
    startIndexRef.current = 0
    currentQueryRef.current = ''
    loadingRef.current = false
    setState({
      books: [],
      isLoading: false,
      error: null,
      hasMore: false,
      query: '',
      totalItems: 0,
    })
  }, [])

  return {
    ...state,
    search,
    loadMore,
    reset,
  }
}
