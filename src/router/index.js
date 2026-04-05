import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import AccountsView from '@/views/AccountsView.vue'
import TransactionsView from '@/views/TransactionsView.vue'
import ProfileView from '@/views/ProfileView.vue'

const routes = [
  { path: '/login',    name: 'login',    component: LoginView,    meta: { guest: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guest: true } },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true }, //Apenas usuários logados
    children: [
      { path: '',           redirect: '/dashboard' },
      { path: 'dashboard',  name: 'dashboard',     component: DashboardView    },
      { path: 'accounts',   name: 'accounts',      component: AccountsView     },
      { path: 'transactions', name: 'transactions', component: TransactionsView },
      { path: 'profile',    name: 'profile',       component: ProfileView      },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next({ name: 'login' })
  if (to.meta.guest && auth.isLoggedIn) return next({ name: 'dashboard' })
  next()
})

export default router
