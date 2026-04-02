<template>
  <div class="min-h-screen bg-brand-dark text-brand-yellow">

    <!-- Hero Header -->
    <div class="relative overflow-hidden bg-brand-darker border-b border-brand-mid">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-brand-red opacity-10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-red opacity-5 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 py-14 text-center">
        <p class="text-brand-red text-xs font-bold uppercase tracking-[0.3em] mb-3">Official Rankings</p>
        <h1 class="text-4xl sm:text-6xl font-black uppercase tracking-tight text-brand-yellow leading-none mb-3">
          Pickleball<br class="sm:hidden" /> Rankings <span class="text-brand-red">PH</span>
        </h1>
        <p class="text-brand-yellow/50 text-sm uppercase tracking-[0.2em]">
          Town &bull; Province &bull; Region &bull; National
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-10 space-y-10">

      <!-- Filter Bar -->
      <div class="bg-brand-mid border border-brand-light rounded-xl p-4 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Scope -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] uppercase tracking-widest text-brand-yellow/40 font-bold">Scope</label>
            <select v-model="filter.scope" @change="onScopeChange"
              class="bg-brand-dark border border-brand-light text-brand-yellow text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-red transition-colors cursor-pointer">
              <option value="national">National</option>
              <option value="regional">Regional</option>
              <option value="provincial">Provincial</option>
              <option value="local">Local</option>
            </select>
          </div>

          <!-- Region -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] uppercase tracking-widest text-brand-yellow/40 font-bold">Region</label>
            <select v-model="filter.region_id" @change="onRegionChange"
              :disabled="filter.scope === 'national'"
              class="bg-brand-dark border border-brand-light text-brand-yellow text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-red transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
              <option value="">All Regions</option>
              <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.name }}</option>
            </select>
          </div>

          <!-- Province -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] uppercase tracking-widest text-brand-yellow/40 font-bold">Province</label>
            <select v-model="filter.province_id" @change="onProvinceChange"
              :disabled="!filter.region_id || filter.scope === 'national' || filter.scope === 'regional'"
              class="bg-brand-dark border border-brand-light text-brand-yellow text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-red transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
              <option value="">All Provinces</option>
              <option v-for="p in filteredProvinces" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>

          <!-- City -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] uppercase tracking-widest text-brand-yellow/40 font-bold">City / Town</label>
            <select v-model="filter.city_id"
              :disabled="!filter.province_id || filter.scope !== 'local'"
              class="bg-brand-dark border border-brand-light text-brand-yellow text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-red transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
              <option value="">All Cities</option>
              <option v-for="c in filteredCities" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        <p class="text-brand-yellow/40 text-sm uppercase tracking-widest">Loading Rankings...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="rankedPlayers.length === 0" class="text-center py-24">
        <p class="text-5xl mb-4">🏓</p>
        <p class="text-brand-yellow/40 uppercase tracking-widest text-sm">No players found</p>
      </div>

      <template v-else>

        <!-- Top 3 Spotlight -->
        <div v-if="rankedPlayers.length >= 1">
          <h2 class="text-xs uppercase tracking-[0.3em] text-brand-red font-bold mb-5">Top Players</h2>
          <div class="flex flex-col sm:flex-row items-end justify-center gap-4">

            <!-- #2 -->
            <div v-if="rankedPlayers[1]"
              class="w-full sm:w-64 order-2 sm:order-1">
              <SpotlightCard :player="rankedPlayers[1]" :rank="2" medal="🥈"
                size="sm" border-color="border-brand-light" glow-color="shadow-brand-light/20" />
            </div>

            <!-- #1 (center, bigger) -->
            <div class="w-full sm:w-72 order-1 sm:order-2">
              <SpotlightCard :player="rankedPlayers[0]" :rank="1" medal="🥇"
                size="lg" border-color="border-brand-red" glow-color="shadow-brand-red/40" />
            </div>

            <!-- #3 -->
            <div v-if="rankedPlayers[2]"
              class="w-full sm:w-64 order-3">
              <SpotlightCard :player="rankedPlayers[2]" :rank="3" medal="🥉"
                size="sm" border-color="border-brand-light" glow-color="shadow-brand-light/20" />
            </div>

          </div>
        </div>

        <!-- Leaderboard -->
        <div v-if="rankedPlayers.length > 3">
          <h2 class="text-xs uppercase tracking-[0.3em] text-brand-red font-bold mb-5">Leaderboard</h2>
          <div class="bg-brand-mid border border-brand-light rounded-xl overflow-hidden">
            <!-- Header -->
            <div class="grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[3rem_1fr_auto_auto] gap-4 px-5 py-3 border-b border-brand-light">
              <span class="text-[10px] uppercase tracking-widest text-brand-yellow/30 font-bold">#</span>
              <span class="text-[10px] uppercase tracking-widest text-brand-yellow/30 font-bold">Player</span>
              <span class="hidden sm:block text-[10px] uppercase tracking-widest text-brand-yellow/30 font-bold text-right">Location</span>
              <span class="text-[10px] uppercase tracking-widest text-brand-yellow/30 font-bold text-right">Points</span>
            </div>
            <!-- Rows -->
            <div v-for="(player, i) in rankedPlayers.slice(3)" :key="player.id"
              class="group grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[3rem_1fr_auto_auto] gap-4 px-5 py-4 border-b border-brand-light/30 last:border-0 hover:bg-brand-light/40 transition-colors cursor-default">
              <span class="text-brand-yellow/50 font-bold text-sm self-center">{{ i + 4 }}</span>
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-full bg-brand-dark border border-brand-light flex items-center justify-center flex-shrink-0 text-xs font-bold text-brand-red uppercase">
                  {{ initials(player.full_name) }}
                </div>
                <div class="min-w-0">
                  <p class="text-brand-yellow font-bold text-sm truncate group-hover:text-white transition-colors">{{ player.full_name }}</p>
                  <p v-if="player.nickname" class="text-brand-yellow/40 text-xs truncate">"{{ player.nickname }}"</p>
                </div>
              </div>
              <span class="hidden sm:flex items-center text-brand-yellow/40 text-xs text-right justify-end">
                {{ locationLabel(player) }}
              </span>
              <span class="flex items-center justify-end font-black text-brand-red text-sm">
                {{ player.rating_points.toLocaleString() }}
              </span>
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Player, Region, Province, City, RankingScope } from '@/types'

// ── Spotlight Card (inline component) ──────────────────────────────────────
const SpotlightCard = defineComponent({
  props: {
    player: { type: Object as () => Player, required: true },
    rank: { type: Number, required: true },
    medal: { type: String, required: true },
    size: { type: String as () => 'sm' | 'lg', default: 'sm' },
    borderColor: { type: String, default: 'border-brand-light' },
    glowColor: { type: String, default: 'shadow-brand-light/20' },
  },
  setup(props) {
    const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    const locationLabel = (p: Player) => [p.city?.name, p.province?.name].filter(Boolean).join(', ') || p.region?.name || '—'
    return () => {
      const isLg = props.size === 'lg'
      return h('div', {
        class: `relative rounded-xl border-2 ${props.borderColor} bg-brand-mid p-5 flex flex-col items-center gap-3 shadow-xl ${props.glowColor} ${isLg ? 'shadow-2xl py-8' : ''}`,
      }, [
        h('span', { class: 'text-3xl' }, props.medal),
        h('div', {
          class: `rounded-full bg-brand-dark border-2 ${props.borderColor} flex items-center justify-center font-black text-brand-red uppercase ${isLg ? 'w-20 h-20 text-2xl' : 'w-14 h-14 text-base'}`,
        }, initials(props.player.full_name)),
        h('div', { class: 'text-center' }, [
          h('p', { class: `font-black text-brand-yellow uppercase tracking-wide ${isLg ? 'text-lg' : 'text-sm'}` }, props.player.full_name),
          props.player.nickname
            ? h('p', { class: 'text-brand-yellow/40 text-xs' }, `"${props.player.nickname}"`)
            : null,
          h('p', { class: 'text-brand-yellow/30 text-xs mt-1' }, locationLabel(props.player)),
        ]),
        h('div', { class: 'mt-1' }, [
          h('span', { class: `font-black text-brand-red ${isLg ? 'text-2xl' : 'text-lg'}` }, props.player.rating_points.toLocaleString()),
          h('span', { class: 'text-brand-yellow/30 text-xs ml-1' }, 'pts'),
        ]),
        h('div', {
          class: `absolute top-3 right-3 text-[10px] font-black text-brand-yellow/30 uppercase tracking-widest`,
        }, `#${props.rank}`),
      ])
    }
  },
})

// ── State ───────────────────────────────────────────────────────────────────
const loading = ref(true)
const players = ref<Player[]>([])
const regions = ref<Region[]>([])
const provinces = ref<Province[]>([])
const cities = ref<City[]>([])

const filter = ref({
  scope: 'national' as RankingScope,
  region_id: '',
  province_id: '',
  city_id: '',
})

// ── Helpers ─────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
function locationLabel(p: Player) {
  return [p.city?.name, p.province?.name].filter(Boolean).join(', ') || p.region?.name || '—'
}

// ── Derived lists ────────────────────────────────────────────────────────────
const filteredProvinces = computed(() =>
  filter.value.region_id
    ? provinces.value.filter(p => p.region_id === filter.value.region_id)
    : provinces.value
)
const filteredCities = computed(() =>
  filter.value.province_id
    ? cities.value.filter(c => c.province_id === filter.value.province_id)
    : cities.value
)

// ── Ranked players ───────────────────────────────────────────────────────────
const rankedPlayers = computed(() => {
  let list = [...players.value]

  if (filter.value.scope === 'regional' && filter.value.region_id)
    list = list.filter(p => p.region_id === filter.value.region_id)
  else if (filter.value.scope === 'provincial' && filter.value.province_id)
    list = list.filter(p => p.province_id === filter.value.province_id)
  else if (filter.value.scope === 'local' && filter.value.city_id)
    list = list.filter(p => p.city_id === filter.value.city_id)

  return list.sort((a, b) => b.rating_points - a.rating_points)
})

// ── Filter change handlers ───────────────────────────────────────────────────
function onScopeChange() {
  filter.value.region_id = ''
  filter.value.province_id = ''
  filter.value.city_id = ''
}
function onRegionChange() {
  filter.value.province_id = ''
  filter.value.city_id = ''
}
function onProvinceChange() {
  filter.value.city_id = ''
}

// ── Data fetching ────────────────────────────────────────────────────────────
async function fetchAll() {
  loading.value = true
  const [{ data: pl }, { data: rg }, { data: pr }, { data: ci }] = await Promise.all([
    supabase.from('players').select('*, city:cities(id,name,province_id), province:provinces(id,name,region_id), region:regions(id,name,code)'),
    supabase.from('regions').select('*').order('name'),
    supabase.from('provinces').select('*').order('name'),
    supabase.from('cities').select('*').order('name'),
  ])
  players.value = (pl ?? []) as Player[]
  regions.value = (rg ?? []) as Region[]
  provinces.value = (pr ?? []) as Province[]
  cities.value = (ci ?? []) as City[]
  loading.value = false
}

onMounted(fetchAll)
</script>
