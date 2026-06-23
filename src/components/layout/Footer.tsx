import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-root border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://i.ibb.co/hJjWWBnr/cropped-25728138-07ce-4dbf-92b1-bd682cf5106a-192x192.jpg"
                alt="CR Projetos 3D"
                className="w-7 h-7 rounded object-cover"
              />
              <span className="font-medium text-sm text-primary">CR Projetos 3D</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Pioneiros em visualização 3D para esquadrias, trazendo clareza e precisão para fabricantes, vidraçarias e arquitetos desde 2019.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.1em] text-muted mb-4">Links</h3>
            <div className="space-y-2">
              <Link to="/catalogo" className="block text-xs text-secondary hover:text-primary transition-colors">
                Catálogo
              </Link>
              <Link to="/login" className="block text-xs text-secondary hover:text-primary transition-colors">
                Entrar
              </Link>
              <Link to="/cadastro" className="block text-xs text-secondary hover:text-primary transition-colors">
                Criar Conta
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.1em] text-muted mb-4">Premium</h3>
            <div className="space-y-2">
              <Link to="/planos" className="block text-xs text-secondary hover:text-primary transition-colors">
                Planos
              </Link>
              <p className="text-xs text-muted">Downloads ilimitados</p>
              <p className="text-xs text-muted">Modelos exclusivos</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-[11px] text-muted">&copy; {new Date().getFullYear()} CR Projetos 3D. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
