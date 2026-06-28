import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import ProjectFormView from '@/views/ProjectFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/novo', name: 'project-create', component: ProjectFormView, meta: { requiresAuth: true } },
    { path: '/editar/:id', name: 'project-edit', component: ProjectFormView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated && !auth.loading) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
