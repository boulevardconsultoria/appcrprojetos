import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button, Input, Modal } from '@/components/ui'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/services/firestore'
import { slugify } from '@/utils'
import type { Category } from '@/types'

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await getCategories()
    setCategories(data)
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setName('')
    setIcon('')
    setModalOpen(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setName(cat.name)
    setIcon(cat.icon)
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const slug = slugify(name)
      if (editing) {
        await updateCategory(editing.id, { name, slug, icon })
      } else {
        await addCategory({ name, slug, icon })
      }
      setModalOpen(false)
      load()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Excluir esta categoria?')) {
      await deleteCategory(id)
      load()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium text-primary">Categorias ({categories.length})</h2>
        <Button onClick={openNew} size="sm">
          <Plus className="h-3.5 w-3.5" /> Nova Categoria
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-muted">Carregando...</div>
      ) : categories.length > 0 ? (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-elevated border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Slug</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Ícone</th>
                  <th className="text-right px-4 py-3 font-medium text-muted">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-border hover:bg-elevated/50">
                    <td className="px-4 py-3 font-medium text-primary">{cat.name}</td>
                    <td className="px-4 py-3 text-secondary">{cat.slug}</td>
                    <td className="px-4 py-3 text-secondary">{cat.icon}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cat)} className="p-1.5 text-muted hover:text-primary hover:bg-elevated rounded transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-muted hover:text-primary hover:bg-elevated rounded transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-muted">Nenhuma categoria</div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Categoria' : 'Nova Categoria'}>
        <div className="space-y-4">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Ícone" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Ex: Building2, Home, Trees" />
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
