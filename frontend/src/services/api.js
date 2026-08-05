import axios from 'axios';
import router from '@/router';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  // Très important: permet d'envoyer/recevoir les cookies (comme le refreshToken)
  withCredentials: true 
});

// Pour Cypress (E2E testing), on permet de lire le token depuis le localStorage
// En production, on utilise uniquement la mémoire (faille XSS)
let memoryToken = window.Cypress ? localStorage.getItem('access_token') : null;

export const setApiToken = (token) => {
  memoryToken = token;
};

export const clearApiToken = () => {
  memoryToken = null;
};

// Intercepteur pour ajouter le Token (Access Token) à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = memoryToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur pour gérer les erreurs 401 (Token expiré)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 et qu'on n'a pas déjà essayé de rafraîchir
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      // Ne pas intercepter les erreurs 401 sur la route de login ou de refresh !
      if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/refresh-token') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenter de rafraîchir le token via le cookie HttpOnly
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const res = await axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        
        if (res.data && res.data.data && res.data.data.token) {
          const newToken = res.data.data.token;
          setApiToken(newToken);
          
          // Rejouer la requête d'origine avec le nouveau token
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Si le rafraîchissement échoue (Refresh Token expiré ou invalide), on déconnecte
        console.error("Échec du rafraîchissement. Déconnexion forçée.");
        clearApiToken();
        router.push({ name: 'login' });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
