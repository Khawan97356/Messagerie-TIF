/**
 * Gestionnaire de thème global pour l'application
 * Synchronise le mode sombre entre toutes les pages et permet le mode automatique
 */
class ThemeManager {
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
    }
    
    /**
     * Initialise le gestionnaire de thème
     */
    init() {
        // Récupération des préférences sauvegardées
        this.currentMode = localStorage.getItem(this.STORAGE_KEY) || this.MODES.SYSTEM;
        
        // Configuration des événements
        this.setupEventListeners();
        
        // Application initiale du thème
        this.applyTheme();
        
        // Si mode auto, configuration du timer pour vérifier périodiquement
        if (this.currentMode === this.MODES.AUTO) {
            this.setupAutoModeTimer();
        }
        
        // Synchronisation avec la page des paramètres
        this.syncWithSettingsPage();
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
        
        // Application du thème global à la racine du document
        if (shouldApplyDarkTheme) {
            document.documentElement.classList.add('dark-theme');
            document.body.classList.add('dark'); // Pour la compatibilité avec le CSS existant
        } else {
            document.documentElement.classList.remove('dark-theme');
            document.body.classList.remove('dark');
        }
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
            
            // Synchroniser avec la page des paramètres
            this.syncWithSettingsPage();
        }
    }
    
    /**
     * Synchronise l'état du toggle dans la page des paramètres
     */
    syncWithSettingsPage() {
        // Si on est sur la page des paramètres
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            // Mettre à jour l'état du toggle selon le mode actuel
            const isDarkMode = document.documentElement.classList.contains('dark-theme');
            darkModeToggle.checked = isDarkMode;
            
            // Ajouter un écouteur pour synchroniser les changements
            darkModeToggle.addEventListener('change', () => {
                this.setMode(darkModeToggle.checked ? this.MODES.DARK : this.MODES.LIGHT);
            });
        }
    }
    
    /**
     * Configure les heures de basculement pour le mode automatique
     */
    setAutoHours(startHour, endHour) {
        this.AUTO_DARK_START_HOUR = parseInt(startHour, 10);
        this.AUTO_DARK_END_HOUR = parseInt(endHour, 10);
        
        localStorage.setItem('dark_mode_start_hour', this.AUTO_DARK_START_HOUR);
        localStorage.setItem('dark_mode_end_hour', this.AUTO_DARK_END_HOUR);
        
        if (this.currentMode === this.MODES.AUTO) {
            this.applyTheme();
        }
    }
    
    /**
     * Vérifie si le mode sombre est actuellement appliqué
     */
    isDarkModeActive() {
        return document.documentElement.classList.contains('dark-theme');
    }
}

// Création de l'instance globale
const themeManager = new ThemeManager();

// Pour permettre l'accès depuis d'autres scripts
window.themeManager = themeManager;