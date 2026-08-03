<template>
  <div class="list-container">
    <!-- Filtres de recherche -->
    <div class="search-section">
      <h4>Rechercher un avis de débit</h4>
      <form @submit.prevent="applyFilters" class="search-form">
        <div class="form-row search-row">
          <div class="form-group">
            <label>N° Prêt</label>
            <input type="number" v-model="filters.pretId" class="custom-input" placeholder="Ex: 100200" />
          </div>
          <div class="form-group">
            <label>Type</label>
            <select v-model="filters.type" class="custom-input">
              <option value="">Tous les types</option>
              <option value="Frais bancaires">Frais bancaires</option>
              <option value="Commission de gestion">Commission de gestion</option>
              <option value="Intérêts de retard">Intérêts de retard</option>
              <option value="Amortissement">Amortissement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label>Date PEC</label>
            <input type="date" v-model="filters.datePEC" class="custom-input" />
          </div>
          <div class="form-actions-search">
            <button type="submit" class="btn btn-primary">Rechercher</button>
            <button type="button" class="btn btn-secondary" @click="resetFilters">Réinitialiser</button>
          </div>
        </div>
      </form>
    </div>

    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>N° Dépense</th>
            <th>N° Prêt</th>
            <th>Type</th>
            <th>Capital</th>
            <th>Intérêt</th>
            <th>Commission</th>
            <th>Taux</th>
            <th>Date Dépense</th>
            <th>Date PEC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="10" class="text-center">Chargement des données...</td>
          </tr>
          <tr v-else-if="avisDebits.length === 0">
            <td colspan="10" class="text-center">Aucun avis de débit trouvé.</td>
          </tr>
          <tr v-else v-for="depense in avisDebits" :key="depense.codeDepense">
            <td>{{ depense.codeDepense }}</td>
            <td>{{ depense.pretId || '-' }}</td>
            <td>
              <span class="badge type-badge">{{ depense.avisDebit?.type || '-' }}</span>
            </td>
            <td class="amount">{{ formatCurrency(depense.avisDebit?.montantCapital) }}</td>
            <td class="amount">{{ formatCurrency(depense.avisDebit?.montantInteret) }}</td>
            <td class="amount">{{ formatCurrency(depense.avisDebit?.montantCommission) }}</td>
            <td>{{ depense.avisDebit?.taux ? depense.avisDebit.taux + '%' : '-' }}</td>
            <td>{{ formatDate(depense.avisDebit?.dateDepense) }}</td>
            <td>{{ formatDate(depense.datePEC) }}</td>
            <td class="actions">
              <button class="btn-icon edit" @click="openEditModal(depense)" title="Modifier">
                ✏️
              </button>
              <button class="btn-icon delete" @click="deleteAvisDebit(depense.codeDepense)" title="Supprimer">
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
        <h3>Modifier l'avis de débit (Dépense N° {{ editFormData.codeDepense }})</h3>
        <form @submit.prevent="submitEdit">
          <div class="form-row">
            <div class="form-group">
              <label>N° Prêt</label>
              <input type="number" v-model="editFormData.pretId" class="custom-input" required />
            </div>
            <div class="form-group">
              <label>Type</label>
              <select v-model="editFormData.type" class="custom-input" required>
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
              <label>Montant Capital</label>
              <input type="number" step="0.01" v-model="editFormData.montantCapital" class="custom-input" required />
            </div>
            <div class="form-group">
              <label>Montant Intérêt</label>
              <input type="number" step="0.01" v-model="editFormData.montantInteret" class="custom-input" required />
            </div>
            <div class="form-group">
              <label>Montant Commission</label>
              <input type="number" step="0.01" v-model="editFormData.montantCommission" class="custom-input" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Taux (%)</label>
              <input type="number" step="0.01" v-model="editFormData.taux" class="custom-input" required />
            </div>
            <div class="form-group">
              <label>Date Dépense</label>
              <input type="date" v-model="editFormData.dateDepense" class="custom-input" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date Échéance</label>
              <input type="date" v-model="editFormData.dateEcheance" class="custom-input" required />
            </div>
            <div class="form-group">
              <label>Date PEC</label>
              <input type="date" v-model="editFormData.datePEC" class="custom-input" required />
            </div>
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
import api from '@/services/api';

const avisDebits = ref([]);
const loading = ref(true);

const filters = ref({
  pretId: '',
  type: '',
  datePEC: ''
});

const loadAvisDebits = async () => {
  loading.value = true;
  try {
    const validFilters = {};
    if (filters.value.pretId) validFilters.pretId = filters.value.pretId;
    if (filters.value.type) validFilters.type = filters.value.type;
    if (filters.value.datePEC) validFilters.datePEC = filters.value.datePEC;

    const response = await api.get('/dette-tresor/avis-debits', { params: validFilters });
    avisDebits.value = response.data.data;
  } catch (error) {
    console.error("Erreur lors du chargement des avis de débit", error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  loadAvisDebits();
};

const resetFilters = () => {
  filters.value = { pretId: '', type: '', datePEC: '' };
  loadAvisDebits();
};

const deleteAvisDebit = async (codeDepense) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet avis de débit ? Cela supprimera la dépense associée.")) {
    try {
      await api.delete(`/dette-tresor/avis-debits/${codeDepense}`);
      loadAvisDebits();
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      alert("Erreur lors de la suppression");
    }
  }
};

const showEditModal = ref(false);
const isSubmittingEdit = ref(false);
const editFormData = ref({});

const openEditModal = (depense) => {
  editFormData.value = {
    codeDepense: depense.codeDepense,
    pretId: depense.pretId,
    type: depense.avisDebit?.type,
    taux: depense.avisDebit?.taux,
    montantCapital: depense.avisDebit?.montantCapital,
    montantInteret: depense.avisDebit?.montantInteret,
    montantCommission: depense.avisDebit?.montantCommission,
    dateDepense: depense.avisDebit?.dateDepense ? new Date(depense.avisDebit.dateDepense).toISOString().split('T')[0] : '',
    dateEcheance: depense.dateEcheance ? new Date(depense.dateEcheance).toISOString().split('T')[0] : '',
    datePEC: depense.datePEC ? new Date(depense.datePEC).toISOString().split('T')[0] : ''
  };
  showEditModal.value = true;
};

const submitEdit = async () => {
  isSubmittingEdit.value = true;
  try {
    const payload = {
      pretId: Number(editFormData.value.pretId),
      type: editFormData.value.type,
      taux: Number(editFormData.value.taux),
      montantCapital: Number(editFormData.value.montantCapital),
      montantInteret: Number(editFormData.value.montantInteret),
      montantCommission: Number(editFormData.value.montantCommission),
      dateDepense: editFormData.value.dateDepense,
      dateEcheance: editFormData.value.dateEcheance,
      datePEC: editFormData.value.datePEC
    };
    
    await api.put(`/dette-tresor/avis-debits/${editFormData.value.codeDepense}`, payload);
    showEditModal.value = false;
    loadAvisDebits();
  } catch (error) {
    console.error("Erreur lors de la modification", error);
    alert("Erreur lors de la modification");
  } finally {
    isSubmittingEdit.value = false;
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

onMounted(() => {
  loadAvisDebits();
});
</script>

<style scoped>
.list-container {
  background: #fff;
}

.search-section {
  background-color: #f8fafc;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.search-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #334155;
  font-size: 1rem;
}

.search-form {
  display: flex;
  flex-direction: column;
}

.search-row {
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-actions-search {
  display: flex;
  gap: 10px;
  margin-bottom: 2px;
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

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: #e0f2fe;
  color: #0284c7;
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
  width: 700px;
  max-width: 90vw;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form-row {
  display: flex;
  gap: 15px;
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
  border-color: #ea580c;
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

.btn-primary { background-color: #ea580c; color: white; }
.btn-primary:hover { background-color: #c2410c; }

.btn-secondary { background-color: #e2e8f0; color: #334155; }
.btn-secondary:hover { background-color: #cbd5e1; }
</style>
