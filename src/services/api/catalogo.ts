import { api } from './client'

export interface ProjetoList {
  id: string
  titulo: string
  slug: string
  descricao: string
  categoria: number | null
  categoria_nome: string
  tags: string[]
  eh_gratuito: boolean
  eh_premium: boolean
  thumbnail: string
  peso_mb: number
  downloads_count: number
  criado_em: string
}

export interface ProjetoDetail extends ProjetoList {
  preco_avulso: string | null
  atualizado_em: string
}

export interface Categoria {
  id: number
  nome: string
  slug: string
  icone: string
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function getProjetos(params?: {
  categoria__slug?: string
  eh_gratuito?: boolean
  eh_premium?: boolean
  search?: string
  page?: number
}): Promise<PaginatedResponse<ProjetoList>> {
  const searchParams = new URLSearchParams()
  if (params?.categoria__slug) searchParams.set('categoria__slug', params.categoria__slug)
  if (params?.eh_gratuito !== undefined) searchParams.set('eh_gratuito', String(params.eh_gratuito))
  if (params?.eh_premium !== undefined) searchParams.set('eh_premium', String(params.eh_premium))
  if (params?.search) searchParams.set('search', params.search)
  if (params?.page) searchParams.set('page', String(params.page))

  const qs = searchParams.toString()
  return api.get<PaginatedResponse<ProjetoList>>(`/catalogo/projetos/${qs ? `?${qs}` : ''}`)
}

export async function getProjetoBySlug(slug: string): Promise<ProjetoDetail> {
  return api.get<ProjetoDetail>(`/catalogo/projetos/${slug}/`)
}

export async function getCategorias(): Promise<Categoria[]> {
  return api.get<Categoria[]>('/catalogo/categorias/')
}
