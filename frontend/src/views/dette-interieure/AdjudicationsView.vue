<template>
  <TabsLayout 
    title="Gestion des Adjudications" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'une nouvelle adjudication</h3>
      <AdjudicationForm />
    </template>
    
    <template #consulter>
      <ListAdjudications />
    </template>
  </TabsLayout>
</template>

<script setup>
import TabsLayout from '@/components/common/TabsLayout.vue';
import AdjudicationForm from '@/components/dette-interieure/AdjudicationForm.vue';
import ListAdjudications from '@/components/dette-interieure/ListAdjudications.vue';

const tabs = [
  { id: 'creer', label: 'Créer Adjudication' },
  { id: 'consulter', label: 'Consulter les Adjudications' }
];
</script>


