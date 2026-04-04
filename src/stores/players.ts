import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Player } from '@/types'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<Player[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetch() {
    loading.value = true
    error.value = ''
    const { data, error: err } = await supabase
      .from('players')
      .select('*')
      .order('points', { ascending: false })
    if (err) error.value = err.message
    else players.value = (data ?? []) as Player[]
    loading.value = false
  }

  async function create(payload: Omit<Player, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('players')
      .insert(payload)
      .select()
      .single()
    if (err) throw err
    players.value.unshift(data as Player)
    return data as Player
  }

  async function update(id: string, payload: Partial<Player>) {
    const { data, error: err } = await supabase
      .from('players')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    const idx = players.value.findIndex(p => p.id === id)
    if (idx !== -1) players.value[idx] = data as Player
    return data as Player
  }

  async function remove(id: string) {
    const { error: err } = await supabase.from('players').delete().eq('id', id)
    if (err) throw err
    players.value = players.value.filter(p => p.id !== id)
  }

  return { players, loading, error, fetch, create, update, remove }
})
