<template>
  <TabsLayout 
    title="Gestion des Bons d'Équipement" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'un nouveau Bon d'Équipement</h3>
      <BonEquipementForm />
    </template>
    
    <template #consulter>
      <ListBonsEquipement />
    </template>
  </TabsLayout>
</template>

<script setup>
import TabsLayout from '@/components/common/TabsLayout.vue';
import BonEquipementForm from '@/components/dette-interieure/BonEquipementForm.vue';
import ListBonsEquipement from '@/components/dette-interieure/ListBonsEquipement.vue';

const tabs = [
  { id: 'creer', label: 'Créer Bon' },
  { id: 'consulter', label: 'Consulter les Bons' }
];
</script>


