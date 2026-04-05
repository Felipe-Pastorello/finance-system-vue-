import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])

  const totalIncome = computed(() =>
    transactions.value
      .filter(t => t.type === 'ENTRADA')
      .reduce((s, t) => s + Number(t.amount), 0)
  )
  const totalExpense = computed(() =>
    transactions.value
      .filter(t => t.type === 'DESPESA')
      .reduce((s, t) => s + Number(t.amount), 0)
  )
  const recent = computed(() =>
    [...transactions.value]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  )

  function normalize(t) {
    return {
      id:              t.id,
      description:     t.description,
      amount:          Number(t.amount),
      type:            t.type,             // 'ENTRADA' | 'DESPESA'
      date:            t.date,
      category:        t.category ?? '',
      accountId:       t.accountId,
      accountBankName: t.accountBankName, 
    }
  }

  // GET /transactions  ──────────────────────────────────────────────────
  async function fetchAll() {
    const res = await api.getTransactions()
    transactions.value = res.content.map(normalize)
  }

  // POST /transactions  ─────────────────────────────────────────────────
  async function add(tx) {
    const res = await api.createTransaction({
      description: tx.description,
      amount:      Number(tx.amount),
      type:        tx.type,
      date:        tx.date,
      category:    tx.category || null,
      account:     { id: tx.accountId },   // obrigatório pela entidade
    })
    transactions.value.unshift(normalize(res))
  }

  // PUT /transactions/{id}  ─────────────────────────────────────────────
  async function update(id, data) {
    const res = await api.updateTransaction(id, {
      description: data.description,
      amount:      Number(data.amount),
      type:        data.type,
      date:        data.date,
      category:    data.category || null,
      account:     { id: data.accountId },
    })
    const idx = transactions.value.findIndex(t => t.id === id)
    if (idx !== -1) transactions.value[idx] = normalize(res)
  }

  // DELETE /transactions/{id}  ──────────────────────────────────────────
  async function remove(id) {
    await api.deleteTransaction(id)
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  return { transactions, totalIncome, totalExpense, recent, fetchAll, add, update, remove }
})