import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/services/firebase/config'
import type { FileData, Category, Download, UserData } from '@/types'
import {
  getFiles as demoGetFiles,
  getFileBySlug as demoGetFileBySlug,
  getFileById as demoGetFileById,
  addFile as demoAddFile,
  updateFile as demoUpdateFile,
  deleteFile as demoDeleteFile,
  incrementDownloads as demoIncrementDownloads,
  getCategories as demoGetCategories,
  addCategory as demoAddCategory,
  updateCategory as demoUpdateCategory,
  deleteCategory as demoDeleteCategory,
  getUserDownloads as demoGetUserDownloads,
  addDownload as demoAddDownload,
  getUserFavorites as demoGetUserFavorites,
  addFavorite as demoAddFavorite,
  removeFavorite as demoRemoveFavorite,
  getAllUsers as demoGetAllUsers,
  updateUserRole as demoUpdateUserRole,
  getDashboardStats as demoGetDashboardStats,
} from '@/demo/firestore'

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

const FILES_COLLECTION = 'files'
const CATEGORIES_COLLECTION = 'categories'
const DOWNLOADS_COLLECTION = 'downloads'
const FAVORITES_COLLECTION = 'favorites'
const USERS_COLLECTION = 'users'

export async function getFiles(filters?: {
  category?: string
  premium?: boolean
  search?: string
}): Promise<FileData[]> {
  if (isDemo) return demoGetFiles(filters)
  let q = query(collection(db, FILES_COLLECTION), orderBy('createdAt', 'desc'))
  const constraints: any[] = []

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category))
  }
  if (filters?.premium !== undefined) {
    constraints.push(where('premium', '==', filters.premium))
  }

  if (constraints.length > 0) {
    q = query(collection(db, FILES_COLLECTION), ...constraints, orderBy('createdAt', 'desc'))
  }

  const snapshot = await getDocs(q)
  let files = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FileData))

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    files = files.filter(
      (f) =>
        f.title.toLowerCase().includes(searchLower) ||
        f.tags.some((t) => t.toLowerCase().includes(searchLower))
    )
  }

  return files
}

export async function getFileBySlug(slug: string): Promise<FileData | null> {
  if (isDemo) return demoGetFileBySlug(slug)
  const q = query(collection(db, FILES_COLLECTION), where('slug', '==', slug))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as FileData
}

export async function getFileById(id: string): Promise<FileData | null> {
  if (isDemo) return demoGetFileById(id)
  const docRef = doc(db, FILES_COLLECTION, id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as FileData
}

export async function addFile(data: Omit<FileData, 'id'>): Promise<string> {
  if (isDemo) return demoAddFile(data)
  const docRef = await addDoc(collection(db, FILES_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateFile(id: string, data: Partial<FileData>) {
  if (isDemo) return demoUpdateFile(id, data)
  await updateDoc(doc(db, FILES_COLLECTION, id), data)
}

export async function deleteFile(id: string) {
  if (isDemo) return demoDeleteFile(id)
  await deleteDoc(doc(db, FILES_COLLECTION, id))
}

export async function incrementDownloads(fileId: string) {
  if (isDemo) return demoIncrementDownloads(fileId)
  const ref = doc(db, FILES_COLLECTION, fileId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const current = snap.data().downloads || 0
    await updateDoc(ref, { downloads: current + 1 })
  }
}

export async function getCategories(): Promise<Category[]> {
  if (isDemo) return demoGetCategories()
  const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION))
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category))
}

export async function addCategory(data: Omit<Category, 'id'>): Promise<string> {
  if (isDemo) return demoAddCategory(data)
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), data)
  return docRef.id
}

export async function updateCategory(id: string, data: Partial<Category>) {
  if (isDemo) return demoUpdateCategory(id, data)
  await updateDoc(doc(db, CATEGORIES_COLLECTION, id), data)
}

export async function deleteCategory(id: string) {
  if (isDemo) return demoDeleteCategory(id)
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id))
}

export async function getUserDownloads(userId: string): Promise<Download[]> {
  if (isDemo) return demoGetUserDownloads(userId)
  const q = query(
    collection(db, DOWNLOADS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Download))
}

export async function addDownload(userId: string, fileId: string) {
  if (isDemo) return demoAddDownload(userId, fileId)
  await addDoc(collection(db, DOWNLOADS_COLLECTION), {
    userId,
    fileId,
    createdAt: serverTimestamp(),
  })
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  if (isDemo) return demoGetUserFavorites(userId)
  const q = query(
    collection(db, FAVORITES_COLLECTION),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data().fileId as string)
}

export async function addFavorite(userId: string, fileId: string) {
  if (isDemo) return demoAddFavorite(userId, fileId)
  const q = query(
    collection(db, FAVORITES_COLLECTION),
    where('userId', '==', userId),
    where('fileId', '==', fileId)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) {
    await addDoc(collection(db, FAVORITES_COLLECTION), { userId, fileId })
  }
}

export async function removeFavorite(userId: string, fileId: string) {
  if (isDemo) return demoRemoveFavorite(userId, fileId)
  const q = query(
    collection(db, FAVORITES_COLLECTION),
    where('userId', '==', userId),
    where('fileId', '==', fileId)
  )
  const snapshot = await getDocs(q)
  snapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })
}

export async function getAllUsers(): Promise<UserData[]> {
  if (isDemo) return demoGetAllUsers()
  const snapshot = await getDocs(collection(db, USERS_COLLECTION))
  return snapshot.docs.map((doc) => doc.data() as UserData)
}

export async function updateUserRole(uid: string, role: 'user' | 'admin') {
  if (isDemo) return demoUpdateUserRole(uid, role)
  await updateDoc(doc(db, USERS_COLLECTION, uid), { role })
}

export async function getDashboardStats(): Promise<{
  totalUsers: number
  premiumUsers: number
  totalDownloads: number
  totalFiles: number
}> {
  if (isDemo) return demoGetDashboardStats()
  const usersSnap = await getDocs(collection(db, USERS_COLLECTION))
  const filesSnap = await getDocs(collection(db, FILES_COLLECTION))

  let totalDownloads = 0
  filesSnap.docs.forEach((doc) => {
    totalDownloads += doc.data().downloads || 0
  })

  return {
    totalUsers: usersSnap.size,
    premiumUsers: usersSnap.docs.filter((d) => d.data().premium === true).length,
    totalDownloads,
    totalFiles: filesSnap.size,
  }
}
