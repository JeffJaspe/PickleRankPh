import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'home_content'

export interface MatchItem {
  id: string
  // Team / player names (player1b / player2b for doubles partners)
  player1: string
  player1b: string
  player2: string
  player2b: string
  // Scores (overall or game-by-game separated by commas, e.g. "11,9,11")
  score1: string
  score2: string
  // Metadata
  category: string      // e.g. "Mixed Doubles Pro Main Draw"
  round: string         // e.g. "Round 1" or "Semifinal"
  scheduledTime: string // e.g. "9:00 AM PDT"
  matchLink: string     // "See details" URL
  matchType: 'local' | 'national' | 'club'
  status: 'upcoming' | 'ongoing' | 'finished'
}

export interface HomeSection {
  id: string
  type: 'hero' | 'featured_matches' | 'announcement' | 'custom'
  title: string
  description: string
  image: string
  buttonText: string
  buttonLink: string
  layout: 'image-left' | 'image-right' | 'full-width' | 'grid'
  visible: boolean
  order: number
  matches: MatchItem[]
}

const defaultSections: HomeSection[] = [
  {
    id: 'default-hero',
    type: 'hero',
    title: 'ONE ID. One National Ranking.',
    description:
      'Register for your Philippine Pickleball Participant Registry (PPPR) ID — the only official way to be included in the National Ranking System and National Pool.',
    image: '',
    buttonText: 'Sign Up for your PPPR ID',
    buttonLink: 'https://registry.pickleball.ph/',
    layout: 'full-width',
    visible: true,
    order: 1,
    matches: [],
  },
]

function load(): HomeSection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as HomeSection[]
  } catch {}
  return defaultSections.map(s => ({ ...s }))
}

// Module-level shared state — single source of truth across all composable calls
const sections = ref<HomeSection[]>(load())

watch(sections, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

function reindex() {
  sections.value.forEach((s, i) => { s.order = i + 1 })
}

export function useHomeContent() {
  const sortedSections = computed(() =>
    [...sections.value].sort((a, b) => a.order - b.order)
  )

  const visibleSections = computed(() =>
    sortedSections.value.filter((s) => s.visible)
  )

  function addSection(type: HomeSection['type']) {
    const defaults: Record<HomeSection['type'], Partial<HomeSection>> = {
      hero: { title: 'Hero Banner', layout: 'full-width' },
      featured_matches: { title: 'Featured Matches', layout: 'grid' },
      announcement: { title: 'Announcement', layout: 'full-width' },
      custom: { title: 'Custom Content Block', layout: 'image-right' },
    }
    sections.value.push({
      id: `section-${Date.now()}`,
      type,
      title: defaults[type].title ?? 'New Section',
      description: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      layout: defaults[type].layout ?? 'full-width',
      visible: true,
      order: sections.value.length + 1,
      matches: [],
    })
    reindex()
  }

  function removeSection(id: string) {
    sections.value = sections.value.filter((s) => s.id !== id)
    reindex()
  }

  function updateSection(id: string, updates: Partial<HomeSection>) {
    const idx = sections.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      sections.value[idx] = { ...sections.value[idx], ...updates }
    }
  }

  function moveUp(id: string) {
    const arr = [...sections.value]
    const idx = arr.findIndex((s) => s.id === id)
    if (idx > 0) {
      ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
      sections.value = arr
      reindex()
    }
  }

  function moveDown(id: string) {
    const arr = [...sections.value]
    const idx = arr.findIndex((s) => s.id === id)
    if (idx < arr.length - 1) {
      ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
      sections.value = arr
      reindex()
    }
  }

  function addMatch(sectionId: string) {
    const section = sections.value.find((s) => s.id === sectionId)
    if (!section) return
    section.matches.push({
      id: `match-${Date.now()}`,
      player1: '',
      player1b: '',
      player2: '',
      player2b: '',
      score1: '',
      score2: '',
      category: '',
      round: '',
      scheduledTime: '',
      matchLink: '',
      matchType: 'local',
      status: 'upcoming',
    })
  }

  function removeMatch(sectionId: string, matchId: string) {
    const section = sections.value.find((s) => s.id === sectionId)
    if (!section) return
    section.matches = section.matches.filter((m) => m.id !== matchId)
  }

  function resetToDefault() {
    sections.value = defaultSections.map((s) => ({ ...s, matches: [] }))
  }

  return {
    sections,
    sortedSections,
    visibleSections,
    addSection,
    removeSection,
    updateSection,
    moveUp,
    moveDown,
    addMatch,
    removeMatch,
    resetToDefault,
  }
}
