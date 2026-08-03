<template>
  <TabsLayout 
    title="Encaissement des Avances (Approvisionnements)" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Saisir un nouvel encaissement</h3>
      <CreateApprovisionnementForm @created="goToConsulter" />
    </template>
    
    <template #consulter>
      <h3>Liste des encaissements reçus</h3>
      <ListApprovisionnement />
    </template>
  </TabsLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import TabsLayout from '@/components/common/TabsLayout.vue';
import CreateApprovisionnementForm from '@/components/programme-meda/approvisionnement/CreateApprovisionnementForm.vue';
import ListApprovisionnement from '@/components/programme-meda/approvisionnement/ListApprovisionnement.vue';

const router = useRouter();
const route = useRoute();

const tabs = [
  { id: 'creer', label: 'Ajouter une avance' },
  { id: 'consulter', label: 'Consulter les avances' }
];

const goToConsulter = () => {
  router.push({ query: { ...route.query, tab: 'consulter' } });
};
</script>
