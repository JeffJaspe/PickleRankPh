<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Matches</h2>
      <button
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
        disabled
      >
        + Log Match
      </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <p class="text-sm font-medium text-gray-700">All Matches</p>
        <span class="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Coming soon</span>
      </div>

      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Player 1</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Player 2</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tournament</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="i in 5" :key="i" class="animate-pulse">
            <td class="px-6 py-4"><div class="h-3 w-20 bg-gray-200 rounded" /></td>
            <td class="px-6 py-4"><div class="h-3 w-28 bg-gray-200 rounded" /></td>
            <td class="px-6 py-4"><div class="h-3 w-28 bg-gray-200 rounded" /></td>
            <td class="px-6 py-4"><div class="h-3 w-16 bg-gray-200 rounded" /></td>
            <td class="px-6 py-4"><div class="h-3 w-24 bg-gray-200 rounded" /></td>
            <td class="px-6 py-4"><div class="h-3 w-16 bg-gray-200 rounded" /></td>
          </tr>
        </tbody>
      </table>

      <div class="px-6 py-8 text-center text-sm text-gray-400">
        Match management will be connected to Supabase.
      </div>
    </div>
  </div>
</template>
