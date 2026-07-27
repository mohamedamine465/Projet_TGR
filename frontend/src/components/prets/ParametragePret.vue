<template>
  <div class="param-container">
    <!-- Modal d'ajout de Prêteur -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Ajouter un Bailleur de fonds</h3>
        <form @submit.prevent="submitPreteur">
          <div class="form-group">
            <BaseInput id="code" label="Code Catégorie (ID)" type="number" v-model="formData.codeCategorie" required />
          </div>
          <div class="form-group">
            <BaseInput id="designation" label="Désignation (Nom)" v-model="formData.designation" required />
          </div>
          <div class="form-group">
            <BaseInput id="adresse" label="Adresse Principale (Optionnel)" v-model="formData.adresse" />
          </div>
          <div class="form-group">
            <label>Maturité (C=Court, M=Moyen, L=Long)</label>
            <select v-model="formData.maturite" required class="custom-select">
              <option value="C">Court terme (C)</option>
              <option value="M">Moyen terme (M)</option>
              <option value="L">Long terme (L)</option>
            </select>
          </div>
          
          <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

          <div class="modal-actions">
            <BaseButton type="button" variant="secondary" @click="showModal = false">Annuler</BaseButton>
            <BaseButton type="submit" variant="primary" :loading="isSubmitting">Enregistrer</BaseButton>
          </div>
        </form>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      Chargement des paramètres...
    </div>

    <div v-else class="param-content">
      <div class="param-card full-width">
        <div class="card-header">
          <h3>Bailleurs de fonds (Prêteurs)</h3>
          <BaseButton variant="secondary" @click="openAddModal">+ Ajouter</BaseButton>
        </div>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>Code Catégorie</th>
              <th>Désignation</th>
              <th>Adresse</th>
              <th>Maturité</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="preteur in preteurs" :key="preteur.codeCategorie">
              <td>{{ preteur.codeCategorie }}</td>
              <td class="font-bold">{{ preteur.designation }}</td>
              <td class="text-sm">{{ preteur.adresses && preteur.adresses.length > 0 ? preteur.adresses[0].adresse : '-' }}</td>
              <td><span class="badge active-badge">{{ preteur.maturite === 'C' ? 'Court terme' : preteur.maturite === 'M' ? 'Moyen terme' : 'Long terme' }}</span></td>
              <td class="actions-cell">
                <button class="icon-btn edit-btn" title="Modifier" @click="openEditModal(preteur)">✏️</button>
                <button class="icon-btn delete-btn" title="Supprimer" @click="deletePreteur(preteur.codeCategorie)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import BaseButton from '../common/BaseButton.vue';
import BaseInput from '../common/BaseInput.vue';

const preteurs = ref([]);
const loading = ref(true);

const showModal = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);
const errorMessage = ref('');

const formData = ref({
  codeCategorie: '',
  designation: '',
  maturite: 'M',
  adresse: ''
});

const loadParametrage = async () => {
  try {
    const response = await api.get('/dette-tresor/prets/preteurs');
    preteurs.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openAddModal = () => {
  isEditing.value = false;
  errorMessage.value = '';
  formData.value = { codeCategorie: '', designation: '', maturite: 'M', adresse: '' };
  showModal.value = true;
};

const openEditModal = (preteur) => {
  isEditing.value = true;
  errorMessage.value = '';
  formData.value = {
    codeCategorie: preteur.codeCategorie,
    designation: preteur.designation,
    maturite: preteur.maturite,
    adresse: preteur.adresses && preteur.adresses.length > 0 ? preteur.adresses[0].adresse : ''
  };
  showModal.value = true;
};

const deletePreteur = async (codeCategorie) => {
  if (!confirm("Voulez-vous vraiment supprimer ce bailleur de fonds ? Cela risque d'échouer si des prêts y sont liés.")) return;
  try {
    await api.delete(`/dette-tresor/prets/preteurs/${codeCategorie}`);
    preteurs.value = preteurs.value.filter(p => p.codeCategorie !== codeCategorie);
  } catch (error) {
    alert(error.response?.data?.message || "Erreur lors de la suppression.");
  }
};

const submitPreteur = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    if (isEditing.value) {
      const response = await api.put(`/dette-tresor/prets/preteurs/${formData.value.codeCategorie}`, formData.value);
      const index = preteurs.value.findIndex(p => p.codeCategorie === formData.value.codeCategorie);
      if (index !== -1) {
        preteurs.value[index] = response.data.data;
      }
    } else {
      const response = await api.post('/dette-tresor/prets/preteurs', formData.value);
      preteurs.value.push(response.data.data);
    }
    showModal.value = false;
    formData.value = { codeCategorie: '', designation: '', maturite: 'M', adresse: '' };
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erreur lors de l'enregistrement.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadParametrage();
});
</script>

<style scoped>
.param-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.param-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.param-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
}

.card-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.data-table th {
  background-color: #f8fafc;
  color: #64748b;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.font-bold {
  font-weight: 600;
  color: #334155;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.active-badge {
  background-color: #dcfce7;
  color: #166534;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
  font-style: italic;
  background-color: #f8fafc;
  border-radius: 6px;
}

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
  width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-top: 0;
  color: #1e293b;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #334155;
  font-size: 0.9rem;
}

.custom-select {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #f8fafc;
  outline: none;
}

.custom-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.error-msg {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 15px;
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
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.edit-btn:hover { background-color: #fef3c7; }
.delete-btn:hover { background-color: #fee2e2; }
</style>
