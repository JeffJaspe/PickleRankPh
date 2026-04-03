<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Overview</h2>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl border border-gray-200 p-5"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ stat.label }}</span>
          <span class="w-8 h-8 rounded-lg flex items-center justify-center" :class="stat.iconBg">
            <span v-html="stat.icon" class="w-4 h-4" :class="stat.iconColor" />
          </span>
        </div>
        <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
        <p class="mt-1 text-xs text-gray-400">{{ stat.note }}</p>
      </div>
    </div>

    <!-- Quick links -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h3 class="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
      <div class="flex flex-wrap gap-3">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-indigo-50
                 hover:text-indigo-700 text-gray-700 rounded-lg transition-colors"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const stats = [
  {
    label: 'Total Players',
    value: '—',
    note: 'Registered in system',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  },
  {
    label: 'Total Matches',
    value: '—',
    note: 'Logged matches',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
  },
  {
    label: 'Tournaments',
    value: '—',
    note: 'Active & past',
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  },
  {
    label: 'Ranked Players',
    value: '—',
    note: 'With ranking points',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`,
  },
]

const quickLinks = [
  { label: 'Manage Players', to: '/admin/players' },
  { label: 'Manage Matches', to: '/admin/matches' },
  { label: 'Manage Tournaments', to: '/admin/tournaments' },
  { label: 'Edit Branding', to: '/admin/branding' },
]
</script>
