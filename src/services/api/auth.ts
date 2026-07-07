import { api, setTokens, clearTokens } from './client'

export async function exchangeFirebaseToken(idToken: string) {
  const data = await api.post<{
    access: string
    refresh: string
    user: {
      id: number
      username: string
      email: string
      first_name: string
      last_name: string
    }
  }>('/contas/firebase-login/', { id_token: idToken })

  setTokens(data.access, data.refresh)
  return data
}

export async function logoutApi() {
  clearTokens()
}

export async function fetchPerfil() {
  return api.get<{
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    telefone: string
    eh_assinante_ativo: boolean
  }>('/contas/perfil/')
}

export async function updatePerfil(data: Partial<{
  first_name: string
  last_name: string
  telefone: string
}>) {
  return api.patch('/contas/perfil/', data)
}
