<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import AppField  from '@/components/ui/AppField.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal  from '@/components/ui/AppModal.vue'

const auth      = useAuthStore()
const router    = useRouter()
const showToast = inject('showToast')

const profileForm = ref({ name: auth.user?.name ?? '', email: auth.user?.email ?? '' })
const pwForm      = ref({ current: '', newPass: '', confirm: '' })
const showConfirm = ref(false)

// ── Perfil ──────────────────────────────────────────────────────────
async function saveProfile() {
  if (!profileForm.value.name || !profileForm.value.email) {
    showToast('Preencha todos os campos.', 'error'); return
  }
  try {
    // PUT /users/me  →  { id, name, email }
    const res = await api.updateMe({
      name:  profileForm.value.name,
      email: profileForm.value.email,
    })
    auth.updateUser({ name: res.name, email: res.email })
    showToast('Perfil atualizado!')
  } catch (e) {
    showToast(e?.message || 'Erro ao atualizar perfil.', 'error')
  }
}

// ── Senha ────────────────────────────────────────────────────────────
async function savePassword() {
  if (!pwForm.value.current || !pwForm.value.newPass) {
    showToast('Preencha todos os campos.', 'error'); return
  }
  if (pwForm.value.newPass !== pwForm.value.confirm) {
    showToast('As senhas não coincidem.', 'error'); return
  }
  try {
    // PATCH /users/me  com o campo password
    await api.patchMe({ password: pwForm.value.newPass })
    pwForm.value = { current: '', newPass: '', confirm: '' }
    showToast('Senha atualizada com sucesso!')
  } catch (e) {
    showToast(e?.message || 'Erro ao atualizar senha.', 'error')
  }
}

// ── Logout ───────────────────────────────────────────────────────────
function logout() {
  auth.logout()
  router.push({ name: 'login' })
}

// ── Excluir conta ────────────────────────────────────────────────────
async function deleteAccount() {
  try {
    // DELETE /users/me  →  204 No Content
    await api.deleteMe()
    auth.logout()
    router.push({ name: 'login' })
  } catch (e) {
    showConfirm.value = false
    showToast(e?.message || 'Erro ao excluir conta.', 'error')
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="ph">
      <div>
        <h1 class="pt">Meu perfil</h1>
        <p class="ps">Gerencie suas informações pessoais</p>
      </div>
    </div>

    <div class="pg">
      <!-- Coluna esquerda -->
      <div class="left-col">
        <div class="pav">
          <div class="av-lg">{{ auth.user?.name?.[0] ?? 'U' }}</div>
          <div class="pname">{{ auth.user?.name }}</div>
          <div class="pemail">{{ auth.user?.email }}</div>
        </div>

        <div class="dz">
          <h4>⚠️ Zona de perigo</h4>
          <p>Esta ação é irreversível. Todos os dados serão removidos permanentemente.</p>
          <AppButton variant="danger" size="sm" @click="showConfirm = true">Excluir minha conta</AppButton>
        </div>

        <AppButton variant="ghost" :full="true" @click="logout">Sair da conta</AppButton>
      </div>

      <!-- Coluna direita -->
      <div class="right-col">
        <div class="panel">
          <div class="panel-title">Dados pessoais</div>
          <AppField label="Nome completo" v-model="profileForm.name" />
          <AppField label="E-mail" type="email" v-model="profileForm.email" />
          <div class="panel-footer">
            <AppButton variant="primary" size="sm" @click="saveProfile">Salvar alterações</AppButton>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">Alterar senha</div>
          <AppField label="Senha atual"          type="password" v-model="pwForm.current" placeholder="••••••••" />
          <AppField label="Nova senha"           type="password" v-model="pwForm.newPass" placeholder="••••••••" />
          <AppField label="Confirmar nova senha" type="password" v-model="pwForm.confirm" placeholder="••••••••" />
          <div class="panel-footer">
            <AppButton variant="primary" size="sm" @click="savePassword">Atualizar senha</AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmação de exclusão -->
    <AppModal :show="showConfirm" title="Excluir conta?" @close="showConfirm = false">
      <p class="confirm-text">
        Esta ação é permanente. Todos os seus dados, contas e transações serão removidos e não poderão ser recuperados.
      </p>
      <div class="confirm-footer">
        <AppButton variant="ghost"  @click="showConfirm = false">Cancelar</AppButton>
        <AppButton variant="danger" @click="deleteAccount">Sim, excluir tudo</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.ph { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
.pt { font-family:var(--display); font-size:2rem; }
.ps { color:var(--muted); font-size:.88rem; margin-top:4px; }

.pg { display:grid; grid-template-columns:290px 1fr; gap:26px; }

/* Coluna esquerda */
.left-col { display:flex; flex-direction:column; gap:15px; }

.pav {
  background:var(--card); border:1px solid var(--border);
  border-radius:var(--radius); padding:30px 22px;
  display:flex; flex-direction:column; align-items:center; gap:13px; text-align:center;
}
.av-lg {
  width:76px; height:76px; border-radius:50%;
  background:linear-gradient(135deg, var(--accent), #4ddb8a);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--display); font-size:1.9rem; color:#0f0f11;
}
.pname  { font-size:1.15rem; font-weight:600; }
.pemail { font-size:.82rem; color:var(--muted); }

.dz {
  background:rgba(255,92,92,.05); border:1px solid rgba(255,92,92,.2);
  border-radius:var(--radius); padding:18px 22px;
}
.dz h4 { color:var(--red); font-size:.88rem; margin-bottom:8px; }
.dz p  { color:var(--muted); font-size:.83rem; margin-bottom:13px; }

/* Coluna direita */
.right-col { display:flex; flex-direction:column; gap:22px; }

.panel { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; }
.panel-title { font-size:.97rem; font-weight:600; margin-bottom:18px; }
.panel-footer { display:flex; justify-content:flex-end; }

/* Modal de confirmação */
.confirm-text   { color:var(--muted); font-size:.9rem; margin-bottom:22px; line-height:1.6; }
.confirm-footer { display:flex; gap:11px; justify-content:center; }
</style>
