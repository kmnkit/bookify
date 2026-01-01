'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const googleProvider = new GoogleAuthProvider()
const appleProvider = new OAuthProvider('apple.com')

function mapFirebaseUser(firebaseUser: User | null): AuthUser | null {
  if (!firebaseUser) return null

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const signInWithApple = async () => {
    await signInWithPopup(auth, appleProvider)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithApple,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
