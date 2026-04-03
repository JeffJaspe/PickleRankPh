export type RankingScope = 'local' | 'provincial' | 'regional' | 'national'
export interface Region { code: string; name: string }
export interface Province { code: string; name: string }
export interface City { code: string; name: string; type: string }
export interface Player {
  id: string
  name: string
  city: string
  province: string
  region: string
  points: number
  dupr_rating?: number
  city_code?: string
  province_code?: string
  region_code?: string
  created_at: string
}
export interface Tournament {
  id: string; name: string; location: string
  city_code: string; province_code: string; region_code: string
  scope: RankingScope; start_date: string; end_date: string
  status: 'upcoming' | 'ongoing' | 'completed'; created_at: string
}
export interface Match {
  id: string; tournament_id: string
  player1_id: string; player2_id: string
  player1_score: number; player2_score: number
  winner_id: string; points_awarded: number; played_at: string
}
export interface User { id: string; email: string; role: 'admin' | 'superadmin' }
export interface RankingFilter { scope: RankingScope; region_code?: string; province_code?: string; city_code?: string }
