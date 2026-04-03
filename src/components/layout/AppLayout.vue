<script setup>
import { provide, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import AppToast from '@/components/ui/AppToast.vue'

const auth  = useAuthStore()
const route = useRoute()

const toast = ref({ show: false, message: '', type: 'success' })

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

provide('showToast', showToast)

const navItems = [
  { name: 'dashboard',    icon: '📊', label: 'Dashboard'   },
  { name: 'accounts',     icon: '💳', label: 'Contas'       },
  { name: 'transactions', icon: '↕️', label: 'Transações'   },
  { name: 'profile',      icon: '👤', label: 'Perfil'       },
]
</script>

<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">FinTrack</div>

      <nav>
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="nav-item"
          :class="{ active: route.name === item.name }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="spacer" />

      <RouterLink :to="{ name: 'profile' }" class="nav-user">
        <div class="avatar">{{ auth.user?.name?.[0] ?? 'U' }}</div>
        <div>
          <div class="nu-name">{{ auth.user?.name }}</div>
          <div class="nu-email">{{ auth.user?.email }}</div>
        </div>
      </RouterLink>
    </aside>

    <main class="main">
      <RouterView />
    </main>

    <AppToast v-bind="toast" />
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.brand {
  font-family: var(--display);
  font-size: 1.65rem;
  color: var(--accent);
  padding: 0 24px 26px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 18px;
}

nav { display: flex; flex-direction: column; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 24px;
  font-size: .93rem;
  color: var(--muted);
  text-decoration: none;
  font-weight: 500;
  transition: all .14s;
  border-right: 3px solid transparent;
}
.nav-item:hover { color: var(--text); background: rgba(255,255,255,.03); }
.nav-item.active { color: var(--accent); background: rgba(200,240,77,.07); border-right-color: var(--accent); }
.nav-icon { font-size: 1.1rem; width: 20px; text-align: center; }

.spacer { flex: 1; }

.nav-user {
  margin: 0 14px;
  padding: 12px 14px;
  background: var(--bg3);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  color: var(--text);
  transition: background .14s;
}
.nav-user:hover { background: var(--border); }

.avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #4ddb8a);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: .88rem; color: #0f0f11;
  flex-shrink: 0;
}
.nu-name  { font-size: .88rem; font-weight: 600; }
.nu-email { font-size: .73rem; color: var(--muted); }

.main { padding: 40px 44px; overflow-y: auto; }
</style>
