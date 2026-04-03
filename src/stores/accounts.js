import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAccountsStore = defineStore('accounts', () => {
  // Mock data – substitua pelas chamadas reais à API
  const accounts = ref([
    { id: 1, name: 'Nubank',            type: 'CORRENTE',    balance: 3200.00 },
    { id: 2, name: 'Poupança Bradesco',  type: 'POUPANÇA',    balance: 8750.50 },
    { id: 3, name: 'Carteira',           type: 'CARTEIRA',    balance: 320.00  },
  ])

  const totalBalance = computed(() => accounts.value.reduce((s, a) => s + a.balance, 0))

  function add(account) {
    const id = Math.max(0, ...accounts.value.map(a => a.id)) + 1
    accounts.value.push({ id, ...account })
  }

  function update(id, data) {
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx !== -1) accounts.value[idx] = { ...accounts.value[idx], ...data }
  }

  function remove(id) {
    accounts.value = accounts.value.filter(a => a.id !== id)
  }

  function getById(id) {
    return accounts.value.find(a => a.id === id)
  }

  return { accounts, totalBalance, add, update, remove, getById }
})
