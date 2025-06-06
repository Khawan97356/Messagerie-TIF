/**
 * Gestion des fonctionnalités d'attachement de fichiers
 * Ce script gère les interactions pour joindre des fichiers aux messages et les envoyer
 */

// Variable pour stocker temporairement les fichiers sélectionnés
let selectedFiles = [];

document.addEventListener('DOMContentLoaded', function() {
    // Gestion de l'attachement de fichiers
    const attachFileBtn = document.getElementById('attachFileBtn');
    const fileInput = document.getElementById('fileInput');
    const sendButton = document.querySelector('.send-button');
    const composerInput = document.querySelector('.composer-input');
    
    if (attachFileBtn && fileInput && sendButton) {
        // Connecter le bouton d'attachement au sélecteur de fichier
        attachFileBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Gérer les changements quand des fichiers sont sélectionnés
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                // Stocker les fichiers sélectionnés
                selectedFiles = Array.from(this.files);
                
                // Afficher un indicateur visuel que des fichiers ont été sélectionnés
                const filesSelected = this.files.length === 1 ? 
                    '1 fichier sélectionné' : 
                    `${this.files.length} fichiers sélectionnés`;
                
                console.log(filesSelected);
                
                // Ajouter un badge visuel sur le bouton d'attachement
                const badge = document.createElement('span');
                badge.className = 'file-badge';
                badge.textContent = this.files.length;
                badge.style.position = 'absolute';
                badge.style.top = '-5px';
                badge.style.right = '-5px';
                badge.style.backgroundColor = '#4caf50';
                badge.style.color = 'white';
                badge.style.borderRadius = '50%';
                badge.style.width = '16px';
                badge.style.height = '16px';
                badge.style.fontSize = '10px';
                badge.style.display = 'flex';
                badge.style.alignItems = 'center';
                badge.style.justifyContent = 'center';
                
                // Supprimer un badge existant s'il y en a un
                const existingBadge = attachFileBtn.querySelector('.file-badge');
                if (existingBadge) {
                    attachFileBtn.removeChild(existingBadge);
                }
                
                // S'assurer que le bouton a une position relative pour le badge
                attachFileBtn.style.position = 'relative';
                attachFileBtn.appendChild(badge);
            }
        });
        
        // Gérer l'envoi du message avec les fichiers
        sendButton.addEventListener('click', function() {
            const messageText = composerInput.value.trim();
            
            // Si des fichiers sont sélectionnés ou il y a du texte, envoyer le message
            if (selectedFiles.length > 0 || messageText) {
                sendMessageWithFiles(messageText, selectedFiles);
                
                // Réinitialiser après envoi
                composerInput.value = '';
                selectedFiles = [];
                fileInput.value = '';
                
                // Supprimer le badge
                const badge = attachFileBtn.querySelector('.file-badge');
                if (badge) {
                    attachFileBtn.removeChild(badge);
                }
            }
        });
        
        // Permettre aussi l'envoi avec la touche Entrée
        composerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });
    }
});

/**
 * Envoie un message avec les fichiers joints
 * @param {string} messageText - Le texte du message
 * @param {File[]} files - Les fichiers à joindre
 */
function sendMessageWithFiles(messageText, files) {
    // Créer un nouveau message dans la conversation
    const chatMessages = document.querySelector('.chat-messages');
    const messageThread = document.createElement('div');
    messageThread.className = 'message-thread outgoing';
    
    // Créer le contenu du message
    const message = document.createElement('div');
    message.className = 'message outgoing';
    
    // Ajouter le texte du message s'il existe
    if (messageText) {
        const messageTextDiv = document.createElement('div');
        messageTextDiv.className = 'message-text';
        messageTextDiv.textContent = messageText;
        message.appendChild(messageTextDiv);
    }
    
    // Ajouter les fichiers au message
    if (files.length > 0) {
        const filesContainer = document.createElement('div');
        filesContainer.className = 'message-files';
        
        files.forEach(file => {
            const fileElement = createFileElement(file);
            filesContainer.appendChild(fileElement);
        });
        
        message.appendChild(filesContainer);
    }
    
    // Ajouter l'heure du message
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = timeString;
    
    // Assembler et ajouter le message à la conversation
    messageThread.appendChild(message);
    messageThread.appendChild(messageTime);
    
    chatMessages.appendChild(messageThread);
    
    // Faire défiler jusqu'au dernier message
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Ici, on simulerait normalement l'envoi réel au serveur
    console.log('Message envoyé avec fichiers:', { text: messageText, files: files });
}

/**
 * Crée un élément pour représenter un fichier dans le message
 * @param {File} file - Le fichier à représenter
 * @returns {HTMLElement} - L'élément représentant le fichier
 */
function createFileElement(file) {
    const fileContainer = document.createElement('div');
    fileContainer.className = 'file-item';
    fileContainer.style.display = 'flex';
    fileContainer.style.alignItems = 'center';
    fileContainer.style.padding = '8px';
    fileContainer.style.margin = '5px 0';
    fileContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
    fileContainer.style.borderRadius = '8px';
    
    // Icône du fichier
    const fileIcon = document.createElement('div');
    fileIcon.className = 'file-icon';
    fileIcon.style.marginRight = '10px';
    
    // Définir l'icône en fonction du type de fichier
    let iconSvg;
    
    if (file.type.startsWith('image/')) {
        iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>`;
    } else if (file.type.startsWith('video/')) {
        iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="7" x2="7" y2="7"></line>
            <line x1="2" y1="17" x2="7" y2="17"></line>
            <line x1="17" y1="17" x2="22" y2="17"></line>
            <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>`;
    } else {
        iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>`;
    }
    
    fileIcon.innerHTML = iconSvg;
    
    // Informations sur le fichier
    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    fileInfo.style.flex = '1';
    
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.style.fontWeight = 'bold';
    fileName.style.fontSize = '14px';
    fileName.style.whiteSpace = 'nowrap';
    fileName.style.overflow = 'hidden';
    fileName.style.textOverflow = 'ellipsis';
    fileName.style.maxWidth = '180px';
    fileName.textContent = file.name;
    
    const fileSize = document.createElement('div');
    fileSize.className = 'file-size';
    fileSize.style.fontSize = '12px';
    fileSize.style.color = '#666';
    fileSize.textContent = formatFileSize(file.size);
    
    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileSize);
    
    // Assembler le conteneur de fichier
    fileContainer.appendChild(fileIcon);
    fileContainer.appendChild(fileInfo);
    
    // Si c'est une image, ajouter une prévisualisation
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Créer la prévisualisation
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.style.maxWidth = '100%';
            preview.style.maxHeight = '200px';
            preview.style.borderRadius = '8px';
            preview.style.marginTop = '5px';
            preview.style.display = 'block';
            
            // Remplacer le conteneur de fichier par la prévisualisation
            fileContainer.innerHTML = '';
            fileContainer.style.display = 'block';
            fileContainer.appendChild(preview);
            
            // Ajouter le nom du fichier sous l'image
            const caption = document.createElement('div');
            caption.style.fontSize = '12px';
            caption.style.color = '#666';
            caption.style.marginTop = '5px';
            caption.textContent = `${file.name} (${formatFileSize(file.size)})`;
            fileContainer.appendChild(caption);
        }
        reader.readAsDataURL(file);
    }
    
    return fileContainer;
}

/**
 * Formate la taille du fichier en unités lisibles
 * @param {number} bytes - La taille en octets
 * @returns {string} - La taille formatée
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' octets';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' Mo';
    else return (bytes / 1073741824).toFixed(1) + ' Go';
}