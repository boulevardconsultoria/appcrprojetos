import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Crown, Calendar, Save } from 'lucide-react'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserName } from '@/services/auth'
import { formatDate } from '@/utils'

export function ProfilePage() {
  const { user, userData, isPremium } = useAuth()
  const [name, setName] = useState(userData?.name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateUserName(name)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
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
      <div className="max-w-2xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-sm font-medium text-primary">Meu Perfil</h1>
          <p className="text-xs text-secondary mt-1">Gerencie suas informações pessoais</p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
                <div className="w-12 h-12 bg-elevated rounded-full flex items-center justify-center">
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-secondary" />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-medium text-primary">{userData?.name || 'Usuário'}</h2>
                  <p className="text-xs text-secondary">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.1em] text-muted mb-2">E-mail</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full rounded-md border border-border px-4 py-2.5 text-xs bg-elevated text-muted cursor-not-allowed"
                  />
                </div>
                <Button onClick={handleSave} loading={saving}>
                  <Save className="h-3.5 w-3.5" />
                  {saved ? 'Salvo!' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="text-xs font-medium text-primary mb-4">Informações da Conta</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <Crown className="h-3.5 w-3.5" />
                    <span>Plano</span>
                  </div>
                  <span className={`text-xs font-medium ${isPremium ? 'text-primary' : 'text-secondary'}`}>
                    {isPremium ? 'Premium' : 'Grátis'}
                  </span>
                </div>
                {userData?.createdAt && (
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Membro desde</span>
                    </div>
                    <span className="text-xs text-secondary">{formatDate(userData.createdAt)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <Mail className="h-3.5 w-3.5" />
                    <span>E-mail verificado</span>
                  </div>
                  <span className={`text-xs font-medium ${user.emailVerified ? 'text-secondary' : 'text-muted'}`}>
                    {user.emailVerified ? 'Sim' : 'Não'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
