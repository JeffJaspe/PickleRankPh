import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from './supabase'
export async function requireAdmin(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return false }
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) { res.status(401).json({ error: 'Invalid token' }); return false }
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!profile || !['admin','superadmin'].includes(profile.role)) { res.status(403).json({ error: 'Forbidden' }); return false }
  return true
}
