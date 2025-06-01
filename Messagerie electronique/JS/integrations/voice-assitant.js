/**
 * Module d'assistant vocal
 */
const VoiceAssistant = (function() {
    // Configuration de l'assistant vocal
    let config = {
        enabled: true,
        continuousListening: false,
        voiceConfirmation: true,
        readNewMessages: false,
        voiceType: 'voice1', // voice1, voice2, voice3
        wakeWord: 'Hey Assistant',
        language: 'fr-FR'
    };
    
    // Services d'assistants vocaux connectés
    let connectedServices = {
        'internal': {
            name: 'Assistant intégré',
            connected: true,
            default: true
        },
        'google': {
            name: 'Google Assistant',
            connected: false,
            default: false
        },
        'alexa': {
            name: 'Amazon Alexa',
            connected: false,
            default: false
        },
        'siri': {
            name: 'Siri',
            connected: false,
            default: false
        }
    };
    
    // Commandes vocales disponibles
    let availableCommands = {
        messages: [
            {
                phrase: 'Envoyer un message à [nom]',
                description: 'Commence un nouveau message',
                action: (params) => {
                    console.log(`Action: Envoyer un message à ${params.nom}`);
                    return `Je prépare un message pour ${params.nom}`;
                }
            },
            {
                phrase: 'Lire mes nouveaux messages',
                description: 'Lit vos messages non lus',
                action: () => {
                    console.log('Action: Lire les nouveaux messages');
                    return 'Je vais lire vos nouveaux messages';
                }
            },
            {
                phrase: 'Répondre',
                description: 'Répond au dernier message',
                action: () => {
                    console.log('Action: Répondre au dernier message');
                    return 'Que voulez-vous répondre ?';
                }
            }
        ],
        calls: [
            {
                phrase: 'Appeler [nom]',
                description: 'Démarre un appel audio',
                action: (params) => {
                    console.log(`Action: Appeler ${params.nom}`);
                    return `J'appelle ${params.nom}`;
                }
            },
            {
                phrase: 'Vidéo avec [nom]',
                description: 'Démarre un appel vidéo',
                action: (params) => {
                    console.log(`Action: Démarrer un appel vidéo avec ${params.nom}`);
                    return `Je démarre un appel vidéo avec ${params.nom}`;
                }
            },
            {
                phrase: 'Raccrocher',
                description: 'Termine l\'appel en cours',
                action: () => {
                    console.log('Action: Raccrocher');
                    return 'Appel terminé';
                }
            }
        ],
        navigation: [
            {
                phrase: 'Ouvrir [section]',
                description: 'Navigue vers une section spécifique',
                action: (params) => {
                    console.log(`Action: Ouvrir la section ${params.section}`);
                    return `J'ouvre la section ${params.section}`;
                }
            },
            {
                phrase: 'Chercher [terme]',
                description: 'Lance une recherche',
                action: (params) => {
                    console.log(`Action: Rechercher ${params.terme}`);
                    return `Je recherche ${params.terme}`;
                }
            }
        ]
    };
    
    // Commandes personnalisées
    let customCommands = [
        {
            phrase: 'Réunion d\'équipe',
            description: 'Crée un événement avec l\'équipe',
            action: () => {
                console.log('Action: Créer une réunion d\'équipe');
                return 'Je crée une réunion d\'équipe';
            }
        }
    ];
    
    // État de l'assistant vocal
    let state = {
        isListening: false,
        recognitionActive: false,
        lastCommand: null,
        pendingAction: null,
        recognitionInstance: null
    };
    
    /**
     * Initialise l'assistant vocal
     */
    function init() {
        console.log('Initialisation de l\'assistant vocal...');
        
        // Vérifier si l'API de reconnaissance vocale est disponible
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('La reconnaissance vocale n\'est pas prise en charge par ce navigateur');
            return;
        }
        
        // Configurer les interactions avec la modale de l'assistant vocal
        setupVoiceAssistantModalEvents();
        
        // Configurer le widget flottant de l'assistant vocal
        setupVoiceWidget();
        
        // Configurer les commandes vocales
        setupVoiceRecognition();
        
        // Configurer les déclencheurs d'assistant vocal
        setupVoiceAssistantTriggers();
    }
    
    /**
     * Configure les interactions avec la modale de l'assistant vocal
     */
    function setupVoiceAssistantModalEvents() {
        // Chargement des commandes vocales
        loadCommandsList();
        
        // Mise à jour des paramètres de l'assistant
        updateVoiceSettingsUI();
        
        // Écouter les changements de paramètres
        listenForSettingsChanges();
        
        // Configurer les interactions avec les services d'assistants
        setupAssistantServicesEvents();
        
        // Configurer les commandes personnalisées
        setupCustomCommandsEvents();
    }
    
    /**
     * Charge la liste des commandes vocales dans l'interface
     */
    function loadCommandsList() {
        const commandsListContainer = document.querySelector('.commands-list');
        if (!commandsListContainer) return;
        
        // Effacer le contenu existant
        commandsListContainer.innerHTML = '';
        
        // Créer les catégories de commandes
        for (const [category, commands] of Object.entries(availableCommands)) {
            const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
            
            const categorySection = document.createElement('div');
            categorySection.className = 'command-category';
            categorySection.innerHTML = `
                <h5>${categoryTitle}</h5>
                <div class="command-items"></div>
            `;
            
            const commandItems = categorySection.querySelector('.command-items');
            
            // Ajouter chaque commande
            commands.forEach(command => {
                const commandItem = document.createElement('div');
                commandItem.className = 'command-item';
                commandItem.innerHTML = `
                    <div class="command-phrase">"${command.phrase}"</div>
                    <div class="command-description">${command.description}</div>
                `;
                
                commandItems.appendChild(commandItem);
            });
            
            commandsListContainer.appendChild(categorySection);
        }
        
        // Charger les commandes personnalisées
        loadCustomCommands();
    }
    
    /**
     * Charge les commandes personnalisées dans l'interface
     */
    function loadCustomCommands() {
        const customCommandsList = document.querySelector('.custom-commands-list');
        if (!customCommandsList) return;
        
        // Effacer le contenu existant
        customCommandsList.innerHTML = '';
        
        if (customCommands.length === 0) {
            customCommandsList.innerHTML = '<p class="no-commands">Aucune commande personnalisée</p>';
            return;
        }
        
        // Ajouter chaque commande personnalisée
        customCommands.forEach((command, index) => {
            const commandItem = document.createElement('div');
            commandItem.className = 'custom-command-item';
            commandItem.innerHTML = `
                <div class="command-details">
                    <div class="command-phrase">"${command.phrase}"</div>
                    <div class="command-action">${command.description}</div>
                </div>
                <div class="command-actions">
                    <button class="edit-command-btn" data-index="${index}"><i class="bx bx-edit"></i></button>
                    <button class="delete-command-btn" data-index="${index}"><i class="bx bx-trash"></i></button>
                </div>
            `;
            
            customCommandsList.appendChild(commandItem);
        });
    }
    
    /**
     * Met à jour l'interface avec les paramètres actuels de l'assistant vocal
     */
    function updateVoiceSettingsUI() {
        // Mettre à jour les interrupteurs
        const toggles = {
            'Activer l\'assistant vocal': 'enabled',
            'Mode écoute continue': 'continuousListening',
            'Confirmation vocale': 'voiceConfirmation',
            'Lecture des nouveaux messages': 'readNewMessages'
        };
        
        for (const [label, settingKey] of Object.entries(toggles)) {
            const settingItem = findSettingItemByLabel(label);
            if (settingItem) {
                const checkbox = settingItem.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = config[settingKey];
                }
            }
        }
        
        // Mettre à jour le sélecteur de voix
        const voiceSelect = document.querySelector('.voice-selection');
        if (voiceSelect) {
            voiceSelect.value = config.voiceType;
        }
        
        // Mettre à jour le mot d'activation
        const wakeWordInput = document.querySelector('.wake-word');
        if (wakeWordInput) {
            wakeWordInput.value = config.wakeWord;
        }
        
        // Mettre à jour la langue
        const languageSelect = document.querySelector('.language-selection');
        if (languageSelect) {
            languageSelect.value = config.language;
        }
    }
    
    /**
     * Trouve un élément de paramètre par son libellé
     */
    function findSettingItemByLabel(label) {
        const items = document.querySelectorAll('.setting-item');
        for (const item of items) {
            const labelElement = item.querySelector('.setting-label span:first-child');
            if (labelElement && labelElement.textContent === label) {
                return item;
            }
        }
        return null;
    }
    
    /**
     * Écoute les changements de paramètres
     */
    function listenForSettingsChanges() {
        // Écouter les changements de commutateurs
        document.addEventListener('change', function(e) {
            if (e.target.matches('.voice-settings input[type="checkbox"]')) {
                const settingItem = e.target.closest('.setting-item');
                if (!settingItem) return;
                
                const label = settingItem.querySelector('.setting-label span:first-child').textContent;
                const isChecked = e.target.checked;
                
                switch (label) {
                    case 'Activer l\'assistant vocal':
                        config.enabled = isChecked;
                        break;
                    case 'Mode écoute continue':
                        config.continuousListening = isChecked;
                        break;
                    case 'Confirmation vocale':
                        config.voiceConfirmation = isChecked;
                        break;
                    case 'Lecture des nouveaux messages':
                        config.readNewMessages = isChecked;
                        break;
                }
                
                console.log(`Paramètre "${label}" mis à jour: ${isChecked}`);
            }
        });
        
        // Écouter les changements de sélecteur de voix
        const voiceSelect = document.querySelector('.voice-selection');
        if (voiceSelect) {
            voiceSelect.addEventListener('change', function() {
                config.voiceType = this.value;
                console.log(`Type de voix mis à jour: ${this.value}`);
            });
        }
        
        // Écouter les changements de mot d'activation
        const wakeWordInput = document.querySelector('.wake-word');
        if (wakeWordInput) {
            wakeWordInput.addEventListener('change', function() {
                config.wakeWord = this.value;
                console.log(`Mot d'activation mis à jour: ${this.value}`);
            });
        }
        
        // Écouter les changements de langue
        const languageSelect = document.querySelector('.language-selection');
        if (languageSelect) {
            languageSelect.addEventListener('change', function() {
                config.language = this.value;
                console.log(`Langue de reconnaissance mise à jour: ${this.value}`);
                
                // Réinitialiser la reconnaissance vocale avec la nouvelle langue
                setupVoiceRecognition();
            });
        }
    }
    
    /**
     * Configure les interactions avec les services d'assistants
     */
    function setupAssistantServicesEvents() {
        // Écouter les changements d'état des services
        document.addEventListener('change', function(e) {
            if (e.target.matches('.assistant-services input[type="checkbox"]')) {
                const serviceItem = e.target.closest('.service-item');
                if (!serviceItem) return;
                
                const serviceName = serviceItem.querySelector('.service-name').textContent.trim().toLowerCase();
                const isChecked = e.target.checked;
                
                toggleAssistantService(getServiceKeyFromName(serviceName), isChecked);
            }
        });
        
        // Écouter les clics sur les boutons de connexion
        document.addEventListener('click', function(e) {
            if (e.target.matches('.connect-service-btn') || e.target.closest('.connect-service-btn')) {
                const serviceItem = e.target.closest('.service-item');
                if (!serviceItem) return;
                
                const serviceName = serviceItem.querySelector('.service-name').textContent.trim().toLowerCase();
                
                connectAssistantService(getServiceKeyFromName(serviceName));
            }
        });
        
        // Écouter les clics sur les boutons de demande d'autorisation
        document.addEventListener('click', function(e) {
            if (e.target.matches('.request-permission-btn') || e.target.closest('.request-permission-btn')) {
                const permissionItem = e.target.closest('.permission-item');
                if (!permissionItem) return;
                
                const permissionName = permissionItem.querySelector('span:first-child').textContent.trim().toLowerCase();
                
                requestPermission(permissionName);
            }
        });
    }
    
    /**
     * Obtient la clé de service à partir du nom affiché
     */
    function getServiceKeyFromName(name) {
        const nameMapping = {
            'assistant intégré': 'internal',
            'google assistant': 'google',
            'amazon alexa': 'alexa',
            'siri': 'siri'
        };
        
        return nameMapping[name.toLowerCase()] || name.toLowerCase();
    }
    
    /**
     * Active ou désactive un service d'assistant
     */
    function toggleAssistantService(serviceKey, enabled) {
        console.log(`${enabled ? 'Activation' : 'Désactivation'} du service ${serviceKey}`);
        
        if (!connectedServices[serviceKey]) {
            console.error(`Service non trouvé: ${serviceKey}`);
            return;
        }
        
        // Si ce n'est pas l'assistant intégré, il faut d'abord le connecter
        if (serviceKey !== 'internal' && !connectedServices[serviceKey].connected) {
            alert('Ce service n\'est pas connecté. Veuillez le connecter d\'abord.');
            return;
        }
        
        // Si on désactive le service par défaut, vérifier qu'un autre service est actif
        if (connectedServices[serviceKey].default && !enabled) {
            const otherEnabledServices = Object.keys(connectedServices).filter(key => 
                key !== serviceKey && connectedServices[key].connected
            );
            
            if (otherEnabledServices.length === 0) {
                alert('Vous ne pouvez pas désactiver le service par défaut sans en activer un autre d\'abord.');
                return false;
            }
            
            // Choisir un nouveau service par défaut
            connectedServices[otherEnabledServices[0]].default = true;
        }
        
        // Mettre à jour l'état du service
        connectedServices[serviceKey].default = enabled;
        
        return true;
    }
    
    /**
     * Connecte un service d'assistant
     */
    function connectAssistantService(serviceKey) {
        console.log(`Connexion au service ${serviceKey}...`);
        
        if (!connectedServices[serviceKey]) {
            console.error(`Service non trouvé: ${serviceKey}`);
            return;
        }
        
        // Dans une implémentation réelle, ouvrirait une fenêtre d'authentification
        // Simulation de la connexion
        setTimeout(() => {
            connectedServices[serviceKey].connected = true;
            
            // Mettre à jour l'interface
            updateAssistantServiceUI(serviceKey);
            
            alert(`Le service "${connectedServices[serviceKey].name}" a été connecté avec succès.`);
        }, 1500);
    }
    
    /**
     * Met à jour l'interface pour un service d'assistant
     */
    function updateAssistantServiceUI(serviceKey) {
        const service = connectedServices[serviceKey];
        if (!service) return;
        
        // Trouver l'élément de service
        const serviceItems = document.querySelectorAll('.service-item');
        for (const item of serviceItems) {
            const nameElement = item.querySelector('.service-name');
            if (nameElement && nameElement.textContent === service.name) {
                // Mettre à jour le statut
                const statusElement = item.querySelector('.service-status');
                if (statusElement) {
                    statusElement.textContent = service.connected ? (service.default ? 'Actif (par défaut)' : 'Connecté') : 'Non connecté';
                }
                
                // Mettre à jour les actions
                const actionsContainer = item.querySelector('.service-actions');
                if (actionsContainer) {
                    if (service.connected) {
                        actionsContainer.innerHTML = `
                            <label class="switch">
                                <input type="checkbox" ${service.default ? 'checked' : ''}>
                                <span class="slider round"></span>
                            </label>
                        `;
                    } else {
                        actionsContainer.innerHTML = `
                            <button class="connect-service-btn">Connecter</button>
                        `;
                    }
                }
                
                break;
            }
        }
    }
    
    /**
     * Demande une autorisation
     */
    function requestPermission(permission) {
        console.log(`Demande d'autorisation pour ${permission}...`);
        
        switch (permission) {
            case 'microphone':
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(() => {
                        updatePermissionStatus(permission, true);
                        alert('Autorisation accordée pour le microphone.');
                    })
                    .catch(() => {
                        updatePermissionStatus(permission, false);
                        alert('Autorisation refusée pour le microphone.');
                    });
                break;
            case 'notifications':
                if ('Notification' in window) {
                    Notification.requestPermission()
                        .then(permission => {
                            updatePermissionStatus('notifications', permission === 'granted');
                            alert(`Autorisation ${permission === 'granted' ? 'accordée' : 'refusée'} pour les notifications.`);
                        });
                }
                break;
            case 'contacts':
                // Dans une implémentation réelle, utiliserait l'API appropriée
                setTimeout(() => {
                    updatePermissionStatus(permission, true);
                    alert('Autorisation accordée pour les contacts.');
                }, 1000);
                break;
            default:
                alert('Demande d\'autorisation non supportée pour ' + permission);
        }
    }
    
    /**
     * Met à jour le statut d'une autorisation dans l'interface
     */
    function updatePermissionStatus(permission, granted) {
        const permissionItems = document.querySelectorAll('.permission-item');
        for (const item of permissionItems) {
            const nameElement = item.querySelector('span:first-child');
            if (nameElement && nameElement.textContent.toLowerCase() === permission) {
                const statusElement = item.querySelector('.permission-status');
                if (statusElement) {
                    statusElement.textContent = granted ? 'Accordé' : 'Refusé';
                    statusElement.className = `permission-status ${granted ? 'granted' : 'denied'}`;
                }
                
                const requestButton = item.querySelector('.request-permission-btn');
                if (requestButton) {
                    requestButton.style.display = granted ? 'none' : 'inline-block';
                }
                
                break;
            }
        }
    }
    
    /**
     * Configure les interactions avec les commandes personnalisées
     */
    function setupCustomCommandsEvents() {
        // Écouter les clics sur le bouton d'ajout de commande
        const addCommandButton = document.querySelector('.add-custom-command');
        if (addCommandButton) {
            addCommandButton.addEventListener('click', function() {
                addCustomCommand();
            });
        }
        
        // Écouter les clics sur les boutons d'édition
        document.addEventListener('click', function(e) {
            if (e.target.matches('.edit-command-btn') || e.target.closest('.edit-command-btn')) {
                const button = e.target.matches('.edit-command-btn') ? e.target : e.target.closest('.edit-command-btn');
                const index = parseInt(button.getAttribute('data-index'));
                
                editCustomCommand(index);
            }
        });
        
        // Écouter les clics sur les boutons de suppression
        document.addEventListener('click', function(e) {
            if (e.target.matches('.delete-command-btn') || e.target.closest('.delete-command-btn')) {
                const button = e.target.matches('.delete-command-btn') ? e.target : e.target.closest('.delete-command-btn');
                const index = parseInt(button.getAttribute('data-index'));
                
                deleteCustomCommand(index);
            }
        });
    }
    
    /**
     * Ajoute une commande personnalisée
     */
    function addCustomCommand() {
        // Dans une implémentation réelle, ouvrirait une modale de création
        const phrase = prompt('Entrez la phrase de commande:');
        if (!phrase) return;
        
        const description = prompt('Entrez la description de l\'action:');
        if (!description) return;
        
        // Ajouter la commande
        customCommands.push({
            phrase,
            description,
            action: () => {
                console.log(`Action personnalisée: ${description}`);
                return `Exécution de: ${description}`;
            }
        });
        
        // Mettre à jour l'interface
        loadCustomCommands();
    }
    
    /**
     * Édite une commande personnalisée
     */
    function editCustomCommand(index) {
        if (index < 0 || index >= customCommands.length) {
            console.error(`Index de commande invalide: ${index}`);
            return;
        }
        
        const command = customCommands[index];
        
        // Dans une implémentation réelle, ouvrirait une modale d'édition
        const phrase = prompt('Modifier la phrase de commande:', command.phrase);
        if (!phrase) return;
        
        const description = prompt('Modifier la description de l\'action:', command.description);
        if (!description) return;
        
        // Mettre à jour la commande
        customCommands[index] = {
            ...command,
            phrase,
            description
        };
        
        // Mettre à jour l'interface
        loadCustomCommands();
    }
    
    /**
     * Supprime une commande personnalisée
     */
    function deleteCustomCommand(index) {
        if (index < 0 || index >= customCommands.length) {
            console.error(`Index de commande invalide: ${index}`);
            return;
        }
        
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            return;
        }
        
        // Supprimer la commande
        customCommands.splice(index, 1);
        
        // Mettre à jour l'interface
        loadCustomCommands();
    }
    
    /**
 * Configure le widget flottant de l'assistant vocal
 */
function setupVoiceWidget() {
    const voiceWidget = document.querySelector('.voice-assistant-widget');
    if (!voiceWidget) return;
    
    // Configurer le bouton du widget
    const widgetButton = voiceWidget.querySelector('.voice-widget-button');
    if (widgetButton) {
        widgetButton.addEventListener('click', function() {
            toggleVoiceListening();
        });
    }
    
    // Configurer les indicateurs d'état
    updateVoiceWidgetStatus();
}

/**
 * Met à jour le statut du widget de l'assistant vocal
 */
function updateVoiceWidgetStatus() {
    const widget = document.querySelector('.voice-assistant-widget');
    if (!widget) return;
    
    const statusIndicator = widget.querySelector('.status-indicator');
    const statusText = widget.querySelector('.status-text');
    
    if (state.isListening) {
        widget.classList.add('active');
        if (statusIndicator) statusIndicator.classList.add('listening');
        if (statusText) statusText.textContent = 'Écoute en cours...';
    } else {
        widget.classList.remove('active');
        if (statusIndicator) statusIndicator.classList.remove('listening');
        if (statusText) statusText.textContent = 'Assistant vocal';
    }
}

/**
 * Active ou désactive l'écoute vocale
 */
function toggleVoiceListening() {
    if (!config.enabled) {
        alert('L\'assistant vocal est désactivé. Veuillez l\'activer dans les paramètres.');
        return;
    }
    
    if (state.isListening) {
        stopListening();
    } else {
        startListening();
    }
    
    // Mettre à jour le statut du widget
    updateVoiceWidgetStatus();
}

/**
 * Démarre l'écoute vocale
 */
function startListening() {
    console.log('Démarrage de l\'écoute vocale...');
    
    if (!state.recognitionInstance) {
        setupVoiceRecognition();
    }
    
    state.isListening = true;
    
    if (state.recognitionInstance) {
        try {
            state.recognitionInstance.start();
            state.recognitionActive = true;
            
            if (config.voiceConfirmation) {
                speakText('Je vous écoute');
            }
        } catch (e) {
            console.error('Erreur lors du démarrage de la reconnaissance vocale:', e);
        }
    }
}

/**
 * Arrête l'écoute vocale
 */
function stopListening() {
    console.log('Arrêt de l\'écoute vocale...');
    
    state.isListening = false;
    
    if (state.recognitionInstance && state.recognitionActive) {
        try {
            state.recognitionInstance.stop();
            state.recognitionActive = false;
            
            if (config.voiceConfirmation) {
                speakText('Écoute terminée');
            }
        } catch (e) {
            console.error('Erreur lors de l\'arrêt de la reconnaissance vocale:', e);
        }
    }
}

/**
 * Configure la reconnaissance vocale
 */
function setupVoiceRecognition() {
    // Créer une instance de reconnaissance vocale
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('La reconnaissance vocale n\'est pas prise en charge');
        return;
    }
    
    // Nettoyer l'instance existante si nécessaire
    if (state.recognitionInstance) {
        state.recognitionInstance.onend = null;
        state.recognitionInstance.onerror = null;
        state.recognitionInstance.onresult = null;
    }
    
    // Créer une nouvelle instance
    state.recognitionInstance = new SpeechRecognition();
    
    // Configurer la reconnaissance
    state.recognitionInstance.continuous = config.continuousListening;
    state.recognitionInstance.interimResults = false;
    state.recognitionInstance.lang = config.language;
    
    // Gérer la fin de la reconnaissance
    state.recognitionInstance.onend = function() {
        state.recognitionActive = false;
        
        // Redémarrer la reconnaissance si le mode continu est activé
        if (config.continuousListening && state.isListening) {
            setTimeout(() => {
                if (state.isListening) {
                    try {
                        state.recognitionInstance.start();
                        state.recognitionActive = true;
                    } catch (e) {
                        console.error('Erreur lors du redémarrage de la reconnaissance:', e);
                    }
                }
            }, 500);
        } else {
            state.isListening = false;
            updateVoiceWidgetStatus();
        }
    };
    
    // Gérer les erreurs
    state.recognitionInstance.onerror = function(event) {
        console.error('Erreur de reconnaissance vocale:', event.error);
        
        if (event.error === 'no-speech') {
            console.log('Aucune parole détectée');
        }
        
        state.recognitionActive = false;
        
        // Ne pas redémarrer en cas d'erreur grave
        if (event.error === 'audio-capture' || event.error === 'not-allowed') {
            state.isListening = false;
            updateVoiceWidgetStatus();
            
            alert('Erreur d\'accès au microphone. Veuillez vérifier les autorisations.');
        }
    };
    
    // Gérer les résultats
    state.recognitionInstance.onresult = function(event) {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log('Parole détectée:', transcript);
        
        // Traiter la commande
        processVoiceCommand(transcript);
    };
}

/**
 * Traite une commande vocale
 */
function processVoiceCommand(text) {
    console.log('Traitement de la commande vocale:', text);
    
    // Vérifier si c'est le mot d'activation
    if (config.wakeWord && !state.isListening) {
        if (text.toLowerCase().includes(config.wakeWord.toLowerCase())) {
            startListening();
            return;
        }
    }
    
    // Rechercher une correspondance dans les commandes disponibles
    let matchedCommand = null;
    let matchedParams = {};
    
    // Vérifier les commandes standard par catégorie
    for (const [category, commands] of Object.entries(availableCommands)) {
        for (const command of commands) {
            const match = matchCommandPattern(command.phrase, text);
            if (match) {
                matchedCommand = command;
                matchedParams = match;
                break;
            }
        }
        
        if (matchedCommand) break;
    }
    
    // Vérifier les commandes personnalisées si aucune correspondance
    if (!matchedCommand) {
        for (const command of customCommands) {
            if (text.toLowerCase() === command.phrase.toLowerCase()) {
                matchedCommand = command;
                break;
            }
        }
    }
    
    // Exécuter la commande si trouvée
    if (matchedCommand) {
        executeVoiceCommand(matchedCommand, matchedParams);
    } else {
        console.log('Aucune commande correspondante trouvée');
        if (config.voiceConfirmation) {
            speakText('Je n\'ai pas compris cette commande');
        }
    }
}

/**
 * Correspond un modèle de commande à un texte
 */
function matchCommandPattern(pattern, text) {
    // Convertir le modèle en expression régulière
    const regex = new RegExp(
        pattern
            .replace(/\[(\w+)\]/g, '([\\w\\s]+)') // Remplacer [param] par un groupe de capture
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // Échapper les caractères spéciaux
        'i' // Insensible à la casse
    );
    
    // Extraire les noms de paramètres
    const paramNames = [];
    let match;
    const paramRegex = /\[(\w+)\]/g;
    while ((match = paramRegex.exec(pattern)) !== null) {
        paramNames.push(match[1]);
    }
    
    // Vérifier la correspondance
    const textMatch = text.match(regex);
    if (!textMatch) return null;
    
    // Construire l'objet de paramètres
    const params = {};
    for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = textMatch[i + 1];
    }
    
    return params;
}

/**
 * Exécute une commande vocale
 */
function executeVoiceCommand(command, params = {}) {
    console.log('Exécution de la commande:', command.phrase);
    
    // Enregistrer la dernière commande
    state.lastCommand = command;
    
    // Exécuter l'action
    try {
        const response = command.action(params);
        
        // Répondre vocalement si la confirmation est activée
        if (config.voiceConfirmation && response) {
            speakText(response);
        }
        
        return response;
    } catch (e) {
        console.error('Erreur lors de l\'exécution de la commande:', e);
        return null;
    }
}

/**
 * Configure les déclencheurs d'assistant vocal
 */
function setupVoiceAssistantTriggers() {
    // Configurer les boutons de l'assistant vocal
    const voiceButtons = document.querySelectorAll('.voice-assistant-trigger');
    for (const button of voiceButtons) {
        button.addEventListener('click', function() {
            toggleVoiceListening();
        });
    }
    
    // Configurer les raccourcis clavier
    document.addEventListener('keydown', function(e) {
        // Alt+V pour activer/désactiver l'assistant
        if (e.altKey && e.key === 'v') {
            e.preventDefault();
            toggleVoiceListening();
        }
    });
    
    // Configurer l'écoute du mot d'activation si le navigateur le supporte
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setupWakeWordDetection();
    }
}

/**
 * Configure la détection du mot d'activation
 */
function setupWakeWordDetection() {
    // Cette fonction serait implémentée pour une détection continue du mot d'activation
    // Nécessite généralement une reconnaissance vocale en arrière-plan
    console.log('Configuration de la détection du mot d\'activation...');
    
    // Dans une implémentation réelle, cette fonction utiliserait une instance distincte
    // de reconnaissance vocale qui écoute en permanence le mot d'activation
}

/**
 * Utilise la synthèse vocale pour parler un texte
 */
function speakText(text) {
    if (!text || !config.voiceConfirmation) return;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = config.language;
        
        // Configurer la voix
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Sélectionner une voix en fonction de la configuration
            const voiceMapping = {
                'voice1': 0, // Index de la première voix disponible
                'voice2': Math.min(1, voices.length - 1), // Index de la deuxième voix si disponible
                'voice3': Math.min(2, voices.length - 1)  // Index de la troisième voix si disponible
            };
            
            const voiceIndex = voiceMapping[config.voiceType] || 0;
            utterance.voice = voices[voiceIndex];
        }
        
        speechSynthesis.speak(utterance);
    } else {
        console.warn('La synthèse vocale n\'est pas prise en charge par ce navigateur');
    }
}

// Initialiser l'assistant vocal quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);

// Exposer les fonctions publiques
return {
    init,
    startListening,
    stopListening,
    toggleVoiceListening,
    speakText,
    getConfig: () => ({ ...config }),
    getState: () => ({ ...state }),
    addCustomCommand: (phrase, description, action) => {
        customCommands.push({ phrase, description, action });
        loadCustomCommands();
    }
};

})();

// Exporter le module si dans un environnement compatible
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = VoiceAssistant;
}