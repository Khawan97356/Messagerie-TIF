/**
 * Module d'intégration avec les services de stockage cloud
 */
const CloudIntegration = (function() {
    // Services de stockage connectés
    let connectedServices = {
        'google': {
            name: 'Google Drive',
            connected: true,
            token: 'mock-token-123',
            quota: {
                used: 5.2, // GB
                total: 15  // GB
            }
        },
        'dropbox': {
            name: 'Dropbox',
            connected: false,
            token: null,
            quota: null
        },
        'onedrive': {
            name: 'OneDrive',
            connected: true,
            token: 'mock-token-456',
            quota: {
                used: 3.7, // GB
                total: 5   // GB
            }
        }
    };
    
    // Structure de fichiers simulée
    let fileSystem = {
        'google': {
            '/': [
                { type: 'folder', name: 'Documents', path: '/Documents' },
                { type: 'folder', name: 'Images', path: '/Images' },
                { type: 'file', name: 'Présentation.pptx', path: '/Présentation.pptx', size: 2.5, extension: 'pptx' }
            ],
            '/Documents': [
                { type: 'folder', name: 'Projets', path: '/Documents/Projets' },
                { type: 'file', name: 'Rapport.docx', path: '/Documents/Rapport.docx', size: 1.2, extension: 'docx' },
                { type: 'file', name: 'Budget.xlsx', path: '/Documents/Budget.xlsx', size: 0.8, extension: 'xlsx' }
            ],
            '/Documents/Projets': [
                { type: 'folder', name: 'Marketing', path: '/Documents/Projets/Marketing' },
                { type: 'folder', name: 'Finances', path: '/Documents/Projets/Finances' },
                { type: 'file', name: 'Rapport Q2.docx', path: '/Documents/Projets/Rapport Q2.docx', size: 1.5, extension: 'docx' },
                { type: 'file', name: 'Budget 2025.xlsx', path: '/Documents/Projets/Budget 2025.xlsx', size: 0.9, extension: 'xlsx' },
                { type: 'file', name: 'Contrat.pdf', path: '/Documents/Projets/Contrat.pdf', size: 2.1, extension: 'pdf' }
            ]
        },
        'onedrive': {
            '/': [
                { type: 'folder', name: 'Documents', path: '/Documents' },
                { type: 'folder', name: 'Photos', path: '/Photos' }
            ],
            '/Documents': [
                { type: 'file', name: 'Notes de réunion.docx', path: '/Documents/Notes de réunion.docx', size: 0.5, extension: 'docx' }
            ]
        }
    };
    
    // Fichiers récemment consultés
    let recentFiles = [
        { 
            name: 'Présentation.pdf', 
            path: '/Présentations/Présentation.pdf', 
            service: 'google',
            extension: 'pdf',
            lastAccessed: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        },
        { 
            name: 'Notes de réunion.docx', 
            path: '/Documents/Notes de réunion.docx', 
            service: 'onedrive',
            extension: 'docx',
            lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        { 
            name: 'Analyse.xlsx', 
            path: '/Documents/Finances/Analyse.xlsx', 
            service: 'google',
            extension: 'xlsx',
            lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
        }
    ];
    
    // État de navigation actuel
    let currentState = {
        service: 'google',
        path: '/',
        history: ['/']
    };
    
    /**
     * Initialise l'intégration cloud
     */
    function init() {
        console.log('Initialisation de l\'intégration stockage cloud...');
        
        // Configurer les interactions avec les onglets cloud
        setupCloudTabEvents();
        
        // Configurer le navigateur de fichiers
        setupFileBrowser();
        
        // Charger les fichiers récents
        loadRecentFiles();
        
        // Configurer les intégrations rapides de cloud
        setupQuickCloudInsert();
    }
    
    /**
     * Configure les interactions avec les onglets cloud
     */
    function setupCloudTabEvents() {
        // Gestion des connexions/déconnexions
        const connectButtons = document.querySelectorAll('.cloud-modal .connect-btn');
        const disconnectButtons = document.querySelectorAll('.cloud-modal .disconnect-btn');
        
        connectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const serviceItem = button.closest('.service-item');
                const serviceName = serviceItem.querySelector('span').textContent.trim().toLowerCase();
                
                // Simuler l'authentification OAuth
                simulateOAuthFlow(serviceName)
                    .then(success => {
                        if (success) {
                            updateCloudConnectionUI(serviceItem, true);
                        }
                    });
            });
        });
        
        disconnectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const serviceItem = button.closest('.service-item');
                const serviceName = serviceItem.querySelector('span').textContent.trim().toLowerCase();
                
                // Déconnecter le service
                disconnectCloudService(serviceName);
                updateCloudConnectionUI(serviceItem, false);
            });
        });
        
        // Sélecteur de service cloud
        const serviceSelector = document.getElementById('cloud-service');
        if (serviceSelector) {
            serviceSelector.addEventListener('change', function() {
                changeCloudService(this.value);
            });
        }
    }
    
    /**
     * Simule un flux d'authentification OAuth
     */
    function simulateOAuthFlow(serviceName) {
        return new Promise((resolve) => {
            console.log(`Démarrage du flux d'authentification pour ${serviceName}...`);
            
            // Simuler un délai de connexion
            setTimeout(() => {
                // Dans une implémentation réelle, ouvrirait une fenêtre OAuth
                // et attendrait la redirection avec le token
                
                const success = true; // Supposons que l'authentification réussit
                
                if (success) {
                    // Convertir le nom du service au format de notre objet (toLowerCase)
                    const serviceKey = serviceName.toLowerCase().replace(/\s+/g, '');
                    
                    // Mettre à jour notre état interne
                    if (connectedServices[serviceKey]) {
                        connectedServices[serviceKey].connected = true;
                        connectedServices[serviceKey].token = `mock-token-${Date.now()}`;
                        
                        // Ajouter des données fictives de quota
                        connectedServices[serviceKey].quota = {
                            used: Math.round(Math.random() * 10 * 10) / 10, // 0-10 GB avec une décimale
                            total: 15
                        };
                        
                        // Initialiser la structure de fichiers si elle n'existe pas
                        if (!fileSystem[serviceKey]) {
                            fileSystem[serviceKey] = {
                                '/': [
                                    { type: 'folder', name: 'Documents', path: '/Documents' },
                                    { type: 'folder', name: 'Images', path: '/Images' }
                                ],
                                '/Documents': []
                            };
                        }
                    }
                    
                    console.log(`✅ Authentification réussie pour ${serviceName}`);
                }
                
                resolve(success);
            }, 1500);
        });
    }
    
    /**
     * Met à jour l'interface utilisateur pour refléter l'état de connexion
     */
    function updateCloudConnectionUI(serviceItem, isConnected) {
        const statusElement = serviceItem.querySelector('.connection-status');
        const button = serviceItem.querySelector('button');
        
        if (isConnected) {
            statusElement.textContent = 'Connecté';
            statusElement.className = 'connection-status connected';
            button.textContent = 'Déconnecter';
            button.className = 'disconnect-btn';
        } else {
            statusElement.textContent = 'Non connecté';
            statusElement.className = 'connection-status';
            button.textContent = 'Connecter';
            button.className = 'connect-btn';
        }
    }
    
    /**
     * Déconnecte un service de stockage cloud
     */
    function disconnectCloudService(serviceName) {
        console.log(`Déconnexion du service ${serviceName}...`);
        
        // Dans une implémentation réelle, révoquerait les tokens d'accès
        
        // Convertir le nom du service au format de notre objet
        const serviceKey = serviceName.toLowerCase().replace(/\s+/g, '');
        
        // Mettre à jour notre état interne
        if (connectedServices[serviceKey]) {
            connectedServices[serviceKey].connected = false;
            connectedServices[serviceKey].token = null;
            connectedServices[serviceKey].quota = null;
        }
    }
    
    /**
     * Configure le navigateur de fichiers
     */
    function setupFileBrowser() {
        // Bouton de retour en arrière
        const backButton = document.querySelector('.file-navigation .back-btn');
        if (backButton) {
            backButton.addEventListener('click', function() {
                navigateBack();
            });
        }
        
        // Charger les fichiers initiaux
        loadFiles(currentState.service, currentState.path);
    }
    
    /**
     * Change le service cloud actif
     */
    function changeCloudService(service) {
        console.log(`Changement de service vers ${service}`);
        
        // Vérifier si le service est connecté
        if (!connectedServices[service] || !connectedServices[service].connected) {
            alert('Ce service n\'est pas connecté. Veuillez le connecter d\'abord.');
            return;
        }
        
        // Mettre à jour l'état actuel
        currentState.service = service;
        currentState.path = '/';
        currentState.history = ['/'];
        
        // Mettre à jour l'UI
        document.querySelector('.current-path').textContent = '/';
        
        // Charger les fichiers
        loadFiles(service, '/');
    }
    
    /**
     * Charge les fichiers pour un chemin donné
     */
    function loadFiles(service, path) {
        console.log(`Chargement des fichiers pour ${service}:${path}`);
        
        // Vérifier si le service est connecté
        if (!connectedServices[service] || !connectedServices[service].connected) {
            console.error(`Le service ${service} n'est pas connecté`);
            return;
        }
        
        // Vérifier si le chemin existe
        if (!fileSystem[service] || !fileSystem[service][path]) {
            console.error(`Le chemin ${path} n'existe pas dans ${service}`);
            return;
        }
        
        // Mettre à jour l'UI
        const filesContainer = document.querySelector('.files-list');
        if (!filesContainer) return;
        
        // Vider le conteneur
        filesContainer.innerHTML = '';
        
        // Récupérer les fichiers
        const files = fileSystem[service][path];
        
        // Créer les éléments pour chaque fichier/dossier
        files.forEach(item => {
            const fileItem = document.createElement('div');
            fileItem.className = `file-item ${item.type}`;
            
            let icon = '';
            if (item.type === 'folder') {
                icon = '<i class="bx bx-folder"></i>';
            } else {
                // Déterminer l'icône en fonction de l'extension
                switch(item.extension) {
                    case 'pdf':
                        icon = '<i class="bx bxs-file-pdf"></i>';
                        break;
                    case 'docx':
                    case 'doc':
                        icon = '<i class="bx bx-file-doc"></i>';
                        break;
                    case 'xlsx':
                    case 'xls':
                        icon = '<i class="bx bx-spreadsheet"></i>';
                        break;
                    case 'pptx':
                    case 'ppt':
                        icon = '<i class="bx bx-slideshow"></i>';
                        break;
                    case 'jpg':
                    case 'png':
                    case 'gif':
                        icon = '<i class="bx bx-image"></i>';
                        break;
                    default:
                        icon = '<i class="bx bx-file"></i>';
                }
            }
            
            // Construction de l'élément
            if (item.type === 'folder') {
                fileItem.innerHTML = `
                    ${icon}
                    <span class="file-name">${item.name}</span>
                `;
            } else {
                fileItem.innerHTML = `
                    ${icon}
                    <span class="file-name">${item.name}</span>
                    <button class="share-file-btn" data-path="${item.path}">
                        <i class="bx bx-share"></i>
                    </button>
                `;
            }
            
            // Ajouter au conteneur
            filesContainer.appendChild(fileItem);
            
            // Ajouter l'événement de navigation pour les dossiers
            if (item.type === 'folder') {
                fileItem.addEventListener('click', function() {
                    navigateTo(item.path);
                });
            }
        });
        
        // Configurer les boutons de partage
        setupShareButtons();
    }
    
    /**
     * Configure les boutons de partage de fichiers
     */
    function setupShareButtons() {
        const shareButtons = document.querySelectorAll('.share-file-btn');
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Empêcher la propagation de l'événement
                
                const filePath = this.getAttribute('data-path');
                shareFile(currentState.service, filePath);
            });
        });
    }
    
    /**
     * Navigue vers un chemin spécifique
     */
    function navigateTo(path) {
        console.log(`Navigation vers ${path}`);
        
        // Mettre à jour l'état actuel
        currentState.path = path;
        currentState.history.push(path);
        
        // Mettre à jour l'UI
        document.querySelector('.current-path').textContent = path;
        
        // Charger les fichiers
        loadFiles(currentState.service, path);
    }
    
    /**
     * Navigue en arrière dans l'historique
     */
    function navigateBack() {
        if (currentState.history.length <= 1) {
            return; // Impossible de remonter plus haut
        }
        
        // Retirer le chemin actuel
        currentState.history.pop();
        
        // Définir le nouveau chemin
        const previousPath = currentState.history[currentState.history.length - 1];
        currentState.path = previousPath;
        
        // Mettre à jour l'UI
        document.querySelector('.current-path').textContent = previousPath;
        
        // Charger les fichiers
        loadFiles(currentState.service, previousPath);
    }
    
    /**
     * Charge les fichiers récemment consultés
     */
    function loadRecentFiles() {
        const recentFilesContainer = document.querySelector('.recent-files');
        if (!recentFilesContainer) return;
        
        // Vider le conteneur
        recentFilesContainer.innerHTML = '';
        
        if (recentFiles.length === 0) {
            recentFilesContainer.innerHTML = '<p class="no-files">Aucun fichier récent</p>';
            return;
        }
        
        // Trier les fichiers par date d'accès (plus récent en premier)
        recentFiles.sort((a, b) => b.lastAccessed - a.lastAccessed);
        
        // Créer les éléments pour chaque fichier
        recentFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = `file-item ${file.extension}`;
            
            // Déterminer l'icône en fonction de l'extension
            let icon = '';
            switch(file.extension) {
                case 'pdf':
                    icon = '<i class="bx bxs-file-pdf"></i>';
                    break;
                case 'docx':
                case 'doc':
                    icon = '<i class="bx bx-file-doc"></i>';
                    break;
                case 'xlsx':
                case 'xls':
                    icon = '<i class="bx bx-spreadsheet"></i>';
                    break;
                case 'pptx':
                case 'ppt':
                    icon = '<i class="bx bx-slideshow"></i>';
                    break;
                case 'jpg':
                case 'png':
                case 'gif':
                    icon = '<i class="bx bx-image"></i>';
                    break;
                default:
                    icon = '<i class="bx bx-file"></i>';
            }
            
            fileItem.innerHTML = `
                ${icon}
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-service">${connectedServices[file.service].name}</span>
                </div>
                <button class="share-file-btn" data-service="${file.service}" data-path="${file.path}">
                    <i class="bx bx-share"></i>
                </button>
            `;
            
            recentFilesContainer.appendChild(fileItem);
        });
        
        // Configurer les boutons de partage
        const shareButtons = recentFilesContainer.querySelectorAll('.share-file-btn');
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const service = this.getAttribute('data-service');
                const path = this.getAttribute('data-path');
                shareFile(service, path);
            });
        });
    }
    
    /**
     * Partage un fichier dans la conversation
     */
    function shareFile(service, path) {
        console.log(`Partage du fichier ${service}:${path} dans la conversation`);
        
        // Extraire le nom du fichier du chemin
        const fileName = path.split('/').pop();
        
        // Dans une implémentation réelle, générerait un lien partageable
        // et créerait un message riche dans la conversation
        
        // Simuler l'insertion d'un message avec le fichier
        // Cette fonction devrait être définie dans le script principal de chat
        if (typeof insertFileMessage === 'function') {
            insertFileMessage({
                service,
                path,
                name: fileName,
                sharedUrl: `https://example.com/shared/${service}/${encodeURIComponent(path)}`
            });
        } else {
            alert(`Fichier partagé: ${fileName} depuis ${connectedServices[service].name}`);
        }
        
        // Ajouter à la liste des fichiers récents si pas déjà présent
        const existingIndex = recentFiles.findIndex(f => f.service === service && f.path === path);
        if (existingIndex !== -1) {
            // Mettre à jour la date d'accès
            recentFiles[existingIndex].lastAccessed = new Date();
        } else {
            // Déterminer l'extension
            const extension = fileName.split('.').pop();
            
            // Ajouter à la liste
            recentFiles.push({
                name: fileName,
                path,
                service,
                extension,
                lastAccessed: new Date()
            });
        }
        
        // Mettre à jour l'affichage des fichiers récents
        loadRecentFiles();
        
        // Fermer la modale après le partage
        document.querySelector('.cloud-modal').style.display = 'none';
    }
    
    /**
     * Configure les fonctionnalités d'insertion rapide de fichiers cloud
     */
    function setupQuickCloudInsert() {
        // Configuration de Google Drive
        const quickDriveBtn = document.querySelector('.quick-drive');
        if (quickDriveBtn) {
            quickDriveBtn.addEventListener('click', function() {
                // Vérifier si le service est connecté
                if (!connectedServices['google'].connected) {
                    alert('Veuillez connecter Google Drive d\'abord.');
                    document.querySelector('.cloud-modal').style.display = 'block';
                    return;
                }
                
                // Ouvrir la modale cloud à l'onglet "Parcourir"
                document.querySelector('.cloud-modal').style.display = 'block';
                document.getElementById('cloud-service').value = 'google';
                const browseTab = document.querySelector('[data-tab="browse"]');
                if (browseTab) browseTab.click();
                
                // Changer le service
                changeCloudService('google');
                
                // Masquer le menu d'intégration rapide
                document.querySelector('.quick-integration-menu').style.display = 'none';
            });
        }
        
        // Configuration de Dropbox
        const quickDropboxBtn = document.querySelector('.quick-dropbox');
        if (quickDropboxBtn) {
            quickDropboxBtn.addEventListener('click', function() {
                // Vérifier si le service est connecté
                if (!connectedServices['dropbox'].connected) {
                    alert('Veuillez connecter Dropbox d\'abord.');
                    document.querySelector('.cloud-modal').style.display = 'block';
                    return;
                }
                
                // Ouvrir la modale cloud à l'onglet "Parcourir"
                document.querySelector('.cloud-modal').style.display = 'block';
                document.getElementById('cloud-service').value = 'dropbox';
                const browseTab = document.querySelector('[data-tab="browse"]');
                if (browseTab) browseTab.click();
                
                // Changer le service
                changeCloudService('dropbox');
                
                // Masquer le menu d'intégration rapide
                document.querySelector('.quick-integration-menu').style.display = 'none';
            });
        }
        
        // Configuration de OneDrive
        const quickOneDriveBtn = document.querySelector('.quick-onedrive');
        if (quickOneDriveBtn) {
            quickOneDriveBtn.addEventListener('click', function() {
                // Vérifier si le service est connecté
                if (!connectedServices['onedrive'].connected) {
                    alert('Veuillez connecter OneDrive d\'abord.');
                    document.querySelector('.cloud-modal').style.display = 'block';
                    return;
                }
                
                // Ouvrir la modale cloud à l'onglet "Parcourir"
                document.querySelector('.cloud-modal').style.display = 'block';
                document.getElementById('cloud-service').value = 'onedrive';
                const browseTab = document.querySelector('[data-tab="browse"]');
                if (browseTab) browseTab.click();
                
                // Changer le service
                changeCloudService('onedrive');
                
                // Masquer le menu d'intégration rapide
                document.querySelector('.quick-integration-menu').style.display = 'none';
            });
        }
    }
    
    // Fonctions publiques pour l'insertion de messages
    function insertFileMessage(fileData) {
        console.log('Insertion d\'un message de fichier partagé:', fileData);
        
        // Cette fonction serait définie dans le script principal de chat
        // Mais nous pouvons fournir une implémentation par défaut
        alert(`Fichier partagé: ${fileData.name} (${fileData.sharedUrl})`);
    }
    
    // API publique
    return {
        init,
        getConnectedServices: () => connectedServices,
        getRecentFiles: () => recentFiles,
        shareFile,
        insertFileMessage
    };
})();