<template>
  <div class="module-view">
    <div class="header">
      <h2>Administration des Utilisateurs</h2>
    </div>

    <!-- Navigation des onglets -->
    <div class="tabs-nav">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'list' }" 
        @click="activeTab = 'list'"
      >
        Utilisateurs existants
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'create' }" 
        @click="activeTab = 'create'"
      >
        Ajouter un utilisateur
      </button>
    </div>
    
    <div class="tab-content">
      <!-- Modal mot de passe généré -->
      <div v-if="generatedPasswordData" class="pwd-modal-overlay">
        <div class="pwd-modal">
          <h3>🔐 Mot de passe généré</h3>
          <p>Voici le mot de passe temporaire pour <strong>{{ generatedPasswordData.name }}</strong>.</p>
          <div class="pwd-box">{{ generatedPasswordData.password }}</div>
          <p class="warning-text">⚠️ Copiez ce mot de passe immédiatement. Il ne sera plus affiché.</p>
          <BaseButton @click="closePwdModal" block>J'ai copié le mot de passe</BaseButton>
        </div>
      </div>

      <!-- Onglet: Formulaire de création -->
      <div v-if="activeTab === 'create'" class="tab-pane">
        <div class="form-section">
          <h3>Formulaire d'ajout</h3>
          <form @submit.prevent="submitForm" class="admin-form">
            <BaseInput id="nom" label="Nom" v-model="formData.nom" required />
            <BaseInput id="prenom" label="Prénom" v-model="formData.prenom" required />
            <BaseInput id="email" type="email" label="Adresse Email" v-model="formData.email" required />
            
            <BaseSelect 
              id="typeUser" 
              label="Type d'utilisateur" 
              v-model="formData.typeUtilisateurId" 
              :options="typeOptions" 
              required 
              @change="handleTypeChange"
            />

            <div class="form-group">
              <label>Profils métier ({{ maxProfiles }} max) <span class="required">*</span></label>
              <div class="checkbox-group">
                <label v-for="profil in profils" :key="profil.idProfil" class="checkbox-label">
                  <input 
                    type="checkbox" 
                    :value="profil.idProfil" 
                    v-model="formData.profilIds"
                    :disabled="formData.profilIds.length >= maxProfiles && !formData.profilIds.includes(profil.idProfil)"
                  />
                  {{ profil.libelleProfil }}
                </label>
              </div>
              <small v-if="formData.typeUtilisateurId && selectedTypeLibelle === 'agent'" class="help-text">
                Un agent ne peut avoir qu'un seul profil métier.
              </small>
            </div>

            <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-msg">{{ successMessage }}</div>

            <BaseButton type="submit" variant="primary" :loading="isSubmitting" block>
              Créer l'utilisateur
            </BaseButton>
          </form>
        </div>
      </div>

      <!-- Onglet: Liste des utilisateurs -->
      <div v-if="activeTab === 'list'" class="tab-pane">
        <div class="list-section">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Profils</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u.idUtilisateur">
                  <td>{{ u.nom }} {{ u.prenom }}</td>
                  <td>{{ u.email }}</td>
                  <td><span class="badge type-badge">{{ u.typeUtilisateur?.libelleType }}</span></td>
                  <td>
                    <span v-for="p in u.profils" :key="p.idProfil" class="badge profil-badge">
                      {{ p.libelleProfil }}
                    </span>
                  </td>
                  <td>
                    <button @click="resetUserPassword(u.idUtilisateur, u.nom + ' ' + u.prenom)" class="btn-action" title="Réinitialiser le mot de passe">
                      🔑
                    </button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="5" class="text-center">Aucun utilisateur trouvé</td>
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
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const activeTab = ref('list');
const users = ref([]);
const types = ref([]);
const profils = ref([]);

const formData = ref({
  nom: '',
  prenom: '',
  email: '',
  typeUtilisateurId: '',
  profilIds: []
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const generatedPasswordData = ref(null);

const typeOptions = computed(() => {
  return types.value.map(t => ({
    value: t.idType,
    label: t.libelleType
  }));
});

const selectedTypeLibelle = computed(() => {
  const type = types.value.find(t => t.idType === Number(formData.value.typeUtilisateurId));
  return type ? type.libelleType.toLowerCase() : '';
});

const maxProfiles = computed(() => {
  if (selectedTypeLibelle.value === 'agent') return 1;
  return profils.value.length; 
});

const handleTypeChange = () => {
  formData.value.profilIds = [];
};

const closePwdModal = () => {
  generatedPasswordData.value = null;
};

const loadData = async () => {
  try {
    const [resUsers, resMeta] = await Promise.all([
      api.get('/admin/users'),
      api.get('/admin/metadata')
    ]);
    users.value = resUsers.data.data;
    types.value = resMeta.data.data.types;
    profils.value = resMeta.data.data.profils;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  loadData();
});

const submitForm = async () => {
  if (formData.value.profilIds.length === 0) {
    errorMessage.value = "Veuillez sélectionner au moins un profil métier.";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await api.post('/admin/users', formData.value);
    successMessage.value = "Utilisateur créé avec succès !";
    
    // Afficher le mot de passe généré
    generatedPasswordData.value = {
      name: `${formData.value.prenom} ${formData.value.nom}`,
      password: response.data.data.plainPassword
    };

    formData.value = { nom: '', prenom: '', email: '', typeUtilisateurId: '', profilIds: [] };
    await loadData(); 
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erreur lors de la création.";
  } finally {
    isSubmitting.value = false;
  }
};

const resetUserPassword = async (idUtilisateur, userName) => {
  if (!confirm(`Voulez-vous vraiment réinitialiser le mot de passe de ${userName} ?`)) return;

  try {
    const response = await api.post(`/admin/users/${idUtilisateur}/reset-password`);
    generatedPasswordData.value = {
      name: userName,
      password: response.data.data.plainPassword
    };
  } catch (error) {
    alert("Erreur lors de la réinitialisation: " + (error.response?.data?.message || error.message));
  }
};
</script>

<style scoped>
.module-view {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.4rem;
}

.tabs-nav {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #334155;
  background-color: #f8fafc;
}

.tab-btn.active {
  color: #ea580c;
  border-bottom-color: #ea580c;
}

.tab-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 20px;
  flex: 1;
}

.form-section, .list-section {
  width: 100%;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #334155;
  font-size: 1.1rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
.required {
  color: #ef4444;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background-color: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 400 !important;
  cursor: pointer;
}

.help-text {
  color: #64748b;
  margin-top: 5px;
}

.table-container {
  overflow-x: auto;
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

.data-table td {
  color: #334155;
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 5px;
  margin-bottom: 5px;
}

.type-badge {
  background-color: #e0e7ff;
  color: #4338ca;
}

.profil-badge {
  background-color: #ffedd5;
  color: #c2410c;
}

.pwd-cell code {
  background-color: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 700;
  color: #0f172a;
}

.text-center {
  text-align: center;
}

.error-msg {
  color: #dc2626;
  background-color: #fef2f2;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.success-msg {
  color: #16a34a;
  background-color: #f0fdf4;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.btn-action {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 4px;
}

.btn-action:hover {
  transform: scale(1.2);
}

.pwd-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pwd-modal {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.pwd-modal h3 {
  color: #ea580c;
  margin-bottom: 10px;
  font-size: 1.4rem;
  border-bottom: none;
}

.pwd-box {
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
  padding: 15px;
  font-size: 1.8rem;
  font-family: monospace;
  font-weight: bold;
  color: #0f172a;
  margin: 20px 0;
  border-radius: 8px;
  letter-spacing: 2px;
}

.warning-text {
  color: #ef4444;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 20px;
}
</style>
