<template>
  <TabsLayout 
    title="Gestion des Projets (MEDA & Fonds de roulement)" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'un nouveau projet</h3>
      <!-- Le composant va émettre l'événement router.push pour changer d'onglet, ou on peut utiliser location.search/window.location -->
      <CreateProjetForm @created="goToConsulter" />
    </template>
    
    <template #consulter>
      <h3>Liste des projets</h3>
      <ListProjet />
    </template>
  </TabsLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import TabsLayout from '@/components/common/TabsLayout.vue';
import CreateProjetForm from '@/components/programme-meda/projet/CreateProjetForm.vue';
import ListProjet from '@/components/programme-meda/projet/ListProjet.vue';

const router = useRouter();
const route = useRoute();

const tabs = [
  { id: 'creer', label: 'Ajouter un projet' },
  { id: 'consulter', label: 'Consulter les projets' }
];

const goToConsulter = () => {
  router.push({ query: { ...route.query, tab: 'consulter' } });
};
</script>
