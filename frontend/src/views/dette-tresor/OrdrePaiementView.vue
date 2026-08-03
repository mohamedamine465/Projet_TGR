<template>
  <TabsLayout 
    title="Gestion des Ordres de Paiement" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'un ordre de paiement</h3>
      <CreateOrdrePaiementForm @created="goToConsulter" />
    </template>
    
    <template #consulter>
      <h3>Liste des ordres de paiement</h3>
      <ListOrdrePaiement />
    </template>
    
    <template #generer>
      <GenererLettre />
    </template>
  </TabsLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import TabsLayout from '@/components/common/TabsLayout.vue';
import CreateOrdrePaiementForm from '@/components/ordre-paiement/CreateOrdrePaiementForm.vue';
import ListOrdrePaiement from '@/components/ordre-paiement/ListOrdrePaiement.vue';
import GenererLettre from '@/components/ordre-paiement/GenererLettre.vue';

const router = useRouter();
const route = useRoute();

const tabs = [
  { id: 'creer', label: 'Ajouter un ordre de paiement' },
  { id: 'consulter', label: 'Consulter les ordres de paiement' },
  { id: 'generer', label: 'Générer Lettre de règlement' }
];

const goToConsulter = () => {
  router.push({ query: { ...route.query, tab: 'consulter' } });
};
</script>
