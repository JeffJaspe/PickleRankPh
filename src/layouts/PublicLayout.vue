<template>
  <!-- Layer 1: background image fills full viewport -->
  <div class="min-h-screen relative" :style="{ color: 'var(--color-accent)' }">
    <div
      v-if="bgImageUrl"
      class="fixed inset-0 z-0 pointer-events-none"
      :style="{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: bgSize === 'repeat' ? 'auto' : bgSize,
        backgroundRepeat: bgSize === 'repeat' ? 'repeat' : 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        opacity: bgOpacity,
      }"
    />

    <!-- Layer 2: nav spans full width with theme color -->
    <HeaderNav class="relative z-10" />

    <!-- Layer 3: centered content container — background visible on sides -->
    <main class="relative z-10 mx-auto max-w-[1400px] px-6 min-h-[calc(100vh-4rem)]">
      <div class="bg-[var(--color-secondary)] min-h-[calc(100vh-4rem)]">
        <RouterView />
      </div>
    </main>

    <!-- Layer 4: footer -->
    <div class="relative z-10 mx-auto max-w-[1400px] px-6">
      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { useTheme } from '@/composables/useTheme'

const { fetchAssets, loadCachedAssets } = useTheme()

const bgImageUrl = ref<string | null>(null)
const bgOpacity = ref(0.15)
const bgSize = ref<'cover' | 'contain' | 'repeat'>('cover')

onMounted(async () => {
  const cached = loadCachedAssets()
  if (cached?.bg_image_url) {
    bgImageUrl.value = cached.bg_image_url
    bgOpacity.value = cached.bg_opacity
    bgSize.value = cached.bg_size ?? 'cover'
  }
  const assets = await fetchAssets()
  if (assets?.bg_image_url) {
    bgImageUrl.value = assets.bg_image_url
    bgOpacity.value = assets.bg_opacity
    bgSize.value = assets.bg_size ?? 'cover'
  }
})
</script>
