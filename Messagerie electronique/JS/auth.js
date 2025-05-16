// JS/auth.js
class AuthService {
  constructor() {
    this.API_URL = 'http://localhost:8080/api/auth';
    this.TOKEN_KEY = 'auth-token';
    this.REFRESH_TOKEN_KEY = 'auth-refresh-token';
    this.USER_KEY = 'auth-user';
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Échec de la connexion');
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      this.setUser(data);
      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  async register(username, email, password) {
    try {
      const response = await fetch(`${this.API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Échec de l\'inscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await fetch(`${this.API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      this.clearSession();
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh token absent');
      }

      const response = await fetch(`${this.API_URL}/refreshtoken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearSession();
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error);
      throw error;
    }
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  setTokens(token, refreshToken) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

// Exporter le service d'authentification comme singleton
const authService = new AuthService();
export default authService;