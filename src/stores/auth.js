import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('ft_token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('ft_user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)

  /** Salva token antecipadamente (necessário antes de chamar /users/me no login) */
  function setToken(jwt) {
    token.value = jwt
    localStorage.setItem('ft_token', jwt)
  }

  function login(userData, jwt) {
    token.value = jwt
    user.value  = userData
    localStorage.setItem('ft_token', jwt)
    localStorage.setItem('ft_user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('ft_token')
    localStorage.removeItem('ft_user')
  }

  function updateUser(data) {
    user.value = { ...user.value, ...data }
    localStorage.setItem('ft_user', JSON.stringify(user.value))
  }

  return { token, user, isLoggedIn, setToken, login, logout, updateUser }
})
