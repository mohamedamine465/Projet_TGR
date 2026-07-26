<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h3>Modules</h3>
    </div>
    <ul class="nav-list">
      <li v-if="hasProfil('Dette du trésor')" class="nav-module">
        <div class="module-title">Dette du trésor</div>
        <ul class="sub-nav-list">
          <!-- Prêts avec menu déroulant -->
          <li class="nav-item-container">
            <div class="nav-item" @click="toggleMenu('prets')" :class="{ 'expanded': isExpanded('prets') }">
              <span>Prêts</span>
              <span class="arrow">{{ isExpanded('prets') ? '▼' : '▶' }}</span>
            </div>
            <ul v-show="isExpanded('prets')" class="nested-list">
              <li><router-link to="/dette-tresor/prets?tab=creer" class="nested-item">Créer prêt</router-link></li>
              <li><router-link to="/dette-tresor/prets?tab=echeancier" class="nested-item">Ajouter échéancier</router-link></li>
              <li><router-link to="/dette-tresor/prets?tab=consulter" class="nested-item">Consulter les prêts</router-link></li>
              <li><router-link to="/dette-tresor/prets?tab=param" class="nested-item">Paramétrage</router-link></li>
            </ul>
          </li>

          <!-- Autres sous-modules -->
          <li>
            <router-link to="/dette-tresor/avis-credit" class="nav-item" active-class="active">Avis de crédit</router-link>
          </li>
          <li>
            <router-link to="/dette-tresor/ordres-paiement" class="nav-item" active-class="active">Ordres de paiement</router-link>
          </li>
          <li>
            <router-link to="/dette-tresor/avis-debit" class="nav-item" active-class="active">Avis de débit</router-link>
          </li>
        </ul>
      </li>
      
      <!-- Administration (visible uniquement pour l'admin) -->
      <li v-if="authStore.user?.typeUtilisateur?.libelleType?.toLowerCase().includes('admin')" class="nav-module">
        <div class="module-title">Administration</div>
        <ul class="sub-nav-list">
          <li>
            <router-link to="/admin/utilisateurs" class="nav-item" active-class="active">Utilisateurs</router-link>
          </li>
        </ul>
      </li>

      <!-- D'autres profils au besoin -->
    </ul>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const expandedMenus = ref(['prets']); // 'prets' est ouvert par défaut

const hasProfil = (profilName) => {
  return true; // Simplifié pour le moment
};

const toggleMenu = (menu) => {
  if (expandedMenus.value.includes(menu)) {
    expandedMenus.value = expandedMenus.value.filter(m => m !== menu);
  } else {
    expandedMenus.value.push(menu);
  }
};

const isExpanded = (menu) => expandedMenus.value.includes(menu);
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #475569;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #334155;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
}

.sidebar-header {
  padding: 20px;
  background-color: #334155;
  border-bottom: 1px solid #1e293b;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #ffedd5;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

.nav-module {
  border-bottom: 1px solid #64748b;
  padding: 15px 0;
}

.module-title {
  padding: 0 20px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #cbd5e1;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.sub-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 30px;
  color: #f1f5f9;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #64748b;
  color: #ffffff;
}

.nav-item.active, .nav-item.expanded {
  background-color: #334155;
  color: #ea580c;
  border-left: 3px solid #ea580c;
  font-weight: 600;
}

.arrow {
  font-size: 0.7rem;
  color: #94a3b8;
}

.nested-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #334155; /* Fond plus foncé pour les sous-éléments */
}

.nested-item {
  display: block;
  padding: 8px 20px 8px 45px; /* Décalage vers la droite */
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.nested-item:hover {
  color: #ffffff;
}

/* On utilise la classe injectée par Vue Router quand l'URL correspond exactement ou partiellement via les query (besoin d'astuce si on veut activer via query) */
.router-link-exact-active.nested-item {
  color: #ea580c;
  font-weight: 600;
}
</style>
