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

export interface SiteAssets {
  favicon_url: string | null
  bg_image_url: string | null
  bg_opacity: number
  bg_size: 'cover' | 'contain' | 'repeat'
  storage_bucket: string
}

const STORAGE_KEY = 'picklerank-theme'
const ASSETS_KEY  = 'picklerank-assets'
const SITE_SETTINGS_ID = 1
let STORAGE_BUCKET = '' // set from site_settings.storage_bucket on load

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
  // ── Theme ──────────────────────────────────────────────────────────────────

  function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.style.setProperty('--color-accent', theme.accent)
    root.style.setProperty('--color-primary-rgb', hexToRgbChannels(theme.primary))
    root.style.setProperty('--color-secondary-rgb', hexToRgbChannels(theme.secondary))
    root.style.setProperty('--color-accent-rgb', hexToRgbChannels(theme.accent))
    root.style.setProperty('--color-darker-rgb', shadeRgbChannels(theme.secondary, -5))
    root.style.setProperty('--color-mid-rgb', shadeRgbChannels(theme.secondary, 16))
    root.style.setProperty('--color-light-rgb', shadeRgbChannels(theme.secondary, 27))
  }

  function loadCached(): Theme | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Theme) : null
  }

  function writeCache(theme: Theme) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  }

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

  async function persistTheme(theme: Theme): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .update({ primary_color: theme.primary, secondary_color: theme.secondary, accent_color: theme.accent })
      .eq('id', SITE_SETTINGS_ID)
    if (error) throw error
    writeCache(theme)
    applyTheme(theme)
  }

  // ── Assets ─────────────────────────────────────────────────────────────────

  function applyFavicon(url: string | null) {
    if (!url) return
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = url + '?t=' + Date.now()
  }

  function loadCachedAssets(): SiteAssets | null {
    const stored = localStorage.getItem(ASSETS_KEY)
    if (!stored) return null
    const assets = JSON.parse(stored) as SiteAssets
    if (assets.storage_bucket) STORAGE_BUCKET = assets.storage_bucket
    return assets
  }

  function writeCachedAssets(assets: SiteAssets) {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets))
  }

  async function fetchAssets(): Promise<SiteAssets | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('favicon_url, bg_image_url, bg_opacity, bg_size, storage_bucket')
      .eq('id', SITE_SETTINGS_ID)
      .single()
    if (error) { console.error('[fetchAssets]', error.message); return null }
    if (!data) return null
    const assets: SiteAssets = {
      favicon_url: data.favicon_url ?? null,
      bg_image_url: data.bg_image_url ?? null,
      bg_opacity: data.bg_opacity ?? 0.15,
      bg_size: data.bg_size ?? 'cover',
      storage_bucket: data.storage_bucket ?? '',
    }
    STORAGE_BUCKET = assets.storage_bucket
    writeCachedAssets(assets)
    return assets
  }

  async function persistAssets(patch: Partial<SiteAssets>): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .update(patch)
      .eq('id', SITE_SETTINGS_ID)
    if (error) throw error
    // Update cache — if bg_image_url is changing, bust the old cache entirely
    if ('bg_image_url' in patch) {
      localStorage.removeItem(ASSETS_KEY)
    } else {
      const current = loadCachedAssets()
      if (current) writeCachedAssets({ ...current, ...patch })
    }
  }

  async function uploadBrandingFile(file: File, path: string): Promise<string> {
    if (!STORAGE_BUCKET) throw new Error('Storage bucket not configured. Set it in the Branding settings.')
    console.log('[upload] bucket:', STORAGE_BUCKET, 'path:', path, 'file:', file.name, file.type, file.size)
    const { data: uploadData, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type })
    console.log('[upload] result:', uploadData, error)
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    console.log('[upload] public url:', data.publicUrl)
    return data.publicUrl
  }

  // ── Boot ───────────────────────────────────────────────────────────────────

  async function initTheme(): Promise<void> {
    // Apply caches immediately for instant paint
    const cachedTheme = loadCached()
    if (cachedTheme) applyTheme(cachedTheme)
    const cachedAssets = loadCachedAssets()
    if (cachedAssets?.favicon_url) applyFavicon(cachedAssets.favicon_url)

    // Fetch fresh from DB and re-apply
    const [dbTheme, assets] = await Promise.all([fetchTheme(), fetchAssets()])
    if (dbTheme) applyTheme(dbTheme)
    if (assets?.favicon_url) applyFavicon(assets.favicon_url)
  }

  return {
    applyTheme, fetchTheme, persistTheme, loadCached, initTheme,
    applyFavicon, fetchAssets, persistAssets, uploadBrandingFile, loadCachedAssets,
    PRESETS,
  }
}
