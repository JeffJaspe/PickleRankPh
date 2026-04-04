<template>
  <footer
    v-if="store.items.length"
    class="relative z-10 w-full"
    :style="{ background: 'var(--color-secondary)', borderTop: '1px solid rgba(var(--color-accent-rgb) / 0.15)' }"
  >
    <div class="mx-auto max-w-[1400px] px-6 py-6 flex flex-wrap items-center justify-center gap-6">
      <template v-for="item in store.items" :key="item.id">
        <!-- Image item -->
        <a v-if="item.type === 'image'" :href="item.url" target="_blank" rel="noopener">
          <img :src="item.url" :alt="item.label ?? ''" class="h-10 object-contain opacity-80 hover:opacity-100 transition-opacity" />
        </a>
        <!-- Link item -->
        <a
          v-else
          :href="item.url"
          target="_blank"
          rel="noopener"
          class="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
          :style="{ color: 'var(--color-accent)' }"
        >
          {{ item.label ?? item.url }}
        </a>
      </template>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFooterStore } from '@/stores/footer'

const store = useFooterStore()

onMounted(() => {
  if (!store.items.length) store.fetch()
})
</script>
