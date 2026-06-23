import { DEMO_FILES, DEMO_CATEGORIES, DEMO_DOWNLOADS, DEMO_FAVORITES, DEMO_USERS } from './data'
import type { FileData, Category, Download, UserData } from '@/types'

let files = [...DEMO_FILES]
let categories = [...DEMO_CATEGORIES]
let downloads = [...DEMO_DOWNLOADS]
let favorites = [...DEMO_FAVORITES]

export function resetDemoData() {
  files = [...DEMO_FILES]
  categories = [...DEMO_CATEGORIES]
  downloads = [...DEMO_DOWNLOADS]
  favorites = [...DEMO_FAVORITES]
}

export async function getFiles(filters?: {
  category?: string
  premium?: boolean
  search?: string
}): Promise<FileData[]> {
  let result = [...files]

  if (filters?.category) {
    result = result.filter((f) => f.category === filters.category)
  }
  if (filters?.premium !== undefined) {
    result = result.filter((f) => f.premium === filters.premium)
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getFileBySlug(slug: string): Promise<FileData | null> {
  return files.find((f) => f.slug === slug) || null
}

export async function getFileById(id: string): Promise<FileData | null> {
  return files.find((f) => f.id === id) || null
}

export async function addFile(data: Omit<FileData, 'id'>): Promise<string> {
  const id = `demo-file-${Date.now()}`
  files.push({ id, ...data, createdAt: new Date() } as FileData)
  return id
}

export async function updateFile(id: string, data: Partial<FileData>) {
  files = files.map((f) => (f.id === id ? { ...f, ...data } : f))
}

export async function deleteFile(id: string) {
  files = files.filter((f) => f.id !== id)
}

export async function incrementDownloads(fileId: string) {
  files = files.map((f) =>
    f.id === fileId ? { ...f, downloads: (f.downloads || 0) + 1 } : f
  )
}

export async function getCategories(): Promise<Category[]> {
  return [...categories]
}

export async function addCategory(data: Omit<Category, 'id'>): Promise<string> {
  const id = `demo-cat-${Date.now()}`
  categories.push({ id, ...data } as Category)
  return id
}

export async function updateCategory(id: string, data: Partial<Category>) {
  categories = categories.map((c) => (c.id === id ? { ...c, ...data } : c))
}

export async function deleteCategory(id: string) {
  categories = categories.filter((c) => c.id !== id)
}

export async function getUserDownloads(userId: string): Promise<Download[]> {
  return downloads
    .filter((d) => d.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export async function addDownload(userId: string, fileId: string) {
  downloads.push({
    id: `demo-dl-${Date.now()}`,
    userId,
    fileId,
    createdAt: new Date(),
  })
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  return favorites.filter((f) => f.userId === userId).map((f) => f.fileId)
}

export async function addFavorite(userId: string, fileId: string) {
  if (!favorites.some((f) => f.userId === userId && f.fileId === fileId)) {
    favorites.push({ userId, fileId })
  }
}

export async function removeFavorite(userId: string, fileId: string) {
  favorites = favorites.filter(
    (f) => !(f.userId === userId && f.fileId === fileId)
  )
}

export async function getAllUsers(): Promise<UserData[]> {
  return DEMO_USERS.map(({ password: _, ...u }) => u as UserData)
}

export async function updateUserRole(uid: string, role: 'user' | 'admin') {
  const user = DEMO_USERS.find((u) => u.uid === uid)
  if (user) user.role = role
}

export async function getDashboardStats() {
  const totalUsers = DEMO_USERS.length
  const premiumUsers = DEMO_USERS.filter((u) => u.premium).length
  const totalDownloads = files.reduce((acc, f) => acc + (f.downloads || 0), 0)
  const totalFiles = files.length

  return { totalUsers, premiumUsers, totalDownloads, totalFiles }
}
