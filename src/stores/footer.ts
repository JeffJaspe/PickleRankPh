import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export interface FooterItem {
  id: string
  type: 'link' | 'image'
  label: string | null
  url: string
  image_url: string | null
  sort_order: number
  created_at: string
}

export const useFooterStore = defineStore('footer', () => {
  const items = ref<FooterItem[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetch() {
    loading.value = true
    error.value = ''
    const { data, error: err } = await (supabase
      .from('footer_items')
      .select('*')
      .order('sort_order', { ascending: true }) as any)
    if (err) error.value = err.message
    else items.value = (data ?? []) as FooterItem[]
    loading.value = false
  }

  async function create(payload: Omit<FooterItem, 'id' | 'created_at'>) {
    const { data, error: err } = await supabase
      .from('footer_items')
      .insert(payload)
      .select()
      .single()
    if (err) throw err
    items.value.push(data as FooterItem)
    items.value.sort((a, b) => a.sort_order - b.sort_order)
    return data as FooterItem
  }

  async function update(id: string, payload: Partial<FooterItem>) {
    const { data, error: err } = await supabase
      .from('footer_items')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) items.value[idx] = data as FooterItem
    return data as FooterItem
  }

  async function remove(id: string) {
    const { error: err } = await supabase.from('footer_items').delete().eq('id', id)
    if (err) throw err
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, loading, error, fetch, create, update, remove }
}, {
  persist: {
    paths: ['items'],
  },
})
