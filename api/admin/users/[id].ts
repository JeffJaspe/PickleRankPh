import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../_lib/supabase'
import { requireAdmin } from '../../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireAdmin(req, res))) return

  const { id } = req.query as { id: string }

  // ── PUT /api/admin/users/:id ─────────────────────────────────────────────
  if (req.method === 'PUT') {
    const { role, password } = req.body as {
      role?: 'admin' | 'superadmin'
      password?: string
    }

    if (role && !['admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ error: 'role must be admin or superadmin' })
    }

    if (password !== undefined && password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Update role in the public users table
    if (role) {
      const { error } = await supabase.from('users').update({ role }).eq('id', id)
      if (error) return res.status(400).json({ error: error.message })
    }

    // Reset password — Supabase Auth bcrypt-hashes it server-side
    if (password) {
      const { error } = await supabase.auth.admin.updateUserById(id, { password })
      if (error) return res.status(400).json({ error: error.message })
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, created_at')
      .eq('id', id)
      .single()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json(data)
  }

  // ── DELETE /api/admin/users/:id ──────────────────────────────────────────
  if (req.method === 'DELETE') {
    // Remove from public users table first (avoids FK constraint errors)
    await supabase.from('users').delete().eq('id', id)

    // Delete the auth account — this removes login access entirely
    const { error } = await supabase.auth.admin.deleteUser(id)
    if (error) return res.status(400).json({ error: error.message })

    return res.status(204).end()
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
