import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  ArrowRight, Crown, Download, Layers, Shield, Zap, TrendingUp,
  Building2, Home, Trees, LampDesk, DoorOpen, Cuboid, Star, Users,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { FileCard } from '@/components/cards'
import { useAuth } from '@/contexts/AuthContext'
import { getFiles, getCategories } from '@/services/firestore'
import { useReveal } from '@/hooks/useReveal'
import { GALLERY_IMAGES, INSTRUCTOR_IMG, SKETCHUP_LOGO, SEAL_7DAYS } from '@/demo/data'
import type { FileData, Category } from '@/types'

const benefits = [
  { icon: Download, title: 'Downloads Ilimitados', desc: 'Baixe quantos modelos quiser com o plano Premium' },
  { icon: Layers, title: 'Modelos Exclusivos', desc: 'Acesso a modelos SketchUp de alta qualidade' },
  { icon: Zap, title: 'Atualizações Semanais', desc: 'Novos modelos toda semana' },
  { icon: Shield, title: 'Acesso Vitalício', desc: 'Baixe novamente quando precisar' },
]

const categoryIcons: Record<string, React.ElementType> = {
  Building2, Home, Trees, LampDesk, DoorOpen, Cuboid,
}

const timeline = [
  { year: '2020', title: 'Fundação', desc: 'Cleiton C. Ribeiro funda a CR Projetos 3D com foco em modelagem SketchUp para esquadrias.' },
  { year: '2021', title: 'Primeiros Clientes', desc: 'Fechamos parceria com as primeiras fábricas de esquadrias, entregando cortes e perfis detalhados.' },
  { year: '2022', title: 'Catálogo Online', desc: 'Lançamos o primeiro catálogo digital com modelos organizados por categoria.' },
  { year: '2023', title: 'Biblioteca Premium', desc: 'Ultrapassamos 500 modelos exclusivos com suporte a SketchUp 2023 e V-Ray.' },
  { year: '2025', title: 'CR Projetos 3D App', desc: 'Lançamos a plataforma web com área do cliente, downloads e planos de assinatura.' },
  { year: '2026', title: 'Referência Nacional', desc: 'Nos tornamos referência em modelos SketchUp para esquadrias no Brasil.' },
]

function RevealSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, revealed } = useReveal({ delay })
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3.5'} ${className}`}
    >
      {children}
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-root z-0" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent2/5 rounded-full blur-[100px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 w-full pt-24 lg:pt-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <RevealSection>
              <div className="inline-flex items-center gap-2 glass text-secondary px-4 py-1.5 rounded text-[11px] uppercase tracking-[0.1em] mb-6">
                <TrendingUp className="h-3.5 w-3.5 text-accent" />
                Modelos SketchUp de alta qualidade
              </div>
            </RevealSection>
            <RevealSection delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight">
                Modelos SketchUp <br />
                <span className="text-gradient-red">Premium</span>
              </h1>
            </RevealSection>
            <RevealSection delay={200}>
              <p className="mt-6 text-base text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A maior plataforma de modelos SketchUp do Brasil. Baixe milhares de modelos
                para arquitetura, design de interiores e paisagismo.
              </p>
            </RevealSection>
            <RevealSection delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row items-center lg:justify-start gap-4">
                <Link to="/catalogo">
                  <Button size="lg">
                    Explorar Catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/catalogo">
                  <Button variant="ghost" size="lg">Ver Modelos Grátis</Button>
                </Link>
              </div>
            </RevealSection>
            <RevealSection delay={400}>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-[11px] text-muted uppercase tracking-[0.1em]">
                <span className="flex items-center gap-1.5"><Download className="h-3.5 w-3.5 text-accent" /> Downloads grátis</span>
                <span className="flex items-center gap-1.5"><Crown className="h-3.5 w-3.5 text-accent" /> Planos Premium</span>
                <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-accent" /> Atualização semanal</span>
              </div>
            </RevealSection>
          </div>

          <RevealSection delay={200} className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-root via-root/60 to-transparent z-10 rounded-2xl" />
              <img
                src={GALLERY_IMAGES[0]}
                alt="Render CR Projetos 3D"
                className="w-full h-[400px] lg:h-[520px] object-cover rounded-2xl shadow-glowCyan"
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 glass rounded-xl p-4 flex items-center gap-3">
                <img src={SKETCHUP_LOGO} alt="SketchUp" className="h-8 w-8" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary truncate">Modelo Corte Suprema 70</p>
                  <p className="text-[11px] text-muted">SketchUp 2023 • V-Ray</p>
                </div>
                <span className="bg-accent/20 text-accent text-[11px] font-medium px-2.5 py-1 rounded-lg uppercase tracking-wider">Premium</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  )
}

function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <RevealSection>
          <h2 className="text-sm font-medium text-primary text-center mb-10 tracking-wide uppercase">Categorias</h2>
        </RevealSection>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => {
            const IconComponent = categoryIcons[cat.icon] || Layers
            return (
              <RevealSection key={cat.id} delay={i * 50}>
                <Link
                  to={`/catalogo?categoria=${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl glass hover:bg-white/[0.08] transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-accent group-hover:text-accent" />
                  </div>
                  <span className="text-xs text-secondary group-hover:text-primary transition-colors">{cat.name}</span>
                </Link>
              </RevealSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function GallerySection() {
  const displayImages = GALLERY_IMAGES.slice(0, 6)
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nossos <span className="text-gradient-red">Renders</span>
            </h2>
            <p className="mt-3 text-sm text-secondary max-w-xl mx-auto">
              Modelos realistas prontos para uso em seus projetos
            </p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayImages.map((img, i) => (
            <RevealSection key={i} delay={i * 80}>
              <div className="group relative overflow-hidden rounded-xl aspect-[4/3]">
                <div className="absolute inset-0 bg-gradient-to-t from-root/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={img}
                  alt={`Render ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs text-primary font-medium">Ver modelo</span>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nossa <span className="text-gradient-red">Trajetória</span>
            </h2>
            <p className="mt-3 text-sm text-secondary max-w-xl mx-auto">
              De 2020 até hoje construindo a maior biblioteca de modelos do Brasil
            </p>
          </div>
        </RevealSection>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-accent/0" />

          {timeline.map((item, i) => (
            <RevealSection key={item.year} delay={i * 100}>
              <div className={`relative flex items-start gap-8 pb-16 last:pb-0 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="flex-1" />

                <div className="relative z-10 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full glass shadow-glowCyan flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                  </div>
                </div>

                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <span className="text-[11px] font-semibold text-accent uppercase tracking-[0.15em]">{item.year}</span>
                  <h3 className="text-base font-semibold text-primary mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.title}</h3>
                  <p className="text-xs text-secondary mt-1 leading-relaxed max-w-sm ml-auto">{item.desc}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function InstructorSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="glass rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent2/20 rounded-2xl blur-xl" />
                <img
                  src={INSTRUCTOR_IMG}
                  alt="Cleiton C. Ribeiro"
                  className="relative z-10 w-36 h-36 lg:w-44 lg:h-44 rounded-2xl object-cover shadow-glowCyan"
                />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 glass text-accent px-3 py-1 rounded text-[11px] uppercase tracking-[0.1em] mb-4">
                <Star className="h-3 w-3" />
                Instrutor
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Cleiton C. Ribeiro
              </h3>
              <p className="mt-2 text-sm text-secondary leading-relaxed max-w-lg">
                Especialista em modelagem 3D para esquadrias com mais de 5 anos de experiência
                no mercado de alumínio e vidro. Fundador da CR Projetos 3D.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-accent" /> +300 alunos</span>
                <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-accent" /> +500 modelos</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-accent" /> SketchUp Expert</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <img src={SEAL_7DAYS} alt="Garantia 7 dias" className="h-24 lg:h-28" />
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

function FeaturedFilesSection({ files }: { files: FileData[] }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-medium text-primary tracking-wide uppercase">Modelos Recentes</h2>
            <Link to="/catalogo" className="text-xs text-accent hover:text-accent font-medium flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </RevealSection>
        {files.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.slice(0, 8).map((file, i) => (
              <RevealSection key={file.id} delay={i * 60}>
                <FileCard file={file} />
              </RevealSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted">
            <Layers className="h-8 w-8 mx-auto mb-3" />
            <p className="text-xs">Nenhum modelo cadastrado ainda.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <RevealSection>
          <h2 className="text-sm font-medium text-primary text-center mb-12 tracking-wide uppercase">
            Por que escolher a CR Projetos 3D?
          </h2>
        </RevealSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <RevealSection key={benefit.title} delay={i * 80}>
              <div className="glass rounded-xl p-6 text-center h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-accent/10">
                  <benefit.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-primary mb-2">{benefit.title}</h3>
                <p className="text-xs text-secondary leading-relaxed">{benefit.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ user }: { user: boolean }) {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
        <RevealSection>
          <div className="glass rounded-2xl p-8 lg:p-12">
            <h2 className="text-xl lg:text-2xl font-bold text-primary mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Comece agora mesmo
            </h2>
            <p className="text-sm text-secondary mb-8 leading-relaxed max-w-lg mx-auto">
              Crie sua conta gratuita e comece a baixar modelos incríveis para seus projetos.
            </p>
            <Link to={user ? '/catalogo' : '/cadastro'}>
              <Button size="lg">
                {user ? 'Explorar Catálogo' : 'Criar Conta Grátis'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

export function HomePage() {
  const { user, isPremium } = useAuth()
  const [featuredFiles, setFeaturedFiles] = useState<FileData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

  useEffect(() => {
    if (isDemo) {
      import('@/demo/data').then((mod) => {
        setFeaturedFiles(mod.DEMO_FILES)
        setCategories(mod.DEMO_CATEGORIES)
      })
    } else {
      getFiles().then(setFeaturedFiles)
      getCategories().then(setCategories)
    }
  }, [isDemo])

  return (
    <div>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <GallerySection />
      <TimelineSection />
      <InstructorSection />
      <FeaturedFilesSection files={featuredFiles} />
      <BenefitsSection />
      {!isPremium && <CTASection user={!!user} />}
    </div>
  )
}
