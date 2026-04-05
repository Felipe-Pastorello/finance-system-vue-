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

const form    = ref({ name: '', email: '', password: '' })
const error   = ref('')
const loading = ref(false)

const pills = [
  { icon: '✅', text: 'Cadastro <strong>rápido e gratuito</strong>'  },
  { icon: '🔐', text: 'Dados <strong>protegidos e privados</strong>' },
]

async function submit() {
  error.value = ''
  if (!form.value.name || !form.value.email || !form.value.password) {
    error.value = 'Preencha todos os campos.'
    return
  }
  loading.value = true
  try {
    // 1. POST /auth/register  →  201 { message }
    await api.register(form.value.name, form.value.email, form.value.password)

    // 2. Login automático após registro
    const loginRes = await api.login(form.value.email, form.value.password)
    auth.setToken(loginRes.token)

    // 3. Busca dados do usuário criado
    const userRes = await api.getMe()
    auth.login(userRes, loginRes.token)

    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = e?.message || 'Erro ao criar conta. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout :pills="pills">
    <h2 class="title">Criar conta</h2>
    <p class="subtitle">Preencha os dados abaixo para se registrar</p>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <AppField label="Nome completo" v-model="form.name"     placeholder="João Silva"          />
    <AppField label="E-mail"        type="email"    v-model="form.email"    placeholder="joao@email.com"      />
    <AppField label="Senha"         type="password" v-model="form.password" placeholder="Mínimo 6 caracteres" />

    <AppButton variant="primary" :full="true" size="lg" :disabled="loading" @click="submit">
      {{ loading ? 'Criando conta...' : 'Criar conta' }}
    </AppButton>

    <p class="switch">
      Já tem conta?
      <RouterLink :to="{ name: 'login' }">Entrar</RouterLink>
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
