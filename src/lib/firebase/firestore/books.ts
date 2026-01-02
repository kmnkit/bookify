import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// Types
export type ReadingStatus = 'want_to_read' | 'reading' | 'finished'

export interface LikedBook {
  bookId: string
  likedAt: Date
}

export interface UserBook {
  bookId: string
  status: ReadingStatus
  progress: number
  startedAt?: Date
  finishedAt?: Date
  updatedAt: Date
}

interface LikedBookDoc {
  bookId: string
  userId: string
  likedAt: unknown
}

interface UserBookDoc {
  bookId: string
  status: ReadingStatus
  progress: number
  startedAt?: unknown
  finishedAt?: unknown
  updatedAt: unknown
}

interface UpdateProgressData {
  status?: ReadingStatus | null
  progress?: number
}

// Collection paths
const LIKES_COLLECTION = 'likes'
const USER_BOOKS_COLLECTION = 'userBooks'

// Like document ID format: {userId}_{bookId}
function getLikeDocId(userId: string, bookId: string): string {
  return `${userId}_${bookId}`
}

// User book document ID format: {userId}_{bookId}
function getUserBookDocId(userId: string, bookId: string): string {
  return `${userId}_${bookId}`
}

// Like Operations

export async function addLike(userId: string, bookId: string): Promise<void> {
  const docId = getLikeDocId(userId, bookId)
  const likeRef = doc(db, LIKES_COLLECTION, docId)

  const likeData: LikedBookDoc = {
    bookId,
    userId,
    likedAt: serverTimestamp(),
  }

  await setDoc(likeRef, likeData)
}

export async function removeLike(userId: string, bookId: string): Promise<void> {
  const docId = getLikeDocId(userId, bookId)
  const likeRef = doc(db, LIKES_COLLECTION, docId)

  await deleteDoc(likeRef)
}

export async function isBookLiked(
  userId: string,
  bookId: string
): Promise<boolean> {
  const docId = getLikeDocId(userId, bookId)
  const likeRef = doc(db, LIKES_COLLECTION, docId)
  const likeSnap = await getDoc(likeRef)

  return likeSnap.exists()
}

export async function getLikedBooks(userId: string): Promise<LikedBook[]> {
  const likesRef = collection(db, LIKES_COLLECTION)
  const q = query(
    likesRef,
    where('userId', '==', userId),
    orderBy('likedAt', 'desc')
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as LikedBookDoc
    return {
      bookId: data.bookId,
      likedAt: data.likedAt as Date,
    }
  })
}

// Reading Progress Operations

export async function getReadingProgress(
  userId: string,
  bookId: string
): Promise<UserBook | null> {
  const docId = getUserBookDocId(userId, bookId)
  const bookRef = doc(db, USER_BOOKS_COLLECTION, docId)
  const bookSnap = await getDoc(bookRef)

  if (!bookSnap.exists()) {
    return null
  }

  const data = bookSnap.data() as UserBookDoc
  return {
    bookId: data.bookId,
    status: data.status,
    progress: data.progress,
    startedAt: data.startedAt as Date | undefined,
    finishedAt: data.finishedAt as Date | undefined,
    updatedAt: data.updatedAt as Date,
  }
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  updates: UpdateProgressData
): Promise<void> {
  const docId = getUserBookDocId(userId, bookId)
  const bookRef = doc(db, USER_BOOKS_COLLECTION, docId)

  // Handle removal from library
  if (updates.status === null) {
    await deleteDoc(bookRef)
    return
  }

  // Build update data
  const updateData: Record<string, unknown> = {
    bookId,
    updatedAt: serverTimestamp(),
  }

  if (updates.progress !== undefined) {
    updateData.progress = updates.progress
  }

  if (updates.status !== undefined) {
    updateData.status = updates.status

    // Set startedAt when status changes to reading
    if (updates.status === 'reading') {
      updateData.startedAt = serverTimestamp()
    }

    // Set finishedAt when status changes to finished
    if (updates.status === 'finished') {
      updateData.finishedAt = serverTimestamp()
    }
  }

  await setDoc(bookRef, updateData, { merge: true })
}

export async function getUserBooks(
  userId: string,
  status?: ReadingStatus
): Promise<UserBook[]> {
  const booksRef = collection(db, USER_BOOKS_COLLECTION)

  // Build query based on whether status filter is provided
  let q
  if (status) {
    q = query(
      booksRef,
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('updatedAt', 'desc')
    )
  } else {
    q = query(
      booksRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )
  }

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as UserBookDoc
    return {
      bookId: data.bookId,
      status: data.status,
      progress: data.progress,
      startedAt: data.startedAt as Date | undefined,
      finishedAt: data.finishedAt as Date | undefined,
      updatedAt: data.updatedAt as Date,
    }
  })
}
