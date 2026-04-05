import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref([])

  const totalBalance = computed(() =>
    accounts.value.reduce((s, a) => s + Number(a.balance), 0)
  )

  /** Converte AccountResponse (API) → modelo interno do frontend */
  function normalize(a) {
    return {
      id:      a.id,
      name:    a.bankName,     // API usa bankName   → frontend usa name
      type:    a.accountType,  // API usa accountType → frontend usa type
      balance: Number(a.balance),
    }
  }

  // GET /accounts  ─────────────────────────────────────────────────────
  async function fetchAll() {
    const res = await api.getAccounts()
    accounts.value = res.content.map(normalize)
  }

  // POST /accounts  ─────────────────────────────────────────────────────
  // Swagger body: { bankName, accountType, balance }
  async function add(account) {
    const res = await api.createAccount({
      bankName:    account.name,
      accountType: account.type,
      balance:     Number(account.balance),
    })
    accounts.value.push(normalize(res))
  }

  // PUT /accounts/{id}  ─────────────────────────────────────────────────
  // Swagger body: { bankName, accountType, balance }
  async function update(id, data) {
    const res = await api.updateAccount(id, {
      bankName:    data.name,
      accountType: data.type,
      balance:     Number(data.balance),
    })
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx !== -1) accounts.value[idx] = normalize(res)
  }

  // DELETE /accounts/{id}  ──────────────────────────────────────────────
  // Retorna 204 sem body — api.js já lida com isso via res.text()
  async function remove(id) {
    await api.deleteAccount(id)
    accounts.value = accounts.value.filter(a => a.id !== id)
  }

  function getById(id) {
    return accounts.value.find(a => a.id === id)
  }

  return { accounts, totalBalance, fetchAll, add, update, remove, getById }
})
