<template>
  <div class="relative min-h-screen text-white" :style="{ background: 'var(--color-secondary)', color: 'var(--color-accent)' }">
    <!-- Site-wide background image -->
    <div
      v-if="bgImageUrl"
      class="fixed inset-0 pointer-events-none z-0"
      :style="{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: bgSize === 'repeat' ? 'auto' : bgSize,
        backgroundRepeat: bgSize === 'repeat' ? 'repeat' : 'no-repeat',
        backgroundPosition: 'center',
        opacity: bgOpacity,
      }"
    />
    <HeaderNav class="relative z-10" />
    <main class="relative z-10">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'
import { useTheme } from '@/composables/useTheme'

const { fetchAssets, loadCachedAssets } = useTheme()

const bgImageUrl = ref<string | null>(null)
const bgOpacity = ref(0.15)
const bgSize = ref<'cover' | 'contain' | 'repeat'>('cover')

onMounted(async () => {
  const cached = loadCachedAssets()
  if (cached) {
    bgImageUrl.value = cached.bg_image_url
    bgOpacity.value = cached.bg_opacity
    bgSize.value = cached.bg_size ?? 'cover'
  }
  const assets = await fetchAssets()
  if (assets) {
    bgImageUrl.value = assets.bg_image_url
    bgOpacity.value = assets.bg_opacity
    bgSize.value = assets.bg_size ?? 'cover'
  }
})
</script>
