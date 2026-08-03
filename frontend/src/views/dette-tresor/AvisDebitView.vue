<template>
  <TabsLayout 
    title="Gestion des Avis de Débits" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'un avis de débit</h3>
      <CreateAvisDebitForm @created="goToConsulter" />
    </template>
    
    <template #consulter>
      <h3>Liste des avis de débits</h3>
      <ListAvisDebit />
    </template>
  </TabsLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import TabsLayout from '@/components/common/TabsLayout.vue';
import CreateAvisDebitForm from '@/components/avis-debit/CreateAvisDebitForm.vue';
import ListAvisDebit from '@/components/avis-debit/ListAvisDebit.vue';

const router = useRouter();
const route = useRoute();

const tabs = [
  { id: 'creer', label: 'Ajouter un avis' },
  { id: 'consulter', label: 'Consulter les avis' }
];

const goToConsulter = () => {
  router.push({ query: { ...route.query, tab: 'consulter' } });
};
</script>
