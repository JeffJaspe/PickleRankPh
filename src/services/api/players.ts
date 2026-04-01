import type { Player } from '@/types'
export async function getPlayers(): Promise<Player[]> {
  const res = await fetch('/api/players')
  if (!res.ok) throw new Error('Failed to fetch players')
  return res.json()
}
export async function createPlayer(data: Partial<Player>): Promise<Player> {
  const res = await fetch('/api/players', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) throw new Error('Failed to create player')
  return res.json()
}
export async function updatePlayer(id: string, data: Partial<Player>): Promise<Player> {
  const res = await fetch(`/api/players/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) throw new Error('Failed to update player')
  return res.json()
}
export async function deletePlayerApi(id: string): Promise<void> {
  const res = await fetch(`/api/players/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete player')
}
