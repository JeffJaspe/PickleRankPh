<template>
  <div class="space-y-5 max-w-7xl mx-auto">

    <!-- ── Page header ───────────────────────────────────────────── -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Home Page Builder</h1>
        <p class="text-sm text-gray-500 mt-0.5">Build and preview each section of the public home page.</p>
      </div>
      <button class="text-xs text-gray-400 hover:text-red-500 transition-colors" @click="confirmReset">
        Reset to default
      </button>
    </div>

    <!-- ── Add section bar ───────────────────────────────────────── -->
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Add Section</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in sectionTypes"
          :key="type.value"
          class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-dashed border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          @click="handleAddSection(type.value as any)"
        >
          <span v-html="type.icon" class="w-4 h-4 flex-shrink-0" />
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- ── Main two-panel layout ─────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

      <!-- LEFT: Section list ──────────────────────────────────── -->
      <div class="lg:col-span-2 space-y-2">
        <p v-if="sortedSections.length === 0" class="text-center py-10 text-sm text-gray-400">
          No sections yet. Add one above.
        </p>

        <div
          v-for="(section, idx) in sortedSections"
          :key="section.id"
          :class="[
            'rounded-xl border transition-all cursor-pointer select-none',
            activeId === section.id
              ? 'border-indigo-400 bg-indigo-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300',
            !section.visible && 'opacity-50',
          ]"
          @click="activeId = section.id"
        >
          <div class="flex items-center gap-2 px-3 py-2.5">
            <!-- Order badge -->
            <span class="w-5 h-5 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-100 rounded-full">
              {{ idx + 1 }}
            </span>

            <!-- Type badge -->
            <span :class="typeBadge(section.type)" class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
              {{ typeLabel(section.type) }}
            </span>

            <!-- Title -->
            <span class="text-sm font-medium text-gray-700 flex-1 truncate">
              {{ section.title || '(untitled)' }}
            </span>

            <!-- Controls -->
            <div class="flex items-center gap-0.5 flex-shrink-0" @click.stop>
              <!-- Visibility -->
              <button
                :title="section.visible ? 'Hide' : 'Show'"
                :class="section.visible ? 'text-indigo-400' : 'text-gray-300'"
                class="p-1.5 rounded hover:bg-gray-100 transition-colors"
                @click="updateSection(section.id, { visible: !section.visible })"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="section.visible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
              <!-- Move up -->
              <button
                :disabled="idx === 0"
                class="p-1.5 rounded text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="moveUp(section.id)"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                </svg>
              </button>
              <!-- Move down -->
              <button
                :disabled="idx === sortedSections.length - 1"
                class="p-1.5 rounded text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="moveDown(section.id)"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <!-- Delete -->
              <button
                class="p-1.5 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                @click="removeSection(section.id)"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Editor + Preview ─────────────────────────────── -->
      <div class="lg:col-span-3 space-y-4">

        <!-- No selection -->
        <div v-if="!activeSection" class="bg-white border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-20 text-center px-4">
          <svg class="w-10 h-10 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
          <p class="text-sm font-medium text-gray-400">Select a section on the left to edit it</p>
          <p class="text-xs text-gray-300 mt-1">Changes save automatically</p>
        </div>

        <template v-else>

          <!-- ── Live Preview ──────────────────────────────────── -->
          <div class="rounded-xl overflow-hidden border border-brand-mid shadow-xl">
            <div class="flex items-center gap-1.5 px-3 py-2 bg-brand-darker">
              <span class="w-2.5 h-2.5 rounded-full bg-brand-red/60" />
              <span class="w-2.5 h-2.5 rounded-full bg-brand-yellow/30" />
              <span class="w-2.5 h-2.5 rounded-full bg-brand-yellow/20" />
              <span class="ml-2 text-xs text-brand-yellow/40 font-medium">Preview — {{ typeLabel(activeSection.type) }}</span>
            </div>

            <!-- Preview content — uses brand CSS vars so it responds to theme changes -->
            <div class="bg-brand-dark min-h-[180px]">

              <!-- Hero preview -->
              <div v-if="activeSection.type === 'hero'" class="relative flex items-center justify-center py-10 px-6 overflow-hidden">
                <div
                  v-if="activeSection.image"
                  class="absolute inset-0 bg-cover bg-center"
                  :style="{ backgroundImage: `url(${activeSection.image})` }"
                >
                  <div class="absolute inset-0 bg-black/60" />
                </div>
                <div class="relative z-10 text-center max-w-lg">
                  <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-brand-yellow uppercase leading-tight mb-3">
                    {{ activeSection.title || 'Section Title' }}
                  </h1>
                  <p v-if="activeSection.description" class="text-sm text-brand-yellow/70 leading-relaxed mb-5">
                    {{ activeSection.description }}
                  </p>
                  <span v-if="activeSection.buttonText" class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-brand-yellow font-bold uppercase tracking-widest text-sm">
                    {{ activeSection.buttonText }}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </span>
                </div>
              </div>

              <!-- Featured matches preview -->
              <div v-else-if="activeSection.type === 'featured_matches'" class="p-5">
                <h2 class="text-base font-black text-brand-yellow uppercase tracking-widest mb-4">
                  {{ activeSection.title || 'Featured Matches' }}
                </h2>
                <div v-if="activeSection.matches.length === 0" class="text-xs text-brand-yellow/20 italic">No matches added yet.</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="match in activeSection.matches.slice(0, 4)"
                    :key="match.id"
                    class="bg-brand-darker border border-brand-yellow/10 rounded-xl p-4"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <span :class="match.status === 'ongoing' ? 'text-green-400' : 'text-brand-yellow/30'" class="text-[10px] font-bold uppercase tracking-wider">
                        {{ match.status === 'ongoing' ? '● LIVE' : 'Finished' }}
                      </span>
                      <span class="text-[10px] text-brand-yellow/20 uppercase tracking-wider">{{ matchTypeLabel(match.matchType) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 text-center">
                        <p class="text-[10px] text-brand-yellow/40 truncate mb-1">{{ match.player1 || 'Player 1' }}</p>
                        <p class="text-3xl font-black text-brand-yellow leading-none">{{ match.score1 || '—' }}</p>
                      </div>
                      <span class="text-brand-yellow/20 font-black text-xs">VS</span>
                      <div class="flex-1 text-center">
                        <p class="text-[10px] text-brand-yellow/40 truncate mb-1">{{ match.player2 || 'Player 2' }}</p>
                        <p class="text-3xl font-black text-brand-yellow leading-none">{{ match.score2 || '—' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p v-if="activeSection.matches.length > 4" class="text-xs text-brand-yellow/30 mt-2">+ {{ activeSection.matches.length - 4 }} more matches</p>
              </div>

              <!-- Announcement preview -->
              <div v-else-if="activeSection.type === 'announcement'" class="p-5">
                <div class="border-l-4 border-brand-red bg-brand-darker px-4 py-3 rounded-r-lg">
                  <p class="font-black text-brand-yellow uppercase tracking-wide text-sm mb-1">{{ activeSection.title || 'Announcement' }}</p>
                  <p v-if="activeSection.description" class="text-brand-yellow/60 text-xs leading-relaxed">{{ activeSection.description }}</p>
                  <span v-if="activeSection.buttonText" class="inline-block mt-2 text-xs font-semibold text-brand-red">{{ activeSection.buttonText }} →</span>
                </div>
              </div>

              <!-- Custom preview -->
              <div v-else-if="activeSection.type === 'custom'" class="p-5">
                <div :class="activeSection.layout !== 'full-width' && activeSection.image ? 'flex gap-4 items-center' : ''">
                  <img
                    v-if="activeSection.image && activeSection.layout === 'image-left'"
                    :src="activeSection.image"
                    class="w-1/3 rounded-lg object-cover h-20 flex-shrink-0"
                    alt=""
                  />
                  <div class="flex-1">
                    <p class="font-black text-brand-yellow uppercase tracking-widest text-sm mb-1">{{ activeSection.title || 'Custom Block' }}</p>
                    <p v-if="activeSection.description" class="text-brand-yellow/60 text-xs leading-relaxed">{{ activeSection.description }}</p>
                    <span v-if="activeSection.buttonText" class="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-brand-red text-brand-yellow font-bold text-xs uppercase tracking-wider">{{ activeSection.buttonText }}</span>
                  </div>
                  <img
                    v-if="activeSection.image && activeSection.layout === 'image-right'"
                    :src="activeSection.image"
                    class="w-1/3 rounded-lg object-cover h-20 flex-shrink-0"
                    alt=""
                  />
                  <img
                    v-if="activeSection.image && activeSection.layout === 'full-width'"
                    :src="activeSection.image"
                    class="w-full rounded-lg object-cover h-24 mt-3"
                    alt=""
                  />
                </div>
              </div>

            </div>
          </div>

          <!-- ── Edit Form ─────────────────────────────────────── -->
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <span :class="typeBadge(activeSection.type)" class="text-xs font-semibold px-2 py-0.5 rounded-full">
                {{ typeLabel(activeSection.type) }}
              </span>
              <span class="text-sm font-semibold text-gray-700">Edit Section</span>
              <label class="ml-auto flex items-center gap-2 cursor-pointer">
                <span class="text-xs text-gray-500">Visible</span>
                <div
                  :class="activeSection.visible ? 'bg-indigo-500' : 'bg-gray-200'"
                  class="relative w-9 h-5 rounded-full transition-colors"
                  @click="updateSection(activeSection.id, { visible: !activeSection.visible })"
                >
                  <span
                    :class="activeSection.visible ? 'translate-x-4' : 'translate-x-0.5'"
                    class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  />
                </div>
              </label>
            </div>

            <div class="p-5 space-y-5">

              <!-- Title & Description -->
              <div class="space-y-3">
                <div>
                  <label class="field-label">Title</label>
                  <input
                    :value="activeSection.title"
                    type="text"
                    class="field-input"
                    placeholder="Section title"
                    @input="updateSection(activeSection.id, { title: ($event.target as HTMLInputElement).value })"
                  />
                </div>
                <div>
                  <label class="field-label">Description</label>
                  <textarea
                    :value="activeSection.description"
                    rows="3"
                    class="field-input resize-none"
                    placeholder="Body text or description..."
                    @input="updateSection(activeSection.id, { description: ($event.target as HTMLTextAreaElement).value })"
                  />
                </div>
              </div>

              <!-- Image (not for featured_matches) -->
              <div v-if="activeSection.type !== 'featured_matches'" class="space-y-2 pt-1 border-t border-gray-100">
                <label class="field-label">Image</label>
                <div class="flex gap-2">
                  <input
                    :value="activeSection.image"
                    type="url"
                    class="field-input flex-1"
                    placeholder="Paste image URL..."
                    @input="updateSection(activeSection.id, { image: ($event.target as HTMLInputElement).value })"
                  />
                  <label
                    :class="uploadingId === activeSection.id ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'"
                    class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg transition-colors flex-shrink-0"
                  >
                    <svg v-if="uploadingId !== activeSection.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                    <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    {{ uploadingId === activeSection.id ? 'Uploading…' : 'Upload' }}
                    <input type="file" accept="image/*" class="hidden" :disabled="uploadingId === activeSection.id" @change="handleImageUpload(activeSection.id, $event)" />
                  </label>
                </div>
                <!-- Image preview -->
                <div v-if="activeSection.image" class="relative inline-block">
                  <img :src="activeSection.image" class="h-24 rounded-lg border border-gray-200 object-cover" alt="preview" />
                  <button
                    class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    @click="updateSection(activeSection.id, { image: '' })"
                  >✕</button>
                </div>
              </div>

              <!-- Button -->
              <div class="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100">
                <div>
                  <label class="field-label">Button Text <span class="text-gray-300 font-normal">(optional)</span></label>
                  <input
                    :value="activeSection.buttonText"
                    type="text"
                    class="field-input"
                    placeholder="e.g. Learn More"
                    @input="updateSection(activeSection.id, { buttonText: ($event.target as HTMLInputElement).value })"
                  />
                </div>
                <div>
                  <label class="field-label">Button Link <span class="text-gray-300 font-normal">(optional)</span></label>
                  <input
                    :value="activeSection.buttonLink"
                    type="url"
                    class="field-input"
                    placeholder="https://..."
                    @input="updateSection(activeSection.id, { buttonLink: ($event.target as HTMLInputElement).value })"
                  />
                </div>
              </div>

              <!-- Layout (not for featured_matches) -->
              <div v-if="activeSection.type !== 'featured_matches'" class="pt-1 border-t border-gray-100">
                <label class="field-label mb-2">Layout</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="opt in layoutOptions"
                    :key="opt.value"
                    :class="activeSection.layout === opt.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'"
                    class="flex flex-col items-center gap-1.5 px-2 py-3 text-xs font-medium rounded-lg border transition-colors"
                    @click="updateSection(activeSection.id, { layout: opt.value as any })"
                  >
                    <span v-html="opt.icon" class="w-6 h-6" />
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <!-- ── Matches editor ─────────────────────────────── -->
              <div v-if="activeSection.type === 'featured_matches'" class="pt-1 border-t border-gray-100 space-y-4">
                <div class="flex items-center justify-between">
                  <label class="field-label mb-0">Match Results</label>
                  <button
                    class="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    @click="addMatch(activeSection.id)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Match
                  </button>
                </div>

                <div v-if="activeSection.matches.length === 0" class="text-center py-6 text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
                  No matches yet. Click "Add Match" to get started.
                </div>

                <div class="space-y-3">
                  <div
                    v-for="(match, mIdx) in activeSection.matches"
                    :key="match.id"
                    class="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <!-- Match header -->
                    <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                      <span class="text-xs font-bold text-gray-400">Match {{ mIdx + 1 }}</span>
                      <span :class="match.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {{ match.status === 'ongoing' ? '● LIVE' : 'Finished' }}
                      </span>
                      <button
                        class="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors"
                        @click="removeMatch(activeSection.id, match.id)"
                      >Remove</button>
                    </div>

                    <!-- Match fields -->
                    <div class="p-3 space-y-3">
                      <!-- Scoreboard row -->
                      <div class="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                        <!-- Player 1 -->
                        <div class="space-y-1.5">
                          <div>
                            <label class="field-label">Player 1 Name</label>
                            <input
                              :value="match.player1"
                              type="text"
                              class="field-input"
                              placeholder="Full name"
                              @input="patchMatch(activeSection.id, match.id, 'player1', ($event.target as HTMLInputElement).value)"
                            />
                          </div>
                          <div>
                            <label class="field-label">Score</label>
                            <input
                              :value="match.score1"
                              type="text"
                              class="field-input text-center font-bold text-lg"
                              placeholder="11"
                              @input="patchMatch(activeSection.id, match.id, 'score1', ($event.target as HTMLInputElement).value)"
                            />
                          </div>
                        </div>

                        <!-- VS -->
                        <div class="flex items-center justify-center pb-1">
                          <span class="text-xs font-black text-gray-300">VS</span>
                        </div>

                        <!-- Player 2 -->
                        <div class="space-y-1.5">
                          <div>
                            <label class="field-label">Player 2 Name</label>
                            <input
                              :value="match.player2"
                              type="text"
                              class="field-input"
                              placeholder="Full name"
                              @input="patchMatch(activeSection.id, match.id, 'player2', ($event.target as HTMLInputElement).value)"
                            />
                          </div>
                          <div>
                            <label class="field-label">Score</label>
                            <input
                              :value="match.score2"
                              type="text"
                              class="field-input text-center font-bold text-lg"
                              placeholder="9"
                              @input="patchMatch(activeSection.id, match.id, 'score2', ($event.target as HTMLInputElement).value)"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Type + Status row -->
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="field-label">Match Type</label>
                          <select
                            :value="match.matchType"
                            class="field-input"
                            @change="patchMatch(activeSection.id, match.id, 'matchType', ($event.target as HTMLSelectElement).value)"
                          >
                            <option value="local">Local</option>
                            <option value="national">National</option>
                            <option value="club">Club League</option>
                          </select>
                        </div>
                        <div>
                          <label class="field-label">Status</label>
                          <select
                            :value="match.status"
                            class="field-input"
                            @change="patchMatch(activeSection.id, match.id, 'status', ($event.target as HTMLSelectElement).value)"
                          >
                            <option value="finished">Finished</option>
                            <option value="ongoing">Live / Ongoing</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHomeContent } from '@/composables/useHomeContent'
import { useTheme } from '@/composables/useTheme'
import type { HomeSection, MatchItem } from '@/composables/useHomeContent'

const {
  sections,
  sortedSections,
  addSection,
  removeSection,
  updateSection,
  moveUp,
  moveDown,
  addMatch,
  removeMatch,
  resetToDefault,
} = useHomeContent()

const { uploadBrandingFile } = useTheme()

const activeId = ref<string | null>(null)
const uploadingId = ref<string | null>(null)

const activeSection = computed(() =>
  activeId.value ? sections.value.find((s) => s.id === activeId.value) ?? null : null
)

function handleAddSection(type: HomeSection['type']) {
  addSection(type)
  // Auto-select newly added section
  const last = sortedSections.value[sortedSections.value.length - 1]
  if (last) activeId.value = last.id
}

function confirmReset() {
  if (confirm('Reset all sections to default? This cannot be undone.')) {
    resetToDefault()
    activeId.value = null
  }
}

async function handleImageUpload(sectionId: string, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingId.value = sectionId
  try {
    // Try Supabase storage first (uses the bucket configured in Branding settings)
    const ext = file.name.split('.').pop() ?? 'png'
    const url = await uploadBrandingFile(file, `home-content/${sectionId}-${Date.now()}.${ext}`)
    updateSection(sectionId, { image: url })
  } catch {
    // Fall back to base64 (localStorage — works without Supabase storage configured)
    const reader = new FileReader()
    reader.onload = () => updateSection(sectionId, { image: reader.result as string })
    reader.readAsDataURL(file)
  } finally {
    uploadingId.value = null
    input.value = ''
  }
}

function patchMatch(sectionId: string, matchId: string, field: keyof MatchItem, value: string) {
  const section = sections.value.find((s) => s.id === sectionId)
  if (!section) return
  const match = section.matches.find((m) => m.id === matchId)
  if (!match) return
  ;(match as any)[field] = value
}

function matchTypeLabel(type: MatchItem['matchType']) {
  return { local: 'Local', national: 'National', club: 'Club League' }[type]
}

function typeLabel(type: HomeSection['type']) {
  return { hero: 'Hero', featured_matches: 'Matches', announcement: 'Announce', custom: 'Custom' }[type]
}

function typeBadge(type: HomeSection['type']) {
  return {
    hero: 'bg-indigo-100 text-indigo-700',
    featured_matches: 'bg-green-100 text-green-700',
    announcement: 'bg-yellow-100 text-yellow-700',
    custom: 'bg-gray-100 text-gray-600',
  }[type]
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
  {
    value: 'full-width',
    label: 'Full Width',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1" stroke-width="2"/></svg>`,
  },
  {
    value: 'image-left',
    label: 'Image Left',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="5" width="8" height="14" rx="1" stroke-width="2"/><rect x="13" y="8" width="8" height="3" rx="0.5" stroke-width="1.5"/><rect x="13" y="13" width="6" height="2" rx="0.5" stroke-width="1.5"/></svg>`,
  },
  {
    value: 'image-right',
    label: 'Image Right',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="13" y="5" width="8" height="14" rx="1" stroke-width="2"/><rect x="3" y="8" width="8" height="3" rx="0.5" stroke-width="1.5"/><rect x="3" y="13" width="6" height="2" rx="0.5" stroke-width="1.5"/></svg>`,
  },
]
</script>

<style scoped>
.field-label {
  @apply block text-xs font-medium text-gray-500 mb-1;
}
.field-input {
  @apply block w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition placeholder-gray-300;
}
</style>
