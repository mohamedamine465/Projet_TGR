<template>
  <div class="form-container">
    <h3>Saisir un nouvel ordre de paiement</h3>
    <form @submit.prevent="submitForm">
      
      <div class="form-row">
        <div class="form-group">
          <label for="pretId">Numéro de Prêt *</label>
          <input type="number" id="pretId" v-model="formData.pretId" class="custom-input" placeholder="Ex: 1024" required />
        </div>
        <div class="form-group">
          <label for="numlettre">Numéro de Lettre *</label>
          <input type="number" id="numlettre" v-model="formData.numlettre" class="custom-input" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="montantCapital">Montant Capital (MAD) *</label>
          <input type="number" step="0.01" id="montantCapital" v-model="formData.montantCapital" class="custom-input" required />
        </div>
        <div class="form-group">
          <label for="montantInteret">Montant Intérêt (MAD) *</label>
          <input type="number" step="0.01" id="montantInteret" v-model="formData.montantInteret" class="custom-input" required />
        </div>
        <div class="form-group">
          <label for="montantCommission">Montant Commission (MAD) *</label>
          <input type="number" step="0.01" id="montantCommission" v-model="formData.montantCommission" class="custom-input" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="dateEcheance">Date d'échéance *</label>
          <input type="date" id="dateEcheance" v-model="formData.dateEcheance" class="custom-input" required />
        </div>
        <div class="form-group">
          <label for="datePEC">Date de prise en charge (PEC) *</label>
          <input type="date" id="datePEC" v-model="formData.datePEC" class="custom-input" required />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const emit = defineEmits(['created']);

const isSubmitting = ref(false);
const formData = ref({
  pretId: '',
  numlettre: '',
  montantCapital: 0,
  montantInteret: 0,
  montantCommission: 0,
  dateEcheance: '',
  datePEC: ''
});

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      pretId: formData.value.pretId ? Number(formData.value.pretId) : null,
      numlettre: Number(formData.value.numlettre),
      montantCapital: Number(formData.value.montantCapital),
      montantInteret: Number(formData.value.montantInteret),
      montantCommission: Number(formData.value.montantCommission),
      dateEcheance: formData.value.dateEcheance,
      datePEC: formData.value.datePEC
    };

    await api.post('/dette-tresor/ordres-paiement', payload);
    
    // Réinitialiser le formulaire
    formData.value = {
      pretId: '', numlettre: '', montantCapital: 0, montantInteret: 0, montantCommission: 0, dateEcheance: '', datePEC: ''
    };
    
    emit('created');
  } catch (error) {
    console.error('Erreur lors de la création de l\'ordre de paiement', error);
    alert('Erreur lors de la création. Veuillez vérifier les champs.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-container {
  background: white;
}

h3 {
  color: #1e293b;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 6px;
  font-weight: 500;
}

.custom-input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.custom-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

.btn-submit {
  background-color: #0284c7;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #0369a1;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
