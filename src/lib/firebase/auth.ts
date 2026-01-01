import {
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()
const appleProvider = new OAuthProvider('apple.com')

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
}

export const signInWithApple = () => {
  return signInWithPopup(auth, appleProvider)
}

export const signOut = () => {
  return firebaseSignOut(auth)
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

export { auth }
