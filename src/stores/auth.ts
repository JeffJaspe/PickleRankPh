import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  async function initialize() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()
      user.value = data
    }
  }
  async function login(email: string, password: string) {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await initialize()
    loading.value = false
  }
  async function logout() { await supabase.auth.signOut(); user.value = null }
  return { user, loading, initialize, login, logout }
})
