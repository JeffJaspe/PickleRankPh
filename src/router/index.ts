import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', meta: { label: 'Home' }, component: () => import('@/features/common/views/PlaceholderView.vue') },
        { path: 'rankings', redirect: '/rankings/official' },
        { path: 'rankings/official', name: 'rankings-official', component: () => import('@/features/rankings/views/RankingsView.vue') },
        { path: 'rankings/amateur', name: 'rankings-amateur', meta: { label: 'Amateur (Community)' }, component: () => import('@/features/common/views/PlaceholderView.vue') },
        { path: 'matches', redirect: '/matches/local' },
        { path: 'matches/local', name: 'matches-local', meta: { label: 'Local Tournaments' }, component: () => import('@/features/common/views/PlaceholderView.vue') },
        { path: 'matches/national', name: 'matches-national', meta: { label: 'National Tournaments' }, component: () => import('@/features/common/views/PlaceholderView.vue') },
        { path: 'matches/club-leagues', name: 'matches-club-leagues', meta: { label: 'Club Leagues' }, component: () => import('@/features/common/views/PlaceholderView.vue') },
        { path: 'courts', redirect: '/courts/open-play' },
        { path: 'courts/open-play', name: 'courts-open-play', meta: { label: 'Open Play' }, component: () => import('@/features/common/views/PlaceholderView.vue') },
        { path: 'tournaments', name: 'tournaments', component: () => import('@/features/tournaments/views/TournamentsView.vue') },
        { path: 'players', name: 'players', component: () => import('@/features/players/views/PlayersView.vue') },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/features/admin/views/AdminDashboard.vue') },
        { path: 'users', name: 'admin-users', component: () => import('@/features/admin/views/AdminUsers.vue') },
        { path: 'players', name: 'admin-players', component: () => import('@/features/admin/views/AdminPlayers.vue') },
        { path: 'tournaments', name: 'admin-tournaments', component: () => import('@/features/admin/views/AdminTournaments.vue') },
        { path: 'matches', name: 'admin-matches', component: () => import('@/features/admin/views/AdminMatches.vue') },
        { path: 'branding', name: 'admin-branding', component: () => import('@/features/admin/views/AdminBranding.vue') },
        { path: 'footer', name: 'admin-footer', component: () => import('@/features/admin/views/AdminFooter.vue') },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/features/admin/views/AdminLogin.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    await auth.initialize()
    if (!auth.user) return { name: 'admin-login' }
  }
})

export default router
