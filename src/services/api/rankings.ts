import type { Player, RankingFilter } from '@/types'
export async function getRankings(filters: RankingFilter): Promise<Player[]> {
  const p = new URLSearchParams()
  p.set('scope', filters.scope)
  if (filters.region_id) p.set('region_id', filters.region_id)
  if (filters.province_id) p.set('province_id', filters.province_id)
  if (filters.city_id) p.set('city_id', filters.city_id)
  const res = await fetch(`/api/rankings?${p}`)
  if (!res.ok) throw new Error('Failed to fetch rankings')
  return res.json()
}
