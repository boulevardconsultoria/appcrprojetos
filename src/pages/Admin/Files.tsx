import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button, Input, Modal } from '@/components/ui'
import { getFiles, addFile, updateFile, deleteFile } from '@/services/firestore'
import { uploadThumbnail, uploadModel } from '@/services/storage'
import { slugify } from '@/utils'
import type { FileData } from '@/types'

export function AdminFiles() {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<FileData | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', premium: false, category: '',
    tags: '', sketchupVersion: '', render: '',
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadFiles() }, [])

  async function loadFiles() {
    setLoading(true)
    const data = await getFiles()
    setFiles(data)
    setLoading(false)
  }

  function openNew() {
    setEditingFile(null)
    setForm({ title: '', description: '', premium: false, category: '', tags: '', sketchupVersion: '', render: '' })
    setThumbnailFile(null)
    setModelFile(null)
    setModalOpen(true)
  }

  function openEdit(file: FileData) {
    setEditingFile(file)
    setForm({
      title: file.title, description: file.description, premium: file.premium,
      category: file.category, tags: file.tags?.join(', ') || '',
      sketchupVersion: file.sketchupVersion, render: file.render,
    })
    setThumbnailFile(null)
    setModelFile(null)
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const slug = slugify(form.title)
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)

      if (editingFile) {
        const updates: Partial<FileData> = {
          title: form.title, slug, description: form.description,
          premium: form.premium, category: form.category, tags,
          sketchupVersion: form.sketchupVersion, render: form.render,
        }
        if (thumbnailFile) {
          updates.thumbnail = await uploadThumbnail(thumbnailFile, editingFile.id)
        }
        await updateFile(editingFile.id, updates)
      } else {
        const fileData: any = {
          title: form.title, slug, description: form.description,
          premium: form.premium, category: form.category, tags,
          sketchupVersion: form.sketchupVersion, render: form.render,
          thumbnail: '', storagePath: '', fileSize: 0, downloads: 0,
        }
        const newId = await addFile(fileData)
        if (thumbnailFile) {
          fileData.thumbnail = await uploadThumbnail(thumbnailFile, newId)
        }
        if (modelFile) {
          const storagePath = `models/${newId}/${modelFile.name}`
          await uploadModel(modelFile, storagePath)
          fileData.storagePath = storagePath
          fileData.fileSize = modelFile.size
        }
        await updateFile(newId, fileData)
      }
      setModalOpen(false)
      loadFiles()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      await deleteFile(id)
      loadFiles()
    }
  }

  const filtered = files.filter((f) =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium text-primary">Arquivos ({files.length})</h2>
        <Button onClick={openNew} size="sm">
          <Plus className="h-3.5 w-3.5" /> Novo Arquivo
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar arquivos..."
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
                  <th className="text-left px-4 py-3 font-medium text-muted">Título</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Downloads</th>
                  <th className="text-right px-4 py-3 font-medium text-muted">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((file) => (
                  <tr key={file.id} className="border-b border-border hover:bg-elevated/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-primary">{file.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${file.premium ? 'bg-elevated text-primary border border-border' : 'bg-elevated text-muted'}`}>
                        {file.premium ? 'Premium' : 'Grátis'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{file.downloads || 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(file)} className="p-1.5 text-muted hover:text-primary hover:bg-elevated rounded transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(file.id)} className="p-1.5 text-muted hover:text-primary hover:bg-elevated rounded transition-colors">
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
        <div className="text-center py-12 text-xs text-muted">Nenhum arquivo encontrado</div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingFile ? 'Editar Arquivo' : 'Novo Arquivo'} size="lg">
        <div className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="block text-[11px] uppercase tracking-[0.1em] text-muted mb-2">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-[rgba(255,255,255,0.1)] px-4 py-2.5 text-xs bg-elevated text-[#eee] focus:outline-none focus:border-[rgba(255,255,255,0.3)]"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input label="Tags (separadas por vírgula)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            <Input label="Versão SketchUp" value={form.sketchupVersion} onChange={(e) => setForm({ ...form, sketchupVersion: e.target.value })} />
            <Input label="Render" value={form.render} onChange={(e) => setForm({ ...form, render: e.target.value })} />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.premium}
              onChange={(e) => setForm({ ...form, premium: e.target.checked })}
              className="rounded border-[rgba(255,255,255,0.2)] bg-elevated text-accent focus:ring-0"
            />
            <span className="text-xs text-secondary">Arquivo Premium</span>
          </label>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.1em] text-muted mb-2">Thumbnail</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} className="text-xs text-secondary" />
          </div>
          {!editingFile && (
            <div>
              <label className="block text-[11px] uppercase tracking-[0.1em] text-muted mb-2">Arquivo ZIP</label>
              <input type="file" accept=".zip,.skp,.rar" onChange={(e) => setModelFile(e.target.files?.[0] || null)} className="text-xs text-secondary" />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
