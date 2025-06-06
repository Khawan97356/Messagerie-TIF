/**
 * Gestionnaire de mode sombre adaptatif
 * - Détecte les préférences système
 * - Bascule automatiquement selon l'heure
 * - Sauvegarde les préférences utilisateur
 */
class DarkModeManager {
    constructor() {
        // Constantes
        this.STORAGE_KEY = 'app_theme_preference';
        this.AUTO_MODE_KEY = 'app_theme_auto_mode';
        
        // États possibles
        this.MODES = {
            LIGHT: 'light',
            DARK: 'dark',
            AUTO: 'auto',
            SYSTEM: 'system'
        };
        
        // Heure par défaut pour le basculement automatique (18h00 - 6h00)
        this.AUTO_DARK_START_HOUR = localStorage.getItem('dark_mode_start_hour') || 18;
        this.AUTO_DARK_END_HOUR = localStorage.getItem('dark_mode_end_hour') || 6;
        
        // Initialisation
        this.init();
        
        // Intégration dans les paramètres
        this.initSettingsIntegration();
    }
    
    /**
     * Initialise le gestionnaire de mode sombre
     */
    init() {
        // Récupération des préférences sauvegardées
        this.currentMode = localStorage.getItem(this.STORAGE_KEY) || this.MODES.SYSTEM;
        this.autoMode = localStorage.getItem(this.AUTO_MODE_KEY) === 'true' || false;
        
        // Configuration des événements
        this.setupEventListeners();
        
        // Application initiale du thème
        this.applyTheme();
        
        // Si mode auto, configuration du timer pour vérifier périodiquement
        if (this.currentMode === this.MODES.AUTO) {
            this.setupAutoModeTimer();
        }
    }
    
    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Écouteur pour les changements de préférence système
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Définir un écouteur pour les changements de préférence
            try {
                // Chrome & Firefox
                mediaQuery.addEventListener('change', () => {
                    if (this.currentMode === this.MODES.SYSTEM) {
                        this.applyTheme();
                    }
                });
            } catch (e) {
                // Safari
                mediaQuery.addListener(() => {
                    if (this.currentMode === this.MODES.SYSTEM) {
                        this.applyTheme();
                    }
                });
            }
        }
    }
    
    /**
     * Applique le thème approprié selon le mode actuel
     */
    applyTheme() {
        let shouldApplyDarkTheme = false;
        
        switch (this.currentMode) {
            case this.MODES.LIGHT:
                shouldApplyDarkTheme = false;
                break;
                
            case this.MODES.DARK:
                shouldApplyDarkTheme = true;
                break;
                
            case this.MODES.AUTO:
                // Vérification de l'heure actuelle
                const currentHour = new Date().getHours();
                shouldApplyDarkTheme = (currentHour >= this.AUTO_DARK_START_HOUR || currentHour < this.AUTO_DARK_END_HOUR);
                break;
                
            case this.MODES.SYSTEM:
            default:
                // Vérification des préférences système
                shouldApplyDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                break;
        }
        
        // Application du thème
        if (shouldApplyDarkTheme) {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
        } else {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
        }
        
        // Mise à jour de l'état UI
        this.updateUIState();
    }
    
    /**
     * Configure le timer pour le mode automatique
     */
    setupAutoModeTimer() {
        // Vérification toutes les minutes si on est en mode automatique
        if (this.autoModeInterval) {
            clearInterval(this.autoModeInterval);
        }
        
        this.autoModeInterval = setInterval(() => {
            if (this.currentMode === this.MODES.AUTO) {
                this.applyTheme();
            }
        }, 60000); // Vérification chaque minute
    }
    
    /**
     * Bascule entre mode clair et sombre
     */
    toggleDarkMode() {
        const isDarkMode = document.documentElement.classList.contains('dark-theme');
        this.setMode(isDarkMode ? this.MODES.LIGHT : this.MODES.DARK);
    }
    
    /**
     * Définit explicitement un mode
     * @param {string} mode - Le mode à définir
     */
    setMode(mode) {
        if (Object.values(this.MODES).includes(mode)) {
            this.currentMode = mode;
            localStorage.setItem(this.STORAGE_KEY, mode);
            
            // Si on passe en mode auto, configurer le timer
            if (mode === this.MODES.AUTO) {
                this.setupAutoModeTimer();
            } else if (this.autoModeInterval) {
                // Sinon, nettoyer le timer s'il existe
                clearInterval(this.autoModeInterval);
            }
            
            // Appliquer le thème
            this.applyTheme();
            
            // Mettre à jour l'interface des paramètres si elle est visible
            this.updateSettingsUI();
        }
    }
    
    /**
     * Met à jour l'état visuel des éléments d'interface
     */
    updateUIState() {
        // Mise à jour des éléments d'interface de paramètres si visibles
        this.updateSettingsUI();
    }
    
    /**
     * Vérifie si le mode sombre est actuellement appliqué
     */
    isDarkModeActive() {
        return document.documentElement.classList.contains('dark-theme');
    }

    /**
     * Intègre les options de thème dans la page de paramètres
     */
    initSettingsIntegration() {
        document.addEventListener('DOMContentLoaded', () => {
            // Attendre un peu pour s'assurer que tout est chargé
            setTimeout(() => {
                // Vérifier si on est sur la page de paramètres
                const isSettingsPage = window.location.href.includes('parametre.html');
                
                if (isSettingsPage) {
                    this.injectThemeSettings();
                } else {
                    // Observer les changements de contenu pour détecter le chargement de la page de paramètres
                    this.observeSettingsLoad();
                }
            }, 300);
        });
    }
    
    /**
     * Observe les changements dans le DOM pour détecter le chargement de la page paramètres
     */
    observeSettingsLoad() {
        // Créer un observateur pour détecter quand la page de paramètres est chargée
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Vérifier si les paramètres sont chargés
                    const settingsContainer = document.querySelector('.settings-container');
                    if (settingsContainer) {
                        this.injectThemeSettings();
                        observer.disconnect(); // Arrêter l'observation une fois les paramètres trouvés
                    }
                }
            });
        });
        
        // Observer les changements dans le corps du document
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    /**
     * Injecte les paramètres de thème dans la page de paramètres
     */
    injectThemeSettings() {
        // Rechercher le conteneur des paramètres
        const settingsContainer = document.querySelector('.settings-container, main, .settings-section');
        
        if (!settingsContainer) {
            console.warn('Conteneur de paramètres non trouvé');
            return;
        }
        
        // Créer la section des paramètres de thème
        const themeSection = document.createElement('div');
        themeSection.className = 'settings-section theme-settings-section';
        themeSection.innerHTML = `
            <h3 class="settings-section-title">
                <i class="bx bx-palette"></i>
                Thème d'affichage
            </h3>
            <div class="settings-section-content">
                <div class="theme-options">
                    <div class="theme-option-row">
                        <button class="theme-btn ${this.currentMode === this.MODES.LIGHT ? 'active' : ''}" data-mode="light">
                            <i class="bx bx-sun"></i>
                            <span>Mode clair</span>
                        </button>
                        
                        <button class="theme-btn ${this.currentMode === this.MODES.DARK ? 'active' : ''}" data-mode="dark">
                            <i class="bx bx-moon"></i>
                            <span>Mode sombre</span>
                        </button>
                    </div>
                    
                    <div class="theme-option-row">
                        <button class="theme-btn ${this.currentMode === this.MODES.SYSTEM ? 'active' : ''}" data-mode="system">
                            <i class="bx bx-desktop"></i>
                            <span>Préférence système</span>
                        </button>
                        
                        <button class="theme-btn ${this.currentMode === this.MODES.AUTO ? 'active' : ''}" data-mode="auto">
                            <i class="bx bx-time"></i>
                            <span>Mode automatique</span>
                        </button>
                    </div>
                </div>
                
                <div class="auto-mode-settings" style="display: ${this.currentMode === this.MODES.AUTO ? 'block' : 'none'}">
                    <h4>Réglages du mode automatique</h4>
                    <div class="time-settings">
                        <div class="time-setting">
                            <label for="dark-mode-start">Activer le mode sombre à</label>
                            <input type="time" id="dark-mode-start" value="${this.formatHourForInput(this.AUTO_DARK_START_HOUR)}">
                        </div>
                        
                        <div class="time-setting">
                            <label for="dark-mode-end">Désactiver le mode sombre à</label>
                            <input type="time" id="dark-mode-end" value="${this.formatHourForInput(this.AUTO_DARK_END_HOUR)}">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter au début ou à un endroit approprié dans les paramètres
        const firstSection = settingsContainer.querySelector('.settings-section');
        if (firstSection) {
            settingsContainer.insertBefore(themeSection, firstSection);
        } else {
            settingsContainer.appendChild(themeSection);
        }
        
        // Configurer les événements
        this.setupSettingsEvents(themeSection);
    }
    
    /**
     * Configure les événements pour les contrôles de thème dans les paramètres
     */
    setupSettingsEvents(themeSection) {
        // Boutons de mode
        const themeBtns = themeSection.querySelectorAll('.theme-btn');
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                this.setMode(mode);
            });
        });
        
        // Inputs d'heure pour le mode automatique
        const startTimeInput = themeSection.querySelector('#dark-mode-start');
        const endTimeInput = themeSection.querySelector('#dark-mode-end');
        
        if (startTimeInput && endTimeInput) {
            // Écouteurs pour sauvegarder les changements
            startTimeInput.addEventListener('change', () => {
                const [hours] = startTimeInput.value.split(':');
                this.AUTO_DARK_START_HOUR = parseInt(hours, 10);
                localStorage.setItem('dark_mode_start_hour', this.AUTO_DARK_START_HOUR);
                if (this.currentMode === this.MODES.AUTO) {
                    this.applyTheme();
                }
            });
            
            endTimeInput.addEventListener('change', () => {
                const [hours] = endTimeInput.value.split(':');
                this.AUTO_DARK_END_HOUR = parseInt(hours, 10);
                localStorage.setItem('dark_mode_end_hour', this.AUTO_DARK_END_HOUR);
                if (this.currentMode === this.MODES.AUTO) {
                    this.applyTheme();
                }
            });
        }
    }
    
    /**
     * Met à jour l'interface des paramètres si elle est visible
     */
    updateSettingsUI() {
        const themeSection = document.querySelector('.theme-settings-section');
        if (!themeSection) return;
        
        // Mise à jour des boutons actifs
        const themeBtns = themeSection.querySelectorAll('.theme-btn');
        themeBtns.forEach(btn => {
            const mode = btn.getAttribute('data-mode');
            if (mode === this.currentMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Affichage/masquage des paramètres du mode automatique
        const autoSettings = themeSection.querySelector('.auto-mode-settings');
        if (autoSettings) {
            autoSettings.style.display = this.currentMode === this.MODES.AUTO ? 'block' : 'none';
        }
    }
    
    /**
     * Formate l'heure pour l'input time
     */
    formatHourForInput(hour) {
        return `${hour.toString().padStart(2, '0')}:00`;
    }
}

// Création de l'instance
const darkModeManager = new DarkModeManager();