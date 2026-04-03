<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import AppField from '@/components/ui/AppField.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const auth   = useAuthStore()

const form  = ref({ email: '', password: '' })
const error = ref('')

const pills = [
  { text: 'Gerencie suas <strong>contas bancárias</strong>' },
  { text: 'Registre suas <strong>transações</strong>'       },
  { text: 'Segurança com <strong>JWT + BCrypt</strong>'     },
]

function submit() {
  error.value = ''
  if (!form.value.email || !form.value.password) {
    error.value = 'Preencha e-mail e senha.'
    return
  }
  // Simula login – substitua pela chamada real: POST /auth/login
  auth.login({ name: 'João Silva', email: form.value.email }, 'mock-jwt-token')
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <AuthLayout :pills="pills">
    <h2 class="title">Bem-vindo de volta</h2>
    <p class="subtitle">Acesse sua conta para continuar</p>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <AppField label="E-mail"  type="email"    v-model="form.email"    placeholder="joao@email.com" />
    <AppField label="Senha"   type="password" v-model="form.password" placeholder="••••••••" />

    <AppButton variant="primary" :full="true" size="lg" @click="submit">
      Entrar
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
