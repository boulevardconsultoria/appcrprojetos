import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Tags, Users, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/arquivos', icon: FolderKanban, label: 'Arquivos' },
  { path: '/admin/categorias', icon: Tags, label: 'Categorias' },
  { path: '/admin/usuarios', icon: Users, label: 'Usuários' },
]

export function AdminLayout() {
  const location = useLocation()
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-sm font-medium text-primary">Acesso Restrito</h2>
          <p className="text-xs text-secondary mt-2">Você não tem permissão para acessar esta área.</p>
          <Link to="/" className="text-xs text-secondary hover:text-primary mt-4 inline-block underline underline-offset-4">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-root" style={{ display: 'flex' }}>
      <nav className="hidden lg:flex flex-col bg-[#0D0D0D] border-r border-border shrink-0" style={{ width: 220 }}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Link>
        </div>
        <div className="flex flex-col gap-1 px-4">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-xs transition-colors ${
                  isActive
                    ? 'bg-elevated text-primary'
                    : 'text-secondary hover:text-primary hover:bg-elevated'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8 lg:hidden">
            <Link to="/" className="p-1.5 rounded hover:bg-elevated transition-colors">
              <ArrowLeft className="h-4 w-4 text-secondary" />
            </Link>
            <h1 className="text-sm font-medium text-primary">Painel Administrativo</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
