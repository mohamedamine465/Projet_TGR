<template>
  <div class="module-view">
    <div class="tabs-header">
      <h2>Gestion des Projets (MEDA & Fonds de roulement)</h2>
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
        <h3>Création d'un nouveau projet</h3>
        <CreateProjetForm @created="setActiveTab('consulter')" />
      </div>
      
      <div v-if="activeTab === 'consulter'" class="tab-pane">
        <h3>Liste des projets</h3>
        <ListProjet />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CreateProjetForm from '@/components/programme-meda/projet/CreateProjetForm.vue';
import ListProjet from '@/components/programme-meda/projet/ListProjet.vue';

const route = useRoute();
const router = useRouter();

const tabs = [
  { id: 'creer', label: 'Ajouter un projet' },
  { id: 'consulter', label: 'Consulter les projets' }
];

const activeTab = ref('creer');

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
  margin-bottom: -1px;
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
