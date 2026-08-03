<template>
  <div class="module-view">
    <div class="tabs-header">
      <h2>Gestion des Prêts</h2>
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="setActiveTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <div class="tab-content">
      <div v-if="activeTab === 'creer'" class="tab-pane">
        <h3>Création d'un nouveau contrat de prêt</h3>
        <CreatePretForm />
      </div>
      
      <div v-if="activeTab === 'echeancier'" class="tab-pane">
        <h3>Ajouter un échéancier</h3>
        <AddEcheancierForm />
      </div>
      
      <div v-if="activeTab === 'consulter'" class="tab-pane">
        <h3>Liste des contrats de prêts</h3>
        <ListPret />
      </div>
      
      <div v-if="activeTab === 'param'" class="tab-pane">
        <h3>Paramétrage du module</h3>
        <ParametragePret />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CreatePretForm from '@/components/prets/CreatePretForm.vue';
import ListPret from '@/components/prets/ListPret.vue';
import AddEcheancierForm from '@/components/prets/AddEcheancierForm.vue';
import ParametragePret from '@/components/prets/ParametragePret.vue';

const route = useRoute();
const router = useRouter();

const tabs = [
  { id: 'creer', label: 'Créer prêt' },
  { id: 'echeancier', label: 'Ajouter échéancier' },
  { id: 'consulter', label: 'Consulter les prêts' },
  { id: 'param', label: 'Paramétrage' }
];

const activeTab = ref('creer');

// Synchroniser l'onglet avec l'URL (ex: ?tab=echeancier)
onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab;
  }
});

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab;
  }
});

// Quand on clique sur un onglet dans la vue, mettre à jour l'URL
const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  router.push({ query: { ...route.query, tab: tabId } });
};
</script>

<style scoped>
.module-view {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.tabs-header {
  background-color: #f8fafc;
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid #e2e8f0;
}

.tabs-header h2 {
  margin: 0 0 15px 0;
  color: #1e293b;
  font-size: 1.4rem;
}

.tabs {
  display: flex;
  gap: 2px;
}

.tab-btn {
  padding: 10px 20px;
  background-color: #e2e8f0;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background-color: #f1f5f9;
  color: #334155;
}

.tab-btn.active {
  background-color: #ffffff;
  color: #ea580c;
  border-color: #e2e8f0;
  border-bottom: 1px solid #ffffff;
  margin-bottom: -1px; /* Overlap border */
}

.tab-content {
  padding: 20px;
  flex: 1;
}

.tab-pane h3 {
  margin-top: 0;
  color: #334155;
  font-size: 1.1rem;
}
</style>
