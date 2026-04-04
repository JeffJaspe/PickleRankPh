<template>
  <div class="min-h-screen">

    <template v-for="section in visibleSections" :key="section.id">

      <!-- ─── HERO ─────────────────────────────────────────────────── -->
      <section
        v-if="section.type === 'hero'"
        :class="[
          'relative flex items-center justify-center overflow-hidden',
          section.image ? 'min-h-[75vh]' : 'py-28 px-4',
        ]"
      >
        <div
          v-if="section.image"
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${section.image})` }"
        >
          <div class="absolute inset-0 bg-black/60" />
        </div>

        <!-- Full-width -->
        <div
          v-if="section.layout === 'full-width' || !section.image"
          class="relative z-10 text-center max-w-3xl mx-auto px-4"
        >
          <h1 class="text-5xl sm:text-7xl font-black tracking-tight text-brand-yellow uppercase leading-none mb-6">
            {{ section.title }}
          </h1>
          <p v-if="section.description" class="text-base sm:text-lg text-brand-yellow/70 leading-relaxed mb-10 max-w-xl mx-auto">
            {{ section.description }}
          </p>
          <a
            v-if="section.buttonText && section.buttonLink"
            :href="section.buttonLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-3 px-10 py-5 bg-brand-red hover:bg-brand-red/90 text-brand-yellow font-black uppercase tracking-widest text-xl shadow-2xl shadow-brand-red/30 hover:scale-105 active:scale-100 transition-all duration-200"
          >
            {{ section.buttonText }}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        <!-- Image left -->
        <div
          v-else-if="section.layout === 'image-left'"
          class="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <img :src="section.image" class="w-full rounded-2xl object-cover shadow-2xl max-h-80" alt="" />
          <div>
            <h2 class="text-4xl sm:text-5xl font-black text-brand-yellow uppercase leading-tight mb-5">{{ section.title }}</h2>
            <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed mb-7 text-lg">{{ section.description }}</p>
            <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-7 py-4 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider text-lg hover:bg-brand-red/90 transition-colors">
              {{ section.buttonText }}
            </a>
          </div>
        </div>

        <!-- Image right -->
        <div
          v-else
          class="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 class="text-4xl sm:text-5xl font-black text-brand-yellow uppercase leading-tight mb-5">{{ section.title }}</h2>
            <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed mb-7 text-lg">{{ section.description }}</p>
            <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-7 py-4 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider text-lg hover:bg-brand-red/90 transition-colors">
              {{ section.buttonText }}
            </a>
          </div>
          <img :src="section.image" class="w-full rounded-2xl object-cover shadow-2xl max-h-80" alt="" />
        </div>
      </section>

      <!-- ─── FEATURED MATCHES ──────────────────────────────────────── -->
      <section v-else-if="section.type === 'featured_matches'" class="py-20 px-4">
        <div class="max-w-6xl mx-auto">

          <!-- Section heading -->
          <div class="flex items-end justify-between mb-10">
            <div>
              <p class="text-xs font-bold text-brand-red uppercase tracking-widest mb-2">Featured</p>
              <h2 class="text-3xl sm:text-4xl font-black text-brand-yellow uppercase tracking-wide leading-none">
                {{ section.title }}
              </h2>
              <p v-if="section.description" class="text-brand-yellow/50 text-sm mt-2">{{ section.description }}</p>
            </div>
            <a
              v-if="section.buttonText && section.buttonLink"
              :href="section.buttonLink"
              target="_blank"
              rel="noopener"
              class="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-yellow/50 hover:text-brand-yellow uppercase tracking-wider transition-colors"
            >
              {{ section.buttonText }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>

          <div v-if="section.matches.length === 0" class="text-brand-yellow/20 text-sm italic text-center py-10">
            No matches added yet.
          </div>

          <!-- Match cards grid — 1 col mobile, 2 col desktop -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              v-for="match in section.matches"
              :key="match.id"
              class="relative bg-brand-darker border border-brand-yellow/10 rounded-2xl overflow-hidden"
            >
              <!-- Glowing top bar for live matches -->
              <div
                v-if="match.status === 'ongoing'"
                class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent"
              />

              <!-- Card header -->
              <div class="flex items-center justify-between px-5 pt-4 pb-2">
                <div class="flex items-center gap-2">
                  <span
                    v-if="match.status === 'ongoing'"
                    class="flex items-center gap-1.5 text-xs font-bold text-green-400 uppercase tracking-widest"
                  >
                    <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    LIVE
                  </span>
                  <span v-else class="text-xs font-semibold text-brand-yellow/30 uppercase tracking-widest">
                    Finished
                  </span>
                </div>
                <span class="text-xs font-bold text-brand-yellow/30 uppercase tracking-wider px-2 py-0.5 border border-brand-mid rounded-full">
                  {{ matchTypeLabel(match.matchType) }}
                </span>
              </div>

              <!-- Scoreboard -->
              <div class="px-5 py-4">
                <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">

                  <!-- Player 1 -->
                  <div class="text-center">
                    <p class="text-sm font-bold text-brand-yellow/70 uppercase tracking-wide mb-2 truncate">
                      {{ match.player1 || '—' }}
                    </p>
                    <p class="text-7xl sm:text-8xl font-black leading-none tabular-nums text-brand-yellow">
                      {{ match.score1 || '0' }}
                    </p>
                  </div>

                  <!-- VS divider -->
                  <div class="flex flex-col items-center gap-1 px-2">
                    <div class="w-px h-8 bg-brand-yellow/10" />
                    <span class="text-xs font-black text-brand-yellow/20 tracking-widest">VS</span>
                    <div class="w-px h-8 bg-brand-yellow/10" />
                  </div>

                  <!-- Player 2 -->
                  <div class="text-center">
                    <p class="text-sm font-bold text-brand-yellow/70 uppercase tracking-wide mb-2 truncate">
                      {{ match.player2 || '—' }}
                    </p>
                    <p class="text-7xl sm:text-8xl font-black leading-none tabular-nums text-brand-yellow">
                      {{ match.score2 || '0' }}
                    </p>
                  </div>

                </div>
              </div>

              <!-- Card footer -->
              <div class="px-5 pb-4">
                <div class="h-px bg-brand-yellow/5 mb-3" />
                <p class="text-[10px] text-brand-yellow/20 uppercase tracking-widest text-center">
                  {{ match.status === 'ongoing' ? 'Match in progress' : 'Final score' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Mobile CTA -->
          <div class="sm:hidden mt-8 text-center">
            <a
              v-if="section.buttonText && section.buttonLink"
              :href="section.buttonLink"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 px-6 py-3 border border-brand-yellow/20 text-brand-yellow/60 hover:text-brand-yellow hover:border-brand-yellow font-semibold text-sm uppercase tracking-wider transition-colors"
            >
              {{ section.buttonText }}
            </a>
          </div>

        </div>
      </section>

      <!-- ─── ANNOUNCEMENT ──────────────────────────────────────────── -->
      <section v-else-if="section.type === 'announcement'" class="py-10 px-4">
        <div class="max-w-3xl mx-auto">
          <div class="relative border-l-4 border-brand-red bg-brand-darker px-6 py-5 rounded-r-xl overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-brand-red/5 to-transparent pointer-events-none" />
            <div class="relative flex items-start gap-4">
              <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-brand-red/20 mt-0.5">
                <svg class="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-black text-brand-yellow uppercase tracking-wide text-xl mb-2">{{ section.title }}</h3>
                <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed">{{ section.description }}</p>
                <a
                  v-if="section.buttonText && section.buttonLink"
                  :href="section.buttonLink"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-brand-red hover:text-brand-red/80 uppercase tracking-wider transition-colors"
                >
                  {{ section.buttonText }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── CUSTOM BLOCK ──────────────────────────────────────────── -->
      <section v-else-if="section.type === 'custom'" class="py-20 px-4">
        <div class="max-w-5xl mx-auto">

          <!-- Full width -->
          <div v-if="section.layout === 'full-width' || !section.image" class="text-center">
            <img v-if="section.image" :src="section.image" class="w-full max-h-72 object-cover rounded-2xl mb-10 shadow-xl" alt="" />
            <h2 class="text-3xl sm:text-4xl font-black text-brand-yellow uppercase tracking-widest mb-4">{{ section.title }}</h2>
            <p v-if="section.description" class="text-brand-yellow/70 max-w-2xl mx-auto leading-relaxed text-lg mb-8">{{ section.description }}</p>
            <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-8 py-4 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider text-lg hover:bg-brand-red/90 transition-colors">
              {{ section.buttonText }}
            </a>
          </div>

          <!-- Image left -->
          <div v-else-if="section.layout === 'image-left'" class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img :src="section.image" class="w-full rounded-2xl object-cover shadow-2xl max-h-80" alt="" />
            <div>
              <h2 class="text-3xl sm:text-4xl font-black text-brand-yellow uppercase tracking-widest mb-4">{{ section.title }}</h2>
              <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed text-lg mb-7">{{ section.description }}</p>
              <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-7 py-4 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider text-lg hover:bg-brand-red/90 transition-colors">
                {{ section.buttonText }}
              </a>
            </div>
          </div>

          <!-- Image right -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl sm:text-4xl font-black text-brand-yellow uppercase tracking-widest mb-4">{{ section.title }}</h2>
              <p v-if="section.description" class="text-brand-yellow/70 leading-relaxed text-lg mb-7">{{ section.description }}</p>
              <a v-if="section.buttonText && section.buttonLink" :href="section.buttonLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-7 py-4 bg-brand-red text-brand-yellow font-bold uppercase tracking-wider text-lg hover:bg-brand-red/90 transition-colors">
                {{ section.buttonText }}
              </a>
            </div>
            <img :src="section.image" class="w-full rounded-2xl object-cover shadow-2xl max-h-80" alt="" />
          </div>

        </div>
      </section>

    </template>

    <!-- Empty state -->
    <div v-if="visibleSections.length === 0" class="flex items-center justify-center min-h-[60vh] px-4">
      <p class="text-brand-yellow/20 uppercase tracking-widest text-sm">Home page content not configured.</p>
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
