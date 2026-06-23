import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/services/firebase/config'

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  if (isDemo) return URL.createObjectURL(file)
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytesResumable(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}

export async function uploadThumbnail(
  file: File,
  fileId: string
): Promise<string> {
  if (isDemo) return URL.createObjectURL(file)
  const ext = file.name.split('.').pop()
  const path = `thumbnails/${fileId}.${ext}`
  return uploadFile(file, path)
}

export async function uploadModel(
  file: File,
  fileId: string
): Promise<string> {
  if (isDemo) return URL.createObjectURL(file)
  const ext = file.name.split('.').pop()
  const path = `models/${fileId}.${ext}`
  return uploadFile(file, path)
}

export async function uploadPreview(
  file: File,
  fileId: string
): Promise<string> {
  if (isDemo) return URL.createObjectURL(file)
  const ext = file.name.split('.').pop()
  const path = `previews/${fileId}.${ext}`
  return uploadFile(file, path)
}

export async function deleteStorageFile(path: string) {
  if (isDemo) return
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

export async function getSignedUrl(path: string): Promise<string> {
  if (isDemo) return '#'
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}
