<script setup>
import { onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountsStore }     from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const router = useRouter()
const accountsStore     = useAccountsStore()
const transactionsStore = useTransactionsStore()

const fmt = v => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
const accName = id => accountsStore.accounts.find(a => a.id === id)?.name ?? '—'

let pie = null
function initChart() {
  const ctx = document.getElementById('pieChart')
  if (!ctx) return
  if (pie) pie.destroy()
  pie = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Entradas', 'Despesas'],
      datasets: [{
        data: [transactionsStore.totalIncome, transactionsStore.totalExpense],
        backgroundColor: ['rgba(77,219,138,.8)', 'rgba(255,92,92,.8)'],
        borderColor:     ['#4ddb8a', '#ff5c5c'],
        borderWidth: 2,
      }]
    },
    options: { plugins: { legend: { display: false } }, cutout: '65%', responsive: true }
  })
}

onMounted(() => nextTick(initChart))
</script>

<template>
  <div>
    <!-- Header -->
    <div class="ph">
      <div>
        <h1 class="pt">Dashboard</h1>
        <p class="ps">Visão geral das suas finanças</p>
      </div>
      <button class="btn-link" @click="router.push({ name: 'transactions' })">Ver transações →</button>
    </div>

    <!-- Stat cards -->
    <div class="stat-grid">
      <div class="sc balance">
        <div class="sc-label">Saldo total</div>
        <div class="sc-value">R$ {{ fmt(accountsStore.totalBalance) }}</div>
        <div class="sc-sub">{{ accountsStore.accounts.length }} conta(s) ativas</div>
      </div>
      <div class="sc income">
        <div class="sc-label">Entradas</div>
        <div class="sc-value">R$ {{ fmt(transactionsStore.totalIncome) }}</div>
        <div class="sc-sub">{{ transactionsStore.transactions.filter(t => t.type === 'ENTRADA').length }} transações</div>
      </div>
      <div class="sc expense">
        <div class="sc-label">Despesas</div>
        <div class="sc-value">R$ {{ fmt(transactionsStore.totalExpense) }}</div>
        <div class="sc-sub">{{ transactionsStore.transactions.filter(t => t.type === 'DESPESA').length }} transações</div>
      </div>
    </div>

    <!-- Bottom grid -->
    <div class="grid-32">
      <!-- Últimas transações -->
      <div class="panel">
        <div class="panel-title">
          Últimas transações
          <button class="btn-link" @click="router.push({ name: 'transactions' })">Ver todas</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tipo</th><th>Descrição</th><th>Conta</th><th>Data</th><th class="tr">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactionsStore.recent" :key="tx.id">
              <td><span :class="tx.type === 'ENTRADA' ? 'badge bi' : 'badge be'">{{ tx.type === 'ENTRADA' ? '↑' : '↓' }} {{ tx.type }}</span></td>
              <td>{{ tx.description }}</td>
              <td class="mu">{{ accName(tx.accountId) }}</td>
              <td class="mu">{{ tx.date }}</td>
              <td class="tr" :class="tx.type === 'ENTRADA' ? 'ai' : 'ae'">
                {{ tx.type === 'ENTRADA' ? '+' : '-' }} R$ {{ fmt(tx.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Painéis laterais -->
      <div class="side-panels">
        <div class="panel">
          <div class="panel-title">Minhas contas</div>
          <div v-for="a in accountsStore.accounts" :key="a.id" class="acc-row">
            <div>
              <div class="acc-name">{{ a.name }}</div>
              <div class="acc-type">{{ a.type }}</div>
            </div>
            <div class="acc-bal">R$ {{ fmt(a.balance) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ph  { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
.pt  { font-family:var(--display); font-size:2rem; }
.ps  { color:var(--muted); font-size:.88rem; margin-top:4px; }
.btn-link { background:none; border:none; cursor:pointer; color:var(--accent); font-family:var(--font); font-size:.88rem; }

.stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:26px; }
.sc { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; position:relative; overflow:hidden; }
.sc::after { content:''; position:absolute; top:-20px; right:-20px; width:90px; height:90px; border-radius:50%; opacity:.08; }
.sc.income::after  { background:var(--green); }
.sc.expense::after { background:var(--red);   }
.sc.balance::after { background:var(--accent);}
.sc-label { font-size:.76rem; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); font-weight:600; margin-bottom:9px; }
.sc-value { font-family:var(--display); font-size:1.9rem; }
.sc.income .sc-value  { color:var(--green);  }
.sc.expense .sc-value { color:var(--red);    }
.sc.balance .sc-value { color:var(--accent); }
.sc-sub { font-size:.78rem; color:var(--muted); margin-top:7px; }

.grid-32 { display:grid; grid-template-columns:2fr 1fr; gap:22px; }
.side-panels { display:flex; flex-direction:column; gap:20px; }

.panel { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; }
.panel-title { font-size:.97rem; font-weight:600; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; }

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

.acc-row { display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px solid var(--border); }
.acc-row:last-child { border-bottom:none; }
.acc-name { font-weight:600; font-size:.9rem; }
.acc-type { font-size:.75rem; color:var(--muted); }
.acc-bal  { font-weight:600; color:var(--accent); font-size:.92rem; }

.legend { display:flex; gap:14px; margin-top:12px; flex-wrap:wrap; }
.legend-item { display:flex; align-items:center; gap:6px; font-size:.8rem; color:var(--muted); }
.dot { display:inline-block; width:10px; height:10px; border-radius:50%; }
.dot.green { background:var(--green); }
.dot.red   { background:var(--red);   }
</style>
