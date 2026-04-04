import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Match } from '@/types'

export const useMatchesStore = defineStore('matches', () => {
  const matches = ref<Match[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetch() {
    loading.value = true
    error.value = ''
    const { data, error: err } = await supabase
      .from('matches')
      .select('*')
      .order('played_at', { ascending: false })
    if (err) error.value = err.message
    else matches.value = (data ?? []) as Match[]
    loading.value = false
  }

  async function create(payload: Omit<Match, 'id'>) {
    const { data, error: err } = await supabase
      .from('matches')
      .insert(payload)
      .select()
      .single()
    if (err) throw err
    matches.value.unshift(data as Match)
    return data as Match
  }

  async function remove(id: string) {
    const { error: err } = await supabase.from('matches').delete().eq('id', id)
    if (err) throw err
    matches.value = matches.value.filter(m => m.id !== id)
  }

  return { matches, loading, error, fetch, create, remove }
})
