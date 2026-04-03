<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Site Branding</h2>
      <p class="mt-1 text-sm text-gray-500">Customize the public site's color scheme. Changes apply instantly.</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center gap-3 text-sm text-gray-500 py-4">
      <svg class="w-4 h-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Loading saved theme…
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

      <!-- Live Preview -->
      <section class="bg-white border border-gray-200 rounded-xl p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">Live Preview</h3>
        <div class="rounded-lg p-5 flex flex-col gap-4" :style="{ background: custom.secondary }">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold" :style="{ color: custom.accent }">PickleRank PH</span>
            <div class="flex gap-2">
              <span class="text-xs px-3 py-1 rounded" :style="{ background: custom.primary, color: custom.accent }">Rankings</span>
              <span class="text-xs px-3 py-1 rounded" :style="{ color: custom.accent, opacity: '0.7' }">Players</span>
            </div>
          </div>
          <div class="py-4 text-center space-y-3">
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

      <!-- Save -->
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
import type { Theme } from '@/composables/useTheme'

const { applyTheme, fetchTheme, persistTheme } = useTheme()

const DEFAULT_THEME: Theme = { primary: '#FF4655', secondary: '#0F1923', accent: '#ECE8D9' }

const custom = reactive<Theme>({ ...DEFAULT_THEME })
const activePreset = ref<string | null>('dark-esports')
const loading = ref(true)
const saving = ref(false)
const saveStatus = ref<'idle' | 'saved' | 'error'>('idle')
const saveError = ref('')

const colorFields: { key: keyof Theme; label: string; hint: string }[] = [
  { key: 'primary', label: 'Primary', hint: 'Buttons, highlights' },
  { key: 'secondary', label: 'Secondary', hint: 'Backgrounds, dark areas' },
  { key: 'accent', label: 'Accent', hint: 'Text on dark backgrounds' },
]

onMounted(async () => {
  const theme = await fetchTheme()
  if (theme) {
    Object.assign(custom, theme)
    activePreset.value = detectPreset(theme)
    applyTheme(theme)
  }
  loading.value = false
})

function detectPreset(theme: Theme): string | null {
  for (const [key, preset] of Object.entries(PRESETS)) {
    const t = preset.theme
    if (t.primary === theme.primary && t.secondary === theme.secondary && t.accent === theme.accent) {
      return key
    }
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
