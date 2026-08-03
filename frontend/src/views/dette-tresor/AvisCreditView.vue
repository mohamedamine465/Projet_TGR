<template>
  <TabsLayout 
    title="Gestion des Avis de Crédits" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'un avis de crédit</h3>
      <CreateAvisCreditForm />
    </template>
    
    <template #consulter>
      <h3>Liste des avis de crédits</h3>
      <ListAvisCredit />
    </template>
  </TabsLayout>
</template>

<script setup>
import TabsLayout from '@/components/common/TabsLayout.vue';
import CreateAvisCreditForm from '@/components/avis-credit/CreateAvisCreditForm.vue';
import ListAvisCredit from '@/components/avis-credit/ListAvisCredit.vue';

const tabs = [
  { id: 'creer', label: 'Ajouter un avis de crédit' },
  { id: 'consulter', label: 'Consulter les avis de crédit' }
];
</script>
