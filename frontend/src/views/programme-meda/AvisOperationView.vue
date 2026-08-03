<template>
  <TabsLayout 
    title="Emploi des Avances (Justificatifs)" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Saisir une nouvelle pièce justificative</h3>
      <CreateAvisOperationForm @created="goToConsulter" />
    </template>
    
    <template #consulter>
      <h3>Liste des justificatifs de dépenses</h3>
      <ListAvisOperation />
    </template>
  </TabsLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import TabsLayout from '@/components/common/TabsLayout.vue';
import CreateAvisOperationForm from '@/components/programme-meda/avis-operation/CreateAvisOperationForm.vue';
import ListAvisOperation from '@/components/programme-meda/avis-operation/ListAvisOperation.vue';

const router = useRouter();
const route = useRoute();

const tabs = [
  { id: 'creer', label: 'Justifier une dépense' },
  { id: 'consulter', label: 'Consulter les pièces' }
];

const goToConsulter = () => {
  router.push({ query: { ...route.query, tab: 'consulter' } });
};
</script>
