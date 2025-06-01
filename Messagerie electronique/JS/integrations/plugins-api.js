/**
 * API pour les extensions/plugins tiers
 */
const PluginsAPI = (function() {
    // Liste des plugins installés
    let installedPlugins = [
        {
            id: 'translation',
            name: 'Traduction instantanée',
            description: 'Traduit les messages en temps réel',
            version: '1.0.2',
            author: 'MessageApp Team',
            icon: 'https://via.placeholder.com/40',
            enabled: true,
            permissions: ['messages:read', 'messages:write'],
            settings: {
                defaultLanguage: 'fr',
                autoTranslate: true
            }
        },
        {
            id: 'ai-predictions',
            name: 'Prédictions IA',
            description: 'Suggestions de réponses intelligentes',
            version: '2.1.0',
            author: 'AI Solutions Inc.',
            icon: 'https://via.placeholder.com/40',
            enabled: true,
            permissions: ['messages:read', 'messages:write'],
            settings: {
                suggestionCount: 3,
                enableContextualSuggestions: true
            }
        },
        {
            id: 'conversation-summary',
            name: 'Résumé de conversation',
            description: 'Génère des résumés des discussions longues',
            version: '1.3.5',
            author: 'ProductivityTools',
            icon: 'https://via.placeholder.com/40',
            enabled: false,
            permissions: ['messages:read'],
            settings: {
                summarizeThreshold: 20, // nombre de messages minimum pour proposer un résumé
                includeSentiment: true
            }
        }
    ];
    
    // Liste des plugins disponibles dans la boutique
    let storePlugins = [
        {
            id: 'shared-calendar',
            name: 'Agenda partagé',
            description: 'Planifiez et partagez des événements collectifs',
            version: '1.2.0',
            author: 'CalendarApps',
            icon: 'https://via.placeholder.com/40',
            rating: 4.8,
            installs: '12k+',
            permissions: ['calendar:read', 'calendar:write', 'messages:write'],
            price: 'Gratuit'
        },
        {
            id: 'taskify',
            name: 'Taskify',
            description: 'Transformez les messages en tâches assignables',
            version: '2.0.1',
            author: 'TaskMaster',
            icon: 'https://via.placeholder.com/40',
            rating: 4.6,
            installs: '8k+',
            permissions: ['messages:read', 'messages:write', 'notifications:send'],
            price: 'Gratuit'
        },
        {
            id: 'chat-stats',
            name: 'Statistiques de chat',
            description: 'Analysez l\'activité et les tendances de vos conversations',
            version: '1.5.3',
            author: 'DataViz Solutions',
            icon: 'https://via.placeholder.com/40',
            rating: 4.2,
            installs: '5k+',
            permissions: ['messages:read', 'storage:read'],
            price: 'Gratuit'
        }
    ];
    
    // Configuration globale des plugins
    let pluginSettings = {
        allowMessagesAccess: true,
        startPluginsAtLaunch: true,
        allowAutoUpdates: true,
        shareAnonymousUsage: false,
        developerMode: false
    };
    
    // Événements et écouteurs
    const eventListeners = {
        'message:sent': [],
        'message:received': [],
        'plugin:installed': [],
        'plugin:uninstalled': [],
        'plugin:enabled': [],
        'plugin:disabled': []
    };
    
    /**
     * Initialise l'API des plugins
     */
    function init() {
        console.log('Initialisation de l\'API des plugins...');
        
        // Configurer les interactions avec la modale des plugins
        setupPluginsModalEvents();
        
        // Initialiser les plugins activés
        initializeEnabledPlugins();
        
        // Exposer l'API aux extensions
        exposePluginAPI();
    }
    
    /**
     * Configure les interactions avec la modale des plugins
     */
    function setupPluginsModalEvents() {
        // Mise à jour de la liste des plugins installés
        updateInstalledPluginsList();
        
        // Mise à jour de la liste des plugins du store
        updateStorePluginsList();
        
        // Écouter les changements d'état des plugins
        listenForPluginToggles();
        
        // Configurer les boutons d'installation de plugins
        setupInstallButtons();
        
        // Configurer les boutons de paramètres des plugins
        setupSettingsButtons();
        
        // Configurer les boutons de mode développeur
        setupDeveloperOptions();
    }
    
    /**
     * Met à jour la liste des plugins installés dans l'interface
     */
    function updateInstalledPluginsList() {
        const pluginsList = document.querySelector('.plugins-list');
        if (!pluginsList) return;
        
        // Vider la liste
        pluginsList.innerHTML = '';
        
        if (installedPlugins.length === 0) {
            pluginsList.innerHTML = '<p class="no-plugins">Aucune extension installée</p>';
            return;
        }
        
        // Créer les éléments pour chaque plugin
        installedPlugins.forEach(plugin => {
            const pluginItem = document.createElement('div');
            pluginItem.className = 'plugin-item';
            pluginItem.innerHTML = `
                <img src="${plugin.icon}" alt="${plugin.name}">
                <div class="plugin-details">
                    <h5>${plugin.name}</h5>
                    <span class="plugin-description">${plugin.description}</span>
                </div>
                <div class="plugin-actions">
                    <label class="switch">
                        <input type="checkbox" data-plugin-id="${plugin.id}" ${plugin.enabled ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                    <button class="plugin-settings-btn" data-plugin-id="${plugin.id}"><i class="bx bx-cog"></i></button>
                </div>
            `;
            
            pluginsList.appendChild(pluginItem);
        });
    }
    
    /**
     * Met à jour la liste des plugins disponibles dans le store
     */
    function updateStorePluginsList() {
        const storeList = document.querySelector('.plugins-store-list');
        if (!storeList) return;
        
        // Vider la liste
        storeList.innerHTML = '';
        
        if (storePlugins.length === 0) {
            storeList.innerHTML = '<p class="no-plugins">Aucune extension disponible</p>';
            return;
        }
        
        // Filtrer les plugins déjà installés
        const installedIds = installedPlugins.map(p => p.id);
        const availablePlugins = storePlugins.filter(p => !installedIds.includes(p.id));
        
        if (availablePlugins.length === 0) {
            storeList.innerHTML = '<p class="no-plugins">Vous avez déjà installé toutes les extensions disponibles</p>';
            return;
        }
        
        // Créer les éléments pour chaque plugin
        availablePlugins.forEach(plugin => {
            const pluginItem = document.createElement('div');
            pluginItem.className = 'plugin-store-item';
            pluginItem.innerHTML = `
                <img src="${plugin.icon}" alt="${plugin.name}">
                <div class="plugin-details">
                    <h5>${plugin.name}</h5>
                    <span class="plugin-description">${plugin.description}</span>
                    <div class="plugin-meta">
                        <span class="plugin-rating"><i class="bx bxs-star"></i> ${plugin.rating}</span>
                        <span class="plugin-installs">${plugin.installs} installations</span>
                    </div>
                </div>
                <button class="install-plugin-btn" data-plugin-id="${plugin.id}">Installer</button>
            `;
            
            storeList.appendChild(pluginItem);
        });
    }
    
    /**
     * Écoute les changements d'état des plugins (activer/désactiver)
     */
    function listenForPluginToggles() {
        document.addEventListener('change', function(e) {
            if (e.target.matches('.plugin-item input[type="checkbox"]')) {
                const pluginId = e.target.getAttribute('data-plugin-id');
                const enabled = e.target.checked;
                
                togglePlugin(pluginId, enabled);
            }
        });
        
        // Écouteurs pour les paramètres globaux
        const globalSettings = document.querySelectorAll('.plugin-settings-list .setting-item input[type="checkbox"]');
        globalSettings.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const settingKey = getSettingKeyFromLabel(this.closest('.setting-item').querySelector('span').textContent);
                
                if (settingKey && pluginSettings.hasOwnProperty(settingKey)) {
                    pluginSettings[settingKey] = this.checked;
                    console.log(`Paramètre global mis à jour: ${settingKey} = ${this.checked}`);
                }
            });
        });
    }
    
    /**
     * Obtient la clé de paramètre à partir du libellé affiché
     */
    function getSettingKeyFromLabel(label) {
        const mappings = {
            'Autoriser les extensions à accéder aux messages': 'allowMessagesAccess',
            'Lancer les extensions au démarrage': 'startPluginsAtLaunch',
            'Autoriser les mises à jour automatiques': 'allowAutoUpdates',
            'Partager des statistiques d\'utilisation anonymes': 'shareAnonymousUsage'
        };
        
        return mappings[label] || null;
    }
    
    /**
     * Active ou désactive un plugin
     */
    function togglePlugin(pluginId, enabled) {
        console.log(`${enabled ? 'Activation' : 'Désactivation'} du plugin ${pluginId}`);
        
        // Trouver le plugin
        const plugin = installedPlugins.find(p => p.id === pluginId);
        if (!plugin) {
            console.error(`Plugin non trouvé: ${pluginId}`);
            return;
        }
        
        // Mettre à jour l'état
        plugin.enabled = enabled;
        
        // Si activé, initialiser le plugin
        if (enabled) {
            initializePlugin(plugin);
            triggerEvent('plugin:enabled', { plugin });
        } else {
            uninitializePlugin(plugin);
            triggerEvent('plugin:disabled', { plugin });
        }
    }
    
    /**
     * Configure les boutons d'installation de plugins
     */
    function setupInstallButtons() {
        document.addEventListener('click', function(e) {
            if (e.target.matches('.install-plugin-btn') || e.target.closest('.install-plugin-btn')) {
                const button = e.target.matches('.install-plugin-btn') ? e.target : e.target.closest('.install-plugin-btn');
                const pluginId = button.getAttribute('data-plugin-id');
                
                installPlugin(pluginId, button);
            }
        });
    }
    
    /**
     * Installe un plugin
     */
    function installPlugin(pluginId, buttonElement) {
        console.log(`Installation du plugin ${pluginId}...`);
        
        // Mettre à jour l'apparence du bouton
        buttonElement.textContent = 'Installation...';
        buttonElement.disabled = true;
        
        // Trouver le plugin dans le store
        const storePlugin = storePlugins.find(p => p.id === pluginId);
        if (!storePlugin) {
            console.error(`Plugin non trouvé dans le store: ${pluginId}`);
            return;
        }
        
        // Simuler un délai d'installation
        setTimeout(() => {
            // Créer une copie du plugin pour l'installer
            const newPlugin = {
                id: storePlugin.id,
                name: storePlugin.name,
                description: storePlugin.description,
                version: storePlugin.version,
                author: storePlugin.author,
                icon: storePlugin.icon,
                enabled: true, // Activer par défaut
                permissions: storePlugin.permissions,
                settings: {} // Paramètres par défaut
            };
            
            // Ajouter à la liste des plugins installés
            installedPlugins.push(newPlugin);
            
            // Initialiser le plugin
            initializePlugin(newPlugin);
            
            // Mettre à jour l'interface
            updateInstalledPluginsList();
            updateStorePluginsList();
            
            // Notifier l'installation
            triggerEvent('plugin:installed', { plugin: newPlugin });
            
            // Afficher un message de succès
            alert(`L'extension "${newPlugin.name}" a été installée avec succès !`);
            
            // Passer à l'onglet des plugins installés
            const installedTab = document.querySelector('[data-tab="installed"]');
            if (installedTab) installedTab.click();
        }, 1500);
    }
    
    /**
     * Configure les boutons de paramètres des plugins
     */
    function setupSettingsButtons() {
        document.addEventListener('click', function(e) {
            if (e.target.matches('.plugin-settings-btn') || e.target.closest('.plugin-settings-btn')) {
                const button = e.target.matches('.plugin-settings-btn') ? e.target : e.target.closest('.plugin-settings-btn');
                const pluginId = button.getAttribute('data-plugin-id');
                
                openPluginSettings(pluginId);
            }
        });
    }
    
    /**
     * Ouvre les paramètres d'un plugin
     */
    function openPluginSettings(pluginId) {
        console.log(`Ouverture des paramètres du plugin ${pluginId}`);
        
        // Trouver le plugin
        const plugin = installedPlugins.find(p => p.id === pluginId);
        if (!plugin) {
            console.error(`Plugin non trouvé: ${pluginId}`);
            return;
        }
        
        // Dans une implémentation réelle, ouvrirait une modale avec les paramètres du plugin
        alert(`Paramètres de l'extension "${plugin.name}"\n\nCette fonctionnalité sera implémentée dans une future version.`);
    }
    
    /**
     * Configure les options de développeur
     */
    function setupDeveloperOptions() {
        // Bouton de mode développeur
        const devModeBtn = document.querySelector('.developer-mode-btn');
        if (devModeBtn) {
            devModeBtn.addEventListener('click', function() {
                toggleDeveloperMode();
            });
        }
        
        // Bouton de documentation API
        const apiDocsBtn = document.querySelector('.api-docs-btn');
        if (apiDocsBtn) {
            apiDocsBtn.addEventListener('click', function() {
                openAPIDocs();
            });
        }
        
        // Bouton de création d'extension
        const createPluginBtn = document.querySelector('.create-plugin-btn');
        if (createPluginBtn) {
            createPluginBtn.addEventListener('click', function() {
                openPluginCreator();
            });
        }
    }
    
    /**
     * Active/désactive le mode développeur
     */
    function toggleDeveloperMode() {
        pluginSettings.developerMode = !pluginSettings.developerMode;
        
        console.log(`Mode développeur ${pluginSettings.developerMode ? 'activé' : 'désactivé'}`);
        
        // Mettre à jour l'interface
        const devModeBtn = document.querySelector('.developer-mode-btn');
        if (devModeBtn) {
            devModeBtn.textContent = pluginSettings.developerMode ? 'Désactiver le mode développeur' : 'Activer le mode développeur';
        }
        
        // Dans une implémentation réelle, afficherait des outils supplémentaires
        if (pluginSettings.developerMode) {
            alert('Mode développeur activé. Des fonctionnalités supplémentaires sont maintenant disponibles.');
        }
    }
    
    /**
     * Ouvre la documentation de l'API
     */
    function openAPIDocs() {
        console.log('Ouverture de la documentation API');
        
        // Dans une implémentation réelle, ouvrirait une page de documentation
        alert('La documentation de l\'API sera ouverte dans un nouvel onglet (fonctionnalité à implémenter).');
    }
    
    /**
     * Ouvre l'outil de création d'extension
     */
    function openPluginCreator() {
        console.log('Ouverture de l\'outil de création d\'extension');
        
        // Dans une implémentation réelle, ouvrirait l'IDE ou un assistant
        alert('L\'outil de création d\'extension sera bientôt disponible (fonctionnalité à implémenter).');
    }
    
    /**
     * Initialise les plugins activés
     */
    function initializeEnabledPlugins() {
        console.log('Initialisation des plugins activés...');
        
        const enabledPlugins = installedPlugins.filter(p => p.enabled);
        
        enabledPlugins.forEach(plugin => {
            initializePlugin(plugin);
        });
    }
    
    /**
     * Initialise un plugin spécifique
     */
    function initializePlugin(plugin) {
        console.log(`Initialisation du plugin ${plugin.id}...`);
        
        // Dans une implémentation réelle, chargerait le code du plugin
        // et exécuterait sa méthode d'initialisation
        
        // Simulation de l'initialisation pour les plugins standard
        switch(plugin.id) {
            case 'translation':
                // Initialiser le plugin de traduction
                console.log('Plugin de traduction initialisé');
                break;
            case 'ai-predictions':
                // Initialiser le plugin de prédictions IA
                console.log('Plugin de prédictions IA initialisé');
                break;
            case 'conversation-summary':
                // Initialiser le plugin de résumé de conversation
                console.log('Plugin de résumé de conversation initialisé');
                break;
            default:
                console.log(`Plugin générique ${plugin.id} initialisé`);
        }
    }
    
    /**
     * Désinitialise un plugin spécifique
     */
    function uninitializePlugin(plugin) {
        console.log(`Désactivation du plugin ${plugin.id}...`);
        
        // Dans une implémentation réelle, appellerait la méthode de nettoyage du plugin
    }
    
    /**
     * Expose l'API aux extensions
     */
    function exposePluginAPI() {
        // Créer un objet global pour l'API des plugins
        window.MessageAppPluginAPI = {
            // Informations sur l'application
            app: {
                version: '1.0.0',
                name: 'MessageApp'
            },
            
            // API pour les conversations
            conversations: {
                getCurrentConversation: () => ({}), // Implémentation réelle retournerait la conversation actuelle
                getMessages: (conversationId) => [], // Implémentation réelle retournerait les messages
                sendMessage: (conversationId, content) => {
                    console.log(`Plugin tente d'envoyer un message dans ${conversationId}: ${content}`);
                    return true;
                }
            },
            
            // API pour les utilisateurs
            users: {
                getCurrentUser: () => ({ id: 'user-123', name: 'Utilisateur actuel' }),
                getContacts: () => [] // Implémentation réelle retournerait les contacts
            },
            
            // API pour le stockage des données
            storage: {
                get: (key) => localStorage.getItem(`plugin_storage_${key}`),
                set: (key, value) => localStorage.setItem(`plugin_storage_${key}`, value),
                remove: (key) => localStorage.removeItem(`plugin_storage_${key}`)
            },
            
            // API pour les événements
            events: {
                on: (event, callback) => {
                    if (eventListeners[event]) {
                        eventListeners[event].push(callback);
                        return true;
                    }
                    return false;
                },
                off: (event, callback) => {
                    if (eventListeners[event]) {
                        const index = eventListeners[event].indexOf(callback);
                        if (index !== -1) {
                            eventListeners[event].splice(index, 1);
                            return true;
                        }
                    }
                    return false;
                }
            },
            
            // API pour l'interface utilisateur
            ui: {
                showNotification: (title, options) => {
                    console.log(`Plugin tente d'afficher une notification: ${title}`);
                    // Implémentation réelle afficherait une notification
                    return true;
                },
                addMenuItem: (label, icon, callback) => {
                    console.log(`Plugin tente d'ajouter un élément de menu: ${label}`);
                    // Implémentation réelle ajouterait un élément de menu
                    return true;
                }
            }
        };
        
        console.log('API des plugins exposée globalement');
    }
    
    /**
     * Déclenche un événement pour les plugins
     */
    function triggerEvent(event, data) {
        if (eventListeners[event]) {
            eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erreur lors de l'exécution d'un écouteur pour l'événement ${event}:`, error);
                }
            });
        }
    }
    
    // API publique
    return {
        init,
        getInstalledPlugins: () => installedPlugins,
        getStorePlugins: () => storePlugins,
        installPlugin,
        uninstallPlugin: (pluginId) => {
            const index = installedPlugins.findIndex(p => p.id === pluginId);
            if (index !== -1) {
                const plugin = installedPlugins[index];
                uninitializePlugin(plugin);
                installedPlugins.splice(index, 1);
                updateInstalledPluginsList();
                updateStorePluginsList();
                triggerEvent('plugin:uninstalled', { plugin });
                return true;
            }
            return false;
        },
        togglePlugin,
        getSettings: () => pluginSettings,
        triggerEvent
    };
})();