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
          component: () => import('@/views/dette-tresor/PretsView.vue'),
          meta: { requiredProfil: 'Dette du Tresor' }
        },
        {
          path: 'dette-tresor/avis-credits',
          name: 'avis-credits',
          component: () => import('@/views/dette-tresor/AvisCreditView.vue'),
          meta: { requiredProfil: 'Dette du Tresor' }
        },
        {
          path: 'dette-tresor/ordres-paiement',
          name: 'ordres-paiement',
          component: () => import('@/views/dette-tresor/OrdrePaiementView.vue'),
          meta: { requiredProfil: 'Dette du Tresor' }
        },
        {
          path: 'dette-tresor/avis-debits',
          name: 'avis-debits',
          component: () => import('@/views/dette-tresor/AvisDebitView.vue'),
          meta: { requiredProfil: 'Dette du Tresor' }
        },
        {
          path: 'programme-meda/projets',
          name: 'projets',
          component: () => import('@/views/programme-meda/ProjetsView.vue'),
          meta: { requiredProfil: 'Projets' }
        },
        {
          path: 'programme-meda/approvisionnements',
          name: 'approvisionnements',
          component: () => import('@/views/programme-meda/ApprovisionnementView.vue'),
          meta: { requiredProfil: 'Projets' }
        },
        {
          path: 'programme-meda/avis-operations',
          name: 'avis-operations',
          component: () => import('@/views/programme-meda/AvisOperationView.vue'),
          meta: { requiredProfil: 'Projets' }
        },
        {
          path: 'dette-interieure/adjudications',
          name: 'adjudications',
          component: () => import('@/views/dette-interieure/AdjudicationsView.vue'),
          meta: { requiredProfil: 'Dette Interieure' }
        },
        {
          path: 'dette-interieure/bons-equipement',
          name: 'bons-equipement',
          component: () => import('@/views/dette-interieure/BonsEquipementView.vue'),
          meta: { requiredProfil: 'Dette Interieure' }
        },
        {
          path: 'dette-interieure/commissions',
          name: 'commissions-di',
          component: () => import('@/views/dette-interieure/CommissionsView.vue'),
          meta: { requiredProfil: 'Dette Interieure' }
        },
        {
          path: 'dette-interieure/interets',
          name: 'interets-di',
          component: () => import('@/views/dette-interieure/InteretsView.vue'),
          meta: { requiredProfil: 'Dette Interieure' }
        },
        {
          path: 'admin/utilisateurs',
          name: 'admin-users',
          component: () => import('@/views/AdminView.vue'),
          meta: { requiresAdmin: true }
        }
      ]
    }
  ]
});

// Variable globale pour savoir si on a déjà tenté de restaurer la session
let isAppInitialized = false;

// Guard global pour vérifier l'authentification et les profils
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  
  // Au premier chargement de l'application, on tente de restaurer la session via le cookie HttpOnly
  if (!isAppInitialized) {
    try {
      // fetchUser va déclencher un appel API qui, s'il renvoie 401, sera intercepté par api.js
      // L'intercepteur tentera de rafraîchir le token via le cookie
      await authStore.fetchUser();
    } catch (e) {
      // Ignorer l'erreur, l'utilisateur n'est pas connecté
    } finally {
      isAppInitialized = true;
    }
  }

  // Si la route requiert d'être connecté
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  } 
  
  // Si la route requiert d'être administrateur
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (authStore.user?.typeUtilisateur?.libelleType?.toLowerCase() !== 'administrateur') {
      return { name: 'home' };
    }
  }

  // Si la route requiert un profil spécifique
  if (to.meta.requiredProfil) {
    const hasProfil = authStore.user?.profils?.some(p => p.libelleProfil === to.meta.requiredProfil);
    if (!hasProfil) {
      // Redirige vers l'accueil si l'utilisateur n'a pas le profil requis
      return { name: 'home' };
    }
  }

  // Si l'utilisateur est déjà connecté et tente d'aller sur login
  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' };
  } 
});

export default router;
