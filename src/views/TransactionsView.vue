<script setup>
import { ref, computed, inject } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useAccountsStore }     from '@/stores/accounts'
import AppModal  from '@/components/ui/AppModal.vue'
import AppField  from '@/components/ui/AppField.vue'
import AppButton from '@/components/ui/AppButton.vue'

const txStore   = useTransactionsStore()
const accStore  = useAccountsStore()
const showToast = inject('showToast')

// Filtros
const search     = ref('')
const typeFilter = ref('')
const accFilter  = ref('')

const filteredTx = computed(() => {
  return txStore.transactions
    .filter(t => {
      const ms = !search.value     || t.description.toLowerCase().includes(search.value.toLowerCase())
      const mt = !typeFilter.value || t.type === typeFilter.value
      const ma = !accFilter.value  || t.accountId == accFilter.value
      return ms && mt && ma
    })
    .sort((a, b) => b.id - a.id)
})

// Modal
const showModal   = ref(false)
const editingItem = ref(null)
const form = ref({ type: 'DESPESA', description: '', amount: 0, accountId: null, date: '' })

const typeOptions = [
  { value: 'ENTRADA', label: '↑ Entrada' },
  { value: 'DESPESA', label: '↓ Despesa' },
]
const accountOptions = computed(() =>
  accStore.accounts.map(a => ({ value: a.id, label: a.name }))
)

function openModal(tx = null) {
  editingItem.value = tx
  const today = new Date().toISOString().slice(0, 10)
  form.value = tx
    ? { ...tx }
    : { type: 'DESPESA', description: '', amount: 0, accountId: accStore.accounts[0]?.id, date: today }
  showModal.value = true
}

function save() {
  if (!form.value.description || !form.value.amount) {
    showToast('Preencha todos os campos.', 'error'); return
  }
  if (editingItem.value) {
    txStore.update(editingItem.value.id, form.value)
    showToast('Transação atualizada!')
  } else {
    txStore.add({ ...form.value, amount: Number(form.value.amount) })
    showToast('Transação registrada!')
  }
  showModal.value = false
}

function remove(id) {
  txStore.remove(id)
  showToast('Transação removida.')
}

const fmt     = v => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
const accName = id => accStore.accounts.find(a => a.id === id)?.name ?? '—'
</script>

<template>
  <div>
    <!-- Header -->
    <div class="ph">
      <div>
        <h1 class="pt">Transações</h1>
        <p class="ps">Histórico de entradas e despesas</p>
      </div>
      <AppButton variant="primary" size="sm" @click="openModal()">+ Nova transação</AppButton>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <input class="fi" placeholder="Buscar descrição..." v-model="search" />
      <select class="fi" v-model="typeFilter">
        <option value="">Todos os tipos</option>
        <option value="ENTRADA">↑ Entrada</option>
        <option value="DESPESA">↓ Despesa</option>
      </select>
      <select class="fi" v-model="accFilter">
        <option value="">Todas as contas</option>
        <option v-for="a in accStore.accounts" :key="a.id" :value="a.id">{{ a.name }}</option>
      </select>
    </div>

    <!-- Tabela -->
    <div class="panel">
      <table>
        <thead>
          <tr>
            <th>Tipo</th><th>Descrição</th><th>Conta</th><th>Data</th><th class="tr">Valor</th><th class="tr">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredTx.length === 0">
            <td colspan="6">
              <div class="empty">
                <div class="ei">📭</div>
                <p>Nenhuma transação encontrada</p>
              </div>
            </td>
          </tr>
          <tr v-for="tx in filteredTx" :key="tx.id">
            <td>
              <span :class="tx.type === 'ENTRADA' ? 'badge bi' : 'badge be'">
                {{ tx.type === 'ENTRADA' ? '↑ ENTRADA' : '↓ DESPESA' }}
              </span>
            </td>
            <td>{{ tx.description }}</td>
            <td class="mu">{{ accName(tx.accountId) }}</td>
            <td class="mu">{{ tx.date }}</td>
            <td class="tr" :class="tx.type === 'ENTRADA' ? 'ai' : 'ae'">
              {{ tx.type === 'ENTRADA' ? '+' : '-' }} R$ {{ fmt(tx.amount) }}
            </td>
            <td class="tr">
              <div class="row-actions">
                <AppButton variant="ghost"  size="sm" @click="openModal(tx)">✏️</AppButton>
                <AppButton variant="danger" size="sm" @click="remove(tx.id)">🗑️</AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <AppModal
      :show="showModal"
      :title="editingItem ? 'Editar transação' : 'Nova transação'"
      @close="showModal = false"
    >
      <AppField label="Tipo"        v-model="form.type"        :options="typeOptions"    />
      <AppField label="Descrição"   v-model="form.description" placeholder="Ex: Salário" />
      <AppField label="Valor (R$)"  v-model="form.amount" type="number" placeholder="0,00" />
      <AppField label="Conta"       v-model="form.accountId"   :options="accountOptions" />
      <AppField label="Data"        v-model="form.date"   type="date" />

      <div class="modal-footer">
        <AppButton variant="ghost"   @click="showModal = false">Cancelar</AppButton>
        <AppButton variant="primary" @click="save">{{ editingItem ? 'Salvar' : 'Registrar' }}</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.ph { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
.pt { font-family:var(--display); font-size:2rem; }
.ps { color:var(--muted); font-size:.88rem; margin-top:4px; }

.filters { display:flex; gap:11px; margin-bottom:20px; flex-wrap:wrap; }
.fi {
  background:var(--bg3); border:1.5px solid var(--border);
  color:var(--text); font-family:var(--font);
  padding:9px 13px; border-radius:9px; font-size:.88rem; outline:none;
  transition:border-color .14s; flex:1; min-width:160px;
}
.fi:focus { border-color:var(--accent); }
.fi::placeholder { color:var(--muted); }
.fi option { background:var(--bg3); }

.panel { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; }
table { width:100%; border-collapse:collapse; }
th { font-size:.76rem; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); font-weight:600; text-align:left; padding:9px 13px; border-bottom:1px solid var(--border); }
td { padding:13px; border-bottom:1px solid rgba(255,255,255,.04); font-size:.9rem; vertical-align:middle; }
tr:last-child td { border-bottom:none; }
tr:hover td { background:rgba(255,255,255,.02); }
.tr { text-align:right; }
.mu { color:var(--muted); }

.badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:50px; font-size:.76rem; font-weight:600; }
.bi { background:rgba(77,219,138,.12); color:var(--green); }
.be { background:rgba(255,92,92,.12);  color:var(--red);   }
.ai { color:var(--green); font-weight:600; }
.ae { color:var(--red);   font-weight:600; }

.row-actions { display:flex; gap:6px; justify-content:flex-end; }

.empty { text-align:center; padding:50px 20px; color:var(--muted); }
.ei    { font-size:2.8rem; margin-bottom:12px; opacity:.35; }

.modal-footer { display:flex; gap:11px; justify-content:flex-end; margin-top:8px; }
</style>
