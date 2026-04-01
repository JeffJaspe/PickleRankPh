export type RankingScope = 'local' | 'provincial' | 'regional' | 'national'
export interface Region { id: string; name: string; code: string }
export interface Province { id: string; region_id: string; name: string }
export interface City { id: string; province_id: string; name: string }
export interface Player {
  id: string; full_name: string; nickname?: string; avatar_url?: string
  city_id: string; province_id: string; region_id: string
  rating_points: number; rank_local?: number; rank_provincial?: number
  rank_regional?: number; rank_national?: number
  city?: City; province?: Province; region?: Region; created_at: string
}
export interface Tournament {
  id: string; name: string; location: string
  city_id: string; province_id: string; region_id: string
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
export interface RankingFilter { scope: RankingScope; region_id?: string; province_id?: string; city_id?: string }
