<template>
  <div class="form-container">
    <div class="form-card">
      <h3 class="form-title">Nouvel Intérêt</h3>
      <p class="form-subtitle">Enregistrement d'un nouvel intérêt sur la dette intérieure.</p>
      
      <form @submit.prevent="submitForm" class="modern-form">
        <div class="form-grid">
          <div class="form-group">
            <BaseInput 
              id="annee" 
              label="Année" 
              type="number" 
              v-model="formData.annee" 
              required 
            />
          </div>

          <div class="form-group">
            <BaseSelect 
              id="trimestre" 
              label="Trimestre" 
              v-model="formData.trimestre" 
              :options="trimestreOptions" 
              required 
            />
          </div>

          <div class="form-group">
            <BaseInput 
              id="tauxInteret" 
              label="Taux d'Intérêt (%)" 
              type="number" 
              step="0.01" 
              min="0" 
              placeholder="Ex: 3.50" 
              v-model="formData.tauxInteret" 
              required 
            />
          </div>

          <div class="form-group">
            <BaseInput 
              id="nbreJour" 
              label="Nombre de Jours" 
              type="number" 
              min="1" 
              max="366" 
              placeholder="Ex: 90" 
              v-model="formData.nbreJour" 
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

const trimestreOptions = [
  { value: '1', label: 'T1' },
  { value: '2', label: 'T2' },
  { value: '3', label: 'T3' },
  { value: '4', label: 'T4' }
];

const initialData = {
  annee: new Date().getFullYear(),
  trimestre: '',
  tauxInteret: '',
  nbreJour: ''
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
    await api.post('/dette-interieure/interets', {
      ...formData,
      annee: parseInt(formData.annee, 10),
      trimestre: parseInt(formData.trimestre, 10),
      nbreJour: parseInt(formData.nbreJour, 10),
      tauxInteret: parseFloat(formData.tauxInteret)
    });
    
    successMessage.value = 'L\'intérêt a été enregistré avec succès.';
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
