<template>
  <div class="form-container">
    <div class="form-card">
      <h3 class="form-title">Nouvelle Adjudication</h3>
      <p class="form-subtitle">Veuillez renseigner les informations relatives à l'adjudication.</p>
      
      <form @submit.prevent="submitForm" class="modern-form">
        <div class="form-grid">
          <div class="form-group">
            <BaseInput 
              id="dateJouissance" 
              label="Date de jouissance" 
              type="date" 
              v-model="formData.dateJouissance" 
              required 
            />
          </div>

          <div class="form-group">
            <BaseSelect 
              id="maturite" 
              label="Maturité" 
              v-model="formData.maturite" 
              :options="maturiteOptions" 
              required 
            />
          </div>

          <div class="form-group">
            <BaseInput 
              id="taux" 
              label="Taux (%)" 
              type="number" 
              step="0.01" 
              min="0" 
              placeholder="Ex: 2.50" 
              v-model="formData.taux" 
              required 
            />
          </div>

          <div class="form-group">
            <BaseInput 
              id="montant" 
              label="Montant (MAD)" 
              type="number" 
              step="0.01" 
              min="0" 
              placeholder="Ex: 500000.00" 
              v-model="formData.montant" 
              required 
            />
          </div>
        </div>

        <div class="form-actions">
          <BaseButton type="button" variant="secondary" @click="resetForm">Réinitialiser</BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSubmitting">Enregistrer</BaseButton>
        </div>

        <BaseAlert v-if="successMessage" :message="successMessage" variant="success" />
        <BaseAlert v-if="errorMessage" :message="errorMessage" variant="error" />
      </form>
    </div>
  </div>
</template>

<script setup>
import BaseInput from '../common/BaseInput.vue';
import BaseSelect from '../common/BaseSelect.vue';
import BaseButton from '../common/BaseButton.vue';
import BaseAlert from '../common/BaseAlert.vue';
import api from '@/services/api';
import { ref, reactive } from 'vue';

const maturiteOptions = [
  { value: '13 semaines', label: '13 semaines' },
  { value: '26 semaines', label: '26 semaines' },
  { value: '52 semaines', label: '52 semaines' },
  { value: '2 ans', label: '2 ans' },
  { value: '5 ans', label: '5 ans' },
  { value: '10 ans', label: '10 ans' },
  { value: '15 ans', label: '15 ans' },
  { value: '20 ans', label: '20 ans' }
];

const initialData = {
  dateJouissance: '',
  maturite: '',
  taux: '',
  montant: ''
};

const formData = reactive({ ...initialData });
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const resetForm = () => {
  Object.assign(formData, initialData);
  successMessage.value = '';
  errorMessage.value = '';
};

const submitForm = async () => {
  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  
  try {
    const response = await api.post('/dette-interieure/adjudications', {
      ...formData,
      taux: parseFloat(formData.taux),
      montant: parseFloat(formData.montant)
    });
    
    successMessage.value = 'L\'adjudication a été enregistrée avec succès.';
    setTimeout(() => { resetForm(); }, 3000);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-container {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 30px;
  width: 100%;
  max-width: 800px;
  border: 1px solid #f1f5f9;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 5px;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 25px;
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
}
</style>
