/**
 * Module de gestion des widgets pour écran d'accueil
 */
const WidgetsManager = (function() {
    // Liste des widgets actifs
    let activeWidgets = [
        {
            id: 'recent-conversations',
            name: 'Conversations récentes',
            icon: 'bx-chat',
            size: 'medium', // small, medium, large
            position: 'middle-center',
            refreshRate: 300, // secondes
            theme: 'light',
            accentColor: '#4285F4',
            content: {
                showUnread: true,
                maxItems: 5,
                showLastMessage: true,
                groupConversations: false
            }
        },
        {
            id: 'calendar',
            name: 'Calendrier',
            icon: 'bx-calendar',
            size: 'medium',
            position: 'top-right',
            refreshRate: 600,
            theme: 'light',
            accentColor: '#34A853',
            content: {
                showAllDayEvents: true,
                timeRange: 'week',
                defaultView: 'day',
                showReminders: true
            }
        },
        {
            id: 'tasks',
            name: 'Tâches à faire',
            icon: 'bx-task',
            size: 'small',
            position: 'bottom-left',
            refreshRate: 900,
            theme: 'light',
            accentColor: '#EA4335',
            content: {
                showCompleted: false,
                sortBy: 'dueDate',
                groupByProject: true,
                showPriority: true
            }
        }
    ];
    
    // Liste des widgets disponibles dans la galerie
    let availableWidgets = [
        {
            id: 'recent-files',
            name: 'Fichiers récents',
            icon: 'bx-file',
            description: 'Affiche vos fichiers récemment consultés',
            defaultSize: 'medium',
            defaultRefreshRate: 600
        },
        {
            id: 'saved-messages',
            name: 'Messages enregistrés',
            icon: 'bx-bookmark',
            description: 'Accédez rapidement à vos messages enregistrés',
            defaultSize: 'medium',
            defaultRefreshRate: 300
        },
        {
            id: 'activity-stats',
            name: 'Statistiques d\'activité',
            icon: 'bx-chart',
            description: 'Visualisez votre activité de messagerie',
            defaultSize: 'medium',
            defaultRefreshRate: 3600
        },
        {
            id: 'news-feed',
            name: 'Flux d\'actualité',
            icon: 'bx-news',
            description: 'Restez informé des dernières actualités',
            defaultSize: 'large',
            defaultRefreshRate: 1800
        },
        {
            id: 'pomodoro',
            name: 'Minuteur Pomodoro',
            icon: 'bx-timer',
            description: 'Gérez votre temps avec la technique Pomodoro',
            defaultSize: 'small',
            defaultRefreshRate: 60
        }
    ];
    
    // Préférences globales pour les widgets
    let widgetPreferences = {
        enableWidgets: true,
        defaultTheme: 'system', // light, dark, system
        defaultRefreshRate: 300,
        notificationsEnabled: true,
        maxActiveWidgets: 8
    };
    
    // Widget en cours de personnalisation
    let currentCustomization = null;
    
    /**
     * Initialise le gestionnaire de widgets
     */
    function init() {
        console.log('Initialisation du gestionnaire de widgets...');
        
        // Configurer les interactions avec la modale des widgets
        setupWidgetsModalEvents();
        
        // Vérifier si les widgets sont activés
        if (widgetPreferences.enableWidgets) {
            // Dans une implémentation réelle, initialiserait les widgets sur l'écran d'accueil
            console.log('Widgets activés, prêts à être affichés sur l\'écran d\'accueil');
        }
    }
    
    /**
     * Configure les interactions avec la modale des widgets
     */
    function setupWidgetsModalEvents() {
        // Mise à jour de la liste des widgets actifs
        updateActiveWidgetsList();
        
        // Mise à jour de la galerie de widgets
        updateWidgetsGallery();
        
        // Configurer les actions sur les widgets
        setupWidgetActions();
        
        // Configurer la personnalisation des widgets
        setupWidgetCustomization();
    }
    
    /**
     * Met à jour la liste des widgets actifs dans l'interface
     */
    function updateActiveWidgetsList() {
        const widgetsList = document.querySelector('.widgets-list');
        if (!widgetsList) return;
        
        // Vider la liste
        widgetsList.innerHTML = '';
        
        if (activeWidgets.length === 0) {
            widgetsList.innerHTML = '<p class="no-widgets">Aucun widget actif</p>';
            return;
        }
        
        // Créer les éléments pour chaque widget
        activeWidgets.forEach(widget => {
            const widgetItem = document.createElement('div');
            widgetItem.className = 'widget-item';
            widgetItem.innerHTML = `
                <div class="widget-preview">
                    <i class="${widget.icon} widget-icon"></i>
                    <span class="widget-name">${widget.name}</span>
                </div>
                <div class="widget-actions">
                    <button class="edit-widget-btn" data-widget-id="${widget.id}"><i class="bx bx-edit"></i></button>
                    <button class="remove-widget-btn" data-widget-id="${widget.id}"><i class="bx bx-trash"></i></button>
                </div>
            `;
            
            widgetsList.appendChild(widgetItem);
        });
    }
    
    /**
     * Met à jour la galerie de widgets disponibles
     */
    function updateWidgetsGallery() {
        const gallery = document.querySelector('.widgets-gallery');
        if (!gallery) return;
        
        // Vider la galerie
        gallery.innerHTML = '';
        
        if (availableWidgets.length === 0) {
            gallery.innerHTML = '<p class="no-widgets">Aucun widget disponible</p>';
            return;
        }
        
        // Filtrer les widgets déjà actifs
        const activeIds = activeWidgets.map(w => w.id);
        const availableForAdd = availableWidgets.filter(w => !activeIds.includes(w.id));
        
        if (availableForAdd.length === 0) {
            gallery.innerHTML = '<p class="no-widgets">Tous les widgets sont déjà actifs</p>';
            return;
        }
        
        // Créer les éléments pour chaque widget
        availableForAdd.forEach(widget => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'widget-gallery-item';
            galleryItem.innerHTML = `
                <div class="widget-preview">
                    <i class="${widget.icon} widget-icon"></i>
                    <span class="widget-name">${widget.name}</span>
                </div>
                <button class="add-widget-btn" data-widget-id="${widget.id}">Ajouter</button>
            `;
            
            gallery.appendChild(galleryItem);
        });
    }
    
    /**
     * Configure les actions sur les widgets (édition, suppression, ajout)
     */
    function setupWidgetActions() {
        // Écouter les clics sur les boutons d'édition
        document.addEventListener('click', function(e) {
            if (e.target.matches('.edit-widget-btn') || e.target.closest('.edit-widget-btn')) {
                const button = e.target.matches('.edit-widget-btn') ? e.target : e.target.closest('.edit-widget-btn');
                const widgetId = button.getAttribute('data-widget-id');
                
                editWidget(widgetId);
            }
        });
        
        // Écouter les clics sur les boutons de suppression
        document.addEventListener('click', function(e) {
            if (e.target.matches('.remove-widget-btn') || e.target.closest('.remove-widget-btn')) {
                const button = e.target.matches('.remove-widget-btn') ? e.target : e.target.closest('.remove-widget-btn');
                const widgetId = button.getAttribute('data-widget-id');
                
                removeWidget(widgetId);
            }
        });
        
        // Écouter les clics sur les boutons d'ajout
        document.addEventListener('click', function(e) {
            if (e.target.matches('.add-widget-btn') || e.target.closest('.add-widget-btn')) {
                const button = e.target.matches('.add-widget-btn') ? e.target : e.target.closest('.add-widget-btn');
                const widgetId = button.getAttribute('data-widget-id');
                
                addWidget(widgetId);
            }
        });
    }
    
    /**
     * Configure la personnalisation des widgets
     */
    function setupWidgetCustomization() {
        // Sélecteur de widget à personnaliser
        const widgetSelector = document.getElementById('widget-to-customize');
        if (widgetSelector) {
            // Mettre à jour le sélecteur avec les widgets actifs
            updateWidgetSelector(widgetSelector);
            
            // Écouter les changements de sélection
            widgetSelector.addEventListener('change', function() {
                loadWidgetCustomizationSettings(this.value);
            });
        }
        
        // Boutons de taille
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                if (currentCustomization) {
                    currentCustomization.size = this.getAttribute('data-size');
                    updateWidgetPreview();
                }
            });
        });
        
        // Boutons de position
        const positionButtons = document.querySelectorAll('.position-btn');
        positionButtons.forEach(button => {
            button.addEventListener('click', function() {
                positionButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                if (currentCustomization) {
                    currentCustomization.position = this.getAttribute('data-position');
                    updateWidgetPreview();
                }
            });
        });
        
        // Sélecteur de taux de rafraîchissement
        const refreshRateSelect = document.querySelector('.refresh-rate');
        if (refreshRateSelect) {
            refreshRateSelect.addEventListener('change', function() {
                if (currentCustomization) {
                    currentCustomization.refreshRate = parseInt(this.value);
                    updateWidgetPreview();
                }
            });
        }
        
        // Boutons de thème
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.addEventListener('click', function() {
                themeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                if (currentCustomization) {
                    currentCustomization.theme = this.getAttribute('data-theme');
                    updateWidgetPreview();
                }
            });
        });
        
        // Sélecteur de couleur d'accent
        const accentColorInput = document.getElementById('accent-color');
        if (accentColorInput) {
            accentColorInput.addEventListener('change', function() {
                if (currentCustomization) {
                    currentCustomization.accentColor = this.value;
                    updateWidgetPreview();
                }
            });
        }
        
        // Bouton de réinitialisation
        const resetButton = document.querySelector('.reset-defaults');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                resetWidgetToDefaults();
            });
        }
        
        // Bouton d'enregistrement
        const saveButton = document.querySelector('.save-customization');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                saveWidgetCustomization();
            });
        }
    }
    
    /**
     * Met à jour le sélecteur de widgets avec les widgets actifs
     */
    function updateWidgetSelector(selector) {
        // Vider le sélecteur
        selector.innerHTML = '';
        
        // Ajouter une option pour chaque widget actif
        activeWidgets.forEach(widget => {
            const option = document.createElement('option');
            option.value = widget.id;
            option.textContent = widget.name;
            selector.appendChild(option);
        });
        
        // Charger les paramètres du premier widget
        if (activeWidgets.length > 0) {
            loadWidgetCustomizationSettings(activeWidgets[0].id);
        }
    }
    
    /**
     * Charge les paramètres de personnalisation d'un widget
     */
    function loadWidgetCustomizationSettings(widgetId) {
        console.log(`Chargement des paramètres du widget ${widgetId}`);
        
        // Trouver le widget
        const widget = activeWidgets.find(w => w.id === widgetId);
        if (!widget) {
            console.error(`Widget non trouvé: ${widgetId}`);
            return;
        }
        
        // Définir le widget en cours de personnalisation
        currentCustomization = { ...widget };
        
        // Mettre à jour l'interface avec les paramètres du widget
        updateCustomizationUI(widget);
    }
    
    /**
     * Met à jour l'interface de personnalisation avec les paramètres du widget
     */
    function updateCustomizationUI(widget) {
        // Mettre à jour les boutons de taille
        document.querySelectorAll('.size-btn').forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-size') === widget.size);
        });
        
        // Mettre à jour les boutons de position
        document.querySelectorAll('.position-btn').forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-position') === widget.position);
        });
        
        // Mettre à jour le sélecteur de taux de rafraîchissement
        const refreshRateSelect = document.querySelector('.refresh-rate');
        if (refreshRateSelect) {
            refreshRateSelect.value = widget.refreshRate;
        }
        
        // Mettre à jour les boutons de thème
        document.querySelectorAll('.theme-btn').forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-theme') === widget.theme);
        });
        
        // Mettre à jour le sélecteur de couleur d'accent
        const accentColorInput = document.getElementById('accent-color');
        if (accentColorInput) {
            accentColorInput.value = widget.accentColor;
        }
        
        // Mettre à jour l'aperçu
        updateWidgetPreview();
    }
    
    /**
     * Met à jour l'aperçu du widget
     */
    function updateWidgetPreview() {
        if (!currentCustomization) return;
        
        const previewContainer = document.querySelector('.widget-preview-container');
        if (!previewContainer) return;
        
        // Mettre à jour l'aperçu
        const previewPlaceholder = previewContainer.querySelector('.widget-preview-placeholder');
        if (previewPlaceholder) {
            // Appliquer la taille
            previewPlaceholder.className = `widget-preview-placeholder size-${currentCustomization.size}`;
            
            // Appliquer le thème
            previewPlaceholder.setAttribute('data-theme', currentCustomization.theme);
            
            // Appliquer la couleur d'accent
            previewPlaceholder.style.setProperty('--accent-color', currentCustomization.accentColor);
            
            // Mettre à jour le titre
            const titleElement = previewPlaceholder.querySelector('.widget-title');
            if (titleElement) {
                titleElement.textContent = currentCustomization.name;
            }
            
            // Générer un aperçu de contenu selon le type de widget
            const contentElement = previewPlaceholder.querySelector('.widget-content');
            if (contentElement) {
                contentElement.innerHTML = generatePreviewContent(currentCustomization);
            }
        }
    }
    
    /**
     * Génère un contenu d'aperçu pour un widget
     */
    function generatePreviewContent(widget) {
        switch(widget.id) {
            case 'recent-conversations':
                return `
                    <div class="conversation-preview">
                        <img src="https://via.placeholder.com/30" alt="">
                        <div class="convo-details">
                            <span class="convo-name">Jean Dupont</span>
                            <span class="convo-message">Dernier message...</span>
                        </div>
                        <span class="convo-time">10:30</span>
                    </div>
                    <div class="conversation-preview">
                        <img src="https://via.placeholder.com/30" alt="">
                        <div class="convo-details">
                            <span class="convo-name">Marie Martin</span>
                            <span class="convo-message">Dernier message...</span>
                        </div>
                        <span class="convo-time">Hier</span>
                    </div>
                `;
            case 'calendar':
                return `
                    <div class="calendar-preview">
                        <div class="calendar-date">Aujourd'hui</div>
                        <div class="calendar-event">
                            <span class="event-time">14:00</span>
                            <span class="event-title">Réunion d'équipe</span>
                        </div>
                        <div class="calendar-event">
                            <span class="event-time">16:30</span>
                            <span class="event-title">Appel client</span>
                        </div>
                    </div>
                `;
            case 'tasks':
                return `
                    <div class="tasks-preview">
                        <div class="task-item">
                            <input type="checkbox">
                            <span class="task-name">Finaliser le rapport</span>
                        </div>
                        <div class="task-item">
                            <input type="checkbox">
                            <span class="task-name">Préparer la présentation</span>
                        </div>
                        <div class="task-item">
                            <input type="checkbox">
                            <span class="task-name">Envoyer les invitations</span>
                        </div>
                    </div>
                `;
            default:
                return `<div class="preview-placeholder">Aperçu du widget</div>`;
        }
    }
    
    /**
     * Réinitialise le widget aux paramètres par défaut
     */
    function resetWidgetToDefaults() {
        if (!currentCustomization) return;
        
        console.log(`Réinitialisation du widget ${currentCustomization.id} aux paramètres par défaut`);
        
        // Trouver le widget original
        const originalWidget = activeWidgets.find(w => w.id === currentCustomization.id);
        if (!originalWidget) return;
        
        // Copier les paramètres par défaut
        currentCustomization = { ...originalWidget };
        
        // Mettre à jour l'interface
        updateCustomizationUI(currentCustomization);
    }
    
    /**
     * Enregistre les personnalisations du widget
     */
    function saveWidgetCustomization() {
        if (!currentCustomization) return;
        
        console.log(`Enregistrement des personnalisations du widget ${currentCustomization.id}`);
        
        // Trouver l'index du widget
        const index = activeWidgets.findIndex(w => w.id === currentCustomization.id);
        if (index === -1) return;
        
        // Mettre à jour le widget
        activeWidgets[index] = { ...currentCustomization };
        
        // Afficher un message de confirmation
        alert(`Les personnalisations du widget "${currentCustomization.name}" ont été enregistrées.`);
        
        // Dans une implémentation réelle, mettrait à jour le widget sur l'écran d'accueil
    }
    
    /**
     * Édite un widget
     */
    function editWidget(widgetId) {
        console.log(`Édition du widget ${widgetId}`);
        
        // Passer à l'onglet de personnalisation
        const customizeTab = document.querySelector('[data-tab="customize"]');
        if (customizeTab) customizeTab.click();
        
        // Sélectionner le widget dans le sélecteur
        const widgetSelector = document.getElementById('widget-to-customize');
        if (widgetSelector) {
            widgetSelector.value = widgetId;
            
            // Déclencher l'événement change pour charger les paramètres
            const event = new Event('change');
            widgetSelector.dispatchEvent(event);
        }
    }
    
    /**
     * Supprime un widget
     */
    function removeWidget(widgetId) {
        console.log(`Suppression du widget ${widgetId}`);
        
        // Demander confirmation
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce widget ?')) {
            return;
        }
        
        // Trouver l'index du widget
        const index = activeWidgets.findIndex(w => w.id === widgetId);
        if (index === -1) {
            console.error(`Widget non trouvé: ${widgetId}`);
            return;
        }
        
        // Supprimer le widget
        activeWidgets.splice(index, 1);
        
        // Mettre à jour l'interface
        updateActiveWidgetsList();
        updateWidgetsGallery();
        
        // Mettre à jour le sélecteur de widgets
        const widgetSelector = document.getElementById('widget-to-customize');
        if (widgetSelector) {
            updateWidgetSelector(widgetSelector);
        }
        
        // Dans une implémentation réelle, supprimerait le widget de l'écran d'accueil
    }
    
    /**
     * Ajoute un widget
     */
    function addWidget(widgetId) {
        console.log(`Ajout du widget ${widgetId}`);
        
        // Vérifier si le nombre maximum de widgets est atteint
        if (activeWidgets.length >= widgetPreferences.maxActiveWidgets) {
            alert(`Vous ne pouvez pas ajouter plus de ${widgetPreferences.maxActiveWidgets} widgets.`);
            return;
        }
        
        // Trouver le widget dans la liste des disponibles
        const widget = availableWidgets.find(w => w.id === widgetId);
        if (!widget) {
            console.error(`Widget non trouvé: ${widgetId}`);
            return;
        }
        
        // Créer le nouveau widget
        const newWidget = {
            id: widget.id,
            name: widget.name,
            icon: widget.icon,
            size: widget.defaultSize || 'medium',
            position: 'middle-center', // Position par défaut
            refreshRate: widget.defaultRefreshRate || widgetPreferences.defaultRefreshRate,
            theme: widgetPreferences.defaultTheme,
            accentColor: '#4285F4', // Couleur par défaut
            content: {} // Contenu par défaut, à personnaliser selon le type de widget
        };
        
        // Ajouter le widget à la liste des actifs
        activeWidgets.push(newWidget);
        
        // Mettre à jour l'interface
        updateActiveWidgetsList();
        updateWidgetsGallery();
        
        // Mettre à jour le sélecteur de widgets
        const widgetSelector = document.getElementById('widget-to-customize');
        if (widgetSelector) {
            updateWidgetSelector(widgetSelector);
            
            // Sélectionner le nouveau widget
            widgetSelector.value = widget.id;
            
            // Déclencher l'événement change
            const event = new Event('change');
            widgetSelector.dispatchEvent(event);
        }
        
        // Passer à l'onglet de personnalisation
        const customizeTab = document.querySelector('[data-tab="customize"]');
        if (customizeTab) customizeTab.click();
        
        // Dans une implémentation réelle, ajouterait le widget à l'écran d'accueil
    }
    
    // API publique
    return {
        init,
        getActiveWidgets: () => activeWidgets,
        getAvailableWidgets: () => availableWidgets,
        addWidget,
        removeWidget,
        editWidget,
        getPreferences: () => widgetPreferences,
        setPreference: (key, value) => {
            if (widgetPreferences.hasOwnProperty(key)) {
                widgetPreferences[key] = value;
                return true;
            }
            return false;
        }
    };
})();