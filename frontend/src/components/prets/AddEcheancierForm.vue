<template>
  <div class="echeancier-container">
    <div v-if="loadingPrets" class="loading-state">
      Chargement des contrats de prêts...
    </div>

    <div v-else class="form-container">
      <h3>1. Sélection du Prêt et création de l'échéancier</h3>
      <form @submit.prevent="createEcheancier" class="echeancier-form">
        <div class="form-row">
          <BaseSelect
            id="pretId"
            label="Contrat de prêt"
            v-model="formData.pretId"
            :options="pretOptions"
            required
            class="flex-2"
          />
          <BaseInput
            id="tranche"
            label="Numéro de Tranche"
            type="number"
            v-model="formData.tranche"
            required
            class="flex-1"
          />
        </div>

        <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
        
        <div class="form-actions">
          <BaseButton type="submit" variant="primary" :loading="isSubmitting" :disabled="currentEcheancier !== null">
            Créer l'échéancier
          </BaseButton>
        </div>
      </form>

      <div v-if="successMessage" class="success-msg mt-3">{{ successMessage }}</div>

      <!-- Section d'ajout des échéances (Lignes) qui apparaît après la création -->
      <div v-if="currentEcheancier" class="echeances-section mt-5">
        <hr />
        <h3>2. Ajouter des échéances pour la tranche {{ currentEcheancier.tranche }}</h3>
        
        <form @submit.prevent="addEcheanceLigne" class="echeancier-form ligne-form">
          <div class="form-row">
            <BaseInput id="dateEcheance" label="Date" type="date" v-model="ligneData.dateEcheance" required class="flex-1" />
            <BaseInput id="capital" label="Capital" type="number" v-model="ligneData.montantCapital" required class="flex-1" />
            <BaseInput id="interet" label="Intérêts" type="number" v-model="ligneData.montantInteret" required class="flex-1" />
            <BaseInput id="commission" label="Commissions" type="number" v-model="ligneData.montantCommission" required class="flex-1" />
            
            <div class="action-btn-container">
              <BaseButton type="submit" variant="secondary" :loading="isAddingLigne">
                + Ajouter
              </BaseButton>
            </div>
          </div>
        </form>

        <div class="table-container mt-4">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Capital</th>
                <th>Intérêts</th>
                <th>Commissions</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ligne, index) in echeancesLignes" :key="index">
                <td>{{ formatDate(ligne.dateEcheance) }}</td>
                <td class="amount-cell">{{ formatMontant(ligne.montantCapital) }}</td>
                <td class="amount-cell">{{ formatMontant(ligne.montantInteret) }}</td>
                <td class="amount-cell">{{ formatMontant(ligne.montantCommission) }}</td>
                <td class="amount-cell font-bold">{{ formatMontant(Number(ligne.montantCapital) + Number(ligne.montantInteret) + Number(ligne.montantCommission)) }}</td>
                <td><span class="badge status-badge">{{ ligne.statut }}</span></td>
              </tr>
              <tr v-if="echeancesLignes.length === 0">
                <td colspan="6" class="text-center">Aucune échéance ajoutée.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="form-actions mt-4">
           <BaseButton type="button" variant="primary" @click="terminerSaisie">
             Terminer la saisie
           </BaseButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';
import BaseInput from '../common/BaseInput.vue';
import BaseSelect from '../common/BaseSelect.vue';
import BaseButton from '../common/BaseButton.vue';

const prets = ref([]);
const loadingPrets = ref(true);

const formData = ref({
  pretId: '',
  tranche: 1
});

const ligneData = ref({
  dateEcheance: '',
  montantCapital: 0,
  montantInteret: 0,
  montantCommission: 0,
  statut: 'Non Réglée'
});

const isSubmitting = ref(false);
const isAddingLigne = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const currentEcheancier = ref(null);
const echeancesLignes = ref([]);

const pretOptions = computed(() => {
  return prets.value.map(p => ({
    value: p.numPret,
    label: `Prêt N° ${p.numPret} - ${p.preteur?.designation || 'Inconnu'} (${formatMontant(p.soldeCourant)} DH)`
  }));
});

const loadPrets = async () => {
  try {
    const res = await api.get('/dette/prets');
    prets.value = res.data.data;
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des prêts.";
  } finally {
    loadingPrets.value = false;
  }
};

onMounted(() => {
  loadPrets();
});

const createEcheancier = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await api.post('/dette/prets/echeanciers', formData.value);
    currentEcheancier.value = response.data.data;
    successMessage.value = "En-tête de l'échéancier créé. Vous pouvez maintenant ajouter les échéances.";
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erreur lors de la création de l'échéancier.";
  } finally {
    isSubmitting.value = false;
  }
};

const addEcheanceLigne = async () => {
  if (!currentEcheancier.value) return;
  
  isAddingLigne.value = true;
  try {
    const response = await api.post(`/dette/prets/echeanciers/${currentEcheancier.value.codeEcheancier}/lignes`, ligneData.value);
    
    echeancesLignes.value.push(response.data.data);
    
    ligneData.value = {
      dateEcheance: '',
      montantCapital: 0,
      montantInteret: 0,
      montantCommission: 0,
      statut: 'Non Réglée'
    };
  } catch (error) {
    console.error(error);
  } finally {
    isAddingLigne.value = false;
  }
};

const terminerSaisie = () => {
  currentEcheancier.value = null;
  echeancesLignes.value = [];
  formData.value = { pretId: '', tranche: 1 };
  successMessage.value = "Saisie terminée avec succès !";
  setTimeout(() => successMessage.value = '', 3000);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const formatMontant = (montant) => {
  return Number(montant).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
</script>

<style scoped>
.echeancier-container {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.form-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1e293b;
  font-size: 1.1rem;
}

.echeancier-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.action-btn-container {
  margin-top: 15px; /* align with inputs that have labels */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.mt-3 { margin-top: 15px; }
.mt-4 { margin-top: 20px; }
.mt-5 { margin-top: 30px; }

hr {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 30px 0;
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

.table-container {
  overflow-x: auto;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.amount-cell {
  font-family: monospace;
  text-align: right !important;
}

.data-table th:nth-child(2),
.data-table th:nth-child(3),
.data-table th:nth-child(4),
.data-table th:nth-child(5) {
  text-align: right;
}

.font-bold {
  font-weight: 700;
  color: #0f172a;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  background-color: #fef3c7;
  color: #b45309;
}

.text-center {
  text-align: center;
  color: #64748b;
  padding: 20px !important;
}
</style>
