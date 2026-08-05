<template>
  <TabsLayout 
    title="Gestion des Intérêts" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'un nouvel Intérêt</h3>
      <InteretForm />
    </template>
    
    <template #consulter>
      <ListInterets />
    </template>
  </TabsLayout>
</template>

<script setup>
import TabsLayout from '@/components/common/TabsLayout.vue';
import InteretForm from '@/components/dette-interieure/InteretForm.vue';
import ListInterets from '@/components/dette-interieure/ListInterets.vue';

const tabs = [
  { id: 'creer', label: 'Créer Intérêt' },
  { id: 'consulter', label: 'Consulter Intérêts' }
];
</script>


