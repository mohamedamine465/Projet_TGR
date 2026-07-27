<template>
  <div class="form-container">
    <form @submit.prevent="submitForm" class="grid-form">
      <div class="form-section">
        <h4 class="section-title">Informations du prêt lié</h4>
        
        <div class="form-group">
          <label>Sélectionner un Prêt</label>
          <select v-model="formData.pretId" required @change="onPretChange">
            <option value="" disabled>-- Choisir un prêt --</option>
            <option v-for="pret in prets" :key="pret.numPret" :value="pret.numPret">
              N° {{ pret.numPret }} - {{ pret.objet }}
            </option>
          </select>
        </div>

        <div class="pret-details" v-if="selectedPret">
          <div class="detail-item"><strong>Maturité :</strong> {{ selectedPret.preteur?.maturite }}</div>
          <div class="detail-item"><strong>Catégorie :</strong> {{ selectedPret.preteurId }}</div>
        </div>
      </div>

      <div class="form-section">
        <h4 class="section-title">Avis de crédit</h4>
        
        <div class="form-row">
          <div class="form-group">
            <label>N° avis</label>
            <input type="text" value="Généré automatiquement" disabled class="disabled-input" />
          </div>
          
          <div class="form-group">
            <label>Date d'échéance</label>
            <input type="date" v-model="formData.dateEcheance" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Date PEC</label>
            <input type="date" v-model="formData.datePEC" required />
          </div>
          
          <div class="form-group">
            <label>Taux (%)</label>
            <input type="number" step="0.01" v-model="formData.taux" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group full-width">
            <label>Montant</label>
            <input type="number" step="0.01" v-model="formData.montant" required />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Ajouter' }}
        </button>
      </div>

      <div v-if="message" :class="['alert', isError ? 'alert-error' : 'alert-success']">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const prets = ref([]);
const selectedPret = ref(null);
const loading = ref(false);
const message = ref('');
const isError = ref(false);

const formData = ref({
  pretId: '',
  dateEcheance: '',
  datePEC: '',
  taux: '',
  montant: ''
});

const loadPrets = async () => {
  try {
    const response = await api.get('/dette-tresor/prets');
    prets.value = response.data.data;
  } catch (error) {
    console.error("Erreur lors du chargement des prêts", error);
  }
};

const onPretChange = () => {
  selectedPret.value = prets.value.find(p => p.numPret == formData.value.pretId) || null;
};

const submitForm = async () => {
  loading.value = true;
  message.value = '';
  isError.value = false;

  try {
    const payload = {
      pretId: formData.value.pretId,
      dateEcheance: formData.value.dateEcheance,
      datePEC: formData.value.datePEC,
      taux: Number(formData.value.taux),
      montant: Number(formData.value.montant)
    };

    await api.post('/dette-tresor/avis-credits', payload);
    message.value = "Avis de crédit ajouté avec succès !";
    
    // Reset form
    formData.value = { pretId: '', dateEcheance: '', datePEC: '', taux: '', montant: '' };
    selectedPret.value = null;
  } catch (error) {
    isError.value = true;
    message.value = error.response?.data?.message || "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPrets();
});
</script>

<style scoped>
.form-container {
  max-width: 800px;
  background: #fff;
}

.grid-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-section {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.section-title {
  margin-top: 0;
  margin-bottom: 15px;
  color: #334155;
  border-bottom: 2px solid #ea580c;
  padding-bottom: 5px;
  display: inline-block;
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

.form-group.full-width {
  flex: none;
  width: 100%;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

input, select {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  outline: none;
  border-color: #ea580c;
  box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.1);
}

.disabled-input {
  background-color: #e2e8f0;
  color: #64748b;
  cursor: not-allowed;
}

.pret-details {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  border: 1px dashed #cbd5e1;
}

.detail-item {
  font-size: 0.9rem;
  color: #475569;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-submit {
  background-color: #ea580c;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-weight: bold;
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
  padding: 12px;
  border-radius: 6px;
  font-weight: 500;
  text-align: center;
}

.alert-success {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
</style>
