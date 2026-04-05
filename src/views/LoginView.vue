<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import AppField   from '@/components/ui/AppField.vue'
import AppButton  from '@/components/ui/AppButton.vue'

const router  = useRouter()
const auth    = useAuthStore()

const form    = ref({ email: '', password: '' })
const error   = ref('')
const loading = ref(false)

const pills = [
  { text: 'Gerencie suas <strong>contas bancárias</strong>' },
  { text: 'Registre suas <strong>transações</strong>'       },
  { text: 'Segurança com <strong>JWT + BCrypt</strong>'     },
]

async function submit() {
  error.value = ''
  if (!form.value.email || !form.value.password) {
    error.value = 'Preencha e-mail e senha.'
    return
  }
  loading.value = true
  try {
    // 1. POST /auth/login  →  { token }
    const loginRes = await api.login(form.value.email, form.value.password)

    // 2. Salva o token antes de chamar /users/me (que precisa do Bearer)
    auth.setToken(loginRes.token)

    // 3. GET /users/me  →  { id, name, email }
    const userRes = await api.getMe()

    // 4. Persiste sessão completa
    auth.login(userRes, loginRes.token)
    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = e?.message || 'E-mail ou senha inválidos.'
    auth.logout()            // limpa token parcial se algo falhou
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout :pills="pills">
    <h2 class="title">Bem-vindo de volta</h2>
    <p class="subtitle">Acesse sua conta para continuar</p>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <AppField label="E-mail"  type="email"    v-model="form.email"    placeholder="joao@email.com" />
    <AppField label="Senha"   type="password" v-model="form.password" placeholder="••••••••" />

    <AppButton variant="primary" :full="true" size="lg" :disabled="loading" @click="submit">
      {{ loading ? 'Entrando...' : 'Entrar' }}
    </AppButton>

    <p class="switch">
      Não tem conta?
      <RouterLink :to="{ name: 'register' }">Criar conta</RouterLink>
    </p>
  </AuthLayout>
</template>

<style scoped>
.title    { font-family: var(--display); font-size: 2rem; margin-bottom: 6px; }
.subtitle { color: var(--muted); font-size: .93rem; margin-bottom: 32px; }
.error-msg { color: var(--red); font-size: .85rem; margin-bottom: 14px; }
.switch {
  margin-top: 18px;
  text-align: center;
  font-size: .9rem;
  color: var(--muted);
}
.switch a { color: var(--accent); text-decoration: underline; }
</style>
