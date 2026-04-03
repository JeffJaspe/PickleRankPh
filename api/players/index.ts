import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'
import { requireAdmin } from '../_lib/auth'
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('players').select('*').order('rating_points', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'POST') {
    if (!(await requireAdmin(req, res))) return
    const { data, error } = await supabase.from('players').insert(req.body).select().single()
    if (error) return res.status(400).json({ error: error.message })
    return res.status(201).json(data)
  }
  res.status(405).json({ error: 'Method not allowed' })
}
