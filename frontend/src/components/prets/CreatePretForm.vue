<template>
  <div class="form-container">
    <form @submit.prevent="submitForm" class="pret-form">
      
      <div class="form-row">
        <BaseInput
          id="numPret"
          label="Numéro de prêt"
          type="number"
          v-model="formData.numPret"
          required
          class="flex-1"
        />
        <BaseInput
          id="numEmprunt"
          label="Numéro d'emprunt (Référence)"
          v-model="formData.numEmprunt"
          required
          class="flex-1"
        />
      </div>

      <div class="form-row">
        <BaseSelect
          id="preteurId"
          label="Bailleur de fonds (Prêteur)"
          v-model="formData.preteurId"
          :options="preteurOptions"
          required
          class="flex-1"
        />
        <BaseInput
          id="dateCreation"
          label="Date de création"
          type="date"
          v-model="formData.dateCreation"
          required
          class="flex-1"
        />
      </div>

      <div class="form-row">
        <BaseInput
          id="soldeCourant"
          label="Montant (Solde)"
          type="number"
          v-model="formData.soldeCourant"
          required
          class="flex-1"
        />
        <BaseInput
          id="objet"
          label="Objet du prêt"
          v-model="formData.objet"
          required
          class="flex-1"
        />
      </div>

      <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-msg">{{ successMessage }}</div>

      <div class="form-actions">
        <BaseButton type="submit" variant="primary" :loading="isSubmitting">
          Créer le contrat de prêt
        </BaseButton>
      </div>
      
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BaseInput from '../common/BaseInput.vue';
import BaseSelect from '../common/BaseSelect.vue';
import BaseButton from '../common/BaseButton.vue';
import api from '../../services/api';

const formData = ref({
  numPret: '',
  numEmprunt: '',
  preteurId: '',
  dateCreation: '',
  soldeCourant: '',
  objet: ''
});

const preteurs = ref([]);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const preteurOptions = computed(() => {
  return preteurs.value.map(p => ({
    value: p.codeCategorie,
    label: `${p.designation} (${p.codeCategorie})`
  }));
});

const loadPreteurs = async () => {
  try {
    const res = await api.get('/dette/prets/preteurs');
    preteurs.value = res.data.data;
  } catch (error) {
    console.error("Erreur chargement des prêteurs", error);
  }
};

onMounted(() => {
  loadPreteurs();
});

const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const payload = {
      ...formData.value,
      numPret: String(formData.value.numPret),
      soldeCourant: String(formData.value.soldeCourant),
      preteurId: Number(formData.value.preteurId)
    };
    
    await api.post('/dette/prets', payload);
    successMessage.value = 'Le prêt a été créé avec succès !';
    
    // Réinitialiser le formulaire
    formData.value = {
      numPret: '',
      numEmprunt: '',
      preteurId: '',
      dateCreation: '',
      soldeCourant: '',
      objet: ''
    };
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Une erreur est survenue lors de la création.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-container {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.pret-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.flex-1 {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.error-msg {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.success-msg {
  color: #16a34a;
  background-color: #f0fdf4;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
}
</style>
