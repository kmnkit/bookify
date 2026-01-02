import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Firestore
const mockGetDoc = vi.fn()
const mockSetDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockDeleteDoc = vi.fn()
const mockDoc = vi.fn()
const mockCollection = vi.fn()
const mockQuery = vi.fn()
const mockWhere = vi.fn()
const mockGetDocs = vi.fn()
const mockOrderBy = vi.fn()

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: (...args: unknown[]) => mockDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  orderBy: (...args: unknown[]) => mockOrderBy(...args),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}))

vi.mock('@/lib/firebase/config', () => ({
  db: {},
}))

// Import after mocking
import {
  addLike,
  removeLike,
  getLikedBooks,
  isBookLiked,
  getReadingProgress,
  updateReadingProgress,
  getUserBooks,
  type UserBook,
  type LikedBook,
} from '@/lib/firebase/firestore/books'

describe('Firestore Book Like Operations', () => {
  const mockUserId = 'user-123'
  const mockBookId = 'book-456'

  beforeEach(() => {
    vi.clearAllMocks()
    mockDoc.mockReturnValue({ id: mockBookId })
    mockCollection.mockReturnValue('mock-collection')
    mockQuery.mockReturnValue('mock-query')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('addLike', () => {
    it('should add a like to Firestore', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined)

      await addLike(mockUserId, mockBookId)

      expect(mockDoc).toHaveBeenCalled()
      expect(mockSetDoc).toHaveBeenCalledTimes(1)
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          bookId: mockBookId,
          userId: mockUserId,
        })
      )
    })

    it('should include likedAt timestamp', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined)

      await addLike(mockUserId, mockBookId)

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          likedAt: 'mock-timestamp',
        })
      )
    })

    it('should handle add like error', async () => {
      mockSetDoc.mockRejectedValueOnce(new Error('Firestore error'))

      await expect(addLike(mockUserId, mockBookId)).rejects.toThrow(
        'Firestore error'
      )
    })
  })

  describe('removeLike', () => {
    it('should remove a like from Firestore', async () => {
      mockDeleteDoc.mockResolvedValueOnce(undefined)

      await removeLike(mockUserId, mockBookId)

      expect(mockDoc).toHaveBeenCalled()
      expect(mockDeleteDoc).toHaveBeenCalledTimes(1)
    })

    it('should handle remove like error', async () => {
      mockDeleteDoc.mockRejectedValueOnce(new Error('Delete failed'))

      await expect(removeLike(mockUserId, mockBookId)).rejects.toThrow(
        'Delete failed'
      )
    })
  })

  describe('isBookLiked', () => {
    it('should return true when book is liked', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          bookId: mockBookId,
          userId: mockUserId,
          likedAt: new Date(),
        }),
      })

      const result = await isBookLiked(mockUserId, mockBookId)

      expect(result).toBe(true)
    })

    it('should return false when book is not liked', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
      })

      const result = await isBookLiked(mockUserId, mockBookId)

      expect(result).toBe(false)
    })
  })

  describe('getLikedBooks', () => {
    it('should return all liked books for user', async () => {
      const mockLikedBooks = [
        { bookId: 'book-1', userId: mockUserId, likedAt: new Date() },
        { bookId: 'book-2', userId: mockUserId, likedAt: new Date() },
      ]

      mockGetDocs.mockResolvedValueOnce({
        docs: mockLikedBooks.map((book) => ({
          data: () => book,
        })),
      })

      const result = await getLikedBooks(mockUserId)

      expect(result).toHaveLength(2)
      expect(result[0].bookId).toBe('book-1')
      expect(result[1].bookId).toBe('book-2')
    })

    it('should return empty array when no liked books', async () => {
      mockGetDocs.mockResolvedValueOnce({
        docs: [],
      })

      const result = await getLikedBooks(mockUserId)

      expect(result).toEqual([])
    })

    it('should handle fetch error', async () => {
      mockGetDocs.mockRejectedValueOnce(new Error('Fetch failed'))

      await expect(getLikedBooks(mockUserId)).rejects.toThrow('Fetch failed')
    })
  })
})

describe('Firestore Reading Progress Operations', () => {
  const mockUserId = 'user-123'
  const mockBookId = 'book-456'

  beforeEach(() => {
    vi.clearAllMocks()
    mockDoc.mockReturnValue({ id: mockBookId })
    mockCollection.mockReturnValue('mock-collection')
    mockQuery.mockReturnValue('mock-query')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getReadingProgress', () => {
    it('should return reading progress when exists', async () => {
      const mockProgress = {
        bookId: mockBookId,
        status: 'reading',
        progress: 45,
        startedAt: new Date(),
        updatedAt: new Date(),
      }

      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockProgress,
      })

      const result = await getReadingProgress(mockUserId, mockBookId)

      expect(result).toEqual(mockProgress)
    })

    it('should return null when no progress exists', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
      })

      const result = await getReadingProgress(mockUserId, mockBookId)

      expect(result).toBeNull()
    })
  })

  describe('updateReadingProgress', () => {
    it('should update progress percentage', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined)

      await updateReadingProgress(mockUserId, mockBookId, { progress: 50 })

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          progress: 50,
          updatedAt: 'mock-timestamp',
        }),
        { merge: true }
      )
    })

    it('should update reading status', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined)

      await updateReadingProgress(mockUserId, mockBookId, { status: 'reading' })

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'reading',
          bookId: mockBookId,
        }),
        { merge: true }
      )
    })

    it('should set startedAt when status changes to reading', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined)

      await updateReadingProgress(mockUserId, mockBookId, { status: 'reading' })

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          startedAt: 'mock-timestamp',
        }),
        { merge: true }
      )
    })

    it('should set finishedAt when status changes to finished', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined)

      await updateReadingProgress(mockUserId, mockBookId, {
        status: 'finished',
        progress: 100,
      })

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          finishedAt: 'mock-timestamp',
          progress: 100,
        }),
        { merge: true }
      )
    })

    it('should handle null status (remove from library)', async () => {
      mockDeleteDoc.mockResolvedValueOnce(undefined)

      await updateReadingProgress(mockUserId, mockBookId, {
        status: null,
        progress: 0,
      })

      expect(mockDeleteDoc).toHaveBeenCalled()
    })
  })

  describe('getUserBooks', () => {
    it('should return all books for user', async () => {
      const mockBooks = [
        {
          bookId: 'book-1',
          status: 'reading',
          progress: 50,
          updatedAt: new Date(),
        },
        {
          bookId: 'book-2',
          status: 'finished',
          progress: 100,
          updatedAt: new Date(),
        },
      ]

      mockGetDocs.mockResolvedValueOnce({
        docs: mockBooks.map((book) => ({
          data: () => book,
        })),
      })

      const result = await getUserBooks(mockUserId)

      expect(result).toHaveLength(2)
    })

    it('should return empty array when user has no books', async () => {
      mockGetDocs.mockResolvedValueOnce({
        docs: [],
      })

      const result = await getUserBooks(mockUserId)

      expect(result).toEqual([])
    })

    it('should filter by status when provided', async () => {
      const mockBooks = [
        {
          bookId: 'book-1',
          status: 'reading',
          progress: 50,
          updatedAt: new Date(),
        },
      ]

      mockGetDocs.mockResolvedValueOnce({
        docs: mockBooks.map((book) => ({
          data: () => book,
        })),
      })

      await getUserBooks(mockUserId, 'reading')

      expect(mockWhere).toHaveBeenCalledWith('status', '==', 'reading')
    })
  })
})

describe('Type definitions', () => {
  it('UserBook should have required fields', () => {
    const userBook: UserBook = {
      bookId: 'book-123',
      status: 'reading',
      progress: 50,
      updatedAt: new Date(),
    }

    expect(userBook.bookId).toBeDefined()
    expect(userBook.status).toBeDefined()
    expect(userBook.progress).toBeDefined()
  })

  it('LikedBook should have required fields', () => {
    const likedBook: LikedBook = {
      bookId: 'book-123',
      likedAt: new Date(),
    }

    expect(likedBook.bookId).toBeDefined()
    expect(likedBook.likedAt).toBeDefined()
  })
})
