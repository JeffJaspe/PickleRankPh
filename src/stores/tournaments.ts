import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Tournament } from '@/types'

export const useTournamentsStore = defineStore('tournaments', () => {
  const tournaments = ref<Tournament[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetch() {
    loading.value = true
    error.value = ''
    const { data, error: err } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_date', { ascending: false })
    if (err) error.value = err.message
    else tournaments.value = (data ?? []) as Tournament[]
    loading.value = false
  }

  async function create(payload: Omit<Tournament, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('tournaments')
      .insert(payload)
      .select()
      .single()
    if (err) throw err
    tournaments.value.unshift(data as Tournament)
    return data as Tournament
  }

  async function update(id: string, payload: Partial<Tournament>) {
    const { data, error: err } = await supabase
      .from('tournaments')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    const idx = tournaments.value.findIndex(t => t.id === id)
    if (idx !== -1) tournaments.value[idx] = data as Tournament
    return data as Tournament
  }

  async function remove(id: string) {
    const { error: err } = await supabase.from('tournaments').delete().eq('id', id)
    if (err) throw err
    tournaments.value = tournaments.value.filter(t => t.id !== id)
  }

  return { tournaments, loading, error, fetch, create, update, remove }
})
