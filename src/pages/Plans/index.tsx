import { Link } from 'react-router-dom'
import { Check, Crown } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    features: [
      'Acesso a modelos gratuitos',
      'Downloads limitados',
      'Suporte básico',
    ],
    highlighted: false,
  },
  {
    name: 'Premium Mensal',
    price: 'R$ 29,90',
    period: '/mês',
    features: [
      'Downloads ilimitados',
      'Todos os modelos Premium',
      'Modelos exclusivos',
      'Suporte prioritário',
      'Sem anúncios',
    ],
    highlighted: true,
  },
  {
    name: 'Premium Anual',
    price: 'R$ 199,90',
    period: '/ano',
    features: [
      'Todos os benefícios do Premium',
      '2 meses grátis',
      'Preço exclusivo',
      'Suporte VIP',
    ],
    highlighted: false,
  },
]

export function PlansPage() {
  const { user, isPremium } = useAuth()

  function handleCheckout(planName: string) {
    const prices: Record<string, string> = {
      'Premium Mensal': 'mensal',
      'Premium Anual': 'anual',
    }
    const plan = prices[planName]
    if (plan) {
      const hotmartUrl = `${import.meta.env.VITE_HOTMART_CHECKOUT_URL}?plan=${plan}`
      window.open(hotmartUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-root">
      <div className="max-w-5xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-elevated text-secondary px-3 py-1 rounded text-[11px] uppercase tracking-[0.1em] mb-4">
            <Crown className="h-3.5 w-3.5" /> Planos
          </div>
          <h1 className="text-lg font-medium text-primary">Escolha o plano ideal para você</h1>
          <p className="text-xs text-secondary mt-3">Acesso ilimitado a todos os modelos SketchUp</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.highlighted ? 'border-[rgba(255,255,255,0.2)]' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-root text-[11px] font-medium px-3 py-1 rounded">
                  Mais Popular
                </div>
              )}
              <CardContent className="p-5">
                <h3 className="text-sm font-medium text-primary">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-lg font-medium text-primary">{plan.price}</span>
                  <span className="text-xs text-secondary">{plan.period}</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-secondary">
                      <Check className="h-3.5 w-3.5 text-secondary mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {!user ? (
                    <Link to="/cadastro">
                      <Button className="w-full">Criar Conta</Button>
                    </Link>
                  ) : isPremium ? (
                    <Button disabled className="w-full">Plano Ativo</Button>
                  ) : (
                    <Button
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      className="w-full"
                      onClick={() => handleCheckout(plan.name)}
                    >
                      Assinar Agora
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
