<template>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      
      <div class="form-row">
        <div class="form-group">
          <label for="pretId">Numéro de Prêt *</label>
          <input type="number" id="pretId" v-model="formData.pretId" class="custom-input" placeholder="Ex: 1024" required />
        </div>
        <div class="form-group">
          <label for="type">Type d'avis de débit *</label>
          <select id="type" v-model="formData.type" class="custom-input" required>
            <option value="" disabled>Sélectionner un type</option>
            <option value="Frais bancaires">Frais bancaires</option>
            <option value="Commission de gestion">Commission de gestion</option>
            <option value="Intérêts de retard">Intérêts de retard</option>
            <option value="Amortissement">Amortissement</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="montantCapital">Montant Capital *</label>
          <input type="number" step="0.01" id="montantCapital" v-model="formData.montantCapital" class="custom-input" required />
        </div>
        <div class="form-group">
          <label for="montantInteret">Montant Intérêt *</label>
          <input type="number" step="0.01" id="montantInteret" v-model="formData.montantInteret" class="custom-input" required />
        </div>
        <div class="form-group">
          <label for="montantCommission">Montant Commission *</label>
          <input type="number" step="0.01" id="montantCommission" v-model="formData.montantCommission" class="custom-input" required />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="taux">Taux appliqué (%) *</label>
          <input type="number" step="0.01" id="taux" v-model="formData.taux" class="custom-input" required />
        </div>
        <div class="form-group">
          <label for="dateDepense">Date de la dépense *</label>
          <input type="date" id="dateDepense" v-model="formData.dateDepense" class="custom-input" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="datePEC">Date Prise en Charge (PEC) *</label>
          <input type="date" id="datePEC" v-model="formData.datePEC" class="custom-input" required />
        </div>
        <div class="form-group">
          <label for="dateEcheance">Date Échéance *</label>
          <input type="date" id="dateEcheance" v-model="formData.dateEcheance" class="custom-input" required />
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-reset" @click="resetForm">Effacer</button>
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          <span v-if="isSubmitting">Création...</span>
          <span v-else>Enregistrer l'Avis de Débit</span>
        </button>
      </div>
      
      <div v-if="successMsg" class="alert success">{{ successMsg }}</div>
      <div v-if="errorMsg" class="alert error">{{ errorMsg }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const emit = defineEmits(['created']);

const formData = ref({
  pretId: '',
  type: '',
  montantCapital: 0,
  montantInteret: 0,
  montantCommission: 0,
  taux: 0,
  dateDepense: '',
  datePEC: '',
  dateEcheance: ''
});

const isSubmitting = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const resetForm = () => {
  formData.value = {
    pretId: '',
    type: '',
    montantCapital: 0,
    montantInteret: 0,
    montantCommission: 0,
    taux: 0,
    dateDepense: '',
    datePEC: '',
    dateEcheance: ''
  };
  successMsg.value = '';
  errorMsg.value = '';
};

const submitForm = async () => {
  isSubmitting.value = true;
  successMsg.value = '';
  errorMsg.value = '';
  
  try {
    const payload = {
      pretId: Number(formData.value.pretId),
      type: formData.value.type,
      montantCapital: Number(formData.value.montantCapital),
      montantInteret: Number(formData.value.montantInteret),
      montantCommission: Number(formData.value.montantCommission),
      taux: Number(formData.value.taux),
      dateDepense: formData.value.dateDepense,
      datePEC: formData.value.datePEC,
      dateEcheance: formData.value.dateEcheance
    };

    const response = await api.post('/dette-tresor/avis-debits', payload);
    successMsg.value = "Avis de débit créé avec succès !";
    emit('created', response.data.data);
    
    setTimeout(() => {
      resetForm();
    }, 2000);
  } catch (error) {
    console.error("Erreur création avis de débit:", error);
    errorMsg.value = error.response?.data?.message || "Une erreur est survenue lors de la création.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-container {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
  margin-bottom: 8px;
}

.custom-input {
  padding: 10px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  background-color: #f8fafc;
}

.custom-input:focus {
  border-color: #ea580c; /* Orange focus */
  background-color: white;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn-reset {
  background: none;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #f1f5f9;
}

.btn-submit {
  background-color: #ea580c;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #c2410c;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  margin-top: 20px;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.95rem;
}

.success {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
</style>
