import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Firestore
const mockGetDoc = vi.fn()
const mockSetDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockDoc = vi.fn()

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}))

vi.mock('@/lib/firebase/config', () => ({
  db: {},
}))

// Import after mocking
import {
  createUser,
  getUser,
  updateUser,
  type UserProfile,
} from '@/lib/firebase/firestore/users'

describe('Firestore User Operations', () => {
  const mockUserId = 'user-123'
  const mockUserProfile: UserProfile = {
    uid: mockUserId,
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    country: 'JP',
    language: 'ja',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockDoc.mockReturnValue({ id: mockUserId })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createUser', () => {
    it('should create a new user in Firestore', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined)

      const userData = {
        uid: mockUserId,
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
      }

      await createUser(userData)

      expect(mockDoc).toHaveBeenCalled()
      expect(mockSetDoc).toHaveBeenCalledTimes(1)
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          uid: mockUserId,
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: 'https://example.com/photo.jpg',
          country: 'JP', // Default
          language: 'ja', // Default
        })
      )
    })

    it('should handle creation error', async () => {
      const error = new Error('Firestore error')
      mockSetDoc.mockRejectedValueOnce(error)

      const userData = {
        uid: mockUserId,
        email: 'test@example.com',
        displayName: 'Test User',
      }

      await expect(createUser(userData)).rejects.toThrow('Firestore error')
    })
  })

  describe('getUser', () => {
    it('should return user profile when user exists', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockUserProfile,
      })

      const user = await getUser(mockUserId)

      expect(mockDoc).toHaveBeenCalled()
      expect(mockGetDoc).toHaveBeenCalledTimes(1)
      expect(user).toEqual(mockUserProfile)
    })

    it('should return null when user does not exist', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
      })

      const user = await getUser(mockUserId)

      expect(user).toBeNull()
    })

    it('should handle get error', async () => {
      const error = new Error('Firestore error')
      mockGetDoc.mockRejectedValueOnce(error)

      await expect(getUser(mockUserId)).rejects.toThrow('Firestore error')
    })
  })

  describe('updateUser', () => {
    it('should update user profile', async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined)

      const updates = {
        displayName: 'Updated Name',
        country: 'US',
        language: 'en',
      }

      await updateUser(mockUserId, updates)

      expect(mockDoc).toHaveBeenCalled()
      expect(mockUpdateDoc).toHaveBeenCalledTimes(1)
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          displayName: 'Updated Name',
          country: 'US',
          language: 'en',
        })
      )
    })

    it('should include updatedAt timestamp', async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined)

      await updateUser(mockUserId, { displayName: 'New Name' })

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          updatedAt: 'mock-timestamp',
        })
      )
    })

    it('should handle update error', async () => {
      const error = new Error('Update failed')
      mockUpdateDoc.mockRejectedValueOnce(error)

      await expect(
        updateUser(mockUserId, { displayName: 'New Name' })
      ).rejects.toThrow('Update failed')
    })
  })
})

describe('UserProfile type', () => {
  it('should have required fields', () => {
    const profile: UserProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test',
      photoURL: null,
      country: 'JP',
      language: 'ja',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    expect(profile.uid).toBeDefined()
    expect(profile.email).toBeDefined()
    expect(profile.country).toBeDefined()
    expect(profile.language).toBeDefined()
  })
})
