<template>
  <div v-if="message" :class="['alert', `alert-${variant}`]">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'success' // 'success' ou 'error'
  }
});
</script>

<style scoped>
.alert {
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 15px;
  font-weight: 500;
}

.alert-success {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
</style>
