<template>
  <div class="list-container">
    <div class="search-section">
      <h4>Rechercher un justificatif</h4>
      <form @submit.prevent="applyFilters" class="search-form">
        <div class="form-row">
          <div class="form-group">
            <label>ID Projet</label>
            <input type="number" v-model="filters.projetId" class="custom-input" placeholder="ID Projet" />
          </div>
          <div class="form-group">
            <label>Date PEC</label>
            <input type="date" v-model="filters.datePEC" class="custom-input" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Rechercher</button>
            <button type="button" class="btn btn-secondary" @click="resetFilters">Réinitialiser</button>
          </div>
        </div>
      </form>
    </div>
    
    <div v-if="loading" class="loading">Chargement des pièces justificatives...</div>
    <div v-else-if="error" class="alert error">{{ error }}</div>
    
    <div v-else class="table-responsive">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Code Dépense</th>
            <th>ID Projet</th>
            <th>Date PEC</th>
            <th>N° Facture</th>
            <th>Montant Dispo</th>
            <th>Part Financée</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="avisList.length === 0">
            <td colspan="7" class="empty-state">Aucun justificatif trouvé.</td>
          </tr>
          <tr v-else v-for="avis in avisList" :key="avis.codeDepense">
            <template v-if="editingId === avis.codeDepense">
              <td>{{ avis.codeDepense }}</td>
              <td><input type="number" v-model="editData.projetId" class="form-input" /></td>
              <td>
                <input type="date" v-model="editData.datePEC" class="form-input mb-1" title="Date PEC" />
                <input type="date" v-model="editData.dateEcheance" class="form-input" title="Date Echéance" />
              </td>
              <td><input type="number" v-model="editData.numFacture" class="form-input" /></td>
              <td><input type="number" v-model="editData.montantDispo" class="form-input" /></td>
              <td><input type="number" v-model="editData.partFinancee" class="form-input" /></td>
              <td class="actions-cell">
                <button class="icon-btn save-btn" title="Enregistrer" @click="saveEdit">✅</button>
                <button class="icon-btn cancel-btn" title="Annuler" @click="cancelEdit">❌</button>
              </td>
            </template>
            <template v-else>
              <td>{{ avis.codeDepense }}</td>
              <td>
                <span class="badge badge-projet">Projet #{{ avis.projetId }}</span>
              </td>
              <td>{{ formatDate(avis.datePEC) }}</td>
              <td>{{ avis.avisOperation?.numFacture || '-' }}</td>
              <td>{{ formatMontant(avis.avisOperation?.montantDispo) }}</td>
              <td class="amount-financed">{{ formatMontant(avis.avisOperation?.partFinancee) }}</td>
              <td class="actions-cell">
                <button class="icon-btn edit-btn" title="Modifier" @click="startEdit(avis)">✏️</button>
                <button class="icon-btn delete-btn" title="Supprimer" @click="deleteAvisOperation(avis.codeDepense)">🗑️</button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const avisList = ref([]);
const loading = ref(true);
const error = ref('');
const filters = ref({
  projetId: '',
  datePEC: ''
});

const editingId = ref(null);
const editData = ref({});

const loadAvisOperations = async () => {
  loading.value = true;
  error.value = '';
  
  const validFilters = {};
  if (filters.value.projetId) validFilters.projetId = filters.value.projetId;
  if (filters.value.datePEC) validFilters.datePEC = filters.value.datePEC;

  try {
    const response = await api.get('/programme-meda/avis-operations', { params: validFilters });
    avisList.value = response.data.data || [];
  } catch (err) {
    error.value = "Impossible de charger les justificatifs.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  loadAvisOperations();
};

const resetFilters = () => {
  filters.value = { projetId: '', datePEC: '' };
  loadAvisOperations();
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const formatMontant = (val) => {
  if (val === undefined || val === null) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(val);
};

const startEdit = (avis) => {
  editingId.value = avis.codeDepense;
  editData.value = {
    projetId: avis.projetId,
    datePEC: formatDateForInput(avis.datePEC),
    dateEcheance: formatDateForInput(avis.dateEcheance),
    numFacture: avis.avisOperation?.numFacture || '',
    montantDispo: avis.avisOperation?.montantDispo || 0,
    partFinancee: avis.avisOperation?.partFinancee || 0
  };
};

const cancelEdit = () => {
  editingId.value = null;
  editData.value = {};
};

const saveEdit = async () => {
  try {
    await api.put(`/programme-meda/avis-operations/${editingId.value}`, editData.value);
    await loadAvisOperations();
    cancelEdit();
  } catch (err) {
    alert("Erreur lors de la modification");
    console.error(err);
  }
};

const deleteAvisOperation = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer cet avis d'opération ?")) return;
  try {
    await api.delete(`/programme-meda/avis-operations/${id}`);
    await loadAvisOperations();
  } catch (err) {
    alert("Erreur lors de la suppression");
    console.error(err);
  }
};

onMounted(() => {
  loadAvisOperations();
});
</script>

<style scoped>
.list-container {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 20px;
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
.search-form { display: flex; flex-direction: column; }
.form-row { display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap; }
.form-group { display: flex; flex-direction: column; flex: 1; min-width: 150px; }
.form-group label { font-size: 0.85rem; color: #475569; margin-bottom: 5px; font-weight: 500; }
.form-actions { display: flex; gap: 10px; margin-bottom: 2px; }
.custom-input {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
}
.custom-input:focus { border-color: #3b82f6; }

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

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-style: italic;
}
.empty-state {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
}
.table-responsive {
  overflow-x: auto;
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
}
.custom-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-align: left;
  padding: 12px 15px;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.9rem;
}
.custom-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.9rem;
}
.custom-table tbody tr:hover {
  background-color: #f1f5f9;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-projet {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}
.amount-financed {
  font-weight: 600;
  color: #ea580c;
}
.alert.error {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #fecaca;
}
.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.edit-btn:hover { background-color: #e0f2fe; }
.delete-btn:hover { background-color: #fee2e2; }
.save-btn:hover { background-color: #dcfce7; }
.cancel-btn:hover { background-color: #f1f5f9; }
.text-center { text-align: center !important; }

.form-input {
  width: 100%;
  padding: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.85rem;
}
.mb-1 { margin-bottom: 4px; }
</style>
