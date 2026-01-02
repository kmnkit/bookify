import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

// Mock Firestore operations
const mockGetReadingProgress = vi.fn()
const mockUpdateReadingProgress = vi.fn()
const mockGetUserBooks = vi.fn()

vi.mock('@/lib/firebase/firestore/books', () => ({
  getReadingProgress: (...args: unknown[]) => mockGetReadingProgress(...args),
  updateReadingProgress: (...args: unknown[]) =>
    mockUpdateReadingProgress(...args),
  getUserBooks: (...args: unknown[]) => mockGetUserBooks(...args),
}))

// Mock Auth Context
const mockUser = { uid: 'test-user-123' }
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
  }),
}))

// Import after mocking
import {
  useReadingProgress,
  useUserLibrary,
  ReadingStatus,
} from '@/hooks/useReadingProgress'

describe('useReadingProgress hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should start with loading state', () => {
      mockGetReadingProgress.mockResolvedValue(null)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      expect(result.current.isLoading).toBe(true)
    })

    it('should fetch reading progress on mount', async () => {
      const mockProgress = {
        bookId: 'book-123',
        status: 'reading' as ReadingStatus,
        progress: 45,
        startedAt: new Date(),
        updatedAt: new Date(),
      }
      mockGetReadingProgress.mockResolvedValue(mockProgress)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockGetReadingProgress).toHaveBeenCalledWith(
        'test-user-123',
        'book-123'
      )
      expect(result.current.status).toBe('reading')
      expect(result.current.progress).toBe(45)
    })

    it('should return null values when no progress exists', async () => {
      mockGetReadingProgress.mockResolvedValue(null)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.status).toBeNull()
      expect(result.current.progress).toBe(0)
    })
  })

  describe('updateProgress', () => {
    it('should update progress percentage', async () => {
      mockGetReadingProgress.mockResolvedValue({
        bookId: 'book-123',
        status: 'reading' as ReadingStatus,
        progress: 20,
        updatedAt: new Date(),
      })
      mockUpdateReadingProgress.mockResolvedValue(undefined)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateProgress(50)
      })

      expect(mockUpdateReadingProgress).toHaveBeenCalledWith(
        'test-user-123',
        'book-123',
        { progress: 50 }
      )
      expect(result.current.progress).toBe(50)
    })

    it('should clamp progress between 0 and 100', async () => {
      mockGetReadingProgress.mockResolvedValue({
        bookId: 'book-123',
        status: 'reading' as ReadingStatus,
        progress: 50,
        updatedAt: new Date(),
      })
      mockUpdateReadingProgress.mockResolvedValue(undefined)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Test over 100
      await act(async () => {
        await result.current.updateProgress(150)
      })

      expect(mockUpdateReadingProgress).toHaveBeenCalledWith(
        'test-user-123',
        'book-123',
        { progress: 100 }
      )
    })

    it('should apply optimistic update', async () => {
      mockGetReadingProgress.mockResolvedValue({
        bookId: 'book-123',
        status: 'reading' as ReadingStatus,
        progress: 20,
        updatedAt: new Date(),
      })
      mockUpdateReadingProgress.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.updateProgress(75)
      })

      // Optimistic update should be immediate
      expect(result.current.progress).toBe(75)
    })
  })

  describe('updateStatus', () => {
    it('should update reading status to want_to_read', async () => {
      mockGetReadingProgress.mockResolvedValue(null)
      mockUpdateReadingProgress.mockResolvedValue(undefined)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateStatus('want_to_read')
      })

      expect(mockUpdateReadingProgress).toHaveBeenCalledWith(
        'test-user-123',
        'book-123',
        { status: 'want_to_read' }
      )
      expect(result.current.status).toBe('want_to_read')
    })

    it('should update reading status to reading', async () => {
      mockGetReadingProgress.mockResolvedValue({
        bookId: 'book-123',
        status: 'want_to_read' as ReadingStatus,
        progress: 0,
        updatedAt: new Date(),
      })
      mockUpdateReadingProgress.mockResolvedValue(undefined)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateStatus('reading')
      })

      expect(mockUpdateReadingProgress).toHaveBeenCalledWith(
        'test-user-123',
        'book-123',
        { status: 'reading' }
      )
      expect(result.current.status).toBe('reading')
    })

    it('should update reading status to finished and set progress to 100', async () => {
      mockGetReadingProgress.mockResolvedValue({
        bookId: 'book-123',
        status: 'reading' as ReadingStatus,
        progress: 80,
        updatedAt: new Date(),
      })
      mockUpdateReadingProgress.mockResolvedValue(undefined)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.updateStatus('finished')
      })

      expect(mockUpdateReadingProgress).toHaveBeenCalledWith(
        'test-user-123',
        'book-123',
        { status: 'finished', progress: 100 }
      )
      expect(result.current.status).toBe('finished')
      expect(result.current.progress).toBe(100)
    })
  })

  describe('removeFromLibrary', () => {
    it('should remove book from library', async () => {
      mockGetReadingProgress.mockResolvedValue({
        bookId: 'book-123',
        status: 'reading' as ReadingStatus,
        progress: 50,
        updatedAt: new Date(),
      })
      mockUpdateReadingProgress.mockResolvedValue(undefined)

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.removeFromLibrary()
      })

      expect(mockUpdateReadingProgress).toHaveBeenCalledWith(
        'test-user-123',
        'book-123',
        { status: null, progress: 0 }
      )
      expect(result.current.status).toBeNull()
      expect(result.current.progress).toBe(0)
    })
  })

  describe('error handling', () => {
    it('should handle update error and rollback', async () => {
      mockGetReadingProgress.mockResolvedValue({
        bookId: 'book-123',
        status: 'reading' as ReadingStatus,
        progress: 30,
        updatedAt: new Date(),
      })
      mockUpdateReadingProgress.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useReadingProgress('book-123'))

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        try {
          await result.current.updateProgress(80)
        } catch {
          // Expected error
        }
      })

      // Should rollback to original progress
      expect(result.current.progress).toBe(30)
      expect(result.current.error).toBeTruthy()
    })
  })
})

describe('useUserLibrary hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetching user library', () => {
    it('should fetch all user books', async () => {
      const mockBooks = [
        {
          bookId: 'book-1',
          status: 'reading' as ReadingStatus,
          progress: 50,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-2',
          status: 'finished' as ReadingStatus,
          progress: 100,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-3',
          status: 'want_to_read' as ReadingStatus,
          progress: 0,
          updatedAt: new Date(),
        },
      ]
      mockGetUserBooks.mockResolvedValue(mockBooks)

      const { result } = renderHook(() => useUserLibrary())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockGetUserBooks).toHaveBeenCalledWith('test-user-123')
      expect(result.current.books).toHaveLength(3)
    })

    it('should filter books by status - reading', async () => {
      const mockBooks = [
        {
          bookId: 'book-1',
          status: 'reading' as ReadingStatus,
          progress: 50,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-2',
          status: 'finished' as ReadingStatus,
          progress: 100,
          updatedAt: new Date(),
        },
      ]
      mockGetUserBooks.mockResolvedValue(mockBooks)

      const { result } = renderHook(() => useUserLibrary())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.readingBooks).toHaveLength(1)
      expect(result.current.readingBooks[0].bookId).toBe('book-1')
    })

    it('should filter books by status - finished', async () => {
      const mockBooks = [
        {
          bookId: 'book-1',
          status: 'reading' as ReadingStatus,
          progress: 50,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-2',
          status: 'finished' as ReadingStatus,
          progress: 100,
          updatedAt: new Date(),
        },
      ]
      mockGetUserBooks.mockResolvedValue(mockBooks)

      const { result } = renderHook(() => useUserLibrary())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.finishedBooks).toHaveLength(1)
      expect(result.current.finishedBooks[0].bookId).toBe('book-2')
    })

    it('should filter books by status - want_to_read', async () => {
      const mockBooks = [
        {
          bookId: 'book-1',
          status: 'want_to_read' as ReadingStatus,
          progress: 0,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-2',
          status: 'finished' as ReadingStatus,
          progress: 100,
          updatedAt: new Date(),
        },
      ]
      mockGetUserBooks.mockResolvedValue(mockBooks)

      const { result } = renderHook(() => useUserLibrary())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.wantToReadBooks).toHaveLength(1)
      expect(result.current.wantToReadBooks[0].bookId).toBe('book-1')
    })
  })

  describe('counts', () => {
    it('should return correct counts for each status', async () => {
      const mockBooks = [
        {
          bookId: 'book-1',
          status: 'reading' as ReadingStatus,
          progress: 50,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-2',
          status: 'reading' as ReadingStatus,
          progress: 30,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-3',
          status: 'finished' as ReadingStatus,
          progress: 100,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-4',
          status: 'want_to_read' as ReadingStatus,
          progress: 0,
          updatedAt: new Date(),
        },
      ]
      mockGetUserBooks.mockResolvedValue(mockBooks)

      const { result } = renderHook(() => useUserLibrary())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.counts.reading).toBe(2)
      expect(result.current.counts.finished).toBe(1)
      expect(result.current.counts.wantToRead).toBe(1)
      expect(result.current.counts.total).toBe(4)
    })
  })

  describe('refetch', () => {
    it('should refetch library when called', async () => {
      mockGetUserBooks
        .mockResolvedValueOnce([
          {
            bookId: 'book-1',
            status: 'reading' as ReadingStatus,
            progress: 50,
            updatedAt: new Date(),
          },
        ])
        .mockResolvedValueOnce([
          {
            bookId: 'book-1',
            status: 'reading' as ReadingStatus,
            progress: 50,
            updatedAt: new Date(),
          },
          {
            bookId: 'book-2',
            status: 'finished' as ReadingStatus,
            progress: 100,
            updatedAt: new Date(),
          },
        ])

      const { result } = renderHook(() => useUserLibrary())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.books).toHaveLength(1)

      await act(async () => {
        await result.current.refetch()
      })

      expect(result.current.books).toHaveLength(2)
    })
  })
})

describe('ReadingStatus type', () => {
  it('should have valid status values', () => {
    const statuses: ReadingStatus[] = ['want_to_read', 'reading', 'finished']

    expect(statuses).toContain('want_to_read')
    expect(statuses).toContain('reading')
    expect(statuses).toContain('finished')
  })
})
