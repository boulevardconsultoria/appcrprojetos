import { useEffect, useState } from 'react'
import { Crown, Shield, User } from 'lucide-react'
import { Button, Input, Badge } from '@/components/ui'
import { getAllUsers, updateUserRole } from '@/services/firestore'
import { formatDate } from '@/utils'
import type { UserData } from '@/types'

export function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data)
      setLoading(false)
    })
  }, [])

  async function toggleRole(uid: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    await updateUserRole(uid, newRole)
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)))
  }

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium text-primary">Usuários ({users.length})</h2>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-muted">Carregando...</div>
      ) : filtered.length > 0 ? (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-elevated border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted">Usuário</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">E-mail</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Plano</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Função</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Cadastro</th>
                  <th className="text-right px-4 py-3 font-medium text-muted">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.uid} className="border-b border-border hover:bg-elevated/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-elevated rounded-full flex items-center justify-center">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-secondary" />
                          )}
                        </div>
                        <span className="font-medium text-primary">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.premium ? (
                        <Badge variant="premium"><Crown className="h-3 w-3" /> Premium</Badge>
                      ) : (
                        <Badge variant="free">Grátis</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'admin' ? 'warning' : 'default'}>
                        {u.role === 'admin' ? 'Admin' : 'Usuário'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-secondary">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleRole(u.uid, u.role)}
                      >
                        <Shield className="h-3.5 w-3.5" />
                        {u.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-muted">Nenhum usuário encontrado</div>
      )}
    </div>
  )
}
