<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import AppField from '@/components/ui/AppField.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const auth   = useAuthStore()

const form  = ref({ name: '', email: '', password: '' })
const error = ref('')

const pills = [
  { icon: '✅', text: 'Cadastro <strong>rápido e gratuito</strong>'  },
  { icon: '🔐', text: 'Dados <strong>protegidos e privados</strong>' },
]

function submit() {
  error.value = ''
  if (!form.value.name || !form.value.email || !form.value.password) {
    error.value = 'Preencha todos os campos.'
    return
  }
  // Simula registro – substitua pela chamada real: POST /auth/register
  auth.login({ name: form.value.name, email: form.value.email }, 'mock-jwt-token')
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <AuthLayout :pills="pills">
    <h2 class="title">Criar conta</h2>
    <p class="subtitle">Preencha os dados abaixo para se registrar</p>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <AppField label="Nome completo" v-model="form.name"     placeholder="João Silva"          />
    <AppField label="E-mail"        type="email" v-model="form.email"    placeholder="joao@email.com"      />
    <AppField label="Senha"         type="password" v-model="form.password" placeholder="Mínimo 6 caracteres" />

    <AppButton variant="primary" :full="true" size="lg" @click="submit">
      Criar conta
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
