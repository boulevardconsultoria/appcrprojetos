import { Link } from 'react-router-dom'
import { Download, Heart, Eye } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import type { FileData } from '@/types'

interface FileCardProps {
  file: FileData
  isFavorite?: boolean
  onToggleFavorite?: (fileId: string) => void
}

export function FileCard({ file, isFavorite, onToggleFavorite }: FileCardProps) {
  return (
    <Card hover className="group overflow-hidden">
      <Link to={`/modelo/${file.slug}`}>
        <div className="aspect-video bg-elevated relative overflow-hidden rounded-t-xl">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <Eye className="h-8 w-8" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={file.premium ? 'premium' : 'free'}>
              {file.premium ? 'Premium' : 'Grátis'}
            </Badge>
          </div>
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/modelo/${file.slug}`}>
          <h3 className="text-sm font-medium text-primary truncate group-hover:text-white transition-colors leading-snug">
            {file.title}
          </h3>
        </Link>
        <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">{file.description}</p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <div className="flex items-center gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {file.downloads || 0}
            </span>
            {file.sketchupVersion && (
              <span>SKP {file.sketchupVersion}</span>
            )}
          </div>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(file.id)
              }}
              className={`p-1 rounded transition-colors ${
                isFavorite
                  ? 'text-accent2 bg-accent2/10'
                  : 'text-muted hover:text-accent2 hover:bg-accent2/10'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
