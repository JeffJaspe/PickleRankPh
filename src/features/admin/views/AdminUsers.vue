<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Users</h2>
      <button
        @click="openCreate"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        + Add User
      </button>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search by email…"
        class="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700
               focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    <!-- Table card -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <!-- Error banner -->
      <div v-if="fetchError" class="px-6 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
        {{ fetchError }}
      </div>

      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="i in 3" :key="i" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-3 w-48 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-20 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-24 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4 flex justify-end gap-2">
                <div class="h-6 w-12 bg-gray-200 rounded" />
                <div class="h-6 w-12 bg-gray-200 rounded" />
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="filteredUsers.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-sm text-gray-400">
              {{ search ? 'No users match your search.' : 'No users found. Add the first admin.' }}
            </td>
          </tr>

          <!-- User rows -->
          <tr v-else v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                  user.role === 'superadmin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700',
                ]"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500 text-xs">
              {{ formatDate((user as any).created_at) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="openEdit(user)"
                  class="px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(user)"
                  class="px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Create / Edit Modal ─────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="modal.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="closeModal"
      >
        <div class="w-full max-w-md bg-white rounded-xl shadow-xl">
          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-base font-semibold text-gray-900">
              {{ modal.mode === 'create' ? 'Add User' : 'Edit User' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4">
            <!-- Email (create only) -->
            <div v-if="modal.mode === 'create'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="user@picklerank.ph"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <!-- Email display (edit mode) -->
            <div v-else>
              <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p class="text-sm text-gray-900 font-medium">{{ modal.user?.email }}</p>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                v-model="form.role"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <p class="mt-1 text-xs text-gray-400">
                Admin can manage content. Superadmin can manage users.
              </p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ modal.mode === 'create' ? 'Password' : 'New Password' }}
                <span v-if="modal.mode === 'edit'" class="text-gray-400 font-normal">(leave blank to keep current)</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                :required="modal.mode === 'create'"
                placeholder="••••••••"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <!-- Password strength indicator -->
              <div v-if="form.password" class="mt-2 space-y-1">
                <div class="flex gap-1">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="h-1 flex-1 rounded-full transition-colors duration-200"
                    :class="i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'"
                  />
                </div>
                <p class="text-xs" :class="passwordStrength.textColor">
                  {{ passwordStrength.label }}
                  <span class="text-gray-400"> — password is encrypted (bcrypt) by Supabase Auth</span>
                </p>
              </div>
            </div>

            <!-- Error -->
            <p v-if="modal.error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {{ modal.error }}
            </p>

            <!-- Actions -->
            <div class="flex gap-3 pt-1">
              <button
                type="submit"
                :disabled="modal.saving"
                class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {{ modal.saving ? 'Saving…' : modal.mode === 'create' ? 'Create User' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ── Delete Confirmation Modal ──────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="deleteTarget = null"
      >
        <div class="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-900">Delete User</h3>
              <p class="mt-1 text-sm text-gray-500">
                Permanently delete <span class="font-medium text-gray-700">{{ deleteTarget.email }}</span>?
                This removes their login access and cannot be undone.
              </p>
            </div>
          </div>

          <p v-if="deleteError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {{ deleteError }}
          </p>

          <div class="flex gap-3">
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
            <button
              @click="deleteTarget = null"
              class="flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { User } from '@/types'
import { listUsers, createUser, updateUser, deleteUser } from '@/services/api/adminUsers'

// ── State ────────────────────────────────────────────────────────────────────
const users = ref<User[]>([])
const loading = ref(true)
const fetchError = ref('')
const search = ref('')

const filteredUsers = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(u => u.email.toLowerCase().includes(q))
})

const modal = reactive({
  open: false,
  mode: 'create' as 'create' | 'edit',
  user: null as User | null,
  saving: false,
  error: '',
})

const form = reactive({ email: '', password: '', role: 'admin' as 'admin' | 'superadmin' })

const deleteTarget = ref<User | null>(null)
const deleting = ref(false)
const deleteError = ref('')

// ── Init ─────────────────────────────────────────────────────────────────────
onMounted(loadUsers)

async function loadUsers() {
  loading.value = true
  fetchError.value = ''
  try {
    users.value = await listUsers()
  } catch (e: any) {
    fetchError.value = e?.message ?? 'Failed to load users'
  } finally {
    loading.value = false
  }
}

// ── Password strength ────────────────────────────────────────────────────────
const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return { score: 0, label: '', color: '', textColor: '' }

  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) score++

  const levels = [
    { label: 'Too short', color: 'bg-red-400', textColor: 'text-red-500' },
    { label: 'Weak', color: 'bg-orange-400', textColor: 'text-orange-500' },
    { label: 'Fair', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
    { label: 'Good', color: 'bg-blue-400', textColor: 'text-blue-600' },
    { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' },
  ]
  return { score: Math.max(1, score), ...levels[Math.max(0, score)] }
})

// ── Modal helpers ────────────────────────────────────────────────────────────
function openCreate() {
  form.email = ''
  form.password = ''
  form.role = 'admin'
  modal.error = ''
  modal.mode = 'create'
  modal.user = null
  modal.open = true
}

function openEdit(user: User) {
  form.email = user.email
  form.password = ''
  form.role = user.role
  modal.error = ''
  modal.mode = 'edit'
  modal.user = user
  modal.open = true
}

function closeModal() {
  modal.open = false
  modal.error = ''
}

// ── Submit ───────────────────────────────────────────────────────────────────
async function handleSubmit() {
  modal.error = ''
  modal.saving = true
  try {
    if (modal.mode === 'create') {
      const user = await createUser({ email: form.email, password: form.password, role: form.role })
      users.value.unshift(user)
    } else if (modal.user) {
      const payload: { role?: 'admin' | 'superadmin'; password?: string } = { role: form.role }
      if (form.password) payload.password = form.password
      const updated = await updateUser(modal.user.id, payload)
      const idx = users.value.findIndex(u => u.id === modal.user!.id)
      if (idx !== -1) users.value[idx] = updated
    }
    closeModal()
  } catch (e: any) {
    modal.error = e?.message ?? 'Something went wrong'
  } finally {
    modal.saving = false
  }
}

// ── Delete ───────────────────────────────────────────────────────────────────
function confirmDelete(user: User) {
  deleteTarget.value = user
  deleteError.value = ''
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await deleteUser(deleteTarget.value.id)
    users.value = users.value.filter(u => u.id !== deleteTarget.value!.id)
    deleteTarget.value = null
  } catch (e: any) {
    deleteError.value = e?.message ?? 'Failed to delete user'
  } finally {
    deleting.value = false
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
