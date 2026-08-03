<template>
  <TabsLayout 
    title="Gestion des Prêts" 
    :tabs="tabs" 
    default-tab="creer"
  >
    <template #creer>
      <h3>Création d'un nouveau contrat de prêt</h3>
      <CreatePretForm />
    </template>
    
    <template #echeancier>
      <h3>Ajouter un échéancier</h3>
      <AddEcheancierForm />
    </template>
    
    <template #consulter>
      <h3>Liste des contrats de prêts</h3>
      <ListPret />
    </template>
    
    <template #param>
      <h3>Paramétrage du module</h3>
      <ParametragePret />
    </template>
  </TabsLayout>
</template>

<script setup>
import TabsLayout from '@/components/common/TabsLayout.vue';
import CreatePretForm from '@/components/prets/CreatePretForm.vue';
import ListPret from '@/components/prets/ListPret.vue';
import AddEcheancierForm from '@/components/prets/AddEcheancierForm.vue';
import ParametragePret from '@/components/prets/ParametragePret.vue';

const tabs = [
  { id: 'creer', label: 'Créer prêt' },
  { id: 'echeancier', label: 'Ajouter échéancier' },
  { id: 'consulter', label: 'Consulter les prêts' },
  { id: 'param', label: 'Paramétrage' }
];
</script>
