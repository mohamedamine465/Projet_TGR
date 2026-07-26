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
      meta: { requiresAuth: true }
    }
  ]
});

// Guard global pour vérifier l'authentification
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Si la route requiert d'être connecté
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } 
  // Si l'utilisateur est déjà connecté et tente d'aller sur login
  else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'home' });
  } 
  else {
    // Si connecté mais l'objet user est vide, on va le chercher
    if (authStore.isAuthenticated && !authStore.user) {
        await authStore.fetchUser();
    }
    next();
  }
});

export default router;
