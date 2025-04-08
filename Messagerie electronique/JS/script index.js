let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let recordingTimer;
let startTime;

const voiceMessageBtn = document.getElementById('voice-message');
const micIcon = voiceMessageBtn.querySelector('.mic-icon');
const recordingDuration = voiceMessageBtn.querySelector('.recording-duration');

voiceMessageBtn.addEventListener('click', toggleVoiceRecording);

async function toggleVoiceRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setupAudioAnalysis(stream);
        } catch (err) {
            console.error('Erreur lors de l\'accès au micro :', err);
            alert('Impossible d\'accéder au micro. Vérifiez vos permissions.');
        }
    } else {
        stopRecording();
    }
}

function startRecording(stream) {
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        sendAudioMessage(audioBlob);
    };

    mediaRecorder.start();
    isRecording = true;
    startTime = Date.now();
    micIcon.textContent = 'stop';
    voiceMessageBtn.classList.add('recording');

    updateRecordingDuration();
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;
        micIcon.textContent = 'mic';
        voiceMessageBtn.classList.remove('recording');
        clearInterval(recordingTimer);
        recordingDuration.textContent = '';
    }
}

function updateRecordingDuration() {
    recordingTimer = setInterval(() => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        recordingDuration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function sendAudioMessage(audioBlob) {
    // Créer un élément audio pour le message
    const audioURL = URL.createObjectURL(audioBlob);
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message message-sent';
    
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = audioURL;
    
    messageContainer.appendChild(audio);
    
    // Ajouter l'heure
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    messageContainer.appendChild(timeSpan);
    
    // Ajouter le message à la conversation
    document.querySelector('.chat-messages').appendChild(messageContainer);
}



function setupAudioAnalysis(stream) {
    // Créer le contexte audio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
        const array = new Uint8Array(analyser.frequencyBinCount); // Correction ici
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
    
    if (emojiButton && emojiPicker) {
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
    }

    // Gestionnaire pour la liste de chat sur mobile
    const toggleChatList = document.querySelector('.toggle-chat-list');
    const chatList = document.querySelector('.chat-list');
    
    if (toggleChatList && chatList) {
        toggleChatList.addEventListener('click', function() {
            chatList.classList.toggle('active');
            this.textContent = chatList.classList.contains('active') 
                ? 'Masquer les conversations' 
                : 'Afficher les conversations';
        });
    }

    // Simuler l'envoi de messages
    const sendButton = document.querySelector('.input-action[aria-label="Envoyer un message"]');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (sendButton && chatMessages && inputField) {
        sendButton.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
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
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
        }
        
        // Générer un délai aléatoire pour la réponse
        const delay = Math.floor(Math.random() * 3000) + 1000;
        
        setTimeout(() => {
            // Masquer l'indicateur de saisie
            if (typingIndicator) {
                typingIndicator.style.display = 'none';
            }
            
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
    
    if (searchInput && chatItems.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            chatItems.forEach(item => {
                const name = item.querySelector('.chat-name');
                const preview = item.querySelector('.chat-preview');
                
                if (!name || !preview) return;
                
                const nameText = name.textContent.toLowerCase();
                const previewText = preview.textContent.toLowerCase();
                
                if (nameText.includes(searchTerm) || previewText.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            chatItems.forEach(item => {
                item.style.display = 'flex';
            });
        });
    }

    // Faire défiler jusqu'au dernier message
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // ============== AJOUT DU CODE DE PARTAGE DE FICHIERS ================
    
    // Gestion du partage de fichiers
    const fileButton = document.querySelector('.input-action[aria-label="Joindre un fichier"]');
    let fileInput = document.getElementById('file-input');
    const chatArea = document.querySelector('.chat-area');
    
    // Si l'input file n'existe pas, le créer
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'file-input';
        fileInput.style.display = 'none';
        fileInput.multiple = true;
        document.body.appendChild(fileInput);
    }
    
    // Ajouter le comportement au bouton de fichier
    if (fileButton) {
        fileButton.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Gérer la sélection de fichiers
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                handleFiles(files);
            }
        });
    }
    
    // Configurer le glisser-déposer
    if (chatArea) {
        chatArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            chatArea.classList.add('drag-over');
        });
        
        chatArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            chatArea.classList.remove('drag-over');
        });
        
        chatArea.addEventListener('drop', function(e) {
            e.preventDefault();
            chatArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFiles(files);
            }
        });
    }
    
    // Fonction pour traiter les fichiers sélectionnés
    function handleFiles(files) {
        if (!chatMessages) {
            console.error("Élément .chat-messages introuvable");
            return;
        }
        
        Array.from(files).forEach(file => {
            // Créer l'élément de message pour le fichier
            const messageEl = document.createElement('div');
            messageEl.className = 'message message-sent';
            
            const fileMessage = document.createElement('div');
            fileMessage.className = 'file-message';
            
            // Icône du fichier en fonction du type
            const fileIcon = document.createElement('div');
            fileIcon.className = 'file-icon';
            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-rounded';
            iconSpan.textContent = getFileIcon(file.type);
            fileIcon.appendChild(iconSpan);
            
            // Informations sur le fichier
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            
            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('div');
            fileSize.className = 'file-size';
            fileSize.textContent = formatFileSize(file.size);
            
            fileInfo.appendChild(fileName);
            fileInfo.appendChild(fileSize);
            
            // Aperçu d'image si c'est une image
            if (file.type.startsWith('image/')) {
                const preview = document.createElement('div');
                preview.className = 'file-preview';
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                preview.appendChild(img);
                fileMessage.appendChild(preview);
            }
            
            fileMessage.appendChild(fileIcon);
            fileMessage.appendChild(fileInfo);
            messageEl.appendChild(fileMessage);
            
            // Ajouter l'heure
            const timeSpan = document.createElement('span');
            timeSpan.className = 'message-time';
            timeSpan.textContent = getCurrentTime();
            messageEl.appendChild(timeSpan);
            
            // Ajouter au chat
            chatMessages.appendChild(messageEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Réinitialiser l'input de fichier
            if (fileInput) fileInput.value = "";
            
            // Simuler une réponse
            setTimeout(() => {
                simulateFileResponse(file.name);
            }, 1500);
        });
    }
    
    // Simuler une réponse après l'envoi du fichier
    function simulateFileResponse(fileName) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message message-received';
        messageEl.innerHTML = `
            J'ai bien reçu votre fichier "${fileName}". Merci !
            <div class="message-time">${getCurrentTime()}</div>
        `;
        
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Obtenir l'icône appropriée selon le type de fichier
    function getFileIcon(fileType) {
        if (fileType.startsWith('image/'))
            return 'image';
        if (fileType.startsWith('video/'))
            return 'videocam';
        if (fileType.startsWith('audio/'))
            return 'audiotrack';
        if (fileType.includes('pdf'))
            return 'picture_as_pdf';
        if (fileType.includes('word') || fileType.includes('document'))
            return 'description';
        if (fileType.includes('spreadsheet') || fileType.includes('excel'))
            return 'table_chart';
        if (fileType.includes('presentation') || fileType.includes('powerpoint'))
            return 'slideshow';
        if (fileType.includes('zip') || fileType.includes('compressed'))
            return 'folder_zip';
        return 'insert_drive_file';
    }
    
    // Formatage de la taille du fichier
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' octets';
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(1) + ' Ko';
        } else {
            return (bytes / 1048576).toFixed(1) + ' Mo';
        }
    }
});

// Gestion du partage de fichiers

