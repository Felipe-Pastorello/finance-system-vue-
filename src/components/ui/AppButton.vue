<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | ghost | danger
  size:    { type: String, default: 'md' },       // sm | md | lg
  full:    { type: Boolean, default: false },
  type:    { type: String, default: 'button' },
})
</script>

<template>
  <button
    :type="type"
    :class="['btn', `btn-${variant}`, `btn-${size}`, { 'btn-full': full }]"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 10px;
  font-family: var(--font);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.17s;
}
.btn-full { width: 100%; justify-content: center; }

/* Variants */
.btn-primary { background: var(--accent); color: #0f0f11; }
.btn-primary:hover { background: var(--accent2); transform: translateY(-1px); }
.btn-ghost  { background: transparent; border: 1.5px solid var(--border); color: var(--text); }
.btn-ghost:hover  { border-color: var(--accent); color: var(--accent); }
.btn-danger { background: rgba(255,92,92,.1); color: var(--red); border: 1.5px solid rgba(255,92,92,.25); }
.btn-danger:hover { background: rgba(255,92,92,.2); }

/* Sizes */
.btn-sm { padding: 7px 13px; font-size: .84rem; }
.btn-md { padding: 11px 20px; font-size: .93rem; }
.btn-lg { padding: 13px 24px; font-size: 1rem; }
</style>
