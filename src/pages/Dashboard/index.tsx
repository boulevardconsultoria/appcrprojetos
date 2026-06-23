import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Crown, Heart, Download, User, ArrowRight, FileDown } from 'lucide-react'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { getUserDownloads, getUserFavorites, getFileById } from '@/services/firestore'
import { formatDate } from '@/utils'
import type { FileData } from '@/types'

export function DashboardPage() {
  const { user, userData, isPremium } = useAuth()
  const [downloads, setDownloads] = useState<(FileData | null)[]>([])
  const [favorites, setFavorites] = useState<(FileData | null)[]>([])

  useEffect(() => {
    if (!user) return
    async function load() {
      if (!user) return
      const [userDownloads, userFavs] = await Promise.all([
        getUserDownloads(user.uid),
        getUserFavorites(user.uid),
      ])
      const downloadFiles = await Promise.all(
        userDownloads.slice(0, 5).map((d) => getFileById(d.fileId))
      )
      const favFiles = await Promise.all(
        userFavs.map((fid) => getFileById(fid))
      )
      setDownloads(downloadFiles.filter(Boolean))
      setFavorites(favFiles.filter(Boolean))
    }
    load()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-sm font-medium text-primary">Faça login para acessar</h2>
          <Link to="/login" className="text-xs text-secondary hover:text-primary mt-2 inline-block underline underline-offset-4">
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-root">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-sm font-medium text-primary">Olá, {userData?.name || 'Usuário'}!</h1>
          <p className="text-xs text-secondary mt-1">Bem-vindo à sua área do cliente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted uppercase tracking-[0.1em]">Plano Atual</p>
                  <p className="text-sm font-medium mt-1.5">
                    {isPremium ? (
                      <span className="text-primary">Premium</span>
                    ) : (
                      <span className="text-secondary">Grátis</span>
                    )}
                  </p>
                  {isPremium && userData?.premiumUntil && (
                    <p className="text-[11px] text-muted mt-1">
                      Válido até {formatDate(userData.premiumUntil)}
                    </p>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-elevated">
                  {isPremium ? (
                    <Crown className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-muted" />
                  )}
                </div>
              </div>
              {!isPremium && (
                <Link to="/planos">
                  <Button variant="secondary" size="sm" className="w-full mt-4">
                    <Crown className="h-3.5 w-3.5" /> Assinar Premium
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted uppercase tracking-[0.1em]">Downloads</p>
                  <p className="text-sm font-medium mt-1.5 text-primary">{downloads.length}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-elevated">
                  <Download className="h-5 w-5 text-secondary" />
                </div>
              </div>
              {downloads.length > 0 && (
                <Link to="/downloads" className="text-xs text-secondary hover:text-primary mt-4 inline-block transition-colors">
                  Ver todos
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted uppercase tracking-[0.1em]">Favoritos</p>
                  <p className="text-sm font-medium mt-1.5 text-primary">{favorites.length}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-elevated">
                  <Heart className="h-5 w-5 text-secondary" />
                </div>
              </div>
              {favorites.length > 0 && (
                <Link to="/favoritos" className="text-xs text-secondary hover:text-primary mt-4 inline-block transition-colors">
                  Ver todos
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-medium text-primary">Downloads Recentes</h2>
              <Link to="/downloads" className="text-[11px] text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {downloads.length > 0 ? downloads.map((file) => file ? (
                <Link key={file.id} to={`/modelo/${file.slug}`} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border hover:border-[rgba(255,255,255,0.15)] transition-colors">
                  <div className="w-10 h-10 rounded bg-elevated overflow-hidden shrink-0 flex items-center justify-center">
                    {file.thumbnail ? (
                      <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileDown className="h-5 w-5 text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary truncate">{file.title}</p>
                    <Badge variant={file.premium ? 'premium' : 'free'}>{file.premium ? 'Premium' : 'Grátis'}</Badge>
                  </div>
                </Link>
              ) : null) : (
                <p className="text-xs text-muted text-center py-6">Nenhum download ainda</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-medium text-primary">Favoritos</h2>
              <Link to="/favoritos" className="text-[11px] text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {favorites.length > 0 ? favorites.map((file) => file ? (
                <Link key={file.id} to={`/modelo/${file.slug}`} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border hover:border-[rgba(255,255,255,0.15)] transition-colors">
                  <div className="w-10 h-10 rounded bg-elevated overflow-hidden shrink-0 flex items-center justify-center">
                    {file.thumbnail ? (
                      <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Heart className="h-5 w-5 text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary truncate">{file.title}</p>
                    <Badge variant={file.premium ? 'premium' : 'free'}>{file.premium ? 'Premium' : 'Grátis'}</Badge>
                  </div>
                </Link>
              ) : null) : (
                <p className="text-xs text-muted text-center py-6">Nenhum favorito ainda</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
