<template>
  <div class="space-y-6 max-w-4xl mx-auto">

    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Home Page Builder</h1>
        <p class="text-sm text-gray-500 mt-0.5">Control sections, content, and layout of the public home page.</p>
      </div>
      <button
        class="text-xs text-gray-400 hover:text-red-500 transition-colors"
        @click="confirmReset"
      >Reset to default</button>
    </div>

    <!-- Add section bar -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Add Section</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in sectionTypes"
          :key="type.value"
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-dashed border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          @click="addSection(type.value as any)"
        >
          <span v-html="type.icon" class="w-4 h-4" />
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="sortedSections.length === 0" class="text-center py-16 text-gray-400">
      <p class="text-sm">No sections yet. Add one above.</p>
    </div>

    <!-- Section cards -->
    <div class="space-y-3">
      <div
        v-for="(section, idx) in sortedSections"
        :key="section.id"
        class="bg-white border border-gray-200 rounded-lg overflow-hidden"
      >
        <!-- Card header -->
        <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <!-- Type badge -->
          <span :class="typeBadge(section.type)" class="text-xs font-semibold px-2 py-0.5 rounded-full">
            {{ typeLabel(section.type) }}
          </span>

          <!-- Title preview -->
          <span class="text-sm font-medium text-gray-700 flex-1 truncate">{{ section.title || '(untitled)' }}</span>

          <!-- Controls -->
          <div class="flex items-center gap-1">
            <!-- Visibility toggle -->
            <button
              :title="section.visible ? 'Hide section' : 'Show section'"
              :class="section.visible ? 'text-indigo-500 hover:text-indigo-700' : 'text-gray-300 hover:text-gray-500'"
              class="p-1.5 rounded transition-colors"
              @click="updateSection(section.id, { visible: !section.visible })"
            >
              <svg v-if="section.visible" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>

            <!-- Move up -->
            <button
              :disabled="idx === 0"
              title="Move up"
              class="p-1.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              @click="moveUp(section.id)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </button>

            <!-- Move down -->
            <button
              :disabled="idx === sortedSections.length - 1"
              title="Move down"
              class="p-1.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              @click="moveDown(section.id)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Expand/collapse -->
            <button
              title="Toggle edit"
              class="p-1.5 rounded text-gray-400 hover:text-indigo-500 transition-colors"
              @click="toggleExpand(section.id)"
            >
              <svg :class="expanded[section.id] ? 'rotate-45' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>

            <!-- Delete -->
            <button
              title="Delete section"
              class="p-1.5 rounded text-gray-400 hover:text-red-500 transition-colors"
              @click="removeSection(section.id)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Expanded form body -->
        <div v-if="expanded[section.id]" class="p-4 space-y-4">

          <!-- Basic fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="field-label">Title</label>
              <input
                :value="section.title"
                type="text"
                class="field-input"
                placeholder="Section title"
                @input="updateSection(section.id, { title: ($event.target as HTMLInputElement).value })"
              />
            </div>

            <div class="col-span-2">
              <label class="field-label">Description</label>
              <textarea
                :value="section.description"
                rows="3"
                class="field-input"
                placeholder="Description or body text"
                @input="updateSection(section.id, { description: ($event.target as HTMLTextAreaElement).value })"
              />
            </div>

            <div>
              <label class="field-label">Image URL</label>
              <input
                :value="section.image"
                type="url"
                class="field-input"
                placeholder="https://..."
                @input="updateSection(section.id, { image: ($event.target as HTMLInputElement).value })"
              />
            </div>

            <!-- Image preview -->
            <div v-if="section.image" class="flex items-center">
              <img :src="section.image" alt="preview" class="h-16 rounded border border-gray-200 object-cover" />
            </div>
          </div>

          <!-- Button fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-gray-100">
            <div>
              <label class="field-label">Button Text <span class="text-gray-400 font-normal">(optional)</span></label>
              <input
                :value="section.buttonText"
                type="text"
                class="field-input"
                placeholder="e.g. Learn More"
                @input="updateSection(section.id, { buttonText: ($event.target as HTMLInputElement).value })"
              />
            </div>
            <div>
              <label class="field-label">Button Link <span class="text-gray-400 font-normal">(optional)</span></label>
              <input
                :value="section.buttonLink"
                type="url"
                class="field-input"
                placeholder="https://..."
                @input="updateSection(section.id, { buttonLink: ($event.target as HTMLInputElement).value })"
              />
            </div>
          </div>

          <!-- Layout selector (not shown for featured_matches) -->
          <div v-if="section.type !== 'featured_matches'" class="pt-1 border-t border-gray-100">
            <label class="field-label">Layout</label>
            <div class="flex flex-wrap gap-2 mt-1">
              <button
                v-for="opt in layoutOptions"
                :key="opt.value"
                :class="section.layout === opt.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'"
                class="px-3 py-1.5 text-xs font-medium rounded border transition-colors"
                @click="updateSection(section.id, { layout: opt.value as any })"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Matches editor for featured_matches -->
          <div v-if="section.type === 'featured_matches'" class="pt-1 border-t border-gray-100 space-y-3">
            <div class="flex items-center justify-between">
              <label class="field-label mb-0">Match Results</label>
              <button
                class="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                @click="addMatch(section.id)"
              >+ Add Match</button>
            </div>

            <div v-if="section.matches.length === 0" class="text-xs text-gray-400 italic">
              No matches yet. Click "+ Add Match" to add one.
            </div>

            <div
              v-for="match in section.matches"
              :key="match.id"
              class="bg-gray-50 border border-gray-200 rounded-md p-3 space-y-3"
            >
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label class="field-label">Player 1</label>
                  <input
                    :value="match.player1"
                    type="text"
                    class="field-input"
                    placeholder="Name"
                    @input="updateMatch(section.id, match.id, 'player1', ($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div>
                  <label class="field-label">Score 1</label>
                  <input
                    :value="match.score1"
                    type="text"
                    class="field-input"
                    placeholder="e.g. 11"
                    @input="updateMatch(section.id, match.id, 'score1', ($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div>
                  <label class="field-label">Player 2</label>
                  <input
                    :value="match.player2"
                    type="text"
                    class="field-input"
                    placeholder="Name"
                    @input="updateMatch(section.id, match.id, 'player2', ($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div>
                  <label class="field-label">Score 2</label>
                  <input
                    :value="match.score2"
                    type="text"
                    class="field-input"
                    placeholder="e.g. 9"
                    @input="updateMatch(section.id, match.id, 'score2', ($event.target as HTMLInputElement).value)"
                  />
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <div>
                  <label class="field-label">Type</label>
                  <select
                    :value="match.matchType"
                    class="field-input"
                    @change="updateMatch(section.id, match.id, 'matchType', ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="local">Local</option>
                    <option value="national">National</option>
                    <option value="club">Club</option>
                  </select>
                </div>
                <div>
                  <label class="field-label">Status</label>
                  <select
                    :value="match.status"
                    class="field-input"
                    @change="updateMatch(section.id, match.id, 'status', ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="finished">Finished</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
                <button
                  class="mt-4 text-xs text-red-400 hover:text-red-600"
                  @click="removeMatch(section.id, match.id)"
                >Remove</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHomeContent } from '@/composables/useHomeContent'
import type { HomeSection, MatchItem } from '@/composables/useHomeContent'

const { sortedSections, addSection, removeSection, updateSection, moveUp, moveDown, addMatch, removeMatch, resetToDefault } = useHomeContent()

const expanded = ref<Record<string, boolean>>({})

function toggleExpand(id: string) {
  expanded.value[id] = !expanded.value[id]
}

function confirmReset() {
  if (confirm('Reset all sections to default? This cannot be undone.')) {
    resetToDefault()
    expanded.value = {}
  }
}

function updateMatch(sectionId: string, matchId: string, field: keyof MatchItem, value: string) {
  const { sections } = useHomeContent()
  const section = sections.value.find((s) => s.id === sectionId)
  if (!section) return
  const match = section.matches.find((m) => m.id === matchId)
  if (!match) return
  ;(match as any)[field] = value
}

function typeLabel(type: HomeSection['type']) {
  const map: Record<HomeSection['type'], string> = {
    hero: 'Hero',
    featured_matches: 'Matches',
    announcement: 'Announcement',
    custom: 'Custom',
  }
  return map[type]
}

function typeBadge(type: HomeSection['type']) {
  const map: Record<HomeSection['type'], string> = {
    hero: 'bg-indigo-100 text-indigo-700',
    featured_matches: 'bg-green-100 text-green-700',
    announcement: 'bg-yellow-100 text-yellow-700',
    custom: 'bg-gray-100 text-gray-600',
  }
  return map[type]
}

const sectionTypes = [
  {
    value: 'hero',
    label: 'Hero Banner',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  },
  {
    value: 'featured_matches',
    label: 'Featured Matches',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
  },
  {
    value: 'announcement',
    label: 'Announcement',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`,
  },
  {
    value: 'custom',
    label: 'Custom Block',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  },
]

const layoutOptions = [
  { value: 'full-width', label: 'Full Width' },
  { value: 'image-left', label: 'Image Left' },
  { value: 'image-right', label: 'Image Right' },
]
</script>

<style scoped>
.field-label {
  @apply block text-xs font-medium text-gray-600 mb-1;
}
.field-input {
  @apply block w-full text-sm text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition;
}
</style>
