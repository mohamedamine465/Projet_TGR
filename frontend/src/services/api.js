import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  // Très important: permet d'envoyer/recevoir les cookies (comme le refreshToken)
  withCredentials: true 
});

// Intercepteur pour ajouter le Token (Access Token) à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token via le cookie HttpOnly
        const res = await axios.post('http://localhost:3000/api/auth/refresh-token', {}, { withCredentials: true });
        
        if (res.data && res.data.data && res.data.data.token) {
          const newToken = res.data.data.token;
          localStorage.setItem('access_token', newToken);
          
          // Rejouer la requête d'origine avec le nouveau token
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue (Refresh Token expiré ou invalide), on déconnecte
        console.error("Échec du rafraîchissement. Déconnexion forçée.");
        localStorage.removeItem('access_token');
        window.location.href = '/login'; // Redirection brutale ou on peut utiliser le router
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
