'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  addLike,
  removeLike,
  getLikedBooks,
  isBookLiked,
} from '@/lib/firebase/firestore/books'

interface UseLikeResult {
  isLiked: boolean
  isLoading: boolean
  error: Error | null
  toggleLike: () => Promise<void>
}

interface UseLikedBooksResult {
  likedBookIds: string[]
  isLoading: boolean
  error: Error | null
  isLiked: (bookId: string) => boolean
  refetch: () => Promise<void>
}

/**
 * Hook for managing like state of a single book
 */
export function useLike(bookId: string): UseLikeResult {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Check initial like status
  useEffect(() => {
    async function checkLikeStatus() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const liked = await isBookLiked(user.uid, bookId)
        setIsLiked(liked)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check like status'))
      } finally {
        setIsLoading(false)
      }
    }

    checkLikeStatus()
  }, [user, bookId])

  const toggleLike = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated to like books')
    }

    const previousState = isLiked

    // Optimistic update
    setIsLiked(!isLiked)
    setError(null)

    try {
      if (isLiked) {
        await removeLike(user.uid, bookId)
      } else {
        await addLike(user.uid, bookId)
      }
    } catch (err) {
      // Rollback on error
      setIsLiked(previousState)
      const error = err instanceof Error ? err : new Error('Failed to toggle like')
      setError(error)
      throw error
    }
  }, [user, bookId, isLiked])

  return {
    isLiked,
    isLoading,
    error,
    toggleLike,
  }
}

/**
 * Hook for managing all liked books for the current user
 */
export function useLikedBooks(): UseLikedBooksResult {
  const { user } = useAuth()
  const [likedBookIds, setLikedBookIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLikedBooks = useCallback(async () => {
    if (!user) {
      setLikedBookIds([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const likedBooks = await getLikedBooks(user.uid)
      setLikedBookIds(likedBooks.map((book) => book.bookId))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch liked books'))
      setLikedBookIds([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Fetch on mount
  useEffect(() => {
    fetchLikedBooks()
  }, [fetchLikedBooks])

  // Memoized Set for O(1) lookup
  const likedBookIdsSet = useMemo(
    () => new Set(likedBookIds),
    [likedBookIds]
  )

  const isLiked = useCallback(
    (bookId: string): boolean => {
      return likedBookIdsSet.has(bookId)
    },
    [likedBookIdsSet]
  )

  return {
    likedBookIds,
    isLoading,
    error,
    isLiked,
    refetch: fetchLikedBooks,
  }
}
