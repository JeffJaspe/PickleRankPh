import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RankingScope } from '@/types'

export const useRankingsStore = defineStore('rankings', () => {
  const scope = ref<RankingScope>('national')
  const region_code = ref('')
  const province_code = ref('')
  const city_code = ref('')

  function resetGeo() {
    region_code.value = ''
    province_code.value = ''
    city_code.value = ''
  }

  return { scope, region_code, province_code, city_code, resetGeo }
}, {
  persist: true,
})
