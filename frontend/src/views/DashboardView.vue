<template>
  <div class="dashboard">
    <header>
      <h1>Tableau de bord TGR</h1>
      <button @click="logout">Se déconnecter</button>
    </header>
    
    <main v-if="user">
      <p>Bienvenue, <strong>{{ user.prenom }} {{ user.nom }}</strong> !</p>
      <p>Rôle: {{ user.typeUtilisateur?.libelleType }}</p>
      
      <h3>Vos profils métiers:</h3>
      <ul>
        <li v-for="profil in user.profils" :key="profil.idProfil">
          {{ profil.libelleProfil }}
        </li>
      </ul>
    </main>
    <div v-else>
      <p>Chargement des données utilisateur...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
</style>
