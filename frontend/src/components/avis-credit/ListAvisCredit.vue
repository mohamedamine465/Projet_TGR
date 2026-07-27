<template>
  <div class="list-container">
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>N° Avis</th>
            <th>N° Prêt</th>
            <th>Maturité</th>
            <th>Catégorie</th>
            <th>Taux</th>
            <th>Montant</th>
            <th>Date Échéance</th>
            <th>Date PEC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="9" class="text-center">Chargement des données...</td>
          </tr>
          <tr v-else-if="avisCredits.length === 0">
            <td colspan="9" class="text-center">Aucun avis de crédit trouvé.</td>
          </tr>
          <tr v-else v-for="avis in avisCredits" :key="avis.codeRecette">
            <td>{{ avis.codeRecette }}</td>
            <td>{{ avis.pretId }}</td>
            <td>{{ avis.pret?.preteur?.maturite || '-' }}</td>
            <td>{{ avis.pret?.preteurId || '-' }}</td>
            <td>{{ avis.avisCredit?.taux }} %</td>
            <td class="amount">{{ formatCurrency(avis.avisCredit?.montant) }}</td>
            <td>{{ formatDate(avis.dateEcheance) }}</td>
            <td>{{ formatDate(avis.datePEC) }}</td>
            <td class="actions">
              <button class="btn-icon edit" @click="openEditModal(avis)" title="Modifier">
                ✏️
              </button>
              <button class="btn-icon delete" @click="deleteAvis(avis.codeRecette)" title="Supprimer">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Modification -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Modifier l'avis de crédit N° {{ editFormData.codeRecette }}</h3>
        <form @submit.prevent="submitEdit">
          <div class="form-group">
            <label>N° Prêt</label>
            <input type="number" v-model="editFormData.pretId" class="custom-input" required />
          </div>
          <div class="form-group">
            <label>Taux (%)</label>
            <input type="number" step="0.01" v-model="editFormData.taux" class="custom-input" required />
          </div>
          <div class="form-group">
            <label>Montant (MAD)</label>
            <input type="number" step="0.01" v-model="editFormData.montant" class="custom-input" required />
          </div>
          <div class="form-group">
            <label>Date Échéance</label>
            <input type="date" v-model="editFormData.dateEcheance" class="custom-input" required />
          </div>
          <div class="form-group">
            <label>Date PEC</label>
            <input type="date" v-model="editFormData.datePEC" class="custom-input" required />
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="showEditModal = false">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmittingEdit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const avisCredits = ref([]);
const loading = ref(true);

const loadAvisCredits = async () => {
  loading.value = true;
  try {
    const response = await api.get('/dette-tresor/avis-credits');
    avisCredits.value = response.data.data;
  } catch (error) {
    console.error("Erreur lors du chargement des avis de crédits", error);
  } finally {
    loading.value = false;
  }
};

const deleteAvis = async (codeRecette) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet avis de crédit ?")) {
    try {
      await api.delete(`/dette-tresor/avis-credits/${codeRecette}`);
      loadAvisCredits();
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      alert("Erreur lors de la suppression");
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
};

const showEditModal = ref(false);
const isSubmittingEdit = ref(false);
const editFormData = ref({});

const openEditModal = (avis) => {
  editFormData.value = {
    codeRecette: avis.codeRecette,
    pretId: avis.pretId,
    taux: avis.avisCredit?.taux,
    montant: avis.avisCredit?.montant,
    dateEcheance: avis.dateEcheance ? new Date(avis.dateEcheance).toISOString().split('T')[0] : '',
    datePEC: avis.datePEC ? new Date(avis.datePEC).toISOString().split('T')[0] : ''
  };
  showEditModal.value = true;
};

const submitEdit = async () => {
  isSubmittingEdit.value = true;
  try {
    const payload = {
      pretId: Number(editFormData.value.pretId),
      taux: Number(editFormData.value.taux),
      montant: Number(editFormData.value.montant),
      dateEcheance: editFormData.value.dateEcheance,
      datePEC: editFormData.value.datePEC
    };
    
    await api.put(`/dette-tresor/avis-credits/${editFormData.value.codeRecette}`, payload);
    showEditModal.value = false;
    loadAvisCredits();
  } catch (error) {
    console.error("Erreur lors de la modification", error);
    alert("Erreur lors de la modification");
  } finally {
    isSubmittingEdit.value = false;
  }
};

onMounted(() => {
  loadAvisCredits();
});
</script>

<style scoped>
.list-container {
  background: #fff;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th, .data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
}

.data-table tr:hover {
  background-color: #f1f5f9;
}

.amount {
  font-weight: 600;
  color: #0f172a;
}

.text-center {
  text-align: center !important;
  padding: 30px !important;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #e2e8f0;
}

.btn-icon.delete:hover {
  background-color: #fee2e2;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 450px;
  max-width: 90vw;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 5px;
  font-weight: 500;
}

.custom-input {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.custom-input:focus {
  border-color: #3b82f6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.btn {
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-primary { background-color: #0284c7; color: white; }
.btn-primary:hover { background-color: #0369a1; }

.btn-secondary { background-color: #e2e8f0; color: #334155; }
.btn-secondary:hover { background-color: #cbd5e1; }
</style>
