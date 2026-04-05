<script setup>
import { ref, inject, onMounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import AppModal  from '@/components/ui/AppModal.vue'
import AppField  from '@/components/ui/AppField.vue'
import AppButton from '@/components/ui/AppButton.vue'

const store     = useAccountsStore()
const showToast = inject('showToast')

const showModal   = ref(false)
const editingItem = ref(null)
const loading     = ref(false)
const form = ref({ name: '', type: 'CORRENTE', balance: 0 })

const typeOptions = [
  { value: 'CORRENTE',     label: 'Conta Corrente' },
  { value: 'POUPANÇA',     label: 'Poupança'        },
  { value: 'INVESTIMENTO', label: 'Investimento'    },
  { value: 'CARTEIRA',     label: 'Carteira'        },
]

const fmt = v => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })

// Carrega contas reais da API ao montar a view
onMounted(async () => {
  try {
    await store.fetchAll()
  } catch (e) {
    showToast('Erro ao carregar contas.', 'error')
  }
})

function openModal(account = null) {
  editingItem.value = account
  form.value = account
    ? { name: account.name, type: account.type, balance: account.balance }
    : { name: '', type: 'CORRENTE', balance: 0 }
  showModal.value = true
}

async function save() {
  if (!form.value.name) { showToast('Informe o nome da conta.', 'error'); return }
  loading.value = true
  try {
    if (editingItem.value) {
      // PUT /accounts/{id}
      await store.update(editingItem.value.id, form.value)
      showToast('Conta atualizada!')
    } else {
      // POST /accounts
      await store.add(form.value)
      showToast('Conta criada!')
    }
    showModal.value = false
  } catch (e) {
    showToast(e?.message || 'Erro ao salvar conta.', 'error')
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  try {
    // DELETE /accounts/{id}
    await store.remove(id)
    showToast('Conta removida.')
  } catch (e) {
    showToast(e?.message || 'Erro ao remover conta.', 'error')
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="ph">
      <div>
        <h1 class="pt">Contas</h1>
        <p class="ps">Gerencie suas contas e carteiras</p>
      </div>
      <AppButton variant="primary" size="sm" @click="openModal()">+ Nova conta</AppButton>
    </div>

    <!-- Grid de contas -->
    <div class="acc-grid">
      <div class="acc-card" v-for="a in store.accounts" :key="a.id">
        <div class="acc-actions">
          <AppButton variant="ghost" size="sm" @click="openModal(a)">✏️</AppButton>
          <AppButton variant="danger" size="sm" @click="remove(a.id)">🗑️</AppButton>
        </div>
        <div class="acc-type">{{ a.type }}</div>
        <div class="acc-name">{{ a.name }}</div>
        <div class="acc-bal">R$ {{ fmt(a.balance) }}</div>
      </div>

      <div class="acc-card add" @click="openModal()">
        <span class="add-icon">+</span>
        <span>Adicionar conta</span>
      </div>
    </div>

    <!-- Modal -->
    <AppModal
      :show="showModal"
      :title="editingItem ? 'Editar conta' : 'Nova conta'"
      @close="showModal = false"
    >
      <AppField label="Nome da conta" v-model="form.name" placeholder="Ex: Nubank, Carteira..." />
      <AppField label="Tipo" v-model="form.type" :options="typeOptions" />
      <AppField label="Saldo inicial (R$)" type="number" v-model="form.balance" placeholder="0,00" />

      <div class="modal-footer">
        <AppButton variant="ghost" @click="showModal = false">Cancelar</AppButton>
        <AppButton variant="primary" :disabled="loading" @click="save">
          {{ loading ? 'Salvando...' : (editingItem ? 'Salvar' : 'Criar conta') }}
        </AppButton>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.ph { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
.pt { font-family:var(--display); font-size:2rem; }
.ps { color:var(--muted); font-size:.88rem; margin-top:4px; }

.acc-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(270px, 1fr)); gap:18px; }

.acc-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:var(--radius); padding:22px;
  cursor:pointer; transition:all .17s;
  position:relative; overflow:hidden;
}
.acc-card:hover { border-color:var(--accent); transform:translateY(-2px); }

.acc-card.add {
  border:1.5px dashed var(--border);
  display:flex; align-items:center; justify-content:center;
  flex-direction:column; gap:9px;
  color:var(--muted); font-size:.88rem; min-height:150px;
}
.acc-card.add:hover { border-color:var(--accent); color:var(--accent); }
.add-icon { font-size:2rem; }

.acc-actions {
  position:absolute; top:14px; right:14px;
  display:flex; gap:5px;
  opacity:0; transition:opacity .14s;
}
.acc-card:hover .acc-actions { opacity:1; }

.acc-type { font-size:.75rem; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); margin-bottom:10px; }
.acc-name { font-size:1.05rem; font-weight:600; margin-bottom:14px; }
.acc-bal  { font-family:var(--display); font-size:1.7rem; color:var(--accent); }

.modal-footer { display:flex; gap:11px; justify-content:flex-end; margin-top:8px; }
</style>
