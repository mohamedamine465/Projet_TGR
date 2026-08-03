<template>
  <div class="dashboard-layout">
    <Sidebar v-if="user" />
    
    <div class="main-workspace">
      <header class="dashboard-header">
        <div class="user-info" v-if="user">
          <span class="user-name">{{ user.prenom }} {{ user.nom }}</span>
          <span class="user-role">{{ user.typeUtilisateur?.libelleType }}</span>
        </div>
        <button @click="logout" class="btn-logout">Se déconnecter</button>
      </header>
      
      <main class="dashboard-content">
        <router-view v-if="user"></router-view>
        <div v-else class="loading">
          Chargement de l'environnement de travail...
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex: 1; /* S'étend sous la TopBar */
  height: calc(100vh - 80px); /* 80px = hauteur approximative de la TopBar */
  background-color: #f1f5f9;
}

.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 20px;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.8rem;
  color: #64748b;
}

.btn-logout {
  padding: 6px 12px;
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: #fee2e2;
}

.dashboard-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #64748b;
}
</style>
