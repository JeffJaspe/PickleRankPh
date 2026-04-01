import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'
import { requireAdmin } from '../_lib/auth'
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!(await requireAdmin(req, res))) return
  const { player1_id, player2_id, player1_score, player2_score, tournament_id, points_awarded } = req.body
  const winner_id = player1_score > player2_score ? player1_id : player2_id
  const { data: match, error: matchError } = await supabase.from('matches').insert({ player1_id, player2_id, player1_score, player2_score, winner_id, tournament_id, points_awarded }).select().single()
  if (matchError) return res.status(400).json({ error: matchError.message })
  const { data: winner } = await supabase.from('players').select('rating_points').eq('id', winner_id).single()
  if (winner) await supabase.from('players').update({ rating_points: winner.rating_points + points_awarded }).eq('id', winner_id)
  return res.status(201).json(match)
}
