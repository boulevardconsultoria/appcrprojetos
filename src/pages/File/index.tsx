import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, Crown, Calendar, HardDrive, Eye, Heart, Tag, ArrowLeft, Layers, FileDown } from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { getFileBySlug, addDownload, getUserFavorites, addFavorite, removeFavorite, incrementDownloads } from '@/services/firestore'
import { getSignedUrl } from '@/services/storage'
import { formatFileSize, formatDate } from '@/utils'
import type { FileData } from '@/types'

export function FilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { user, isPremium } = useAuth()
  const [file, setFile] = useState<FileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getFileBySlug(slug).then((data) => {
      setFile(data)
      setLoading(false)
    })
  }, [slug])

  useEffect(() => {
    if (user && file) {
      getUserFavorites(user.uid).then((favs) => {
        setIsFavorite(favs.includes(file.id))
      })
    }
  }, [user, file])

  async function handleDownload() {
    if (!file || !user) return
    if (file.premium && !isPremium) return

    setDownloading(true)
    try {
      const url = await getSignedUrl(file.storagePath)
      await addDownload(user.uid, file.id)
      await incrementDownloads(file.id)
      window.open(url, '_blank')
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  async function handleToggleFavorite() {
    if (!user || !file) return
    if (isFavorite) {
      await removeFavorite(user.uid, file.id)
      setIsFavorite(false)
    } else {
      await addFavorite(user.uid, file.id)
      setIsFavorite(true)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="aspect-video bg-elevated rounded-lg" />
          <div className="h-5 bg-elevated rounded w-1/2" />
          <div className="h-3 bg-elevated rounded w-full" />
          <div className="h-3 bg-elevated rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (!file) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Eye className="h-8 w-8 mx-auto mb-4 text-muted" />
        <h2 className="text-sm font-medium text-primary">Modelo não encontrado</h2>
        <p className="text-xs text-secondary mt-2">O modelo que você procura não existe ou foi removido.</p>
        <Link to="/catalogo" className="inline-block mt-6">
          <Button variant="secondary">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao catálogo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-root">
      <div className="max-w-5xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
        <Link to="/catalogo" className="inline-flex items-center gap-1 text-xs text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-lg overflow-hidden border border-border">
              {file.thumbnail ? (
                <img src={file.thumbnail} alt={file.title} className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full aspect-video bg-elevated flex items-center justify-center">
                  <Layers className="h-12 w-12 text-muted" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-5 space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-sm font-medium text-primary">{file.title}</h1>
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-1.5 rounded shrink-0 transition-colors ${
                        isFavorite ? 'text-primary bg-elevated' : 'text-muted hover:text-primary hover:bg-elevated'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="mt-3">
                    <Badge variant={file.premium ? 'premium' : 'free'}>
                      {file.premium ? 'Premium' : 'Grátis'}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-secondary leading-relaxed">{file.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  {file.category && (
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{file.category}</span>
                    </div>
                  )}
                  {file.sketchupVersion && (
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <Layers className="h-3.5 w-3.5" />
                      <span>SKP {file.sketchupVersion}</span>
                    </div>
                  )}
                  {file.fileSize > 0 && (
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <HardDrive className="h-3.5 w-3.5" />
                      <span>{formatFileSize(file.fileSize)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <FileDown className="h-3.5 w-3.5" />
                    <span>{file.downloads || 0} downloads</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>

                {file.tags && file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {file.tags.map((tag) => (
                      <span key={tag} className="text-[11px] bg-elevated text-muted px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  {!user ? (
                    <Link to="/login">
                      <Button className="w-full">
                        <Download className="h-3.5 w-3.5" /> Entrar para baixar
                      </Button>
                    </Link>
                  ) : file.premium && !isPremium ? (
                    <Link to="/planos">
                      <Button variant="secondary" className="w-full">
                        <Crown className="h-3.5 w-3.5" /> Assinar para baixar
                      </Button>
                    </Link>
                  ) : (
                    <Button onClick={handleDownload} loading={downloading} className="w-full">
                      <Download className="h-3.5 w-3.5" /> Baixar Modelo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
