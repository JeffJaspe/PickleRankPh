import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const { scope, region_id, province_id, city_id } = req.query
  let query = supabase.from('players').select('*, city:cities(id,name), province:provinces(id,name), region:regions(id,name)').order('rating_points', { ascending: false })
  if (scope === 'regional' && region_id) query = query.eq('region_id', region_id)
  if (scope === 'provincial' && province_id) query = query.eq('province_id', province_id)
  if (scope === 'local' && city_id) query = query.eq('city_id', city_id)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
