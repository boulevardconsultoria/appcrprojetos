import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { resetPassword } from '@/services/auth'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      setError('')
      await resetPassword(data.email)
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-sm font-medium text-primary">Recuperar Senha</h1>
          <p className="text-xs text-secondary mt-2">Receba um link para redefinir sua senha</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-sm font-medium text-primary mb-2">E-mail enviado!</h2>
              <p className="text-xs text-secondary mb-6 leading-relaxed">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
              <Link to="/login">
                <Button variant="secondary">
                  <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-elevated text-secondary text-xs p-3 rounded-lg mb-4 border border-border">{error}</div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" loading={isSubmitting} className="w-full">
                  Enviar Link
                </Button>
              </form>
              <p className="text-center text-xs text-muted mt-6">
                <Link to="/login" className="text-secondary hover:text-primary transition-colors underline underline-offset-4 flex items-center justify-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
