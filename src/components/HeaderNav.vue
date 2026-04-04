<template>
  <header class="sticky top-0 z-50 border-b border-white/10 shadow-lg shadow-black/40" :style="{ background: 'var(--color-secondary)' }">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 shrink-0 group">
          <span class="logo-text text-xl font-black tracking-widest uppercase text-white transition-colors duration-200">
            Pickle<span class="logo-primary">Rank</span>
          </span>
          <span class="text-[10px] font-bold tracking-widest text-white/30 uppercase mt-1">PH</span>
        </RouterLink>

        <!-- Desktop Nav -->
        <ul class="hidden md:flex items-center gap-1">
          <li v-for="item in navItems" :key="item.label">

            <!-- Simple link -->
            <RouterLink
              v-if="!item.children"
              :to="item.to"
              class="nav-link"
              :class="{ 'nav-link--active': isActive(item) }"
            >
              {{ item.label }}
            </RouterLink>

            <!-- Dropdown -->
            <div
              v-else
              class="relative"
              @mouseenter="openDropdown(item.label)"
              @mouseleave="closeDropdown"
            >
              <button
                class="nav-link flex items-center gap-1.5"
                :class="{ 'nav-link--active': isDropdownActive(item) }"
              >
                {{ item.label }}
                <svg
                  class="w-3 h-3 text-white/40 transition-transform duration-200"
                  :class="{ 'rotate-180': activeDropdown === item.label }"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <Transition name="dropdown">
                <ul
                  v-if="activeDropdown === item.label"
                  class="absolute top-full left-0 mt-1 w-52 border border-white/10 shadow-xl shadow-black/60 py-1"
                  :style="{ background: 'var(--color-secondary)' }"
                >
                  <li v-for="child in item.children" :key="child.label">
                    <RouterLink
                      :to="child.to"
                      class="dropdown-item"
                      :class="{ 'dropdown-item--active': $route.path === child.to }"
                      @click="closeDropdown"
                    >
                      <span class="w-1 h-1 rounded-full" :style="{ background: 'var(--color-primary)' }"></span>
                      {{ child.label }}
                    </RouterLink>
                  </li>
                </ul>
              </Transition>
            </div>

          </li>
        </ul>

        <!-- Secret admin entry — no label, no tooltip, barely visible -->
        <RouterLink
          to="/admin/login"
          class="secret-gate hidden md:flex items-center justify-center w-7 h-7"
          aria-label=" "
          tabindex="-1"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </RouterLink>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 group"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <span
            class="block h-0.5 bg-white transition-all duration-300 origin-center"
            :class="mobileOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'"
          ></span>
          <span
            class="block h-0.5 bg-white transition-all duration-300"
            :class="mobileOpen ? 'w-0 opacity-0' : 'w-4'"
          ></span>
          <span
            class="block h-0.5 bg-white transition-all duration-300 origin-center"
            :class="mobileOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'"
          ></span>
        </button>

      </div>
    </nav>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="mobileOpen" class="md:hidden border-t border-white/10" :style="{ background: 'var(--color-secondary)' }">
        <ul class="px-4 py-3 space-y-1">
          <li v-for="item in navItems" :key="item.label">

            <!-- Simple link -->
            <RouterLink
              v-if="!item.children"
              :to="item.to"
              class="mobile-link"
              :class="{ 'mobile-link--active': isActive(item) }"
              @click="mobileOpen = false"
            >
              {{ item.label }}
            </RouterLink>

            <!-- Accordion -->
            <div v-else>
              <button
                class="mobile-link w-full flex items-center justify-between"
                :class="{ 'mobile-link--active': isDropdownActive(item) }"
                @click="toggleMobileAccordion(item.label)"
              >
                {{ item.label }}
                <svg
                  class="w-3.5 h-3.5 text-white/40 transition-transform duration-200"
                  :class="{ 'rotate-180': mobileAccordion === item.label }"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <Transition name="accordion">
                <ul v-if="mobileAccordion === item.label" class="mt-1 pl-4 border-l border-white/10 space-y-1">
                  <li v-for="child in item.children" :key="child.label">
                    <RouterLink
                      :to="child.to"
                      class="mobile-link text-sm"
                      :class="{ 'mobile-link--active': $route.path === child.to }"
                      @click="mobileOpen = false; mobileAccordion = ''"
                    >
                      {{ child.label }}
                    </RouterLink>
                  </li>
                </ul>
              </Transition>
            </div>

          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const activeDropdown = ref('')
const mobileOpen = ref(false)
const mobileAccordion = ref('')

const navItems = [
  { label: 'Home', to: '/' },
  {
    label: 'Rankings',
    to: '/rankings',
    children: [
      { label: 'Official (National)', to: '/rankings/official' },
      { label: 'Amateur (Community)', to: '/rankings/amateur' },
    ],
  },
  {
    label: 'Matches',
    to: '/matches',
    children: [
      { label: 'Local Tournaments', to: '/matches/local' },
      { label: 'National Tournaments', to: '/matches/national' },
      { label: 'Club Leagues', to: '/matches/club-leagues' },
    ],
  },
  {
    label: 'Registered Courts',
    to: '/courts',
    children: [
      { label: 'Open Play', to: '/courts/open-play' },
    ],
  },
]

function isActive(item: { to: string }) {
  return item.to === '/' ? route.path === '/' : route.path.startsWith(item.to)
}

function isDropdownActive(item: { to: string; children?: unknown[] }) {
  return route.path.startsWith(item.to)
}

let closeTimer: ReturnType<typeof setTimeout>

function openDropdown(label: string) {
  clearTimeout(closeTimer)
  activeDropdown.value = label
}

function closeDropdown() {
  closeTimer = setTimeout(() => {
    activeDropdown.value = ''
  }, 120)
}

function toggleMobileAccordion(label: string) {
  mobileAccordion.value = mobileAccordion.value === label ? '' : label
}
</script>

<style scoped>
.nav-link {
  @apply relative px-3 py-2 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors duration-200 cursor-pointer select-none;
}

.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-3 right-3 h-0.5 scale-x-0 transition-transform duration-200 origin-left;
  background-color: var(--color-primary);
}

.nav-link:hover::after,
.nav-link--active::after {
  @apply scale-x-100;
}

.nav-link--active {
  @apply text-white;
}

.dropdown-item {
  @apply flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-white/50 hover:text-white hover:bg-white/5 transition-all duration-150;
}

.dropdown-item--active {
  color: var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.mobile-link {
  @apply block px-3 py-2.5 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white hover:bg-white/5 rounded transition-all duration-150;
}

.mobile-link--active {
  @apply text-white bg-white/5;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  @apply transition-all duration-200;
}
.dropdown-enter-from,
.dropdown-leave-to {
  @apply opacity-0 -translate-y-1;
}

/* Mobile menu transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  @apply transition-all duration-300;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  @apply opacity-0 -translate-y-2;
}

/* Logo */
.logo-primary {
  color: var(--color-primary);
}
.group:hover .logo-text {
  color: var(--color-primary);
}

/* Secret admin gate — barely there, no label, no tooltip */
.secret-gate {
  color: rgba(255, 255, 255, 0.20);
  transition: color 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  opacity: 1;
  cursor: default;
}
.secret-gate:hover {
  color: var(--color-primary);
  opacity: 1;
  cursor: pointer;
  transform: scale(1.15);
}

/* Accordion transition */
.accordion-enter-active,
.accordion-leave-active {
  @apply transition-all duration-200 overflow-hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  @apply opacity-0 max-h-0;
}
.accordion-enter-to,
.accordion-leave-from {
  @apply opacity-100 max-h-40;
}
</style>
