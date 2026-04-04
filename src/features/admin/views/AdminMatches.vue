<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Matches</h2>
      <button
        @click="openLog"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        + Log Match
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div v-if="matchStore.error" class="px-6 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
        {{ matchStore.error }}
      </div>

      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Player 1</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Player 2</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Winner</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pts</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <template v-if="matchStore.loading">
            <tr v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-3 w-20 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-28 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-28 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-12 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-24 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-10 bg-gray-200 rounded" /></td>
              <td class="px-6 py-4"><div class="h-3 w-14 bg-gray-200 rounded ml-auto" /></td>
            </tr>
          </template>

          <tr v-else-if="matchStore.matches.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-400">
              No matches logged yet.
            </td>
          </tr>

          <tr
            v-else
            v-for="match in matchStore.matches"
            :key="match.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-gray-500 text-xs">{{ formatDate(match.played_at) }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ playerName(match.player1_id) }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ playerName(match.player2_id) }}</td>
            <td class="px-6 py-4 font-mono text-gray-700">{{ match.player1_score }}–{{ match.player2_score }}</td>
            <td class="px-6 py-4">
              <span class="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                {{ playerName(match.winner_id) }}
              </span>
            </td>
            <td class="px-6 py-4 font-semibold text-indigo-600">{{ match.points_awarded }}</td>
            <td class="px-6 py-4 text-right">
              <button
                @click="confirmDelete(match)"
                class="px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Log Match Modal -->
    <Teleport to="body">
      <div
        v-if="modal.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="closeModal"
      >
        <div class="w-full max-w-md bg-white rounded-xl shadow-xl">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-base font-semibold text-gray-900">Log Match</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>

          <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Played</label>
              <input
                v-model="form.played_at"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Player 1</label>
                <select
                  v-model="form.player1_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  <option value="">Select player</option>
                  <option
                    v-for="p in playerStore.players"
                    :key="p.id"
                    :value="p.id"
                    :disabled="p.id === form.player2_id"
                  >{{ p.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Player 2</label>
                <select
                  v-model="form.player2_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  <option value="">Select player</option>
                  <option
                    v-for="p in playerStore.players"
                    :key="p.id"
                    :value="p.id"
                    :disabled="p.id === form.player1_id"
                  >{{ p.name }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Score P1</label>
                <input
                  v-model.number="form.player1_score"
                  type="number"
                  min="0"
                  required
                  placeholder="11"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Score P2</label>
                <input
                  v-model.number="form.player2_score"
                  type="number"
                  min="0"
                  required
                  placeholder="7"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Points Awarded to Winner</label>
              <input
                v-model.number="form.points_awarded"
                type="number"
                min="0"
                required
                placeholder="10"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tournament (optional)</label>
              <select
                v-model="form.tournament_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">None</option>
                <option
                  v-for="t in tournamentStore.tournaments"
                  :key="t.id"
                  :value="t.id"
                >{{ t.name }}</option>
              </select>
            </div>

            <p v-if="modal.error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {{ modal.error }}
            </p>

            <div class="flex gap-3 pt-1">
              <button
                type="submit"
                :disabled="modal.saving"
                class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors"
              >{{ modal.saving ? 'Saving…' : 'Log Match' }}</button>
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
            <h3 class="text-base font-semibold text-gray-900">Delete Match</h3>
            <p class="mt-1 text-sm text-gray-500">
              Delete this match record? This cannot be undone.
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
import { reactive, ref, computed, onMounted } from 'vue'
import { useMatchesStore } from '@/stores/matches'
import { usePlayersStore } from '@/stores/players'
import { useTournamentsStore } from '@/stores/tournaments'
import type { Match } from '@/types'

const matchStore = useMatchesStore()
const playerStore = usePlayersStore()
const tournamentStore = useTournamentsStore()

onMounted(async () => {
  await Promise.all([
    matchStore.fetch(),
    playerStore.players.length === 0 ? playerStore.fetch() : Promise.resolve(),
    tournamentStore.tournaments.length === 0 ? tournamentStore.fetch() : Promise.resolve(),
  ])
})

// Player name lookup
const playerMap = computed(() =>
  Object.fromEntries(playerStore.players.map(p => [p.id, p.name]))
)
function playerName(id: string) { return playerMap.value[id] ?? '—' }

const modal = reactive({ open: false, saving: false, error: '' })
const form = reactive({
  played_at: new Date().toISOString().slice(0, 10),
  player1_id: '',
  player2_id: '',
  player1_score: 0,
  player2_score: 0,
  points_awarded: 10,
  tournament_id: '',
})

const deleteTarget = ref<Match | null>(null)
const deleting = ref(false)
const deleteError = ref('')

function openLog() {
  Object.assign(form, {
    played_at: new Date().toISOString().slice(0, 10),
    player1_id: '',
    player2_id: '',
    player1_score: 0,
    player2_score: 0,
    points_awarded: 10,
    tournament_id: '',
  })
  modal.error = ''
  modal.open = true
}

function closeModal() { modal.open = false; modal.error = '' }

async function handleSubmit() {
  modal.error = ''
  if (form.player1_id === form.player2_id) {
    modal.error = 'Players must be different.'
    return
  }
  if (form.player1_score === form.player2_score) {
    modal.error = 'Scores cannot be tied — one player must win.'
    return
  }
  modal.saving = true
  try {
    const winner_id = form.player1_score > form.player2_score ? form.player1_id : form.player2_id
    await matchStore.create({
      played_at: form.played_at,
      player1_id: form.player1_id,
      player2_id: form.player2_id,
      player1_score: form.player1_score,
      player2_score: form.player2_score,
      winner_id,
      points_awarded: form.points_awarded,
      tournament_id: form.tournament_id || null as any,
    })
    closeModal()
  } catch (e: any) {
    modal.error = e?.message ?? 'Something went wrong'
  } finally {
    modal.saving = false
  }
}

function confirmDelete(match: Match) {
  deleteTarget.value = match
  deleteError.value = ''
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await matchStore.remove(deleteTarget.value.id)
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
