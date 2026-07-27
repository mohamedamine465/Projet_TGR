<template>
  <div class="list-container">
    <!-- Filtres de recherche -->
    <div class="search-section">
      <h4>Rechercher un ordre de paiement</h4>
      <form @submit.prevent="applyFilters" class="search-form">
        <div class="form-row search-row">
          <div class="form-group">
            <label>N° Ordre</label>
            <input type="number" v-model="filters.numOrdre" class="custom-input" placeholder="Ex: 15" />
          </div>
          <div class="form-group">
            <label>N° Prêt</label>
            <input type="number" v-model="filters.pretId" class="custom-input" placeholder="Ex: 100200" />
          </div>
          <div class="form-group">
            <label>Capital</label>
            <input type="number" step="0.01" v-model="filters.montantCapital" class="custom-input" placeholder="Ex: 500000" />
          </div>
          <div class="form-group">
            <label>Intérêt</label>
            <input type="number" step="0.01" v-model="filters.montantInteret" class="custom-input" placeholder="Ex: 20000" />
          </div>
          <div class="form-group">
            <label>Commission</label>
            <input type="number" step="0.01" v-model="filters.montantCommission" class="custom-input" placeholder="Ex: 500" />
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
            <th>N° OP</th>
            <th>N° Prêt</th>
            <th>N° Lettre</th>
            <th>Capital</th>
            <th>Intérêt</th>
            <th>Commission</th>
            <th>Date Échéance</th>
            <th>Date PEC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="9" class="text-center">Chargement des données...</td>
          </tr>
          <tr v-else-if="ordres.length === 0">
            <td colspan="9" class="text-center">Aucun ordre de paiement trouvé.</td>
          </tr>
          <tr v-else v-for="ordre in ordres" :key="ordre.numOrdre">
            <td>{{ ordre.numOrdre }}</td>
            <td>{{ ordre.pretId || '-' }}</td>
            <td>{{ ordre.numlettre }}</td>
            <td class="amount">{{ formatCurrency(ordre.montantCapital) }}</td>
            <td class="amount">{{ formatCurrency(ordre.montantInteret) }}</td>
            <td class="amount">{{ formatCurrency(ordre.montantCommission) }}</td>
            <td>{{ formatDate(ordre.dateEcheance) }}</td>
            <td>{{ formatDate(ordre.datePEC) }}</td>
            <td class="actions">
              <button class="btn-icon edit" @click="openEditModal(ordre)" title="Modifier">
                ✏️
              </button>
              <button class="btn-icon delete" @click="deleteOrdre(ordre.numOrdre)" title="Supprimer">
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
        <h3>Modifier l'ordre de paiement N° {{ editFormData.numOrdre }}</h3>
        <form @submit.prevent="submitEdit">
          <div class="form-row">
            <div class="form-group">
              <label>N° Prêt</label>
              <input type="number" v-model="editFormData.pretId" class="custom-input" required />
            </div>
            <div class="form-group">
              <label>N° Lettre</label>
              <input type="number" v-model="editFormData.numlettre" class="custom-input" required />
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

const ordres = ref([]);
const loading = ref(true);

const filters = ref({
  numOrdre: '',
  pretId: '',
  montantCapital: '',
  montantInteret: '',
  montantCommission: '',
  datePEC: ''
});

const loadOrdres = async () => {
  loading.value = true;
  try {
    const validFilters = {};
    if (filters.value.numOrdre) validFilters.numOrdre = filters.value.numOrdre;
    if (filters.value.pretId) validFilters.pretId = filters.value.pretId;
    if (filters.value.montantCapital) validFilters.montantCapital = filters.value.montantCapital;
    if (filters.value.montantInteret) validFilters.montantInteret = filters.value.montantInteret;
    if (filters.value.montantCommission) validFilters.montantCommission = filters.value.montantCommission;
    if (filters.value.datePEC) validFilters.datePEC = filters.value.datePEC;

    const response = await api.get('/dette-tresor/ordres-paiement', { params: validFilters });
    ordres.value = response.data.data;
  } catch (error) {
    console.error("Erreur lors du chargement des ordres de paiement", error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  loadOrdres();
};

const resetFilters = () => {
  filters.value = { numOrdre: '', pretId: '', montantCapital: '', montantInteret: '', montantCommission: '', datePEC: '' };
  loadOrdres();
};

const deleteOrdre = async (numOrdre) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet ordre de paiement ?")) {
    try {
      await api.delete(`/dette-tresor/ordres-paiement/${numOrdre}`);
      loadOrdres();
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      alert("Erreur lors de la suppression");
    }
  }
};

const showEditModal = ref(false);
const isSubmittingEdit = ref(false);
const editFormData = ref({});

const openEditModal = (ordre) => {
  editFormData.value = {
    numOrdre: ordre.numOrdre,
    pretId: ordre.pretId,
    numlettre: ordre.numlettre,
    montantCapital: ordre.montantCapital,
    montantInteret: ordre.montantInteret,
    montantCommission: ordre.montantCommission,
    dateEcheance: ordre.dateEcheance ? new Date(ordre.dateEcheance).toISOString().split('T')[0] : '',
    datePEC: ordre.datePEC ? new Date(ordre.datePEC).toISOString().split('T')[0] : ''
  };
  showEditModal.value = true;
};

const submitEdit = async () => {
  isSubmittingEdit.value = true;
  try {
    const payload = {
      pretId: editFormData.value.pretId ? Number(editFormData.value.pretId) : null,
      numlettre: Number(editFormData.value.numlettre),
      montantCapital: Number(editFormData.value.montantCapital),
      montantInteret: Number(editFormData.value.montantInteret),
      montantCommission: Number(editFormData.value.montantCommission),
      dateEcheance: editFormData.value.dateEcheance,
      datePEC: editFormData.value.datePEC
    };
    
    await api.put(`/dette-tresor/ordres-paiement/${editFormData.value.numOrdre}`, payload);
    showEditModal.value = false;
    loadOrdres();
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
  loadOrdres();
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
  width: 650px;
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
