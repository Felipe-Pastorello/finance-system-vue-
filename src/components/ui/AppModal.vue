<script setup>
defineProps({ title: String, show: Boolean })
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="overlay" @click.self="$emit('close')">
        <div class="modal">
          <div class="modal-header">
            <span class="modal-title">{{ title }}</span>
            <button class="close-btn" @click="$emit('close')">✕</button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.65);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}
.modal {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 34px;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 26px;
}
.modal-title { font-family: var(--display); font-size: 1.45rem; }
.close-btn {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  transition: all .15s;
  font-family: var(--font);
}
.close-btn:hover { border-color: var(--accent); color: var(--accent); }

/* Transition */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-active .modal, .fade-leave-active .modal { transition: transform .2s ease, opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-from .modal, .fade-leave-to .modal { transform: translateY(16px) scale(.97); opacity: 0; }
</style>
