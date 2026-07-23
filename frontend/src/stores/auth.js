import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('access_token') || null,
    firstLoginFlag: false // Gère le cas où l'utilisateur doit changer son mot de passe
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    mustChangePassword: (state) => state.firstLoginFlag
  },
  
  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password });
        
        // Stocker le token
        this.token = response.data.data.token;
        this.user = response.data.data.user;
        localStorage.setItem('access_token', this.token);
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
        this.user = response.data.data.user;
      } catch (error) {
        console.error("Impossible de récupérer l'utilisateur", error);
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
        localStorage.removeItem('access_token');
      }
    }
  }
});
