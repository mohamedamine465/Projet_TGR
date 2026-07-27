<template>
  <div class="list-container">
    
    <!-- Filtres de recherche -->
    <div class="search-section">
      <h4>Rechercher un prêt</h4>
      <form @submit.prevent="applyFilters" class="search-form">
        <div class="form-row">
          <div class="form-group">
            <label>Numéro de prêt</label>
            <input type="number" v-model="filters.numPret" class="custom-input" placeholder="Ex: 100200" />
          </div>
          <div class="form-group">
            <label>Référence (Emprunt)</label>
            <input type="text" v-model="filters.numEmprunt" class="custom-input" placeholder="Ex: EMP-2023" />
          </div>
          <div class="form-group">
            <label>Catégorie Bailleur</label>
            <input type="number" v-model="filters.codeCategorie" class="custom-input" placeholder="Ex: 5" />
          </div>
          <div class="form-group">
            <label>Date de création</label>
            <input type="date" v-model="filters.dateCreation" class="custom-input" />
          </div>
          <div class="form-group">
            <label>Objet du prêt</label>
            <input type="text" v-model="filters.objet" class="custom-input" placeholder="Ex: Autoroute" />
          </div>
          <div class="form-group">
            <label>Montant (Solde)</label>
            <input type="number" v-model="filters.soldeCourant" class="custom-input" placeholder="Ex: 500000" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Rechercher</button>
            <button type="button" class="btn btn-secondary" @click="resetFilters">Réinitialiser</button>
          </div>
        </div>
      </form>
    </div>

    <div v-if="loading" class="loading-state">
      Chargement des prêts en cours...
    </div>
    
    <div v-else-if="error" class="error-msg">
      {{ error }}
    </div>

    <div v-else>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Numéro Prêt</th>
              <th>Référence</th>
              <th>Date de création</th>
              <th>Bailleur</th>
              <th>Catégorie</th>
              <th>Maturité</th>
              <th>Objet</th>
              <th>Solde (DH)</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pret in prets" :key="pret.numPret">
              <td class="font-bold">#{{ pret.numPret }}</td>
              <td>{{ pret.numEmprunt }}</td>
              <td>{{ formatDate(pret.dateCreation) }}</td>
              <td>
                <span class="badge bailleur-badge">
                  {{ pret.preteur?.designation || 'Inconnu' }}
                </span>
              </td>
              <td>{{ pret.preteur?.codeCategorie || '-' }}</td>
              <td>
                <span class="badge maturite-badge">
                  {{ formatMaturite(pret.preteur?.maturite) }}
                </span>
              </td>
              <td class="truncate" :title="pret.objet">{{ pret.objet }}</td>
              <td class="amount-cell">{{ formatMontant(pret.soldeCourant) }}</td>
              <td class="actions-cell">
                <button class="icon-btn edit-btn" title="Modifier" @click="openEditModal(pret)">
                  ✏️
                </button>
                <button class="icon-btn schedule-btn" title="Consulter Échéancier" @click="openScheduleModal(pret.numPret)">
                  📅
                </button>
                <button class="icon-btn delete-btn" title="Supprimer" @click="deletePret(pret.numPret)">
                  🗑️
                </button>
              </td>
            </tr>
            <tr v-if="prets.length === 0">
              <td colspan="9" class="text-center empty-state">Aucun prêt n'a été trouvé avec ces critères.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Modification -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Modifier le prêt N° {{ editFormData.numPret }}</h3>
        <form @submit.prevent="submitEdit">
          <div class="form-group">
            <label>Numéro d'emprunt (Référence)</label>
            <input type="text" v-model="editFormData.numEmprunt" class="custom-input" required />
          </div>
          <div class="form-group">
            <label>Objet du prêt</label>
            <input type="text" v-model="editFormData.objet" class="custom-input" required />
          </div>
          <div class="form-group">
            <label>Montant (Solde)</label>
            <input type="number" v-model="editFormData.soldeCourant" class="custom-input" required />
          </div>
          <div class="form-group">
            <label>Bailleur de fonds (ID)</label>
            <input type="number" v-model="editFormData.preteurId" class="custom-input" required />
          </div>
          
          <div v-if="editError" class="error-msg">{{ editError }}</div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="showEditModal = false">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmittingEdit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal d'Échéancier -->
    <div v-if="showScheduleModal" class="modal-overlay">
      <div class="modal-content schedule-modal">
        <div class="modal-header">
          <h3>Échéancier du prêt N° {{ currentSchedulePret?.numPret }}</h3>
          <button class="close-btn" @click="showScheduleModal = false">✖</button>
        </div>
        
        <div v-if="loadingSchedule" class="loading-state">Chargement de l'échéancier...</div>
        
        <div v-else-if="currentSchedulePret?.echeanciers?.length === 0" class="empty-state">
          Aucun échéancier défini pour ce prêt.
        </div>
        
        <div v-else class="schedule-details">
          <div v-for="echeancier in currentSchedulePret?.echeanciers" :key="echeancier.codeEcheancier" class="echeancier-section">
            <h4>Tranche N° {{ echeancier.tranche }}</h4>
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
                <tr v-for="ech in echeancier.echeances" :key="ech.idEcheance">
                  <td>{{ formatDate(ech.dateEcheance) }}</td>
                  <td class="amount-cell">{{ formatMontant(ech.montantCapital) }}</td>
                  <td class="amount-cell">{{ formatMontant(ech.montantInteret) }}</td>
                  <td class="amount-cell">{{ formatMontant(ech.montantCommission) }}</td>
                  <td class="amount-cell font-bold">{{ formatMontant(ech.montantCapital + ech.montantInteret + ech.montantCommission) }}</td>
                  <td><span class="badge" :class="ech.statut === 'Réglée' ? 'badge-success' : 'badge-warning'">{{ ech.statut }}</span></td>
                </tr>
                <tr v-if="echeancier.echeances?.length === 0">
                  <td colspan="6" class="text-center">Aucune échéance ajoutée.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const prets = ref([]);
const loading = ref(true);
const error = ref('');

const filters = ref({
  numPret: '',
  numEmprunt: '',
  codeCategorie: '',
  dateCreation: '',
  objet: '',
  soldeCourant: ''
});

const loadPrets = async () => {
  try {
    loading.value = true;
    
    const validFilters = {};
    if (filters.value.numPret) validFilters.numPret = filters.value.numPret;
    if (filters.value.numEmprunt) validFilters.numEmprunt = filters.value.numEmprunt;
    if (filters.value.codeCategorie) validFilters.codeCategorie = filters.value.codeCategorie;
    if (filters.value.dateCreation) validFilters.dateCreation = filters.value.dateCreation;
    if (filters.value.objet) validFilters.objet = filters.value.objet;
    if (filters.value.soldeCourant) validFilters.soldeCourant = filters.value.soldeCourant;

    const response = await api.get('/dette-tresor/prets', { params: validFilters });
    prets.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || "Impossible de charger la liste des prêts.";
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  loadPrets();
};

const resetFilters = () => {
  filters.value = { numPret: '', numEmprunt: '', codeCategorie: '', dateCreation: '', objet: '', soldeCourant: '' };
  loadPrets();
};

const deletePret = async (numPret) => {
  if (!confirm(`Voulez-vous vraiment supprimer le prêt N° ${numPret} ?`)) return;
  
  try {
    await api.delete(`/dette-tresor/prets/${numPret}`);
    prets.value = prets.value.filter(p => p.numPret !== numPret);
  } catch (err) {
    const details = err.response?.data?.errors || err.response?.data?.message || err.message;
    alert("Erreur lors de la suppression : " + details);
  }
};

// --- LOGIQUE DE MODIFICATION ---
const showEditModal = ref(false);
const isSubmittingEdit = ref(false);
const editError = ref('');
const editFormData = ref({});

const openEditModal = (pret) => {
  try {
    editError.value = '';
    editFormData.value = { 
      numPret: pret.numPret,
      numEmprunt: pret.numEmprunt,
      objet: pret.objet,
      soldeCourant: pret.soldeCourant,
      preteurId: pret.preteurId
    };
    showEditModal.value = true;
  } catch (err) {
    alert("Erreur lors de l'ouverture de la modification : " + err.message);
  }
};

const submitEdit = async () => {
  isSubmittingEdit.value = true;
  editError.value = '';
  
  try {
    const payload = {
      numEmprunt: editFormData.value.numEmprunt,
      objet: editFormData.value.objet,
      soldeCourant: String(editFormData.value.soldeCourant),
      preteurId: Number(editFormData.value.preteurId)
    };
    
    const response = await api.put(`/dette-tresor/prets/${editFormData.value.numPret}`, payload);
    if (response.data.success) {
      showEditModal.value = false;
      loadPrets();
    } else {
      editError.value = "Erreur inattendue : " + JSON.stringify(response.data);
    }
  } catch (error) {
    editError.value = error.response?.data?.errors || error.response?.data?.message || error.message;
  } finally {
    isSubmittingEdit.value = false;
  }
};

// --- LOGIQUE D'ÉCHÉANCIER ---
const showScheduleModal = ref(false);
const loadingSchedule = ref(false);
const currentSchedulePret = ref(null);

const openScheduleModal = async (numPret) => {
  try {
    showScheduleModal.value = true;
    loadingSchedule.value = true;
    currentSchedulePret.value = null;
    
    const response = await api.get(`/dette-tresor/prets/${numPret}`);
    
    if (response.data && response.data.data) {
      currentSchedulePret.value = response.data.data;
    } else {
      throw new Error("Données de l'échéancier introuvables.");
    }
  } catch (error) {
    const details = error.response?.data?.errors || error.response?.data?.message || error.message;
    alert("Impossible de charger l'échéancier : " + details);
    showScheduleModal.value = false;
  } finally {
    loadingSchedule.value = false;
  }
};

onMounted(() => {
  loadPrets();
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const formatMaturite = (maturite) => {
  if (maturite === 'C') return 'Court terme';
  if (maturite === 'M') return 'Moyen terme';
  if (maturite === 'L') return 'Long terme';
  return '-';
};

const formatMontant = (montant) => {
  if (montant === undefined || montant === null) return '0.00';
  return Number(montant).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
</script>

<style scoped>
.list-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
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

.form-row {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
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
}

.custom-input:focus {
  border-color: #3b82f6;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 2px;
}

.btn {
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #0284c7;
  color: white;
}
.btn-primary:hover { background-color: #0369a1; }

.btn-secondary {
  background-color: #e2e8f0;
  color: #334155;
}
.btn-secondary:hover { background-color: #cbd5e1; }


.loading-state {
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-style: italic;
}

.error-msg {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 14px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.data-table td {
  color: #334155;
  font-size: 0.9rem;
}

.data-table tr:hover {
  background-color: #f8fafc;
}

.font-bold {
  font-weight: 700;
  color: #0f172a !important;
}

.amount-cell {
  font-family: monospace;
  font-weight: 600;
  color: #ea580c !important;
  text-align: right !important;
}

.data-table th:nth-child(7) {
  text-align: right;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.bailleur-badge {
  background-color: #e0f2fe;
  color: #0284c7;
}

.maturite-badge {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.truncate {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
.schedule-btn:hover { background-color: #fef3c7; }
.delete-btn:hover { background-color: #fee2e2; }

.text-center {
  text-align: center !important;
}

.empty-state {
  padding: 40px !important;
  color: #94a3b8 !important;
  font-style: italic;
  text-align: center;
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
  max-height: 90vh;
  overflow-y: auto;
}

.schedule-modal {
  width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #64748b;
}

.echeancier-section {
  margin-bottom: 30px;
}

.echeancier-section h4 {
  margin-bottom: 10px;
  color: #ea580c;
}

.badge-success { background-color: #dcfce7; color: #166534; }
.badge-warning { background-color: #fef3c7; color: #b45309; }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}
</style>
