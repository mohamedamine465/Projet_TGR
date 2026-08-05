import { defineStore } from 'pinia';
import api, { setApiToken, clearApiToken } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null, // Initialisé à null, géré en mémoire via api.js
    firstLoginFlag: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user, // Se base sur user plutôt que token car le token est caché
    mustChangePassword: (state) => state.firstLoginFlag
  },
  
  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password });
        
        // Stocker le token en mémoire uniquement
        this.token = response.data.data.token;
        this.user = response.data.data.user;
        setApiToken(this.token);
        this.firstLoginFlag = false;
        
        return { success: true };
      } catch (error) {
        // Si c'est une erreur 403 à cause de la première connexion
        if (error.response && error.response.status === 403 && error.response.data && error.response.data.errors && error.response.data.errors.first_login) {
           this.firstLoginFlag = true;
           return { success: false, first_login: true, email: error.response.data.errors.email };
        }
        return { success: false, message: error.response?.data?.message || 'Erreur lors de la connexion' };
      }
    },

    async fetchUser() {
      try {
        const response = await api.get('/auth/me');
        this.user = response.data?.data?.user || response.data?.user;
      } catch (error) {
        console.error("Impossible de récupérer l'utilisateur, session invalide.", error);
        await this.logout();
      }
    },
    
    async logout() {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error("Erreur lors de la déconnexion", error);
      } finally {
        this.token = null;
        this.user = null;
        clearApiToken();
      }
    }
  }
});
