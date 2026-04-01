import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'
import { requireAdmin } from '../_lib/auth'
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireAdmin(req, res))) return
  const { id } = req.query
  if (req.method === 'PUT') {
    const { data, error } = await supabase.from('players').update(req.body).eq('id', id).select().single()
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('players').delete().eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    return res.status(204).end()
  }
  res.status(405).json({ error: 'Method not allowed' })
}
