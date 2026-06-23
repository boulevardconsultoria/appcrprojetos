import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { FileCard } from '@/components/cards'
import { Select } from '@/components/ui'
import { getFiles, getCategories, getUserFavorites, addFavorite, removeFavorite } from '@/services/firestore'
import { useAuth } from '@/contexts/AuthContext'
import type { FileData, Category } from '@/types'

export function CatalogPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [premiumFilter, setPremiumFilter] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const filters: Record<string, string | boolean> = {}
      if (categoryFilter) filters.category = categoryFilter
      if (premiumFilter === 'gratis') filters.premium = false
      if (premiumFilter === 'premium') filters.premium = true
      if (searchTerm) filters.search = searchTerm

      const result = await getFiles(filters)
      setFiles(result)
      setLoading(false)
    }
    load()
  }, [categoryFilter, premiumFilter, searchTerm])

  useEffect(() => {
    if (user) {
      getUserFavorites(user.uid).then(setFavorites)
    }
  }, [user])

  async function handleToggleFavorite(fileId: string) {
    if (!user) return
    if (favorites.includes(fileId)) {
      await removeFavorite(user.uid, fileId)
      setFavorites((prev) => prev.filter((id) => id !== fileId))
    } else {
      await addFavorite(user.uid, fileId)
      setFavorites((prev) => [...prev, fileId])
    }
  }

  return (
    <div className="min-h-screen bg-root">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-sm font-medium text-primary">Catálogo de Modelos</h1>
          <p className="text-xs text-secondary mt-1">Encontre o modelo perfeito para seu projeto</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-md border border-[rgba(255,255,255,0.1)] bg-elevated text-sm text-[#eee] placeholder:text-muted focus:outline-none focus:border-[rgba(255,255,255,0.3)]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <div className="w-full lg:w-48">
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  placeholder="Todas categorias"
                  options={categories.map((c) => ({ value: c.slug, label: c.name }))}
                />
              </div>
              <div className="w-full lg:w-40">
                <Select
                  value={premiumFilter}
                  onChange={(e) => setPremiumFilter(e.target.value)}
                  placeholder="Todos"
                  options={[
                    { value: 'gratis', label: 'Grátis' },
                    { value: 'premium', label: 'Premium' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
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
                isFavorite={favorites.includes(file.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SlidersHorizontal className="h-8 w-8 mx-auto mb-4 text-muted" />
            <h3 className="text-sm font-medium text-primary mb-2">Nenhum modelo encontrado</h3>
            <p className="text-xs text-secondary">Tente ajustar os filtros ou buscar por outro termo.</p>
          </div>
        )}
      </div>
    </div>
  )
}
