<script setup>
defineProps({
  label:       { type: String, default: '' },
  modelValue:  { type: [String, Number], default: '' },
  type:        { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  options:     { type: Array, default: null }, // [{ value, label }] → select
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label v-if="label">{{ label }}</label>

    <select
      v-if="options"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style scoped>
.field { margin-bottom: 18px; }
label {
  display: block;
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 7px;
}
input, select {
  width: 100%;
  background: var(--bg3);
  border: 1.5px solid var(--border);
  color: var(--text);
  font-family: var(--font);
  font-size: .95rem;
  padding: 11px 15px;
  border-radius: 10px;
  outline: none;
  transition: border-color .2s;
}
input:focus, select:focus { border-color: var(--accent); }
input::placeholder { color: var(--muted); }
select option { background: var(--bg3); }
</style>
