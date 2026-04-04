<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Site Branding</h2>
      <p class="mt-1 text-sm text-gray-500">Customize colors, favicon, and home background. Changes apply instantly.</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center gap-3 text-sm text-gray-500 py-4">
      <svg class="w-4 h-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Loading settings…
    </div>

    <template v-else>
      <!-- Preset Themes -->
      <section class="bg-white border border-gray-200 rounded-xl p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Preset Themes</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            v-for="(preset, key) in PRESETS"
            :key="key"
            @click="applyPreset(key)"
            :class="[
              'flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-xs font-medium transition-all',
              activePreset === key
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300',
            ]"
          >
            <div class="flex gap-1">
              <span class="w-5 h-5 rounded-full border border-white shadow-sm" :style="{ background: preset.theme.primary }" />
              <span class="w-5 h-5 rounded-full border border-white shadow-sm" :style="{ background: preset.theme.secondary }" />
              <span class="w-5 h-5 rounded-full border border-white shadow-sm" :style="{ background: preset.theme.accent }" />
            </div>
            {{ preset.label }}
          </button>
        </div>
      </section>

      <!-- Custom Colors -->
      <section class="bg-white border border-gray-200 rounded-xl p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Custom Colors</h3>
        <div class="space-y-4">
          <div v-for="field in colorFields" :key="field.key" class="flex items-center gap-4">
            <label class="w-28 text-sm font-medium text-gray-600 flex-shrink-0">{{ field.label }}</label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                :value="custom[field.key]"
                @input="onColorInput(field.key, ($event.target as HTMLInputElement).value)"
                class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                :value="custom[field.key]"
                @change="onColorInput(field.key, ($event.target as HTMLInputElement).value)"
                maxlength="7"
                class="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-sm font-mono text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <span class="text-xs text-gray-400">{{ field.hint }}</span>
          </div>
        </div>
      </section>

      <!-- Site Assets -->
      <section class="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <h3 class="text-sm font-semibold text-gray-700">Site Assets</h3>

        <!-- Storage Bucket -->
        <div>
          <p class="text-xs font-semibold text-gray-600 mb-2">Storage Bucket</p>
          <div class="flex items-center gap-2">
            <input
              v-model="assets.storage_bucket"
              type="text"
              placeholder="branding"
              class="w-48 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-mono text-gray-700
                     focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              @click="saveBucket"
              :disabled="bucketSaving"
              class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
                     text-white text-xs font-medium rounded-lg transition-colors"
            >{{ bucketSaving ? 'Saving…' : 'Save' }}</button>
          </div>
          <p class="mt-1 text-xs text-gray-400">Must match your Supabase Storage bucket name exactly.</p>
        </div>

        <div class="border-t border-gray-100" />

        <!-- Favicon -->
        <div>
          <p class="text-xs font-semibold text-gray-600 mb-3">Favicon</p>
          <div class="flex items-center gap-4">
            <!-- Preview -->
            <div class="w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                v-if="assets.favicon_url"
                :src="assets.favicon_url"
                alt="favicon"
                class="w-8 h-8 object-contain"
              />
              <svg v-else class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <div class="space-y-1">
              <label
                class="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600
                       hover:bg-gray-50 transition-colors cursor-pointer"
                :class="{ 'opacity-50 cursor-not-allowed': faviconUploading }"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {{ faviconUploading ? 'Uploading…' : 'Upload Favicon' }}
                <input
                  type="file"
                  accept="image/*"
                  class="sr-only"
                  :disabled="faviconUploading"
                  @change="handleFaviconUpload"
                />
              </label>
              <p class="text-xs text-gray-400">PNG, ICO, SVG — shown in browser tab</p>
              <p v-if="faviconError" class="text-xs text-red-500">{{ faviconError }}</p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100" />

        <!-- Background Image -->
        <div>
          <p class="text-xs font-semibold text-gray-600 mb-3">Home Background Image</p>
          <div class="flex items-start gap-4">
            <!-- Preview -->
            <div class="w-28 h-18 rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden relative"
                 style="height: 4.5rem;">
              <img
                v-if="assets.bg_image_url"
                :src="assets.bg_image_url"
                alt="background"
                class="w-full h-full object-cover"
                :style="{ opacity: assets.bg_opacity }"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div class="space-y-3 flex-1">
              <label
                class="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600
                       hover:bg-gray-50 transition-colors cursor-pointer"
                :class="{ 'opacity-50 cursor-not-allowed': bgUploading }"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {{ bgUploading ? 'Uploading…' : 'Upload PNG' }}
                <input
                  type="file"
                  accept="image/png"
                  class="sr-only"
                  :disabled="bgUploading"
                  @change="handleBgUpload"
                />
              </label>
              <p class="text-xs text-gray-400">PNG only — displayed as full-page overlay on the home page</p>

              <!-- Opacity slider -->
              <div v-if="assets.bg_image_url" class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-600">Opacity</span>
                  <span class="text-xs font-mono text-gray-500">{{ Math.round(assets.bg_opacity * 100) }}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="Math.round(assets.bg_opacity * 100)"
                  @input="onOpacityInput"
                  class="w-full accent-indigo-600"
                />
                <button
                  @click="saveOpacity"
                  :disabled="opacitySaving"
                  class="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
                         text-white font-medium rounded-lg transition-colors"
                >
                  {{ opacitySaving ? 'Saving…' : 'Save Opacity' }}
                </button>
              </div>

              <p v-if="bgError" class="text-xs text-red-500">{{ bgError }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Live Preview -->
      <section class="bg-white border border-gray-200 rounded-xl p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Live Preview</h3>
        <div class="rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden" :style="{ background: custom.secondary }">
          <!-- bg preview overlay -->
          <div
            v-if="assets.bg_image_url"
            class="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            :style="{ backgroundImage: `url(${assets.bg_image_url})`, opacity: assets.bg_opacity }"
          />
          <div class="relative flex items-center justify-between">
            <span class="text-sm font-bold" :style="{ color: custom.accent }">PickleRank PH</span>
            <div class="flex gap-2">
              <span class="text-xs px-3 py-1 rounded" :style="{ background: custom.primary, color: custom.accent }">Rankings</span>
              <span class="text-xs px-3 py-1 rounded" :style="{ color: custom.accent, opacity: '0.7' }">Players</span>
            </div>
          </div>
          <div class="relative py-4 text-center space-y-3">
            <p class="text-lg font-bold" :style="{ color: custom.accent }">Philippine Pickleball Rankings</p>
            <p class="text-xs" :style="{ color: custom.accent, opacity: '0.6' }">Official ranking platform</p>
            <button
              class="px-5 py-2 rounded-md text-sm font-semibold"
              :style="{ background: custom.primary, color: custom.accent }"
            >
              View Rankings
            </button>
          </div>
        </div>
      </section>

      <!-- Save Colors -->
      <div class="flex items-center gap-4">
        <button
          @click="handleSave"
          :disabled="saving"
          class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
                 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {{ saving ? 'Saving…' : 'Save Theme' }}
        </button>
        <button
          @click="handleReset"
          :disabled="saving"
          class="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50
                 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          Reset to Default
        </button>
        <span v-if="saveStatus === 'saved'" class="text-sm text-green-600 font-medium">Saved!</span>
        <span v-if="saveStatus === 'error'" class="text-sm text-red-600 font-medium">{{ saveError }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useTheme, PRESETS } from '@/composables/useTheme'
import type { Theme, SiteAssets } from '@/composables/useTheme'

const { applyTheme, fetchTheme, persistTheme, fetchAssets, persistAssets, uploadBrandingFile, applyFavicon } = useTheme()

const DEFAULT_THEME: Theme = { primary: '#FF4655', secondary: '#0F1923', accent: '#ECE8D9' }
const DEFAULT_ASSETS: SiteAssets = { favicon_url: null, bg_image_url: null, bg_opacity: 0.15, storage_bucket: 'branding' }

const custom = reactive<Theme>({ ...DEFAULT_THEME })
const assets = reactive<SiteAssets>({ ...DEFAULT_ASSETS })
const activePreset = ref<string | null>('dark-esports')
const loading = ref(true)
const saving = ref(false)
const saveStatus = ref<'idle' | 'saved' | 'error'>('idle')
const saveError = ref('')

const faviconUploading = ref(false)
const faviconError = ref('')
const bgUploading = ref(false)
const bgError = ref('')
const opacitySaving = ref(false)
const bucketSaving = ref(false)

const colorFields: { key: keyof Theme; label: string; hint: string }[] = [
  { key: 'primary',   label: 'Primary',   hint: 'Buttons, highlights' },
  { key: 'secondary', label: 'Secondary', hint: 'Backgrounds, dark areas' },
  { key: 'accent',    label: 'Accent',    hint: 'Text on dark backgrounds' },
]

onMounted(async () => {
  const [theme, siteAssets] = await Promise.all([fetchTheme(), fetchAssets()])
  if (theme) {
    Object.assign(custom, theme)
    activePreset.value = detectPreset(theme)
    applyTheme(theme)
  }
  if (siteAssets) Object.assign(assets, siteAssets)
  loading.value = false
})

function detectPreset(theme: Theme): string | null {
  for (const [key, preset] of Object.entries(PRESETS)) {
    const t = preset.theme
    if (t.primary === theme.primary && t.secondary === theme.secondary && t.accent === theme.accent) return key
  }
  return null
}

function applyPreset(key: string) {
  const preset = PRESETS[key]
  if (!preset) return
  Object.assign(custom, preset.theme)
  activePreset.value = key
  applyTheme(custom)
}

function onColorInput(key: keyof Theme, value: string) {
  custom[key] = value
  activePreset.value = detectPreset(custom)
  applyTheme(custom)
}

function onOpacityInput(e: Event) {
  assets.bg_opacity = parseInt((e.target as HTMLInputElement).value) / 100
}

async function saveBucket() {
  bucketSaving.value = true
  try {
    await persistAssets({ storage_bucket: assets.storage_bucket })
  } finally {
    bucketSaving.value = false
  }
}

async function saveOpacity() {
  opacitySaving.value = true
  try {
    await persistAssets({ bg_opacity: assets.bg_opacity })
  } finally {
    opacitySaving.value = false
  }
}

async function handleFaviconUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  faviconError.value = ''
  faviconUploading.value = true
  try {
    const ext = file.name.split('.').pop() ?? 'png'
    const url = await uploadBrandingFile(file, `favicon/favicon.${ext}`)
    await persistAssets({ favicon_url: url })
    assets.favicon_url = url
    applyFavicon(url)
  } catch (e: any) {
    faviconError.value = e?.message ?? 'Upload failed'
  } finally {
    faviconUploading.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

async function handleBgUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  bgError.value = ''
  bgUploading.value = true
  try {
    const url = await uploadBrandingFile(file, 'background/bg.png')
    await persistAssets({ bg_image_url: url })
    assets.bg_image_url = url
  } catch (e: any) {
    bgError.value = e?.message ?? 'Upload failed'
  } finally {
    bgUploading.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

async function handleSave() {
  saving.value = true
  saveStatus.value = 'idle'
  try {
    await persistTheme({ ...custom })
    saveStatus.value = 'saved'
    setTimeout(() => (saveStatus.value = 'idle'), 2500)
  } catch (e: any) {
    saveStatus.value = 'error'
    saveError.value = e?.message ?? 'Failed to save. Try again.'
  } finally {
    saving.value = false
  }
}

function handleReset() {
  Object.assign(custom, DEFAULT_THEME)
  activePreset.value = 'dark-esports'
  applyTheme(custom)
}
</script>
