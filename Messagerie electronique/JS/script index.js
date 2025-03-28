function setupAudioAnalysis(stream) {
    // Créer le contexte audio
    audioContext = new (window.audioContext || window.webkitAudioContext)();

    // Créer un noeud d'analyse
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    // Connecter le stream audio au noeud d'analyse
    source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    // Configurer le noeud de traitement
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    // Traiter les données audio pour obtenir le volume 
    javascriptNode.onaudioprocess = function() {
        const Array = new Uint8Array(analyser.frequencyBincount);
        analyser.getByteFrequencyData(array);

        // Calculer le volume moyen
        let values = 0;
        for (let i = 0; i < array.length; i++) {
            values += array[i];
        }

        const average = values / array.length;

        // Mettre a jour l'indicateur visuel (0-100%)
        const levelPercentage = Math.min(Math.max(average * 1.5, 0), 100);
        audioLevelBar.style.width = levelPercentage + '%';

        // Changer la couleur en fonction du niveau
        if (levelPercentage < 30) {
            audioLevelBar.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)';
        } else if (levelPercentage < 60) {
            audioLevelBar.style.background = 'linear-gradient(to right, #FFC107, #FF9800)';
        } else {
            audioLevelBar.style.background = 'linear-gradient(to right, #F44336, #E91E63)';
        }
    };
} 

document.addEventListener('DOMContentLoaded', function() {
    // Gestionnaire pour la barre latérale
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggler = document.querySelector('.sidebar-toggler');
    const menuToggler = document.querySelector('.menu-toggler');
    
    sidebarToggler.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
    
    menuToggler.addEventListener('click', function() {
        sidebar.classList.toggle('menu-active');
    });

    // Gestionnaire pour le thème sombre
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme', this.checked);
        localStorage.setItem('darkMode', this.checked);
    });
    
    // Vérifier les préférences de thème enregistrées
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    themeToggle.checked = savedDarkMode;
    document.body.classList.toggle('dark-theme', savedDarkMode);

    // Gestionnaire pour le sélecteur d'emojis
    const emojiButton = document.getElementById('emoji-button');
    const emojiPicker = document.querySelector('.emoji-picker');
    const inputField = document.querySelector('.input-field');
    
    emojiButton.addEventListener('click', function() {
        emojiPicker.classList.toggle('active');
    });
    
    // Fermer le sélecteur d'emojis si on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!emojiButton.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.classList.remove('active');
        }
    });
    
    // Insérer l'emoji sélectionné dans le champ de saisie
    const emojis = document.querySelectorAll('.emoji');
    
    emojis.forEach(emoji => {
        emoji.addEventListener('click', function() {
            inputField.value += this.textContent;
            inputField.focus();
        });
    });

    // Gestionnaire pour la liste de chat sur mobile
    const toggleChatList = document.querySelector('.toggle-chat-list');
    const chatList = document.querySelector('.chat-list');
    
    toggleChatList.addEventListener('click', function() {
        chatList.classList.toggle('active');
        this.textContent = chatList.classList.contains('active') 
            ? 'Masquer les conversations' 
            : 'Afficher les conversations';
    });

    // Simuler l'envoi de messages
    const sendButton = document.querySelector('.input-action[aria-label="Envoyer un message"]');
    const chatMessages = document.querySelector('.chat-messages');
    
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = inputField.value.trim();
        if (message) {
            // Créer un nouveau message
            const messageElement = document.createElement('div');
            messageElement.className = 'message message-sent';
            messageElement.innerHTML = `
                ${message}
                <div class="message-time">${getCurrentTime()}</div>
            `;
            
            // Ajouter le message à la conversation
            chatMessages.appendChild(messageElement);
            
            // Effacer le champ de saisie
            inputField.value = '';
            
            // Faire défiler vers le bas
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simuler une réponse après un délai aléatoire
            simulateResponse();
        }
    }
    
    function simulateResponse() {
        // Afficher l'indicateur de saisie
        const typingIndicator = document.querySelector('.typing-indicator');
        typingIndicator.style.display = 'flex';
        
        // Générer un délai aléatoire pour la réponse
        const delay = Math.floor(Math.random() * 3000) + 1000;
        
        setTimeout(() => {
            // Masquer l'indicateur de saisie
            typingIndicator.style.display = 'none';
            
            // Réponses possibles
            const responses = [
                "D'accord, je comprends.",
                "Merci pour l'information !",
                "Je vais m'en occuper immédiatement.",
                "Pouvez-vous m'en dire plus ?",
                "C'est noté, je reviens vers vous dès que possible."
            ];
            
            // Sélectionner une réponse aléatoire
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            // Créer et ajouter la réponse
            const responseElement = document.createElement('div');
            responseElement.className = 'message message-received';
            responseElement.innerHTML = `
                ${randomResponse}
                <div class="message-time">${getCurrentTime()}</div>
            `;
            
            chatMessages.appendChild(responseElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, delay);
    }
    
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    // Recherche dans la liste des conversations
    const searchInput = document.querySelector('.search-input');
    const clearSearch = document.querySelector('.clear-search');
    const chatItems = document.querySelectorAll('.chat-item');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        chatItems.forEach(item => {
            const name = item.querySelector('.chat-name').textContent.toLowerCase();
            const preview = item.querySelector('.chat-preview').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || preview.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        chatItems.forEach(item => {
            item.style.display = 'flex';
        });
    });

    // Faire défiler jusqu'au dernier message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Gestion du partage de fichiers

document.addEventListener('DOMContentLoaded', function() {
    const fileButton = document.getElementById('fileButton');
    const fileInput = document.getElementById('fileInput');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const inputField = document.querySelector('.input-field');

    // Ouvrir le selecteur de fichiers quand on clique sur le bouton d'attachement 
    fileButton.addEventListener('click', function() {
        fileInput.click();
    });

    // Traiter les fichiers sélectionnés
    fileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handlesFiles(this.files);
        }
    });

    // Configuration du drag and drop
    chatArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('drag-over');
    });

    chatArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');
    });

    chatArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');

        if (e.dataTransfer.files.length > 0) {
            handlesFiles(e.dataTransfer.files);
        }
    });

    // Fonction pour traiter les fichiers selectionnés
    function handlesFiles(files) {
        Array.from(files).forEach(file => {
            // Créer un nouveau message de fichier
            const messageElement = document.createElement('div');
            messageElement.className = 'message message-sent';

            // Afficher différement selon le type de fichier
            if (file.type.startsWith('image/')) {
                // Pour les images, créer une previsualisation
                const reader = new FileReader();
                reader.onload = function(e) {
                    messageElement.innerHTML = `
                    <div class="file-message">
                            <div class="file-preview">
                                <img src="${e.target.result}" alt="Image partagée" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                            </div>
                            <div class="file-info">
                                <div class="file-name">${file.name}</div>
                                <div class="file-size">${formatFileSize(file.size)}</div>
                            </div>
                        </div>
                        <div class="message-time">${getCurrentTime()}</div>
                    `;

                    // Ajouter le message à la conversation et faire defiler 
                    chatMessages.appendChild(messageElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;

                    // Simuler une reponse
                    simulateFileResponse(file.name);
                };
                reader.readAsDataURL(file);
            } else {
                // Pour les autres types de fichiers
                let fileIcon = getFileIcon(file.type);

                messageElement.innerHTML = `
                <div class="file-message">
                        <div class="file-icon">
                            <span class="material-symbols-rounded">${fileIcon}</span>
                        </div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${formatFileSize(file.size)}</div>
                        </div>
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                `;

                // Ajouter le message à la conversation et faire defiler 
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Simuler une reponse
                simulateFileResponse(file.name);
            }
        });

        // Réinitialiser l'input file pour permettre de selectionner à nouveau le memes fichiers
        fileInput.value = '';
    }

    // Simuler une reponse après l'envoi du fichier
    function simulateFileResponse(fileName) {
        // Afficher l'indicateur de saisie 
        typingIndicator.style.display = 'none';

        // Créer et ajouter la reponse
        const responseElement = document.createElement('div');
        responseElement.className = 'message message-received';
        responseElement.innerHTML = `
            J'ai bien reçu votre fichier "${fileName}". Merci !
                <div class="message-time">${getCurrentTime()}</div>
            `;

        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } 
    
}, 1500);


// Formatage de la taille du fichier
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' octets';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / 1048576).toFixed(1) + ' Mo';
}

// Obtenir l'icone approprié selon le type de fichier
function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'videocam';
    if (fileType.startsWith('audio/')) return 'music_note';
    if (fileType.includes('pdf')) return 'picture_as_pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'description';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'table_chart';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'slideshow';
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'folder_zip';
    return 'insert_drive_file';
}

// Fonction pour obtenir l'heure actuelle au format hh:mm
function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

const fileManagement = {
    // Apercu des fichiers 
    previewFile: (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Logique d'apercu selon le type de fichier
            console.log('Apercu du fichier:', e.target.result);
        };
        reader.readAsDataURL(file);
    },

    // Compression des image avant envoi
    compressImage: async (imageFile) => {
        // Logique de compression
        return compressedImage;       
    },

    // Organisation des fichiers par dossiers
    organizeFiles: (files) => {
        return {
            images: files.filter(f => f.type.startsWith('image')),
            documents: files.filter(f => f.type.includes('document')),
            others: files.filter(f => !f.type.startsWith('image') &&
            f.type.includes('document')) 
        };
    }
};

const notificationSystem = {
    // Gestion des mentions
    handleMention: (message) => {
        const mentions = message.match(/@(\w+)/g);
        if (mentions) {
            mentions.forEach(mention => {
                notifyUser(mention.substring(1));
            });
        }
    },

    // Notifications personnalisées 
    notificationPreferences: {
        sound: true,
        desktop: true,
        email: false,
        muteThreads: [],
        customSounds: {
            message: 'beep.mp3',
            mention: 'ping.mp3'
        }
    },

    // Programmmation des notifications
    scheduleNotification: (message, time) => {
        setTimeout(() => {
            showNotification(message);
        }, time);
    }
};

const translationSystem = {
    // Detection automatique de la langue 
    detectLanguage: (text) => {
        // Logique de detection
        return detectedLanguage;
    },

    // Traduction automatique 
    translateMessage: async (text, targetLang) => {
        try {
            // Intégration avec API de traduction
            const translated = await translateAPI(text, targetLang);
            return translated;
        } catch (error) {
            console.error('Erreur de traduction:', error);
        }
    },

    // Sauvegarde des préférences de langue
    languagePreferences: {
        userLanguage: 'fr',
        autoTranslate: true,
        excludedLanguages: []
    }
};

const statusManager = {
    statuses: {
        online: { icon: '🟢', text: 'En ligne' },
        busy: { icon: '🔴', text: 'Occupé' },
        away: { icon: '🟡', text: 'Absent' },
        inMeeting: { icon: '👥', text: 'En réunion' },
        custom: { icon: '✏️', text: 'Personnalisé' }
    },

    // Statut automatique basé sur l'activité
    autoStatus: () => {
    // Détection de l'activité
        if (isInMeeting()) return 'inMeeting';
        if (isIdle()) return 'away';
        return 'online';
    },

    // Programmation des statuts
 scheduleStatus: (status, startTime, endTime) => {
        // Logique de programmation
    }
};

const pollSystem = {
createPoll: (question, options) => {
return {
    id: Date.now(),
    question,
    options: options.map(opt => ({
        text: opt,
        votes: 0,
        voters: []
    })),
    created: new Date(),
    expires: null,
    isAnonymous: false
};
},

vote: (pollId, optionIndex, userId) => {
// Logique de vote
},

getPollResults: (pollId) => {
// Calcul et affichage des résultats
}
};

const reminderSystem = {
createReminder: (message, date, participants) => {
return {
    id: Date.now(),
    message,
    date,
    participants,
    status: 'pending',
    notifications: []
};
},

// Rappels récurrents
createRecurringReminder: (message, schedule) => {
// Logique pour les rappels récurrents
},

// Suivi des tâches
taskTracking: {
create: (task) => {},
assign: (taskId, userId) => {},
updateStatus: (taskId, status) => {},
addComment: (taskId, comment) => {}
}
};

// Désactiver le bouton d'envoi lors de la perte de connexion
function toggleSendButton() {
    const sendButton = document.querySelector('.send-button');
    if (!navigator.onLine) {
        sendButton.disabled = true;
        sendButton.title = 'Hors ligne - Vous ne pouvez pas envoyer de messages.';
    } else {
        sendButton.disabled = false;
        sendButton.title = '';
    }
}

// Écoute les changements de connectivité pour le bouton d'envoi
window.addEventListener('online', toggleSendButton);
window.addEventListener('offline', toggleSendButton);

// Initialisation
document.addEventListener('DOMContentLoaded', toggleSendButton);

// Mise en cache des données avec Service Workers 
const CACHE_NAME = 'messaging-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style/index.css',
    '/script.js',
    '/assets/logo.png'
];

// Installer le Service Worker et mettre les ressources en cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Intercepter les requêtes pour servir les fichiers en cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Mettre à jour le cache si nécessaire
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker enregistré avec succès:', registration);
        })
        .catch((error) => {
            console.error('Échec de l\'enregistrement du Service Worker:', error);
        });
}

let offlineMessages = [];

// Fonction pour sauvegarder les messages hors ligne
function saveMessageOffline(message) {
    offlineMessages.push(message);
    localStorage.setItem('offlineMessages', JSON.stringify(offlineMessages));
}

// Fonction pour synchroniser les messages une fois en ligne
function syncOfflineMessages() {
    if (navigator.onLine) {
        offlineMessages = JSON.parse(localStorage.getItem('offlineMessages')) || [];
        offlineMessages.forEach((message) => {
            // Envoyer chaque message au serveur
            sendMessageToServer(message);
        });
        // Nettoyer les messages hors ligne
        offlineMessages = [];
        localStorage.removeItem('offlineMessages');
    }
}

// Écoute les changements de connectivité pour synchroniser
window.addEventListener('online', syncOfflineMessages);

// Exemple d'envoi de message
function sendMessage(message) {
    if (navigator.onLine) {
        sendMessageToServer(message); // Fonction simulée
    } else {
        saveMessageOffline(message);
        alert('Message sauvegardé. Il sera envoyé une fois que vous serez en ligne.');
    }
}

// Fonction simulée pour envoyer un message au serveur
function sendMessageToServer(message) {
    console.log('Message envoyé au serveur:', message);
}

// Recherche en temps réel
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input'); // Champ de recherche
    const chatItems = document.querySelectorAll('.chat-item'); // Les éléments des conversations

    // Écoute l'événement "input" pour filtrer la liste
    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();

        chatItems.forEach((item) => {
            const chatName = item.querySelector('.chat-name').textContent.toLowerCase();

            // Affiche ou masque les éléments en fonction du texte recherché
            if (chatName.includes(searchText)) {
                item.style.display = 'flex'; // Affiche l'élément
            } else {
                item.style.display = 'none'; // Masque l'élément
            }
        });
    });
});

// Notifications Push

// Vérifie si le navigateur supporte les notifications
if ('Notification' in window) {
    // Demande la permission de l'utilisateur
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notifications autorisées.');
        } else {
            console.log('Notifications refusées.');
        }
    });

    // Fonction pour afficher une notification
    function showNotification(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/assets/logo.png', // Chemin vers une icône (facultatif)
            });
        }
    }

    // Exemple : déclencher une notification pour un nouveau message
    const newMessageButton = document.querySelector('.floating-button'); // Exemple de déclencheur
    newMessageButton.addEventListener('click', () => {
        showNotification('Nouveau Message', 'Vous avez reçu un nouveau message de Marie Dupont.');
    });

    // Simuler une notification automatique après 5 secondes
    setTimeout(() => {
        showNotification('Notification', 'Un événement important vient de se produire.');
    }, 5000);
}

// Gestion des réactions

    // Sélectionne tous les boutons "Ajouter une réaction" (➕)
    const addReactionButtons = document.querySelectorAll('.add-reaction');
    
    // Sélectionne tous les conteneurs de réactions disponibles
    const reactionContainers = document.querySelectorAll('.reactions-container');

    // Ajoute un gestionnaire pour afficher/masquer les réactions
    addReactionButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const container = reactionContainers[index];
            container.classList.toggle('active'); // Affiche/masque le conteneur
        });
    });

    // Gestion de l'ajout des réactions

    reactionContainers.forEach((container, index) => {
        const reactions = container.querySelectorAll('.reaction');

        reactions.forEach((reaction) => {
            reaction.addEventListener('click', () => {
                // Clone l'emoji sélectionné
                const emoji = reaction.textContent;
                const messageReactions = document.querySelectorAll('.message-reactions')[index];

                // Vérifie si la réaction existe déjà
                const existingReaction = Array.from(messageReactions.querySelectorAll('.reaction')).find(
                    (r) => r.textContent === emoji
                );

                if (existingReaction) {
                    // Si la réaction existe, augmente son compteur (ou affiche un effet)
                    const counter = existingReaction.querySelector('.reaction-counter');
                    if (counter) {
                        counter.textContent = parseInt(counter.textContent) + 1; // Augmente le compteur
                    } else {
                        // Ajoute un compteur si ce n'est pas encore fait
                        const newCounter = document.createElement('span');
                        newCounter.className = 'reaction-counter';
                        newCounter.textContent = '2';
                        existingReaction.appendChild(newCounter);
                    }
                } else {
                    // Si la réaction n'existe pas, ajoute un nouvel élément
                    const newReaction = document.createElement('div');
                    newReaction.className = 'reaction';
                    newReaction.textContent = emoji;

                    // Ajoute le nouveau bouton de réaction au conteneur des réactions du message
                    messageReactions.insertBefore(newReaction, messageReactions.querySelector('.add-reaction'));
                }

                // Cache le conteneur après avoir ajouté une réaction
                container.classList.remove('active');
            });
        });
    });

    // Ferme le conteneur de réactions si on clique en dehors
    document.addEventListener('click', (event) => {
        reactionContainers.forEach((container) => {
            if (!container.contains(event.target) && !event.target.classList.contains('add-reaction')) {
                container.classList.remove('active');
            }
        });
    });

    // Gestion des messages vocaux
document.addEventListener('DOMContentLoaded', function() {
    const voiceButton = document.getElementById('voice-message');
    const inputField = document.querySelector('.input-field');
    const chatMessages = document.querySelector('.chat-messages');
    const audioLevelContainer = document.querySelector('.audio-level-container');
    const audioLevelBar = document.querySelector('.audio-level-bar');
    
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;
    let audioContext;
    let analyser;
    let microphone;
    let javascriptNode;
    
    // Vérifier si le navigateur supporte l'API MediaRecorder
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        voiceButton.addEventListener('click', function() {
            if (!isRecording) {
                // Commencer l'enregistrement
                startRecording();
            } else {
                // Arrêter l'enregistrement
                stopRecording();
            }
        });
    } else {
        voiceButton.title = "Votre navigateur ne supporte pas l'enregistrement audio";
        voiceButton.disabled = true;
        voiceButton.style.opacity = 0.5;
    }
    
    function startRecording() {
        // Demander la permission d'accéder au microphone
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                isRecording = true;
                
                // Changer l'icône pour indiquer l'enregistrement
                voiceButton.querySelector('.material-symbols-rounded').textContent = 'stop_circle';
                voiceButton.style.color = 'var(--notification-color)';
                voiceButton.classList.add('recording');

                // afficher l'indicateur de niveau sonore
                audioLevelContainer.classList.add('active');
                
                // Créer l'enregistreur
                mediaRecorder = new MediaRecorder(stream);

                // Initialiser l'analyse audio 
                setupAudioAnalysis(stream);
                
                // Collecter les données audio
                mediaRecorder.ondataavailable = function(e) {
                    audioChunks.push(e.data);
                };
                
                // Lorsque l'enregistrement est terminé
                mediaRecorder.onstop = function() {
                    // Convertir les chunks audio en blob
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    
                    // Créer une URL pour le blob
                    const audioUrl = URL.createObjectURL(audioBlob);
                    
                    // Créer un élément audio
                    const audio = document.createElement('audio');
                    audio.src = audioUrl;
                    audio.controls = true;
                    audio.style.display = 'block';
                    audio.style.marginTop = '5px';
                    audio.style.width = '100%';
                    
                    // Créer un message avec l'audio
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message message-sent';
                    messageElement.innerHTML = `
                        Message vocal
                        <div class="message-time">${getCurrentTime()}</div>
                    `;
                    messageElement.appendChild(audio);
                    
                    // Ajouter le message à la conversation
                    chatMessages.appendChild(messageElement);
                    
                    // Faire défiler vers le bas
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Réinitialiser les variables
                    audioChunks = [];
                    
                    // Simuler une réponse après un délai
                    setTimeout(() => {
                        const responseElement = document.createElement('div');
                        responseElement.className = 'message message-received';
                        responseElement.innerHTML = `
                            J'ai bien reçu votre message vocal, je l'écouterai dès que possible !
                            <div class="message-time">${getCurrentTime()}</div>
                        `;
                        
                        chatMessages.appendChild(responseElement);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 1500);
                };
                
                // Démarrer l'enregistrement
                mediaRecorder.start();
                
                // Afficher un message de notification
                inputField.placeholder = "Enregistrement en cours...";
                inputField.disabled = true;
                
            })
            .catch(function(err) {
                console.error('Erreur lors de l\'accès au microphone:', err);
                alert('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.');
            });
    }

    function setupAudioAnalysis(stream) {
        // Créer le contexte audio
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Créer un noeud d'analyse
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        // Connecter le microphone à l'analyseur
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        // Configurer le noeud de traitement
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        // Traiter les donnés audio pour obtenir le volume 
        javascriptNode.onaudioprocess = function() {
            const Array = new Uint8Array(analyser.frequencyBincount);
            analyser.getByteFrequencyData(array);

            // Calculer le volume moyen
            let values = 0;
            for (let i = 0; i < array.length; i++) {
                values += array[i];
        }

        const average = values / array.length;

        // Mettre a jour l'indicator visuel (0-100%)
        const levelPercentage = Math.min(Math.max(average * 1.5, 0), 100);
        audioLevelBar.style.width = levelPercentage + '%';

        // Changer la couleur en fonction du niveau
        if (levelPercentage < 20) {
            audioLevelBar.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)';
        } else if (levelPercentage < 60) {
            audioLevelBar.style.background = 'linear-gradient(to right, #8BC34A, #FFC107)';
        } else {
            audioLevelBar.style.background = 'linear-gradient(to right, #FFC107, #F44336)';
        }

        };
    }
    
    function stopRecording() {
        isRecording = false;
        
        // Changer l'icône pour revenir à l'état normal
        voiceButton.querySelector('.material-symbols-rounded').textContent = 'mic';
        voiceButton.style.color = '';
        voiceButton.classList.remove('recording');

        // Masquer l'indicateur de niveau sonore
        audioLevelContainer.classList.remove('active');
        
        // Arrêter l'enregistrement
        mediaRecorder.stop();

        // Arreter l'analyse audio 
        if (javascriptNode) {
            javascriptNode.disconnect();
            microphone.disconnect();
            analyser.disconnect();
            audioContext.close();
        }
        
        // Arrêter tous les tracks du stream
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        // Réactiver le champ de saisie
        inputField.placeholder = "Écrivez votre message...";
        inputField.disabled = false;
    }
    
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
});