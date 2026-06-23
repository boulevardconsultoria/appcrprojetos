import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui'
import { FileCard } from '@/components/cards'
import { useAuth } from '@/contexts/AuthContext'
import { getUserFavorites, getFileById, removeFavorite } from '@/services/firestore'
import type { FileData } from '@/types'

export function FavoritesPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const currentUser = user
    async function load() {
      const favIds = await getUserFavorites(currentUser.uid)
      const favFiles = await Promise.all(favIds.map((fid) => getFileById(fid)))
      setFiles(favFiles.filter(Boolean) as FileData[])
      setLoading(false)
    }
    load()
  }, [user])

  async function handleRemoveFavorite(fileId: string) {
    if (!user) return
    await removeFavorite(user.uid, fileId)
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-sm font-medium text-primary">Faça login para acessar</h2>
          <Link to="/login" className="text-xs text-secondary hover:text-primary mt-2 inline-block underline underline-offset-4">Entrar</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-root">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-sm font-medium text-primary">Meus Favoritos</h1>
          <p className="text-xs text-secondary mt-1">Modelos que você salvou para baixar depois</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-border overflow-hidden animate-pulse">
                <div className="aspect-video bg-elevated" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-elevated rounded w-3/4" />
                  <div className="h-2 bg-elevated rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isFavorite={true}
                onToggleFavorite={handleRemoveFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-8 w-8 mx-auto mb-4 text-muted" />
            <h3 className="text-sm font-medium text-primary mb-2">Nenhum favorito</h3>
            <p className="text-xs text-secondary mb-6">Salve modelos como favoritos para encontrá-los facilmente.</p>
            <Link to="/catalogo">
              <Button>Explorar Catálogo</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
