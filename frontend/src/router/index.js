import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dette-tresor/prets',
          name: 'prets',
          component: () => import('@/views/dette-tresor/PretsView.vue')
        },
        {
          path: 'dette-tresor/avis-credits',
          name: 'avis-credits',
          component: () => import('@/views/dette-tresor/AvisCreditView.vue')
        },
        {
          path: 'dette-tresor/ordres-paiement',
          name: 'ordres-paiement',
          component: () => import('@/views/dette-tresor/OrdrePaiementView.vue')
        },
        {
          path: 'admin/utilisateurs',
          name: 'admin-users',
          component: () => import('@/views/AdminView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'dette-tresor/avis-debits',
          name: 'avis-debits',
          component: () => import('@/views/dette-tresor/AvisDebitView.vue')
        },
        {
          path: 'programme-meda/projets',
          name: 'projets',
          component: () => import('@/views/programme-meda/ProjetsView.vue')
        },
        {
          path: 'programme-meda/approvisionnements',
          name: 'approvisionnements',
          component: () => import('@/views/programme-meda/ApprovisionnementView.vue')
        },
        {
          path: 'programme-meda/avis-operations',
          name: 'avis-operations',
          component: () => import('@/views/programme-meda/AvisOperationView.vue')
        }
      ]
    }
  ]
});

// Guard global pour vérifier l'authentification
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  
  // Si connecté mais l'objet user est vide, on va le chercher
  if (authStore.isAuthenticated && !authStore.user) {
      await authStore.fetchUser();
  }

  // Si la route requiert d'être connecté
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  } 
  
  // Si la route requiert d'être administrateur
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (authStore.user?.typeUtilisateur?.libelleType !== 'Administrateur') {
      // Redirige vers l'accueil si l'utilisateur n'est pas Admin
      return { name: 'home' };
    }
  }

  // Si l'utilisateur est déjà connecté et tente d'aller sur login
  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' };
  } 
});

export default router;
