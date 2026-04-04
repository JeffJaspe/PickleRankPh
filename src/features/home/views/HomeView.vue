<template>
  <div class="relative flex items-center justify-center min-h-[60vh] overflow-hidden">
    <!-- Background image overlay -->
    <div
      v-if="bgImageUrl"
      class="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
      :style="{ backgroundImage: `url(${bgImageUrl})`, opacity: bgOpacity }"
    />
    <h1 class="relative text-4xl font-black uppercase tracking-widest text-brand-yellow">Pickleball Home</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { fetchAssets, loadCachedAssets } = useTheme()

const bgImageUrl = ref<string | null>(null)
const bgOpacity = ref(0.15)

onMounted(async () => {
  // Apply cached immediately for instant paint
  const cached = loadCachedAssets()
  if (cached) {
    bgImageUrl.value = cached.bg_image_url
    bgOpacity.value = cached.bg_opacity
  }
  // Then fetch fresh
  const assets = await fetchAssets()
  if (assets) {
    bgImageUrl.value = assets.bg_image_url
    bgOpacity.value = assets.bg_opacity
  }
})
</script>
