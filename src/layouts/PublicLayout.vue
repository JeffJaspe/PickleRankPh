<template>
  <div class="min-h-screen text-white" :style="{ background: 'var(--color-secondary)', color: 'var(--color-accent)' }">
    <HeaderNav />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'
</script>
