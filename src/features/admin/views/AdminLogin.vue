<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-gray-900">PickleRank</h1>
          <p class="mt-1 text-sm text-gray-500">Admin Portal</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="email">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              placeholder="admin@picklerank.ph"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <!-- Error -->
          <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
                   text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>
      </div>

      <p class="mt-4 text-center text-xs text-gray-400">PickleRank Philippines &copy; {{ year }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const year = new Date().getFullYear()

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/admin/dashboard')
  } catch (e: any) {
    error.value = e?.message ?? 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
