import { supabase } from '@/lib/supabase'

export interface Theme {
  primary: string
  secondary: string
  accent: string
}

export interface Preset {
  label: string
  theme: Theme
}

const STORAGE_KEY = 'picklerank-theme'

// Maps our Theme keys → actual site_settings column names
const SITE_SETTINGS_ID = 1

export const PRESETS: Record<string, Preset> = {
  'dark-esports': {
    label: 'Dark Esports',
    theme: { primary: '#FF4655', secondary: '#0F1923', accent: '#ECE8D9' },
  },
  'blue-professional': {
    label: 'Blue Professional',
    theme: { primary: '#2563EB', secondary: '#1E3A5F', accent: '#DBEAFE' },
  },
  'green-sport': {
    label: 'Green Sport',
    theme: { primary: '#16A34A', secondary: '#14532D', accent: '#DCFCE7' },
  },
  'purple-neon': {
    label: 'Purple Neon',
    theme: { primary: '#A855F7', secondary: '#3B0764', accent: '#F3E8FF' },
  },
}

function hexToRgbChannels(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

function shadeRgbChannels(hex: string, offset: number): string {
  const h = hex.replace('#', '')
  const clamp = (n: number) => Math.min(255, Math.max(0, n))
  const r = clamp(parseInt(h.slice(0, 2), 16) + offset)
  const g = clamp(parseInt(h.slice(2, 4), 16) + offset)
  const b = clamp(parseInt(h.slice(4, 6), 16) + offset)
  return `${r} ${g} ${b}`
}

export function useTheme() {
  /** Apply CSS variables immediately — no async */
  function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.style.setProperty('--color-accent', theme.accent)
    // RGB channel versions for Tailwind opacity modifiers
    root.style.setProperty('--color-primary-rgb', hexToRgbChannels(theme.primary))
    root.style.setProperty('--color-secondary-rgb', hexToRgbChannels(theme.secondary))
    root.style.setProperty('--color-accent-rgb', hexToRgbChannels(theme.accent))
    // Secondary shade variants (darker / mid / light)
    root.style.setProperty('--color-darker-rgb', shadeRgbChannels(theme.secondary, -5))
    root.style.setProperty('--color-mid-rgb', shadeRgbChannels(theme.secondary, 16))
    root.style.setProperty('--color-light-rgb', shadeRgbChannels(theme.secondary, 27))
  }

  /** Read from localStorage cache (synchronous, for instant paint) */
  function loadCached(): Theme | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Theme) : null
  }

  /** Write to localStorage cache */
  function writeCache(theme: Theme) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  }

  /**
   * Fetch from the existing site_settings table.
   * Maps flat columns → Theme shape.
   */
  async function fetchTheme(): Promise<Theme | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('primary_color, secondary_color, accent_color')
      .eq('id', SITE_SETTINGS_ID)
      .single()

    if (error || !data) return null

    const theme: Theme = {
      primary: data.primary_color ?? '#FF4655',
      secondary: data.secondary_color ?? '#0F1923',
      accent: data.accent_color ?? '#ECE8D9',
    }
    writeCache(theme)
    return theme
  }

  /**
   * Update the site_settings row with new colors.
   * Uses update (row must already exist — insert a seed row if empty).
   */
  async function persistTheme(theme: Theme): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .update({
        primary_color: theme.primary,
        secondary_color: theme.secondary,
        accent_color: theme.accent,
      })
      .eq('id', SITE_SETTINGS_ID)

    if (error) throw error
    writeCache(theme)
    applyTheme(theme)
  }

  /**
   * Called on app boot (App.vue onMounted).
   * 1. Apply localStorage cache immediately for instant paint.
   * 2. Fetch from DB and re-apply if different.
   */
  async function initTheme(): Promise<void> {
    const cached = loadCached()
    if (cached) applyTheme(cached)

    const dbTheme = await fetchTheme()
    if (dbTheme) applyTheme(dbTheme)
  }

  return { applyTheme, fetchTheme, persistTheme, loadCached, initTheme, PRESETS }
}
