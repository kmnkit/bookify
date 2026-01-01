import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  country: string
  language: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  uid: string
  email: string | null
  displayName?: string | null
  photoURL?: string | null
  country?: string
  language?: string
}

export interface UpdateUserData {
  displayName?: string | null
  photoURL?: string | null
  country?: string
  language?: string
}

const USERS_COLLECTION = 'users'

export async function createUser(data: CreateUserData): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, data.uid)

  const userData = {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName ?? null,
    photoURL: data.photoURL ?? null,
    country: data.country ?? 'JP',
    language: data.language ?? 'ja',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await setDoc(userRef, userData)
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, USERS_COLLECTION, uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    return null
  }

  return userSnap.data() as UserProfile
}

export async function updateUser(
  uid: string,
  data: UpdateUserData
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid)

  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function getOrCreateUser(
  data: CreateUserData
): Promise<UserProfile> {
  const existingUser = await getUser(data.uid)

  if (existingUser) {
    return existingUser
  }

  await createUser(data)
  const newUser = await getUser(data.uid)

  if (!newUser) {
    throw new Error('Failed to create user')
  }

  return newUser
}
