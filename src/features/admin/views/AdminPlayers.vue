<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Players</h2>
      <button
        @click="openCreate"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        + Add Player
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <!-- Error banner -->
      <div v-if="store.error" class="px-6 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
        {{ store.error }}
      </div>

      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">DUPR</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <template v-if="store.loading">
            <tr v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-3 w-4 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-32 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-28 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-12 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-14 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-16 bg-gray-200 rounded ml-auto" /></td>
            </tr>
          </template>

          <tr v-else-if="store.players.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-400">
              No players yet. Add the first one.
            </td>
          </tr>

          <tr
            v-else
            v-for="(player, i) in store.players"
            :key="player.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-gray-400 font-medium">{{ i + 1 }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ player.name }}</td>
            <td class="px-6 py-4 text-gray-500 text-xs">
              {{ [player.city, player.province].filter(Boolean).join(', ') || player.region || '—' }}
            </td>
            <td class="px-6 py-4 text-gray-500">{{ player.dupr_rating ?? '—' }}</td>
            <td class="px-6 py-4 font-semibold text-gray-900">{{ (player.points ?? 0).toLocaleString() }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="openEdit(player)"
                  class="px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >Edit</button>
                <button
                  @click="confirmDelete(player)"
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
        <div class="w-full max-w-md bg-white rounded-xl shadow-xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-base font-semibold text-gray-900">
              {{ modal.mode === 'create' ? 'Add Player' : 'Edit Player' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>

          <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Juan dela Cruz"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City / Town</label>
                <input
                  v-model="form.city"
                  type="text"
                  placeholder="Makati"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input
                  v-model="form.province"
                  type="text"
                  placeholder="Metro Manila"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <input
                v-model="form.region"
                type="text"
                placeholder="NCR"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input
                  v-model.number="form.points"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DUPR Rating</label>
                <input
                  v-model.number="form.dupr_rating"
                  type="number"
                  step="0.01"
                  min="0"
                  max="8"
                  placeholder="5.00"
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
                {{ modal.saving ? 'Saving…' : modal.mode === 'create' ? 'Add Player' : 'Save Changes' }}
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
            <h3 class="text-base font-semibold text-gray-900">Delete Player</h3>
            <p class="mt-1 text-sm text-gray-500">
              Permanently delete <span class="font-medium text-gray-700">{{ deleteTarget.name }}</span>?
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
import { usePlayersStore } from '@/stores/players'
import type { Player } from '@/types'

const store = usePlayersStore()
onMounted(() => store.fetch())

const modal = reactive({
  open: false,
  mode: 'create' as 'create' | 'edit',
  player: null as Player | null,
  saving: false,
  error: '',
})

const form = reactive({
  name: '',
  city: '',
  province: '',
  region: '',
  points: 0,
  dupr_rating: undefined as number | undefined,
})

const deleteTarget = ref<Player | null>(null)
const deleting = ref(false)
const deleteError = ref('')

function openCreate() {
  Object.assign(form, { name: '', city: '', province: '', region: '', points: 0, dupr_rating: undefined })
  modal.error = ''
  modal.mode = 'create'
  modal.player = null
  modal.open = true
}

function openEdit(player: Player) {
  Object.assign(form, {
    name: player.name,
    city: player.city ?? '',
    province: player.province ?? '',
    region: player.region ?? '',
    points: player.points ?? 0,
    dupr_rating: player.dupr_rating,
  })
  modal.error = ''
  modal.mode = 'edit'
  modal.player = player
  modal.open = true
}

function closeModal() { modal.open = false; modal.error = '' }

async function handleSubmit() {
  modal.error = ''
  modal.saving = true
  try {
    const payload = {
      name: form.name,
      city: form.city,
      province: form.province,
      region: form.region,
      points: form.points,
      ...(form.dupr_rating !== undefined ? { dupr_rating: form.dupr_rating } : {}),
    }
    if (modal.mode === 'create') {
      await store.create(payload as any)
    } else if (modal.player) {
      await store.update(modal.player.id, payload)
    }
    closeModal()
  } catch (e: any) {
    modal.error = e?.message ?? 'Something went wrong'
  } finally {
    modal.saving = false
  }
}

function confirmDelete(player: Player) {
  deleteTarget.value = player
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
</script>
