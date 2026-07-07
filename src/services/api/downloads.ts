import { api } from './client'

export interface DownloadRecord {
  id: string
  projeto: {
    id: string
    titulo: string
    slug: string
    thumbnail: string
    eh_premium: boolean
    eh_gratuito: boolean
  }
  timestamp: string
}

export async function getDownloads(): Promise<DownloadRecord[]> {
  return api.get<DownloadRecord[]>('/downloads/')
}

export async function registerDownload(projetoId: string) {
  return api.post('/downloads/novo/', { projeto_id: projetoId })
}

export async function getDownloadUrl(projetoId: string): Promise<{ url: string }> {
  return api.post<{ url: string }>(`/downloads/presigned-url/${projetoId}/`)
}
