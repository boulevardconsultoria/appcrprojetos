import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LogIn, Eye, EyeOff, FlaskConical } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { loginWithEmail, loginWithGoogle } from '@/services/auth'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_USERS } from '@/demo/data'

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export function LoginPage() {
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (user) {
    navigate('/dashboard')
    return null
  }

  function fillDemoCredentials(entry: typeof DEMO_USERS[number]) {
    setValue('email', entry.email)
    setValue('password', entry.password)
  }

  async function onSubmit(data: FormData) {
    try {
      setError('')
      await loginWithEmail(data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('')
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-sm font-medium text-primary">Entrar</h1>
          <p className="text-xs text-secondary mt-2">Entre na sua conta para continuar</p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6">
          {isDemo && (
            <div className="mb-6 p-4 rounded-lg border border-border bg-elevated">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="h-3.5 w-3.5 text-secondary" />
                <span className="text-xs font-medium text-primary">Modo Demonstração</span>
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-elevated text-secondary border border-border">Demo</span>
              </div>
              <p className="text-[11px] text-muted mb-3">Clique em um usuário para preencher os dados:</p>
              <div className="space-y-2">
                {DEMO_USERS.map((entry) => (
                  <button
                    key={entry.uid}
                    type="button"
                    onClick={() => fillDemoCredentials(entry)}
                    className="w-full flex items-center gap-3 p-2.5 rounded border border-border bg-surface hover:bg-elevated transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-elevated flex items-center justify-center text-xs font-medium text-secondary shrink-0">
                      {entry.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary truncate">{entry.name}</p>
                      <p className="text-[11px] text-muted truncate">{entry.email}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-elevated text-muted border border-border">
                      {entry.role === 'admin' ? 'Admin' : entry.premium ? 'Premium' : 'Grátis'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {error && (
            <div className="bg-elevated text-secondary text-xs p-3 rounded-lg mb-4 border border-border">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[31px] text-muted hover:text-secondary"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/recuperar-senha" className="text-[11px] text-secondary hover:text-primary transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full">
              <LogIn className="h-3.5 w-3.5" />
              Entrar
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-surface text-muted">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
            </svg>
            Entrar com Google
          </Button>

          <p className="text-center text-xs text-muted mt-6">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-secondary hover:text-primary transition-colors underline underline-offset-4">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
