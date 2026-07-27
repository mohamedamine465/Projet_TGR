import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dette-tresor/prets',
          name: 'prets',
          component: () => import('../views/dette-tresor/PretsView.vue')
        },
        {
          path: 'dette-tresor/avis-credits',
          name: 'avis-credits',
          component: () => import('../views/dette-tresor/AvisCreditView.vue')
        },
        {
          path: 'admin/utilisateurs',
          name: 'admin-users',
          component: () => import('../views/AdminView.vue')
        }
      ]
    }
  ]
});

// Guard global pour vérifier l'authentification
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  
  // Si la route requiert d'être connecté
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  } 
  // Si l'utilisateur est déjà connecté et tente d'aller sur login
  else if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' };
  } 
  else {
    // Si connecté mais l'objet user est vide, on va le chercher
    if (authStore.isAuthenticated && !authStore.user) {
        await authStore.fetchUser();
    }
  }
});

export default router;
