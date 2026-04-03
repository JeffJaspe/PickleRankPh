import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const { scope, region_code, province_code, city_code } = req.query
  let query = supabase.from('players').select('*').order('rating_points', { ascending: false })
  if (scope === 'regional' && region_code) query = query.eq('region_code', region_code)
  if (scope === 'provincial' && province_code) query = query.eq('province_code', province_code)
  if (scope === 'local' && city_code) query = query.eq('city_code', city_code)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
