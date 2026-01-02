'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getReadingProgress,
  updateReadingProgress,
  getUserBooks,
  type UserBook,
} from '@/lib/firebase/firestore/books'

export type ReadingStatus = 'want_to_read' | 'reading' | 'finished'

interface UseReadingProgressResult {
  status: ReadingStatus | null
  progress: number
  isLoading: boolean
  error: Error | null
  updateProgress: (progress: number) => Promise<void>
  updateStatus: (status: ReadingStatus) => Promise<void>
  removeFromLibrary: () => Promise<void>
}

interface UseUserLibraryResult {
  books: UserBook[]
  readingBooks: UserBook[]
  finishedBooks: UserBook[]
  wantToReadBooks: UserBook[]
  counts: {
    total: number
    reading: number
    finished: number
    wantToRead: number
  }
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook for managing reading progress of a single book
 */
export function useReadingProgress(bookId: string): UseReadingProgressResult {
  const { user } = useAuth()
  const [status, setStatus] = useState<ReadingStatus | null>(null)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch initial progress
  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const bookProgress = await getReadingProgress(user.uid, bookId)
        if (bookProgress) {
          setStatus(bookProgress.status)
          setProgress(bookProgress.progress)
        } else {
          setStatus(null)
          setProgress(0)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch progress'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [user, bookId])

  const updateProgressValue = useCallback(
    async (newProgress: number) => {
      if (!user) {
        throw new Error('User must be authenticated')
      }

      // Clamp progress between 0 and 100
      const clampedProgress = Math.max(0, Math.min(100, newProgress))

      const previousProgress = progress

      // Optimistic update
      setProgress(clampedProgress)
      setError(null)

      try {
        await updateReadingProgress(user.uid, bookId, {
          progress: clampedProgress,
        })
      } catch (err) {
        // Rollback on error
        setProgress(previousProgress)
        const newError = err instanceof Error ? err : new Error('Failed to update progress')
        setError(newError)
        throw newError
      }
    },
    [user, bookId, progress]
  )

  const updateStatusValue = useCallback(
    async (newStatus: ReadingStatus) => {
      if (!user) {
        throw new Error('User must be authenticated')
      }

      const previousStatus = status
      const previousProgress = progress

      // Optimistic update
      setStatus(newStatus)
      if (newStatus === 'finished') {
        setProgress(100)
      }
      setError(null)

      try {
        const updateData: { status: ReadingStatus; progress?: number } = {
          status: newStatus,
        }

        // Set progress to 100 when marking as finished
        if (newStatus === 'finished') {
          updateData.progress = 100
        }

        await updateReadingProgress(user.uid, bookId, updateData)
      } catch (err) {
        // Rollback on error
        setStatus(previousStatus)
        setProgress(previousProgress)
        const newError = err instanceof Error ? err : new Error('Failed to update status')
        setError(newError)
        throw newError
      }
    },
    [user, bookId, status, progress]
  )

  const removeFromLibrary = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated')
    }

    const previousStatus = status
    const previousProgress = progress

    // Optimistic update
    setStatus(null)
    setProgress(0)
    setError(null)

    try {
      await updateReadingProgress(user.uid, bookId, {
        status: null,
        progress: 0,
      })
    } catch (err) {
      // Rollback on error
      setStatus(previousStatus)
      setProgress(previousProgress)
      const newError = err instanceof Error ? err : new Error('Failed to remove from library')
      setError(newError)
      throw newError
    }
  }, [user, bookId, status, progress])

  return {
    status,
    progress,
    isLoading,
    error,
    updateProgress: updateProgressValue,
    updateStatus: updateStatusValue,
    removeFromLibrary,
  }
}

/**
 * Hook for managing the user's entire library
 */
export function useUserLibrary(): UseUserLibraryResult {
  const { user } = useAuth()
  const [books, setBooks] = useState<UserBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBooks = useCallback(async () => {
    if (!user) {
      setBooks([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const userBooks = await getUserBooks(user.uid)
      setBooks(userBooks)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch library'))
      setBooks([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Fetch on mount
  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  // Filter books by status
  const readingBooks = useMemo(
    () => books.filter((book) => book.status === 'reading'),
    [books]
  )

  const finishedBooks = useMemo(
    () => books.filter((book) => book.status === 'finished'),
    [books]
  )

  const wantToReadBooks = useMemo(
    () => books.filter((book) => book.status === 'want_to_read'),
    [books]
  )

  const counts = useMemo(
    () => ({
      total: books.length,
      reading: readingBooks.length,
      finished: finishedBooks.length,
      wantToRead: wantToReadBooks.length,
    }),
    [books.length, readingBooks.length, finishedBooks.length, wantToReadBooks.length]
  )

  return {
    books,
    readingBooks,
    finishedBooks,
    wantToReadBooks,
    counts,
    isLoading,
    error,
    refetch: fetchBooks,
  }
}

// Re-export types
export type { UserBook }
