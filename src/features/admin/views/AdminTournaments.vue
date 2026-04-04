<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Tournaments</h2>
      <button
        @click="openCreate"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        + Add Tournament
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div v-if="store.error" class="px-6 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
        {{ store.error }}
      </div>

      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scope</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <template v-if="store.loading">
            <tr v-for="i in 4" :key="i" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-3 w-36 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-28 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-16 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-28 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-16 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-16 bg-gray-200 rounded ml-auto" /></td>
            </tr>
          </template>

          <tr v-else-if="store.tournaments.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-400">
              No tournaments yet. Add the first one.
            </td>
          </tr>

          <tr
            v-else
            v-for="t in store.tournaments"
            :key="t.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 font-medium text-gray-900">{{ t.name }}</td>
            <td class="px-6 py-4 text-gray-500 text-xs">{{ t.location || '—' }}</td>
            <td class="px-6 py-4">
              <span class="text-xs font-semibold capitalize text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {{ t.scope }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500 text-xs">
              {{ formatDate(t.start_date) }} – {{ formatDate(t.end_date) }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'text-xs font-semibold px-2 py-0.5 rounded-full',
                  t.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                  t.status === 'ongoing'  ? 'bg-green-50 text-green-700' :
                                            'bg-gray-100 text-gray-500'
                ]"
              >{{ t.status }}</span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="openEdit(t)"
                  class="px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >Edit</button>
                <button
                  @click="confirmDelete(t)"
                  class="px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <div
        v-if="modal.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="closeModal"
      >
        <div class="w-full max-w-lg bg-white rounded-xl shadow-xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-base font-semibold text-gray-900">
              {{ modal.mode === 'create' ? 'Add Tournament' : 'Edit Tournament' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>

          <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tournament Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="PickleRank Open 2025"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                v-model="form.location"
                type="text"
                placeholder="Makati Sports Complex"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Scope</label>
                <select
                  v-model="form.scope"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  <option value="local">Local</option>
                  <option value="provincial">Provincial</option>
                  <option value="regional">Regional</option>
                  <option value="national">National</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="form.status"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  v-model="form.start_date"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  v-model="form.end_date"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <p v-if="modal.error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {{ modal.error }}
            </p>

            <div class="flex gap-3 pt-1">
              <button
                type="submit"
                :disabled="modal.saving"
                class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {{ modal.saving ? 'Saving…' : modal.mode === 'create' ? 'Add Tournament' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="deleteTarget = null"
      >
        <div class="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 space-y-4">
          <div>
            <h3 class="text-base font-semibold text-gray-900">Delete Tournament</h3>
            <p class="mt-1 text-sm text-gray-500">
              Delete <span class="font-medium text-gray-700">{{ deleteTarget.name }}</span>?
              This cannot be undone.
            </p>
          </div>
          <p v-if="deleteError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {{ deleteError }}
          </p>
          <div class="flex gap-3">
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold rounded-lg transition-colors"
            >{{ deleting ? 'Deleting…' : 'Delete' }}</button>
            <button
              @click="deleteTarget = null"
              class="flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useTournamentsStore } from '@/stores/tournaments'
import type { Tournament, RankingScope } from '@/types'

const store = useTournamentsStore()
onMounted(() => store.fetch())

const today = new Date().toISOString().slice(0, 10)

const modal = reactive({
  open: false,
  mode: 'create' as 'create' | 'edit',
  tournament: null as Tournament | null,
  saving: false,
  error: '',
})

const form = reactive({
  name: '',
  location: '',
  scope: 'local' as RankingScope,
  status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
  start_date: today,
  end_date: today,
})

const deleteTarget = ref<Tournament | null>(null)
const deleting = ref(false)
const deleteError = ref('')

function openCreate() {
  Object.assign(form, { name: '', location: '', scope: 'local', status: 'upcoming', start_date: today, end_date: today })
  modal.error = ''
  modal.mode = 'create'
  modal.tournament = null
  modal.open = true
}

function openEdit(t: Tournament) {
  Object.assign(form, {
    name: t.name,
    location: t.location ?? '',
    scope: t.scope,
    status: t.status,
    start_date: t.start_date?.slice(0, 10) ?? today,
    end_date: t.end_date?.slice(0, 10) ?? today,
  })
  modal.error = ''
  modal.mode = 'edit'
  modal.tournament = t
  modal.open = true
}

function closeModal() { modal.open = false; modal.error = '' }

async function handleSubmit() {
  modal.error = ''
  modal.saving = true
  try {
    const payload = {
      name: form.name,
      location: form.location,
      scope: form.scope,
      status: form.status,
      start_date: form.start_date,
      end_date: form.end_date,
      city_code: '',
      province_code: '',
      region_code: '',
    }
    if (modal.mode === 'create') {
      await store.create(payload)
    } else if (modal.tournament) {
      await store.update(modal.tournament.id, payload)
    }
    closeModal()
  } catch (e: any) {
    modal.error = e?.message ?? 'Something went wrong'
  } finally {
    modal.saving = false
  }
}

function confirmDelete(t: Tournament) {
  deleteTarget.value = t
  deleteError.value = ''
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await store.remove(deleteTarget.value.id)
    deleteTarget.value = null
  } catch (e: any) {
    deleteError.value = e?.message ?? 'Failed to delete'
  } finally {
    deleting.value = false
  }
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
