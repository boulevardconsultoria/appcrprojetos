import { api } from './client'

export interface CheckoutResponse {
  checkout_id: string
  url: string
  amount: number
  dev_mode: boolean
}

export async function criarCheckout(projetoId: string): Promise<CheckoutResponse> {
  return api.post<CheckoutResponse>('/pagamentos/checkout/', { projeto_id: projetoId })
}
