import type { Player, RankingFilter } from '@/types'
export async function getRankings(filters: RankingFilter): Promise<Player[]> {
  const p = new URLSearchParams()
  p.set('scope', filters.scope)
  if (filters.region_code) p.set('region_code', filters.region_code)
  if (filters.province_code) p.set('province_code', filters.province_code)
  if (filters.city_code) p.set('city_code', filters.city_code)
  const res = await fetch(`/api/rankings?${p}`)
  if (!res.ok) throw new Error('Failed to fetch rankings')
  return res.json()
}
