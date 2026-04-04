import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../_lib/supabase'
import { requireAdmin } from '../../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireAdmin(req, res))) return

  // ── GET /api/admin/users ─────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // ── POST /api/admin/users ────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { email, password, role } = req.body as {
      email: string
      password: string
      role: 'admin' | 'superadmin'
    }

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password, and role are required' })
    }

    if (!['admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ error: 'role must be admin or superadmin' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Supabase Auth handles bcrypt hashing — password never stored in plain text
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip confirmation email for admin-created accounts
    })

    if (authError) return res.status(400).json({ error: authError.message })

    // Mirror into the public users table with the assigned role
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({ id: authData.user.id, email, role })
      .select('id, email, role, created_at')
      .single()

    if (insertError) {
      // Roll back the auth user so we don't leave orphaned auth records
      await supabase.auth.admin.deleteUser(authData.user.id)
      return res.status(400).json({ error: insertError.message })
    }

    return res.status(201).json(user)
  }

  return res.status(405).json({ error: 'Method not allowed' })
  } catch (e: any) {
    console.error('[api/admin/users]', e)
    return res.status(500).json({ error: e?.message ?? 'Internal server error' })
  }
}
