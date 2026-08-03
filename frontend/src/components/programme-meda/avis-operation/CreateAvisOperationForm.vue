<template>
  <div class="form-container">
    <div v-if="successMessage" class="alert success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>

    <form @submit.prevent="submitForm" class="custom-form">
      <div class="form-row">
        <div class="form-group half">
          <label>ID Projet (Don ou FR) *</label>
          <input type="number" v-model="form.projetId" required class="custom-input" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label>Date de prise en charge (PEC) *</label>
          <input type="date" v-model="form.datePEC" required class="custom-input" />
        </div>
        <div class="form-group half">
          <label>Date d'échéance *</label>
          <input type="date" v-model="form.dateEcheance" required class="custom-input" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label>Numéro de Facture (ou Justificatif) *</label>
          <input type="number" v-model="form.numFacture" required class="custom-input" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label>Montant Disponible *</label>
          <input type="number" step="0.01" v-model="form.montantDispo" required class="custom-input" />
        </div>
        <div class="form-group half">
          <label>Part Financée (Justifiée) *</label>
          <input type="number" step="0.01" v-model="form.partFinancee" required class="custom-input" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Enregistrer la pièce justificative' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const emit = defineEmits(['created']);

const form = ref({
  projetId: '',
  datePEC: '',
  dateEcheance: '',
  numFacture: '',
  montantDispo: '',
  partFinancee: ''
});

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const submitForm = async () => {
  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await api.post('/programme-meda/avis-operations', form.value);
    
    successMessage.value = 'Pièce justificative (Avis d\'opération) enregistrée avec succès !';
    setTimeout(() => {
      emit('created');
    }, 1500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la création.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.custom-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-row {
  display: flex;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group.half {
  flex: 1;
}
label {
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
}
.custom-input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;
}
.custom-input:focus {
  border-color: #ea580c;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.btn-primary {
  background-color: #ea580c;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover:not(:disabled) {
  background-color: #c2410c;
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.alert {
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-weight: 500;
}
.alert.success {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.alert.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
</style>
