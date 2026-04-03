<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white">
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
