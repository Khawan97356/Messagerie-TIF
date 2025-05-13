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


// Gestion du chiffrement
document.getElementById('manageEncryptionKey').addEventListener('click', () => {
    // Afficher une boîte de dialogue pour gérer la clé
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>Gérer la clé de chiffrement</h2>
            <div class="key-info">
                <p>Clé actuelle : ********-****-****-********</p>
                <p>Date de création : ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" id="generateNewKey">Générer nouvelle clé</button>
                <button class="btn btn-primary" id="closeDialog">Fermer</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    dialog.querySelector('#closeDialog').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });

    dialog.querySelector('#generateNewKey').addEventListener('click', () => {
        // Simulation de génération de nouvelle clé
        showToast('Nouvelle clé générée avec succès');
    });
});

document.getElementById('backupEncryptionKey').addEventListener('click', () => {
    // Simulation d'export de la clé
    const dummyKey = {
        key: "encrypted-key-data",
        createdAt: new Date().toISOString(),
        version: "1.0"
    };

    // Création du fichier à télécharger
    const blob = new Blob([JSON.stringify(dummyKey, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Création du lien de téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = `encryption-key-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Nettoyage
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);

    showToast('Sauvegarde de la clé téléchargée');
});

// Fonction utilitaire pour afficher les messages toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Gestion de la sauvegarde et des données
document.getElementById('backupConversations').addEventListener('click', () => {
    // Création d'une boîte de dialogue pour la sauvegarde
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="backup-dialog">
            <h2>Sauvegarder les conversations</h2>
            <div class="backup-options">
                <div class="backup-option">
                    <input type="checkbox" id="backupMedia" checked>
                    <label for="backupMedia">Inclure les médias</label>
                </div>
                <div class="backup-option">
                    <input type="checkbox" id="backupEncrypted" checked>
                    <label for="backupEncrypted">Chiffrer la sauvegarde</label>
                </div>
                <div class="backup-option">
                    <input type="checkbox" id="backupCloud">
                    <label for="backupCloud">Sauvegarder dans le cloud</label>
                </div>
            </div>
            <div class="backup-status" id="backupStatus">
                Prêt à lancer la sauvegarde
            </div>
            <div class="backup-progress">
                <div class="backup-progress-bar" id="backupProgressBar"></div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" id="cancelBackup">Annuler</button>
                <button class="btn btn-primary" id="startBackup">Commencer</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    // Gestion des boutons de la boîte de dialogue
    dialog.querySelector('#cancelBackup').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });

    dialog.querySelector('#startBackup').addEventListener('click', () => {
        const includeMedia = dialog.querySelector('#backupMedia').checked;
        const encryptBackup = dialog.querySelector('#backupEncrypted').checked;
        const cloudBackup = dialog.querySelector('#backupCloud').checked;
        
        const statusEl = dialog.querySelector('#backupStatus');
        const progressBar = dialog.querySelector('#backupProgressBar');
        
        // Simulation de progression
        statusEl.textContent = 'Sauvegarde en cours...';
        
        let progress = 0;
        const backupInterval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(backupInterval);
                statusEl.textContent = 'Sauvegarde terminée avec succès!';
                
                setTimeout(() => {
                    dialog.close();
                    dialog.remove();
                    showToast('Sauvegarde des conversations terminée');
                }, 1500);
            }
        }, 200);
    });
});

document.getElementById('exportHistory').addEventListener('click', () => {
    // Création d'une boîte de dialogue pour l'exportation
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="backup-dialog">
            <h2>Exporter l'historique des conversations</h2>
            <div class="backup-options">
                <div class="backup-option">
                    <label for="exportFormat">Format:</label>
                    <select id="exportFormat" class="settings-select">
                        <option value="json">JSON</option>
                        <option value="html">HTML</option>
                        <option value="txt">Texte brut</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
                <div class="backup-option">
                    <label for="exportPeriod">Période:</label>
                    <select id="exportPeriod" class="settings-select">
                        <option value="all">Tout l'historique</option>
                        <option value="30">30 derniers jours</option>
                        <option value="90">3 derniers mois</option>
                        <option value="365">Dernière année</option>
                    </select>
                </div>
                <div class="backup-option">
                    <input type="checkbox" id="exportMedia" checked>
                    <label for="exportMedia">Inclure les médias</label>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" id="cancelExport">Annuler</button>
                <button class="btn btn-primary" id="startExport">Exporter</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    // Gestion des boutons de la boîte de dialogue
    dialog.querySelector('#cancelExport').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });

    dialog.querySelector('#startExport').addEventListener('click', () => {
        const format = dialog.querySelector('#exportFormat').value;
        const period = dialog.querySelector('#exportPeriod').value;
        const includeMedia = dialog.querySelector('#exportMedia').checked;
        
        // Simulation d'exportation
        setTimeout(() => {
            dialog.close();
            dialog.remove();
            
            // Création du fichier à télécharger
            const dummyData = {
                type: "conversation_export",
                format: format,
                period: period,
                includeMedia: includeMedia,
                timestamp: new Date().toISOString(),
                data: "Ceci est un exemple de données exportées"
            };
            
            const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Création du lien de téléchargement
            const a = document.createElement('a');
            a.href = url;
            a.download = `conversation-export-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            
            // Nettoyage
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
            
            showToast(`Historique exporté au format ${format.toUpperCase()}`);
        }, 1000);
    });
});

// Gestion de la suppression automatique
const autoDeleteToggle = document.getElementById('autoDeleteToggle');
const autoDeleteOptions = document.getElementById('autoDeleteOptions');

autoDeleteToggle.addEventListener('change', () => {
    autoDeleteOptions.style.display = autoDeleteToggle.checked ? 'flex' : 'none';
    showToast(autoDeleteToggle.checked ? 'Suppression automatique activée' : 'Suppression automatique désactivée');
});

document.getElementById('autoDeleteDelay').addEventListener('change', (e) => {
    const days = e.target.value;
    const readableTime = {
        '1': '24 heures',
        '7': '7 jours',
        '30': '30 jours',
        '90': '3 mois',
        '365': '1 an'
    };
    showToast(`Messages seront supprimés après ${readableTime[days]}`);
});

// Gestion des autres boutons de données
document.getElementById('backupSettings').addEventListener('click', () => {
    // Simulation de sauvegarde des paramètres
    const settings = {
        darkMode: document.getElementById('darkModeToggle').checked,
        fontSize: document.getElementById('fontSizeSlider').value,
        highContrast: document.getElementById('highContrastToggle').checked,
        reduceMotion: document.getElementById('reduceMotionToggle').checked,
        autoDelete: document.getElementById('autoDeleteToggle').checked,
        autoDeleteDelay: document.getElementById('autoDeleteDelay').value
    };
    
    // Création du fichier à télécharger
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Création du lien de téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Nettoyage
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    showToast('Paramètres sauvegardés');
});

document.getElementById('restoreData').addEventListener('click', () => {
    // Création d'un input file caché pour sélectionner le fichier de restauration
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    // Appliquer les paramètres restaurés
                    if (settings.darkMode !== undefined) {
                        document.getElementById('darkModeToggle').checked = settings.darkMode;
                        document.body.classList.toggle('dark', settings.darkMode);
                    }
                    if (settings.fontSize !== undefined) {
                        document.getElementById('fontSizeSlider').value = settings.fontSize;
                        const sizes = {
                            '1': '14px',
                            '2': '15px',
                            '3': '16px',
                            '4': '17px',
                            '5': '18px'
                        };
                        document.body.style.fontSize = sizes[settings.fontSize];
                    }
                    if (settings.highContrast !== undefined) {
                        document.getElementById('highContrastToggle').checked = settings.highContrast;
                        document.body.classList.toggle('high-contrast', settings.highContrast);
                    }
                    if (settings.reduceMotion !== undefined) {
                        document.getElementById('reduceMotionToggle').checked = settings.reduceMotion;
                        document.body.classList.toggle('reduce-motion', settings.reduceMotion);
                    }
                    if (settings.autoDelete !== undefined) {
                        document.getElementById('autoDeleteToggle').checked = settings.autoDelete;
                        autoDeleteOptions.style.display = settings.autoDelete ? 'flex' : 'none';
                    }
                    if (settings.autoDeleteDelay !== undefined) {
                        document.getElementById('autoDeleteDelay').value = settings.autoDeleteDelay;
                    }
                    
                    showToast('Paramètres restaurés avec succès');
                } catch (error) {
                    showToast('Erreur lors de la restauration des paramètres');
                    console.error('Erreur de restauration:', error);
                }
            };
            reader.readAsText(file);
        }
    });
    
    input.click();
});

document.getElementById('clearAllData').addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes vos données ? Cette action est irréversible.')) {
        // Simulation de suppression des données
        showToast('Suppression des données en cours...');
        
        setTimeout(() => {
            showToast('Toutes les données ont été effacées');
        }, 2000);
    }
});

// Gestion des paramètres de langue et localisation
document.getElementById('languageSelect').addEventListener('change', (e) => {
    const language = e.target.value;
    const languageNames = {
        'fr': 'Français',
        'en': 'Anglais',
        'es': 'Espagnol',
        'de': 'Allemand',
        'it': 'Italien',
        'pt': 'Portugais',
        'ar': 'Arabe',
        'zh': 'Chinois',
        'ja': 'Japonais',
        'ru': 'Russe'
    };
    showToast(`Langue changée en ${languageNames[language]}`);
    
    // Simulation de changement de langue
    // Dans une application réelle, cela rechargerait les textes
});

document.getElementById('dateFormatSelect').addEventListener('change', (e) => {
    const format = e.target.value;
    const currentDate = new Date();
    let formattedDate = '';
    
    // Formater la date selon le format sélectionné
    switch(format) {
        case 'dd/mm/yyyy':
            formattedDate = `${padZero(currentDate.getDate())}/${padZero(currentDate.getMonth()+1)}/${currentDate.getFullYear()}`;
            break;
        case 'mm/dd/yyyy':
            formattedDate = `${padZero(currentDate.getMonth()+1)}/${padZero(currentDate.getDate())}/${currentDate.getFullYear()}`;
            break;
        case 'yyyy-mm-dd':
            formattedDate = `${currentDate.getFullYear()}-${padZero(currentDate.getMonth()+1)}-${padZero(currentDate.getDate())}`;
            break;
        case 'dd-mm-yyyy':
            formattedDate = `${padZero(currentDate.getDate())}-${padZero(currentDate.getMonth()+1)}-${currentDate.getFullYear()}`;
            break;
        case 'dd.mm.yyyy':
            formattedDate = `${padZero(currentDate.getDate())}.${padZero(currentDate.getMonth()+1)}.${currentDate.getFullYear()}`;
            break;
    }
    
    showToast(`Format de date changé en ${formattedDate}`);
});

document.getElementById('timeFormatSelect').addEventListener('change', (e) => {
    const format = e.target.value;
    const currentDate = new Date();
    let formattedTime = '';
    
    if (format === '24h') {
        formattedTime = `${padZero(currentDate.getHours())}:${padZero(currentDate.getMinutes())}`;
    } else {
        const hours = currentDate.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        formattedTime = `${displayHours}:${padZero(currentDate.getMinutes())} ${ampm}`;
    }
    
    showToast(`Format d'heure changé en ${formattedTime}`);
});

document.getElementById('timezoneSelect').addEventListener('change', (e) => {
    const timezone = e.target.value;
    const timezoneNames = {
        'auto': 'Automatique',
        'Europe/Paris': 'Europe/Paris (UTC+1)',
        'Europe/London': 'Europe/Londres (UTC+0)',
        'America/New_York': 'Amérique/New York (UTC-5)',
        'America/Los_Angeles': 'Amérique/Los Angeles (UTC-8)',
        'Asia/Tokyo': 'Asie/Tokyo (UTC+9)',
        'Australia/Sydney': 'Australie/Sydney (UTC+10)'
    };
    
    showToast(`Fuseau horaire changé en ${timezoneNames[timezone]}`);
});

document.getElementById('firstDaySelect').addEventListener('change', (e) => {
    const firstDay = e.target.value;
    const dayNames = {
        '0': 'Dimanche',
        '1': 'Lundi'
    };
    
    showToast(`Premier jour de la semaine: ${dayNames[firstDay]}`);
});

document.getElementById('numberFormatSelect').addEventListener('change', (e) => {
    const format = e.target.value;
    const exampleNumber = 1234.56;
    let formattedNumber = '';
    
    if (format === 'fr') {
        formattedNumber = '1 234,56';
    } else {
        formattedNumber = '1,234.56';
    }
    
    showToast(`Format numérique changé en ${formattedNumber}`);
});

document.getElementById('autoTranslateToggle').addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Traduction automatique activée' : 'Traduction automatique désactivée');
});

document.getElementById('configureLanguages').addEventListener('click', () => {
    // Création d'une boîte de dialogue pour configurer les langues
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content language-dialog">
            <h2>Configurer les langues de traduction</h2>
            <div class="language-options">
                <div class="language-option">
                    <input type="checkbox" id="lang_fr" checked>
                    <label for="lang_fr">Français</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_en" checked>
                    <label for="lang_en">Anglais</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_es">
                    <label for="lang_es">Espagnol</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_de">
                    <label for="lang_de">Allemand</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_it">
                    <label for="lang_it">Italien</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_pt">
                    <label for="lang_pt">Portugais</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_ar">
                    <label for="lang_ar">Arabe</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_zh">
                    <label for="lang_zh">Chinois</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_ja">
                    <label for="lang_ja">Japonais</label>
                </div>
                <div class="language-option">
                    <input type="checkbox" id="lang_ru">
                    <label for="lang_ru">Russe</label>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" id="cancelLanguages">Annuler</button>
                <button class="btn btn-primary" id="saveLanguages">Enregistrer</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    // Gestion des boutons de la boîte de dialogue
    dialog.querySelector('#cancelLanguages').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });

    dialog.querySelector('#saveLanguages').addEventListener('click', () => {
        // Récupération des langues sélectionnées
        const selectedLanguages = Array.from(dialog.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.id.replace('lang_', ''));
        
        showToast(`${selectedLanguages.length} langues de traduction configurées`);
        dialog.close();
        dialog.remove();
    });
});

// Fonction utilitaire pour ajouter des zéros devant les nombres < 10
function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

// Gestion des intégrations et applications connectées
document.getElementById('manageApps').addEventListener('click', () => {
    // Création d'une boîte de dialogue pour gérer les applications
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>Applications connectées</h2>
            <div class="apps-list">
                <div class="app-item">
                    <div class="app-details">
                        <div class="app-name">Dropbox Sync</div>
                        <div class="app-permissions">Accès: Fichiers, photos</div>
                        <div class="app-status">Connecté le: 12/04/2023</div>
                    </div>
                    <button class="btn-danger btn-sm" data-app="dropbox">Révoquer</button>
                </div>
                <div class="app-item">
                    <div class="app-details">
                        <div class="app-name">Google Calendar</div>
                        <div class="app-permissions">Accès: Calendrier, contacts</div>
                        <div class="app-status">Connecté le: 05/01/2024</div>
                    </div>
                    <button class="btn-danger btn-sm" data-app="gcal">Révoquer</button>
                </div>
                <div class="app-item">
                    <div class="app-details">
                        <div class="app-name">Slack Notifications</div>
                        <div class="app-permissions">Accès: Notifications</div>
                        <div class="app-status">Connecté le: 23/07/2023</div>
                    </div>
                    <button class="btn-danger btn-sm" data-app="slack">Révoquer</button>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-danger" id="revokeAllApps">Révoquer tout</button>
                <button class="btn btn-primary" id="closeAppsDialog">Fermer</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    // Gestion des boutons de révocation individuels
    dialog.querySelectorAll('.btn-danger.btn-sm').forEach(button => {
        button.addEventListener('click', (e) => {
            const appName = e.target.closest('.app-item').querySelector('.app-name').textContent;
            e.target.closest('.app-item').remove();
            showToast(`Accès révoqué pour "${appName}"`);
        });
    });

    // Gestion du bouton "Révoquer tout"
    dialog.querySelector('#revokeAllApps').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir révoquer l\'accès de toutes les applications ?')) {
            dialog.querySelectorAll('.app-item').forEach(item => item.remove());
            showToast('Accès révoqué pour toutes les applications');
        }
    });

    // Fermeture de la boîte de dialogue
    dialog.querySelector('#closeAppsDialog').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
});

document.getElementById('manageServices').addEventListener('click', () => {
    // Création d'une boîte de dialogue pour gérer les services
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>Services externes connectés</h2>
            <div class="service-list">
                <div class="service-item">
                    <div class="service-icon google-icon"></div>
                    <div class="service-details">
                        <div class="service-name">Google Drive</div>
                        <div class="service-status">Connecté</div>
                        <div class="service-info">Synchronisation automatique activée</div>
                    </div>
                    <div class="service-actions">
                        <button class="btn-secondary btn-sm" id="configureGoogle">Configurer</button>
                        <button class="btn-danger btn-sm" id="disconnectGoogle">Déconnecter</button>
                    </div>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" id="addNewService">Ajouter un service</button>
                <button class="btn btn-primary" id="closeServicesDialog">Fermer</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    // Configuration du service Google
    dialog.querySelector('#configureGoogle').addEventListener('click', () => {
        showToast('Configuration de Google Drive...');
    });

    // Déconnexion du service Google
    dialog.querySelector('#disconnectGoogle').addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment déconnecter Google Drive ?')) {
            dialog.querySelector('.service-item').remove();
            showToast('Google Drive déconnecté');
        }
    });

    // Ajout d'un nouveau service
    dialog.querySelector('#addNewService').addEventListener('click', () => {
        showToast('Ajout d\'un nouveau service...');
    });

    // Fermeture de la boîte de dialogue
    dialog.querySelector('#closeServicesDialog').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
});

document.getElementById('manageAPI').addEventListener('click', () => {
    // Création d'une boîte de dialogue pour gérer l'API
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content">
            <h2>API & Webhooks</h2>
            <div class="api-section">
                <h3>Clés d'API</h3>
                <div class="api-key-item">
                    <div class="api-key-details">
                        <div class="api-key-name">Clé principale</div>
                        <div class="api-key-value">******************************</div>
                        <div class="api-key-created">Créée le: 01/03/2023</div>
                    </div>
                    <div class="api-key-actions">
                        <button class="btn-secondary btn-sm" id="viewKey">Afficher</button>
                        <button class="btn-danger btn-sm" id="revokeKey">Révoquer</button>
                    </div>
                </div>
                <button class="btn btn-secondary" id="generateNewKey">Générer une nouvelle clé</button>
            </div>
            <div class="api-section">
                <h3>Webhooks configurés</h3>
                <div class="webhook-item">
                    <div class="webhook-details">
                        <div class="webhook-url">https://exemple.com/webhook</div>
                        <div class="webhook-events">Événements: messages, connexions</div>
                    </div>
                    <div class="webhook-actions">
                        <button class="btn-secondary btn-sm" id="editWebhook">Modifier</button>
                        <button class="btn-danger btn-sm" id="deleteWebhook">Supprimer</button>
                    </div>
                </div>
                <button class="btn btn-secondary" id="addWebhook">Ajouter un webhook</button>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" id="apiDocumentation">Documentation</button>
                <button class="btn btn-primary" id="closeAPIDialog">Fermer</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    // Affichage de la clé d'API
    dialog.querySelector('#viewKey').addEventListener('click', () => {
        const keyElement = dialog.querySelector('.api-key-value');
        if (keyElement.textContent.includes('*')) {
            keyElement.textContent = 'api_key_' + Math.random().toString(36).substring(2, 15);
        } else {
            keyElement.textContent = '******************************';
        }
    });

    // Révocation de la clé d'API
    dialog.querySelector('#revokeKey').addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir révoquer cette clé d\'API ? Les applications qui l\'utilisent cesseront de fonctionner.')) {
            showToast('Clé d\'API révoquée');
        }
    });

    // Génération d'une nouvelle clé
    dialog.querySelector('#generateNewKey').addEventListener('click', () => {
        showToast('Nouvelle clé d\'API générée');
    });

    // Modification du webhook
    dialog.querySelector('#editWebhook').addEventListener('click', () => {
        showToast('Modification du webhook...');
    });

    // Suppression du webhook
    dialog.querySelector('#deleteWebhook').addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment supprimer ce webhook ?')) {
            dialog.querySelector('.webhook-item').remove();
            showToast('Webhook supprimé');
        }
    });

    // Ajout d'un webhook
    dialog.querySelector('#addWebhook').addEventListener('click', () => {
        showToast('Ajout d\'un nouveau webhook...');
    });

    // Documentation de l'API
    dialog.querySelector('#apiDocumentation').addEventListener('click', () => {
        window.open('https://api.documentation.exemple.com', '_blank');
    });

    // Fermeture de la boîte de dialogue
    dialog.querySelector('#closeAPIDialog').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
});

// Gestion des boutons de connexion rapide
document.querySelectorAll('#connectGoogle, #connectMicrosoft, #connectDropbox, #connectSlack').forEach(button => {
    button.addEventListener('click', (e) => {
        const service = e.target.id.replace('connect', '');
        showToast(`Connexion à ${service} en cours...`);
        
        // Simuler une connexion
        setTimeout(() => {
            showToast(`Connecté avec ${service} avec succès`);
        }, 1500);
    });
});

// Gestion des commutateurs de synchronisation
document.getElementById('googleSyncToggle').addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Synchronisation Google activée' : 'Synchronisation Google désactivée');
});

document.getElementById('microsoftSyncToggle').addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Synchronisation Microsoft activée' : 'Synchronisation Microsoft désactivée');
});

// Gestion du journal d'activité et audit
document.getElementById('viewLoginHistory').addEventListener('click', () => {
    // Création d'une boîte de dialogue pour l'historique de connexion
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content activity-dialog">
            <h2>Historique de connexion</h2>
            <div class="activity-filters">
                <label>
                    Période:
                    <select class="settings-select">
                        <option>7 derniers jours</option>
                        <option>30 derniers jours</option>
                        <option>3 derniers mois</option>
                        <option>Tout l'historique</option>
                    </select>
                </label>
                <label>
                    Appareil:
                    <select class="settings-select">
                        <option>Tous les appareils</option>
                        <option>iPhone</option>
                        <option>MacBook</option>
                        <option>Windows PC</option>
                    </select>
                </label>
            </div>
            <div class="login-history">
                <table class="activity-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Appareil</th>
                            <th>Localisation</th>
                            <th>IP</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>13/05/2024, 14:32</td>
                            <td>iPhone 14</td>
                            <td>Paris, France</td>
                            <td>192.168.1.XX</td>
                            <td class="status-success">Réussi</td>
                        </tr>
                        <tr>
                            <td>12/05/2024, 09:45</td>
                            <td>MacBook Pro</td>
                            <td>Paris, France</td>
                            <td>192.168.1.XX</td>
                            <td class="status-success">Réussi</td>
                        </tr>
                        <tr>
                            <td>10/05/2024, 18:12</td>
                            <td>Windows PC</td>
                            <td>Lyon, France</td>
                            <td>82.45.XX.XX</td>
                            <td class="status-warning">2FA requis</td>
                        </tr>
                        <tr>
                            <td>08/05/2024, 03:27</td>
                            <td>Inconnu</td>
                            <td>Moscou, Russie</td>
                            <td>188.34.XX.XX</td>
                            <td class="status-danger">Bloqué</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" id="exportLoginHistory">Exporter</button>
                <button class="btn btn-primary" id="closeLoginHistoryDialog">Fermer</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    // Exportation de l'historique
    dialog.querySelector('#exportLoginHistory').addEventListener('click', () => {
        showToast('Exportation de l\'historique de connexion...');
        
        // Création du fichier à télécharger
        const dummyData = {
            type: "login_history",
            generated: new Date().toISOString(),
            entries: [
                {date: "2024-05-13T14:32:00", device: "iPhone 14", location: "Paris, France", ip: "192.168.1.XX", status: "success"},
                {date: "2024-05-12T09:45:00", device: "MacBook Pro", location: "Paris, France", ip: "192.168.1.XX", status: "success"},
                {date: "2024-05-10T18:12:00", device: "Windows PC", location: "Lyon, France", ip: "82.45.XX.XX", status: "2fa_required"},
                {date: "2024-05-08T03:27:00", device: "Unknown", location: "Moscow, Russia", ip: "188.34.XX.XX", status: "blocked"}
            ]
        };
        
        const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Création du lien de téléchargement
        const a = document.createElement('a');
        a.href = url;
        a.download = `login-history-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Nettoyage
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    });

    // Fermeture de la boîte de dialogue
    dialog.querySelector('#closeLoginHistoryDialog').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
});

document.getElementById('viewChangeLog').addEventListener('click', () => {
    // Création d'une boîte de dialogue pour le journal des modifications
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <div class="dialog-content activity-dialog">
            <h2>Journal des modifications</h2>
            <div class="activity-filters">
                <label>
                    Type de modification:
                    <select class="settings-select">
                        <option>Toutes les modifications</option>
                        <option>Paramètres de sécurité</option>
                        <option>Informations du compte</option>
                        <option>Intégrations</option>
                    </select>
                </label>
            </div>
            <div class="change-log">
                <div class="change-item">
                    <div class="change-date">12/05/2024, 09:15</div>
                    <div class="change-details">
                        <div class="change-title">Mot de passe modifié</div>
                        <div class="change-info">Appareil: MacBook Pro, IP: 192.168.1.XX</div>
                    </div>
                </div>
                <div class="change-item">
                    <div class="change-date">05/05/2024, 16:22</div>
                    <div class="change-details">
                        <div class="change-title">2FA activé</div>
                        <div class="change-info">Appareil: iPhone 14, IP: 86.76.XX.XX</div>
                    </div>
                </div>
                <div class="change-item">
                    <div class="change-date">28/04/2024, 11:05</div>
                    <div class="change-details">
                        <div class="change-title">Adresse e-mail modifiée</div>
                        <div class="change-info">Appareil: Windows PC, IP: 192.168.1.XX</div>
                    </div>
                </div>
                <div class="change-item">
                    <div class="change-date">15/04/2024, 14:38</div>
                    <div class="change-details">
                        <div class="change-title">Google Drive connecté</div>
                        <div class="change-info">Appareil: MacBook Pro, IP: 192.168.1.XX</div>
                    </div>
                </div>
            </div>
            <div class="dialog-actions">
                <button class="btn btn-secondary" id="exportChangeLog">Exporter</button>
                <button class="btn btn-primary" id="closeChangeLogDialog">Fermer</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();

    // Exportation du journal
    dialog.querySelector('#exportChangeLog').addEventListener('click', () => {
        showToast('Exportation du journal des modifications...');
        
        setTimeout(() => {
            // Téléchargement du fichier
            const a = document.createElement('a');
            a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Journal des modifications');
            a.download = 'changelog.txt';
            a.click();
        }, 1000);
    });

    // Fermeture de la boîte de dialogue
    dialog.querySelector('#closeChangeLogDialog').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
});

document.getElementById('runSecurityAudit').addEventListener('click', () => {
    showToast('Lancement de l\'audit de sécurité...');
    
    // Simulation d'un audit
    setTimeout(() => {
        // Création d'une boîte de dialogue pour les résultats de l'audit
        const dialog = document.createElement('dialog');
        dialog.innerHTML = `
            <div class="dialog-content activity-dialog">
                <h2>Résultats de l'audit de sécurité</h2>
                <div class="audit-summary">
                    <div class="audit-score">
                        <div class="score-circle">
                            <span class="score-value">85</span>
                        </div>
                        <div class="score-label">Score de sécurité</div>
                    </div>
                    <div class="audit-stats">
                        <div class="audit-stat success">
                            <span class="stat-value">6</span>
                            <span class="stat-label">Points validés</span>
                        </div>
                        <div class="audit-stat warning">
                            <span class="stat-value">2</span>
                            <span class="stat-label">Avertissements</span>
                        </div>
                        <div class="audit-stat danger">
                            <span class="stat-value">1</span>
                            <span class="stat-label">Critique</span>
                        </div>
                    </div>
                </div>
                <div class="audit-results">
                    <h3>Problèmes détectés</h3>
                    <div class="audit-item danger">
                        <div class="audit-icon"></div>
                        <div class="audit-text">
                            <div class="audit-title">Mot de passe trop ancien</div>
                            <div class="audit-description">Votre mot de passe n'a pas été changé depuis plus de 3 mois.</div>
                        </div>
                        <button class="btn-primary btn-sm" id="fixPassword">Corriger</button>
                    </div>
                    <div class="audit-item warning">
                        <div class="audit-icon"></div>
                        <div class="audit-text">
                            <div class="audit-title">2FA non activé</div>
                            <div class="audit-description">L'authentification à deux facteurs renforce la sécurité de votre compte.</div>
                        </div>
                        <button class="btn-primary btn-sm" id="setup2FAFromAudit">Activer</button>
                    </div>
                    <div class="audit-item warning">
                        <div class="audit-icon"></div>
                        <div class="audit-text">
                            <div class="audit-title">Appareils non vérifiés</div>
                            <div class="audit-description">Vous avez des appareils connectés qui n'ont pas été vérifiés récemment.</div>
                        </div>
                        <button class="btn-primary btn-sm" id="manageDevicesFromAudit">Gérer</button>
                    </div>
                </div>
                <div class="dialog-actions">
                    <button class="btn btn-secondary" id="downloadAuditReport">Télécharger rapport</button>
                    <button class="btn btn-primary" id="closeAuditDialog">Fermer</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        dialog.showModal();

        // Téléchargement du rapport
        dialog.querySelector('#downloadAuditReport').addEventListener('click', () => {
            showToast('Téléchargement du rapport d\'audit...');
            
            setTimeout(() => {
                // Téléchargement du fichier
                const a = document.createElement('a');
                a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Rapport d\'audit de sécurité');
                a.download = 'security-audit-report.pdf';
                a.click();
            }, 1000);
        });

        // Actions de correction
        dialog.querySelector('#fixPassword').addEventListener('click', () => {
            showToast('Redirection vers la modification du mot de passe...');
            dialog.close();
            dialog.remove();
        });

        dialog.querySelector('#setup2FAFromAudit').addEventListener('click', () => {
            showToast('Redirection vers la configuration de 2FA...');
            dialog.close();
            dialog.remove();
        });

        dialog.querySelector('#manageDevicesFromAudit').addEventListener('click', () => {
            showToast('Redirection vers la gestion des appareils...');
            dialog.close();
            dialog.remove();
        });

        // Fermeture de la boîte de dialogue
        dialog.querySelector('#closeAuditDialog').addEventListener('click', () => {
            dialog.close();
            dialog.remove();
        });
    }, 2000);
});

// Gestion des commutateurs d'activité
document.getElementById('suspiciousActivityToggle').addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Notifications d\'activité suspecte activées' : 'Notifications d\'activité suspecte désactivées');
});

document.getElementById('monthlyReportToggle').addEventListener('change', (e) => {
    showToast(e.target.checked ? 'Rapport d\'activité mensuel activé' : 'Rapport d\'activité mensuel désactivé');
});

// Gestion des actions d'activité
document.getElementById('downloadActivityReport').addEventListener('click', () => {
    showToast('Génération du rapport d\'activité...');
    
    setTimeout(() => {
        // Téléchargement du fichier
        const a = document.createElement('a');
        a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Rapport d\'activité mensuel');
        a.download = 'activity-report.pdf';
        a.click();
        
        showToast('Rapport d\'activité téléchargé');
    }, 1500);
});

document.getElementById('exportAuditLog').addEventListener('click', () => {
    showToast('Exportation du journal d\'audit...');
    
    setTimeout(() => {
        // Téléchargement du fichier
        const a = document.createElement('a');
        a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Journal d\'audit complet');
        a.download = 'audit-log.csv';
        a.click();
        
        showToast('Journal d\'audit exporté');
    }, 1500);
});

document.getElementById('viewMoreActivity').addEventListener('click', () => {
    showToast('Chargement de plus d\'activités...');
});