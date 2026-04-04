<template>
  <div class="min-h-screen">

    <template v-for="section in visibleSections" :key="section.id">

      <!-- ─── HERO ─────────────────────────────────────────────────── -->
      <section
        v-if="section.type === 'hero'"
        :class="[
          'relative flex items-center justify-center overflow-hidden',
          section.image ? 'min-h-[70vh]' : 'py-24 px-4',
        ]"
      >
        <!-- Background image -->
        <div
          v-if="section.image"
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${section.image})` }"
        >
          <div class="absolute inset-0 bg-black/60" />
        </div>

        <!-- Full-width centered -->
        <div
          v-if="section.layout === 'full-width' || !section.image"
          class="relative z-10 text-center max-w-3xl mx-auto px-4"
        >
          <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-brand-yellow uppercase leading-none mb-6">
            {{ section.title }}
          </h1>
          <p v-if="section.description" class="text-base sm:text-lg text-brand-yellow/70 leading-relaxed mb-8 max-w-xl mx-auto">
            {{ section.description }}
          </p>
          <a
            v-if="section.buttonText && section.buttonLink"
            :href="section.buttonLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-8 py-4 bg-brand-red hover:bg-brand-red/90 text-brand-yellow font-black uppercase tracking-widest text-lg shadow-xl shadow-brand-red/30 hover:scale-105 active:scale-100 transition-all duration-200"
          >
            {{ section.buttonText }}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        <!-- Image left / text right -->
        <div
          v-else-if="section.layout === 'image-left'"
          class="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          <img :src="section.image" class="w-full rounded-xl object-cover shadow-2xl max-h-72" alt="" />
          <div>
            <h2 class="text-3xl sm:text-4xl font-black text-brand-yellow uppercase leading-tight mb-4">{{ section.title }}</h2>
            <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed mb-6">{{ section.description }}</p>
            <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider hover:bg-brand-red/90 transition-colors">
              {{ section.buttonText }}
            </a>
          </div>
        </div>

        <!-- Image right / text left -->
        <div
          v-else
          class="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          <div>
            <h2 class="text-3xl sm:text-4xl font-black text-brand-yellow uppercase leading-tight mb-4">{{ section.title }}</h2>
            <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed mb-6">{{ section.description }}</p>
            <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider hover:bg-brand-red/90 transition-colors">
              {{ section.buttonText }}
            </a>
          </div>
          <img :src="section.image" class="w-full rounded-xl object-cover shadow-2xl max-h-72" alt="" />
        </div>
      </section>

      <!-- ─── FEATURED MATCHES ──────────────────────────────────────── -->
      <section v-else-if="section.type === 'featured_matches'" class="py-16 px-4">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-black text-brand-yellow uppercase tracking-widest mb-2">{{ section.title }}</h2>
          <p v-if="section.description" class="text-brand-yellow/60 text-sm mb-8">{{ section.description }}</p>

          <div v-if="section.matches.length === 0" class="text-brand-yellow/30 text-sm italic">No matches added yet.</div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="match in section.matches"
              :key="match.id"
              class="bg-brand-darker border border-brand-mid rounded-lg p-4 space-y-3"
            >
              <!-- Status badge -->
              <div class="flex items-center justify-between">
                <span
                  :class="match.status === 'ongoing'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'"
                  class="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                >
                  {{ match.status === 'ongoing' ? '● LIVE' : 'Finished' }}
                </span>
                <span class="text-xs text-brand-yellow/40 uppercase tracking-wider">{{ matchTypeLabel(match.matchType) }}</span>
              </div>

              <!-- Scores -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex-1 text-center">
                  <p class="text-xs text-brand-yellow/50 truncate mb-1">{{ match.player1 || '—' }}</p>
                  <p class="text-3xl font-black text-brand-yellow">{{ match.score1 || '—' }}</p>
                </div>
                <span class="text-brand-yellow/30 font-bold text-lg">VS</span>
                <div class="flex-1 text-center">
                  <p class="text-xs text-brand-yellow/50 truncate mb-1">{{ match.player2 || '—' }}</p>
                  <p class="text-3xl font-black text-brand-yellow">{{ match.score2 || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <a
            v-if="section.buttonText && section.buttonLink"
            :href="section.buttonLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 mt-8 px-6 py-3 border border-brand-yellow/30 text-brand-yellow/70 hover:text-brand-yellow hover:border-brand-yellow font-semibold text-sm uppercase tracking-wider transition-colors"
          >
            {{ section.buttonText }}
          </a>
        </div>
      </section>

      <!-- ─── ANNOUNCEMENT ──────────────────────────────────────────── -->
      <section v-else-if="section.type === 'announcement'" class="py-10 px-4">
        <div class="max-w-3xl mx-auto">
          <div class="border-l-4 border-brand-red bg-brand-darker px-6 py-5 rounded-r-lg">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
              </svg>
              <div class="flex-1">
                <h3 class="font-black text-brand-yellow uppercase tracking-wide text-lg mb-1">{{ section.title }}</h3>
                <p v-if="section.description" class="text-brand-yellow/70 text-sm leading-relaxed">{{ section.description }}</p>
                <a
                  v-if="section.buttonText && section.buttonLink"
                  :href="section.buttonLink"
                  target="_blank"
                  rel="noopener"
                  class="inline-block mt-3 text-sm font-semibold text-brand-red hover:text-brand-red/80 underline underline-offset-2 transition-colors"
                >
                  {{ section.buttonText }} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── CUSTOM BLOCK ──────────────────────────────────────────── -->
      <section v-else-if="section.type === 'custom'" class="py-16 px-4">
        <div class="max-w-5xl mx-auto">

          <!-- Full width -->
          <div v-if="section.layout === 'full-width' || !section.image" class="text-center">
            <img v-if="section.image" :src="section.image" class="w-full max-h-64 object-cover rounded-xl mb-8" alt="" />
            <h2 class="text-2xl font-black text-brand-yellow uppercase tracking-widest mb-3">{{ section.title }}</h2>
            <p v-if="section.description" class="text-brand-yellow/70 max-w-2xl mx-auto leading-relaxed mb-6">{{ section.description }}</p>
            <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider hover:bg-brand-red/90 transition-colors">
              {{ section.buttonText }}
            </a>
          </div>

          <!-- Image left -->
          <div v-else-if="section.layout === 'image-left'" class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <img :src="section.image" class="w-full rounded-xl object-cover shadow-xl max-h-72" alt="" />
            <div>
              <h2 class="text-2xl font-black text-brand-yellow uppercase tracking-widest mb-3">{{ section.title }}</h2>
              <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed mb-6">{{ section.description }}</p>
              <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider hover:bg-brand-red/90 transition-colors">
                {{ section.buttonText }}
              </a>
            </div>
          </div>

          <!-- Image right -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 class="text-2xl font-black text-brand-yellow uppercase tracking-widest mb-3">{{ section.title }}</h2>
              <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed mb-6">{{ section.description }}</p>
              <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider hover:bg-brand-red/90 transition-colors">
                {{ section.buttonText }}
              </a>
            </div>
            <img :src="section.image" class="w-full rounded-xl object-cover shadow-xl max-h-72" alt="" />
          </div>

        </div>
      </section>

    </template>

    <!-- Empty state (admin content cleared) -->
    <div v-if="visibleSections.length === 0" class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p class="text-brand-yellow/30 uppercase tracking-widest text-sm">Home page content not configured.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useHomeContent } from '@/composables/useHomeContent'
import type { MatchItem } from '@/composables/useHomeContent'

const { visibleSections } = useHomeContent()

function matchTypeLabel(type: MatchItem['matchType']) {
  return { local: 'Local', national: 'National', club: 'Club League' }[type]
}
</script>
