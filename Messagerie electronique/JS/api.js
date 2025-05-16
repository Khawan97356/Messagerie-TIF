// api.js - Gestionnaire centralisé des appels API

import authService from './auth.js';

class ApiService {
  constructor() {
    this.API_URL = 'http://localhost:3000/api';
  }

  // Méthode pour obtenir les en-têtes avec authentification
  getHeaders(requireAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (requireAuth) {
      const authHeaders = authService.authHeader();
      Object.assign(headers, authHeaders);
    }

    return headers;
  }

  // Méthode fetch avec gestion automatique des tokens
  async fetchWithAuth(endpoint, options = {}) {
    const { requireAuth = true, ...fetchOptions } = options;
    
    // Ajouter les en-têtes d'authentification si nécessaire
    const headers = this.getHeaders(requireAuth);
    const requestOptions = {
      ...fetchOptions,
      headers: { ...headers, ...fetchOptions.headers }
    };

    try {
      let response = await fetch(`${this.API_URL}${endpoint}`, requestOptions);
      
      // Si la réponse est 401 (non autorisé), essayer de rafraîchir le token
      if (response.status === 401 && requireAuth) {
        // Token invalide ou expiré -> rediriger vers la page de connexion
        authService.clearAuth();
        window.location.href = '/HTML/page connexion.html';
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      if (responses.status === 403) {
        // L'utilisateur n'a pas les permissions nécessaires
        throw new Error('Vous n\'avez pas les permissions necessaires pour cette action');
      }
      
      // Traiter la réponse
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Méthodes d'API simplifiées
  async get(endpoint, requireAuth = true) {
    return this.fetchWithAuth(endpoint, { method: 'GET', requireAuth });
  }

  async post(endpoint, data, requireAuth = true) {
    return this.fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth
    });
  }

  async put(endpoint, data, requireAuth = true) {
    return this.fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth
    });
  }

  async delete(endpoint, requireAuth = true) {
    return this.fetchWithAuth(endpoint, { method: 'DELETE', requireAuth });
  }
}

// Exporter une instance unique du service API
const apiService = new ApiService();
export default apiService;