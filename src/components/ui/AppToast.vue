<script setup>
defineProps({
  show:    { type: Boolean, default: false },
  message: { type: String,  default: ''    },
  type:    { type: String,  default: 'success' }, // success | error
})
</script>

<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div v-if="show" :class="['toast', type]">
        <span>{{ type === 'success' ? '✅' : '❌' }}</span>
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 26px; right: 26px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 13px 18px;
  font-size: .88rem;
  z-index: 999;
  display: flex; align-items: center; gap: 9px;
  pointer-events: none;
}
.toast.success { border-color: var(--green); }
.toast.error   { border-color: var(--red);   }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all .25s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(10px); }
</style>
