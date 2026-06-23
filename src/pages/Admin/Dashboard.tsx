import { useEffect, useState } from 'react'
import { Users, Crown, Download, FolderKanban } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { getDashboardStats } from '@/services/firestore'

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, totalDownloads: 0, totalFiles: 0 })

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

  const cards = [
    { label: 'Usuários', value: stats.totalUsers, icon: Users },
    { label: 'Premium Ativos', value: stats.premiumUsers, icon: Crown },
    { label: 'Downloads', value: stats.totalDownloads, icon: Download },
    { label: 'Arquivos', value: stats.totalFiles, icon: FolderKanban },
  ]

  return (
    <div>
      <h2 className="text-sm font-medium text-primary mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted uppercase tracking-[0.1em]">{card.label}</p>
                  <p className="text-lg font-medium text-primary mt-1">{card.value}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-elevated">
                  <card.icon className="h-5 w-5 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
