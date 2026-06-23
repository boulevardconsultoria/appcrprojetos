import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, Shield, Crown, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { logoutUser } from '@/services/auth'
import { Button } from '@/components/ui'

export function Header() {
  const { user, userData, isAdmin, isPremium } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    await logoutUser()
    navigate('/')
  }

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-7xl glass rounded-2xl" style={{ height: 56 }}>
      <div className="px-5 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://i.ibb.co/hJjWWBnr/cropped-25728138-07ce-4dbf-92b1-bd682cf5106a-192x192.jpg"
              alt="CR Projetos 3D"
              className="w-7 h-7 rounded object-cover"
            />
            <span className="font-medium text-sm text-primary hidden sm:block" style={{ fontFamily: 'Poppins, sans-serif' }}>
              CR Projetos 3D
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/catalogo" className="text-xs text-secondary hover:text-primary transition-colors tracking-wide">
              Catálogo
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1 tracking-wide">
                    <Shield className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1 tracking-wide">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Área do Cliente
                </Link>
                <div className="flex items-center gap-3">
                  {isPremium && (
                    <Crown className="h-4 w-4 text-accent" />
                  )}
                  <Link to="/perfil" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center glass">
                      {userData?.photoURL ? (
                        <img src={userData.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-secondary" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-secondary">{userData?.name || user.email}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-1.5 text-muted hover:text-secondary transition-colors">
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link to="/cadastro">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </div>
            )}
          </nav>

          <button
            className="md:hidden p-1.5 text-secondary hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-2 glass rounded-2xl p-4">
          <div className="space-y-3">
            <Link to="/catalogo" className="block text-xs text-secondary hover:text-primary py-2 tracking-wide" onClick={() => setMenuOpen(false)}>
              Catálogo
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="block text-xs text-secondary hover:text-primary py-2 tracking-wide" onClick={() => setMenuOpen(false)}>
                    Painel Admin
                  </Link>
                )}
                <Link to="/dashboard" className="block text-xs text-secondary hover:text-primary py-2 tracking-wide" onClick={() => setMenuOpen(false)}>
                  Área do Cliente
                </Link>
                <Link to="/perfil" className="block text-xs text-secondary hover:text-primary py-2 tracking-wide" onClick={() => setMenuOpen(false)}>
                  Perfil
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block text-xs text-secondary hover:text-primary py-2 tracking-wide">
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Entrar</Button>
                </Link>
                <Link to="/cadastro" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
