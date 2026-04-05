<script setup>
defineProps({
  pills: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="auth-wrapper">
    <!-- Lado esquerdo -->
    <div class="auth-left">
      <div class="brand">FinTrack</div>
      <p class="tagline">Controle financeiro pessoal de forma simples, clara e inteligente.</p>
      <div class="pills">
        <div class="pill" v-for="p in pills" :key="p.text">
          <!-- <span>{{ p.icon }}</span> --> 
          <span v-html="p.text" />
        </div>
      </div>
    </div>

    <!-- Lado direito -->
    <div class="auth-right">
      <div class="auth-card">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.auth-left {
  background: linear-gradient(135deg, #1a1f12 0%, #0f1a05 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}
.auth-left::before {
  content: '';
  position: absolute;
  width: 500px; height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200,240,77,.12) 0%, transparent 70%);
  top: -100px; left: -100px;
  pointer-events: none;
}

.brand   { font-family: var(--display); font-size: 2.6rem; color: var(--accent); margin-bottom: 12px; }
.tagline { font-size: 1.05rem; color: var(--muted); line-height: 1.7; max-width: 320px; margin-bottom: 52px; }

.pills { display: flex; flex-direction: column; gap: 12px; }
.pill  {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,.04);
  border: 1px solid var(--border);
  border-radius: 50px;
  padding: 11px 18px;
  width: fit-content;
  font-size: .88rem; color: var(--muted);
}

.auth-right {
  display: flex; align-items: center; justify-content: center;
  padding: 60px 40px;
  background: var(--bg2);
}
.auth-card { width: 100%; max-width: 420px; }
</style>
