import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileDown } from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { getUserDownloads, getFileById } from '@/services/firestore'
import { getSignedUrl } from '@/services/storage'
import { formatDate } from '@/utils'
import type { FileData } from '@/types'

export function DownloadsPage() {
  const { user } = useAuth()
  const [downloads, setDownloads] = useState<(FileData & { downloadId: string; downloadedAt: Date })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const currentUser = user
    async function load() {
      const userDownloads = await getUserDownloads(currentUser.uid)
      const files = await Promise.all(
        userDownloads.map(async (d) => {
          const f = await getFileById(d.fileId)
          return f ? { ...f, downloadId: d.id, downloadedAt: d.createdAt } : null
        })
      )
      setDownloads(files.filter(Boolean) as any[])
      setLoading(false)
    }
    load()
  }, [user])

  async function handleDownload(file: FileData) {
    try {
      const url = await getSignedUrl(file.storagePath)
      window.open(url, '_blank')
    } catch (err) {
      console.error(err)
    }
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
      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-sm font-medium text-primary">Meus Downloads</h1>
          <p className="text-xs text-secondary mt-1">Histórico de todos os modelos que você baixou</p>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-border p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-elevated rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-elevated rounded w-1/3" />
                    <div className="h-2 bg-elevated rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : downloads.length > 0 ? (
          <div className="space-y-2">
            {downloads.map((d) => (
              <Card key={d.downloadId}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-elevated overflow-hidden shrink-0 flex items-center justify-center">
                      {d.thumbnail ? (
                        <img src={d.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileDown className="h-6 w-6 text-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/modelo/${d.slug}`} className="text-xs font-medium text-primary hover:text-[#EFEFEF] truncate block transition-colors">
                        {d.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={d.premium ? 'premium' : 'free'}>
                          {d.premium ? 'Premium' : 'Grátis'}
                        </Badge>
                        <span className="text-[11px] text-muted">
                          {formatDate(d.downloadedAt)}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => handleDownload(d)}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Download className="h-8 w-8 mx-auto mb-4 text-muted" />
            <h3 className="text-sm font-medium text-primary mb-2">Nenhum download ainda</h3>
            <p className="text-xs text-secondary mb-6">Comece a explorar o catálogo e baixe seus primeiros modelos.</p>
            <Link to="/catalogo">
              <Button>Explorar Catálogo</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
