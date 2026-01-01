import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'

// Mock Firebase auth
const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
}

const mockOnAuthStateChanged = vi.fn()
const mockSignInWithPopup = vi.fn()
const mockSignOut = vi.fn()

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth')
  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
    signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
    signOut: (...args: unknown[]) => mockSignOut(...args),
  }
})

vi.mock('@/lib/firebase/config', () => ({
  auth: {},
}))

// Import after mocking
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: simulate no user logged in
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null)
      return vi.fn() // unsubscribe function
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should start with loading true', () => {
      mockOnAuthStateChanged.mockImplementation(() => vi.fn())

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.loading).toBe(true)
      expect(result.current.user).toBeNull()
    })

    it('should set loading to false after auth state is determined', async () => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null)
        return vi.fn()
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('authenticated state', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return vi.fn()
      })
    })

    it('should return user when authenticated', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).not.toBeNull()
      })

      expect(result.current.user?.uid).toBe('test-uid-123')
      expect(result.current.user?.email).toBe('test@example.com')
      expect(result.current.user?.displayName).toBe('Test User')
    })

    it('should set isAuthenticated to true when user exists', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
      })
    })
  })

  describe('unauthenticated state', () => {
    it('should return null user when not authenticated', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('signInWithGoogle', () => {
    it('should call Firebase signInWithPopup with Google provider', async () => {
      mockSignInWithPopup.mockResolvedValueOnce({ user: mockUser })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.signInWithGoogle()
      })

      expect(mockSignInWithPopup).toHaveBeenCalledTimes(1)
    })

    it('should handle sign in error', async () => {
      const error = new Error('Sign in failed')
      mockSignInWithPopup.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await expect(
        act(async () => {
          await result.current.signInWithGoogle()
        })
      ).rejects.toThrow('Sign in failed')
    })
  })

  describe('signInWithApple', () => {
    it('should call Firebase signInWithPopup with Apple provider', async () => {
      mockSignInWithPopup.mockResolvedValueOnce({ user: mockUser })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.signInWithApple()
      })

      expect(mockSignInWithPopup).toHaveBeenCalledTimes(1)
    })
  })

  describe('signOut', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return vi.fn()
      })
    })

    it('should call Firebase signOut', async () => {
      mockSignOut.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).not.toBeNull()
      })

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })

    it('should handle sign out error', async () => {
      const error = new Error('Sign out failed')
      mockSignOut.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).not.toBeNull()
      })

      await expect(
        act(async () => {
          await result.current.signOut()
        })
      ).rejects.toThrow('Sign out failed')
    })
  })

  describe('useAuth outside AuthProvider', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within an AuthProvider')
    })
  })
})
