export interface UserData {
  uid: string
  name: string
  email: string
  photoURL: string
  role: 'user' | 'admin'
  premium: boolean
  plan: string | null
  premiumUntil: Date | null
  createdAt: Date
}

export interface FileData {
  id: string
  title: string
  slug: string
  description: string
  premium: boolean
  category: string
  tags: string[]
  sketchupVersion: string
  render: string
  thumbnail: string
  storagePath: string
  fileSize: number
  downloads: number
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export interface Download {
  id: string
  userId: string
  fileId: string
  createdAt: Date
}

export interface Favorite {
  userId: string
  fileId: string
}

export interface FileFormData {
  title: string
  description: string
  premium: boolean
  category: string
  tags: string
  sketchupVersion: string
  render: string
  thumbnail: File | null
  file: File | null
  preview: File | null
}

export interface CategoryFormData {
  name: string
  slug: string
  icon: string
}
