<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { initTheme } = useTheme()

onMounted(async () => {
  await initTheme()
})
</script>
