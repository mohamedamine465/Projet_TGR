<template>
  <button
    :type="type"
    :class="['btn', `btn-${variant}`, { 'btn-block': block }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <span :class="{ 'invisible': loading }">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary' // 'primary', 'secondary', 'danger', 'success'
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  position: relative;
}

.btn-block {
  width: 100%;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #ea580c;
  color: #ffffff;
}
.btn-primary:hover:not(:disabled) {
  background-color: #c2410c;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #475569;
}
.btn-secondary:hover:not(:disabled) {
  background-color: #cbd5e1;
}

.btn-danger {
  background-color: #ef4444;
  color: #ffffff;
}
.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.spinner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

.invisible {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
