// JS/script connexion.js
import authService from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Rediriger si déjà connecté
  if (authService.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  // Formulaire de connexion
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Récupérer les données du formulaire
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Afficher un indicateur de chargement
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Connexion en cours...';
      
      try {
        // Tentative de connexion
        await authService.login(email, password);
        
        // Rediriger vers la page d'accueil après connexion réussie
        window.location.href = 'index.html';
      } catch (error) {
        // Afficher l'erreur
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
          errorElement.textContent = error.message || 'Échec de la connexion. Veuillez réessayer.';
          errorElement.style.display = 'block';
        }
      } finally {
        // Restaurer le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Formulaire d'inscription
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Récupérer les données du formulaire
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Vérifier que les mots de passe correspondent
      if (password !== confirmPassword) {
        const errorElement = document.getElementById('register-error');
        if (errorElement) {
          errorElement.textContent = 'Les mots de passe ne correspondent pas.';
          errorElement.style.display = 'block';
        }
        return;
      }
      
      // Afficher un indicateur de chargement
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Inscription en cours...';
      
      try {
        // Tentative d'inscription
        await authService.register(username, email, password);
        
        // Afficher un message de succès
        const successElement = document.getElementById('register-success');
        if (successElement) {
          successElement.textContent = 'Inscription réussie! Vous pouvez maintenant vous connecter.';
          successElement.style.display = 'block';
        }
        
        // Réinitialiser le formulaire
        registerForm.reset();
        
        // Basculer vers le formulaire de connexion si nécessaire
        const loginTab = document.getElementById('login-tab');
        if (loginTab) {
          loginTab.click();
        }
      } catch (error) {
        // Afficher l'erreur
        const errorElement = document.getElementById('register-error');
        if (errorElement) {
          errorElement.textContent = error.message || 'Échec de l\'inscription. Veuillez réessayer.';
          errorElement.style.display = 'block';
        }
      } finally {
        // Restaurer le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});