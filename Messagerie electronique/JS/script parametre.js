      // Sélection des éléments
      const darkModeToggle = document.getElementById('darkModeToggle');
      const highContrastToggle = document.getElementById('highContrastToggle');
      const reduceMotionToggle = document.getElementById('reduceMotionToggle');
      const screenReaderToggle = document.getElementById('screenReaderToggle');
      const fontSizeSlider = document.getElementById('fontSizeSlider');
      const settingsSections = document.querySelectorAll('.settings-section');
      const toast = document.getElementById('toast');

      // Gestion du mode sombre
      darkModeToggle.addEventListener('change', () => {
          document.body.classList.toggle('dark', darkModeToggle.checked);
          showToast(darkModeToggle.checked ? 'Mode sombre activé' : 'Mode sombre désactivé');
      });

      // Gestion des sections accordéon
      settingsSections.forEach(section => {
          const header = section.querySelector('.settings-header');
          header.addEventListener('click', () => {
              section.classList.toggle('active');
          });
      });

      // Gestion de la taille de la police
      fontSizeSlider.addEventListener('input', (e) => {
          const sizes = {
              '1': '14px',
              '2': '15px',
              '3': '16px',
              '4': '17px',
              '5': '18px'
          };
          document.body.style.fontSize = sizes[e.target.value];
      });

      // Gestion du contraste élevé
      highContrastToggle.addEventListener('change', () => {
          document.body.classList.toggle('high-contrast', highContrastToggle.checked);
          showToast(highContrastToggle.checked ? 'Contraste élevé activé' : 'Contraste élevé désactivé');
      });

      // Gestion des animations réduites
      reduceMotionToggle.addEventListener('change', () => {
          document.body.classList.toggle('reduce-motion', reduceMotionToggle.checked);
          showToast(reduceMotionToggle.checked ? 'Animations réduites activées' : 'Animations réduites désactivées');
      });

      // Gestion du lecteur d'écran
      screenReaderToggle.addEventListener('change', () => {
          showToast(screenReaderToggle.checked ? 'Lecteur d\'écran activé' : 'Lecteur d\'écran désactivé');
      });

      // Gestion des boutons de sécurité
      document.getElementById('setup2fa').addEventListener('click', () => {
          showToast('Configuration de l\'authentification à deux facteurs...');
      });

      document.getElementById('changePassword').addEventListener('click', () => {
          showToast('Changement de mot de passe...');
      });

      // Fonction d'affichage du toast
      function showToast(message) {
          toast.textContent = message;
          toast.classList.add('show');
          
          setTimeout(() => {
              toast.classList.remove('show');
          }, 3000);
      }

      // Activation de la première section par défaut
      settingsSections[0].classList.add('active');

      // Détection du mode sombre système
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          darkModeToggle.checked = true;
          document.body.classList.add('dark');
      }

         // Nouveaux gestionnaires d'événements pour la section sécurité
    document.getElementById('autoLockToggle').addEventListener('change', (e) => {
        showToast(e.target.checked ? 'Verrouillage automatique activé' : 'Verrouillage automatique désactivé');
    });

    document.getElementById('loginNotificationsToggle').addEventListener('change', (e) => {
        showToast(e.target.checked ? 'Notifications de connexion activées' : 'Notifications de connexion désactivées');
    });

    document.getElementById('manageDevices').addEventListener('click', () => {
        showToast('Gestion des appareils connectés...');
    });

    document.getElementById('viewHistory').addEventListener('click', () => {
        showToast('Consultation de l\'historique des connexions...');
    });

    document.getElementById('backupCodes').addEventListener('click', () => {
        showToast('Génération des codes de récupération...');
    });

    document.getElementById('securityAudit').addEventListener('click', () => {
        showToast('Lancement de l\'audit de sécurité...');
    });

    document.getElementById('revokeAccess').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir révoquer tous les accès ? Cette action déconnectera tous vos appareils.')) {
            showToast('Révocation de tous les accès en cours...');
        }
    });

    // Simulation de changement du niveau de sécurité
    function updateSecurityLevel() {
        const progress = document.querySelector('.security-progress');
        const score = document.querySelector('.security-score');
        let currentScore = 75;

        document.getElementById('autoLockToggle').addEventListener('change', (e) => {
            currentScore = e.target.checked ? Math.min(currentScore + 10, 100) : Math.max(currentScore - 10, 0);
            progress.style.width = `${currentScore}%`;
            score.textContent = `${currentScore}%`;
        });

        document.getElementById('loginNotificationsToggle').addEventListener('change', (e) => {
            currentScore = e.target.checked ? Math.min(currentScore + 5, 100) : Math.max(currentScore - 5, 0);
            progress.style.width = `${currentScore}%`;
            score.textContent = `${currentScore}%`;
        });
    }

    updateSecurityLevel();