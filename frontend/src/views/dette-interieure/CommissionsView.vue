<template>
  <TabsLayout 
    title="Gestion des Commissions" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'une nouvelle Commission</h3>
      <CommissionForm />
    </template>
    
    <template #consulter>
      <ListCommissions />
    </template>
  </TabsLayout>
</template>

<script setup>
import TabsLayout from '@/components/common/TabsLayout.vue';
import CommissionForm from '@/components/dette-interieure/CommissionForm.vue';
import ListCommissions from '@/components/dette-interieure/ListCommissions.vue';

const tabs = [
  { id: 'creer', label: 'Créer Commission' },
  { id: 'consulter', label: 'Consulter Commissions' }
];
</script>


