<template>
  <div class="max-w-3xl space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">Footer Items</h2>
      <button
        class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
        @click="openAdd"
      >
        + Add Item
      </button>
    </div>

    <!-- Error -->
    <p v-if="store.error" class="text-sm text-red-600">{{ store.error }}</p>

    <!-- Loading -->
    <p v-if="store.loading" class="text-sm text-gray-400">Loading…</p>

    <!-- List -->
    <div v-else class="space-y-2">
      <div
        v-for="item in store.items"
        :key="item.id"
        class="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3"
      >
        <!-- Type badge -->
        <span
          class="text-xs font-semibold px-2 py-0.5 rounded"
          :class="item.type === 'image' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
        >
          {{ item.type }}
        </span>

        <!-- Preview -->
        <div class="flex-1 min-w-0">
          <template v-if="item.type === 'image'">
            <img :src="item.url" :alt="item.label ?? ''" class="h-8 object-contain" />
          </template>
          <template v-else>
            <p class="text-sm font-medium text-gray-800 truncate">{{ item.label }}</p>
            <p class="text-xs text-gray-400 truncate">{{ item.url }}</p>
          </template>
        </div>

        <!-- Sort order -->
        <span class="text-xs text-gray-400 w-8 text-center">#{{ item.sort_order }}</span>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            class="text-xs text-indigo-600 hover:underline"
            @click="openEdit(item)"
          >Edit</button>
          <button
            class="text-xs text-red-500 hover:underline"
            @click="confirmDelete(item.id)"
          >Delete</button>
        </div>
      </div>

      <p v-if="!store.items.length" class="text-sm text-gray-400 text-center py-8">
        No footer items yet. Click "Add Item" to get started.
      </p>
    </div>

    <!-- Modal -->
    <div
      v-if="modal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-800">{{ modal.isEdit ? 'Edit' : 'Add' }} Footer Item</h3>

        <!-- Type -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <div class="flex gap-3">
            <button
              v-for="t in ['link', 'image']"
              :key="t"
              class="px-3 py-1.5 rounded text-sm font-medium border transition-colors"
              :class="modal.type === t
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'"
              @click="modal.type = t as 'link' | 'image'"
            >
              {{ t.charAt(0).toUpperCase() + t.slice(1) }}
            </button>
          </div>
        </div>

        <!-- Label (links only) -->
        <div v-if="modal.type === 'link'">
          <label class="block text-xs font-medium text-gray-600 mb-1">Label</label>
          <input
            v-model="modal.label"
            type="text"
            placeholder="e.g. Facebook"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <!-- URL -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">
            {{ modal.type === 'image' ? 'Image URL' : 'Link URL' }}
          </label>
          <input
            v-model="modal.url"
            type="url"
            placeholder="https://..."
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <!-- Image preview -->
          <img
            v-if="modal.type === 'image' && modal.url"
            :src="modal.url"
            class="mt-2 h-12 object-contain rounded border border-gray-200"
          />
        </div>

        <!-- Sort order -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
          <input
            v-model.number="modal.sort_order"
            type="number"
            min="0"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <p v-if="modal.error" class="text-sm text-red-600">{{ modal.error }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <button
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            @click="closeModal"
          >Cancel</button>
          <button
            class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            :disabled="modal.saving"
            @click="save"
          >
            {{ modal.saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useFooterStore } from '@/stores/footer'
import type { FooterItem } from '@/stores/footer'

const store = useFooterStore()

onMounted(() => store.fetch())

const modal = reactive({
  open: false,
  isEdit: false,
  editId: '',
  type: 'link' as 'link' | 'image',
  label: '',
  url: '',
  sort_order: 0,
  saving: false,
  error: '',
})

function openAdd() {
  modal.open = true
  modal.isEdit = false
  modal.editId = ''
  modal.type = 'link'
  modal.label = ''
  modal.url = ''
  modal.sort_order = store.items.length
  modal.error = ''
}

function openEdit(item: FooterItem) {
  modal.open = true
  modal.isEdit = true
  modal.editId = item.id
  modal.type = item.type
  modal.label = item.label ?? ''
  modal.url = item.url
  modal.sort_order = item.sort_order
  modal.error = ''
}

function closeModal() {
  modal.open = false
}

async function save() {
  if (!modal.url.trim()) { modal.error = 'URL is required.'; return }
  modal.saving = true
  modal.error = ''
  try {
    const payload = {
      type: modal.type,
      label: modal.type === 'link' ? modal.label || null : null,
      url: modal.url.trim(),
      sort_order: modal.sort_order,
    }
    if (modal.isEdit) {
      await store.update(modal.editId, payload)
    } else {
      await store.create(payload)
    }
    closeModal()
  } catch (err: any) {
    modal.error = err.message ?? 'Failed to save.'
  } finally {
    modal.saving = false
  }
}

async function confirmDelete(id: string) {
  if (!confirm('Delete this footer item?')) return
  try {
    await store.remove(id)
  } catch (err: any) {
    alert(err.message ?? 'Failed to delete.')
  }
}
</script>
