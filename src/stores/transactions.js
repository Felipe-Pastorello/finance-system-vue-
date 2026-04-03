import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionsStore = defineStore('transactions', () => {
  // Mock data – substitua pelas chamadas reais à API
  const transactions = ref([
    { id: 1, type: 'ENTRADA', description: 'Salário',    amount: 5000, accountId: 1, date: '2025-04-01' },
    { id: 2, type: 'DESPESA', description: 'Aluguel',    amount: 1500, accountId: 1, date: '2025-04-02' },
    { id: 3, type: 'DESPESA', description: 'Mercado',    amount: 380,  accountId: 3, date: '2025-04-05' },
    { id: 4, type: 'ENTRADA', description: 'Freelance',  amount: 1200, accountId: 1, date: '2025-04-10' },
    { id: 5, type: 'DESPESA', description: 'Academia',   amount: 99,   accountId: 1, date: '2025-04-12' },
    { id: 6, type: 'DESPESA', description: 'Streaming',  amount: 55,   accountId: 1, date: '2025-04-14' },
    { id: 7, type: 'ENTRADA', description: 'Dividendos', amount: 320,  accountId: 2, date: '2025-04-15' },
  ])

  const totalIncome  = computed(() => transactions.value.filter(t => t.type === 'ENTRADA').reduce((s, t) => s + t.amount, 0))
  const totalExpense = computed(() => transactions.value.filter(t => t.type === 'DESPESA').reduce((s, t) => s + t.amount, 0))
  const recent       = computed(() => [...transactions.value].sort((a, b) => b.id - a.id).slice(0, 5))

  function add(tx) {
    const id = Math.max(0, ...transactions.value.map(t => t.id)) + 1
    transactions.value.push({ id, ...tx })
  }

  function update(id, data) {
    const idx = transactions.value.findIndex(t => t.id === id)
    if (idx !== -1) transactions.value[idx] = { ...transactions.value[idx], ...data }
  }

  function remove(id) {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  return { transactions, totalIncome, totalExpense, recent, add, update, remove }
})
