// Fichier: ../JS/messages.js

const MESSAGES_API_URL = "http://localhost:3000/api";
let socket; // Variable pour la connexion WebSocket
let currentChatId = null; // Conversation actuellement ouverte
let lastMessageTimestamp = 0; // Pour le chargement des messages plus anciens

// Initialisation de la connexion WebSocket
function initializeWebSocket() {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    socket = new WebSocket(`ws://localhost:3000?token=${token}`);
    
    socket.onopen = () => {
        console.log('Connexion WebSocket établie');
    };
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
            case 'new_message':
                // Ajouter le nouveau message à l'interface
                if (data.chatId === currentChatId) {
                    addMessageToUI(data.message);
                } else {
                    // Notification pour les conversations non ouvertes
                    showMessageNotification(data.chatId, data.message);
                }
                break;
                
            case 'message_update':
                // Mettre à jour un message modifié
                if (data.chatId === currentChatId) {
                    updateMessageInUI(data.messageId, data.content);
                }
                break;
                
            case 'message_delete':
                // Supprimer un message
                if (data.chatId === currentChatId) {
                    deleteMessageFromUI(data.messageId);
                }
                break;
                
            case 'read_receipt':
                // Mettre à jour les statuts de lecture
                updateReadStatus(data.chatId, data.messageId, data.userId);
                break;
                
            case 'typing_indicator':
                // Afficher l'indicateur de frappe
                showTypingIndicator(data.chatId, data.userId, data.isTyping);
                break;
        }
    };
    
    socket.onclose = () => {
        console.log('Connexion WebSocket fermée');
        // Tentative de reconnexion après 5 secondes
        setTimeout(initializeWebSocket, 5000);
    };
    
    socket.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
    };
}

// Fonction pour envoyer un message
async function sendMessage(chatId, content, attachments = [], replyToId = null) {
    try {
        // 1. Envoyer via API REST
        const response = await fetch(`${MESSAGES_API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId,
                content,
                attachments,
                replyToId
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de l\'envoi du message');
        }
        
        // 2. Ajouter le message à l'interface
        addMessageToUI(data.message);
        
        // 3. Réinitialiser le champ de saisie
        document.querySelector('.chat-input input[type="text"]').value = '';
        
        // 4. Cacher les prévisualisations de fichiers
        document.querySelector('.file-preview-container').style.display = 'none';
        
        return data.message;
    } catch (error) {
        console.error("Erreur d'envoi de message:", error);
        throw error;
    }
}

// Fonction pour récupérer l'historique des messages
async function loadMessageHistory(chatId, limit = 20) {
    try {
        currentChatId = chatId;
        
        const response = await fetch(`${MESSAGES_API_URL}/messages/${chatId}?limit=${limit}&before=${lastMessageTimestamp || Date.now()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors du chargement des messages');
        }
        
        // Mettre à jour le timestamp du dernier message chargé
        if (data.messages.length > 0) {
            lastMessageTimestamp = new Date(data.messages[data.messages.length - 1].timestamp).getTime();
        }
        
        // Afficher les messages dans l'interface
        displayMessages(data.messages, true);
        
        // Marquer les messages comme lus
        markMessagesAsRead(chatId);
        
        return data.messages;
    } catch (error) {
        console.error("Erreur de chargement des messages:", error);
        throw error;
    }
}

// Fonction pour charger plus de messages (scroll vers le haut)
async function loadMoreMessages() {
    if (!currentChatId) return;
    
    try {
        const response = await fetch(`${MESSAGES_API_URL}/messages/${currentChatId}?limit=20&before=${lastMessageTimestamp}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors du chargement des messages');
        }
        
        if (data.messages.length > 0) {
            // Mettre à jour le timestamp du dernier message chargé
            lastMessageTimestamp = new Date(data.messages[data.messages.length - 1].timestamp).getTime();
            
            // Afficher les messages dans l'interface
            displayMessages(data.messages, false);
        }
        
        return data.messages;
    } catch (error) {
        console.error("Erreur de chargement des messages:", error);
        throw error;
    }
}

// Fonction pour marquer des messages comme lus
async function markMessagesAsRead(chatId) {
    try {
        await fetch(`${MESSAGES_API_URL}/messages/${chatId}/read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Mettre à jour l'interface pour montrer que les messages ont été lus
        updateConversationReadStatus(chatId);
    } catch (error) {
        console.error("Erreur de marquage des messages comme lus:", error);
    }
}

// Fonction pour supprimer un message
async function deleteMessage(messageId) {
    try {
        const response = await fetch(`${MESSAGES_API_URL}/messages/${messageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la suppression du message');
        }
        
        // Supprimer le message de l'interface
        deleteMessageFromUI(messageId);
        
        return true;
    } catch (error) {
        console.error("Erreur de suppression de message:", error);
        throw error;
    }
}

// Fonction pour modifier un message
async function editMessage(messageId, newContent) {
    try {
        const response = await fetch(`${MESSAGES_API_URL}/messages/${messageId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: newContent
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la modification du message');
        }
        
        // Mettre à jour le message dans l'interface
        updateMessageInUI(messageId, newContent);
        
        return data.message;
    } catch (error) {
        console.error("Erreur de modification de message:", error);
        throw error;
    }
}

// Fonction pour envoyer un indicateur de frappe
function sendTypingIndicator(isTyping) {
    if (!socket || !currentChatId) return;
    
    socket.send(JSON.stringify({
        type: 'typing',
        chatId: currentChatId,
        isTyping
    }));
}

// Fonctions d'aide pour l'interface utilisateur

// Afficher les messages dans l'interface
function displayMessages(messages, clearFirst = false) {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    
    if (clearFirst) {
        chatMessagesContainer.innerHTML = '';
    }
    
    const scrollPosition = chatMessagesContainer.scrollTop;
    const oldHeight = chatMessagesContainer.scrollHeight;
    
    // Préparer le fragment pour meilleure performance
    const fragment = document.createDocumentFragment();
    
    // Tri des messages par date
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        fragment.appendChild(messageElement);
    });
    
    // Si on charge d'anciens messages, les ajouter au début
    if (!clearFirst) {
        chatMessagesContainer.prepend(fragment);
        // Maintenir la position de défilement
        const newHeight = chatMessagesContainer.scrollHeight;
        chatMessagesContainer.scrollTop = scrollPosition + (newHeight - oldHeight);
    } else {
        chatMessagesContainer.appendChild(fragment);
        // Défiler jusqu'en bas
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
}

// Créer un élément de message
function createMessageElement(message) {
    const messageElement = document.createElement('div');
    
    // Déterminer si c'est un message reçu ou envoyé
    const isOwn = message.senderId === getCurrentUserId(); // Fonction à définir
    messageElement.className = `message ${isOwn ? 'sent' : 'received'}`;
    messageElement.dataset.id = message.id;
    
    // Créer le contenu du message
    let messageContent = `<p>${escapeHtml(message.content)}</p>`;
    
    // Ajouter les pièces jointes s'il y en a
    if (message.attachments && message.attachments.length > 0) {
        messageContent += '<div class="attachments">';
        message.attachments.forEach(attachment => {
            if (attachment.type.startsWith('image/')) {
                messageContent += `<img src="${attachment.url}" alt="Image jointe" class="message-attachment">`;
            } else {
                messageContent += `
                    <div class="file-attachment">
                        <i class="bx bx-file"></i>
                        <span>${attachment.name}</span>
                        <a href="${attachment.url}" download="${attachment.name}" class="download-btn">
                            <i class="bx bx-download"></i>
                        </a>
                    </div>
                `;
            }
        });
        messageContent += '</div>';
    }
    
    // Ajouter les informations de temps et statut
    messageContent += `
        <div class="message-footer">
            <span class="time">${formatTime(message.timestamp)}</span>
            ${isOwn ? `
                <span class="message-status">
                    <i class="bx ${message.readBy && message.readBy.length > 0 ? 'bx-check-double' : 'bx-check'}"></i>
                </span>
            ` : ''}
        </div>
    `;
    
    // Ajouter les boutons d'action pour les messages envoyés
    if (isOwn) {
        messageContent += `
            <div class="message-actions">
                <button class="reply-btn" title="Répondre">
                    <i class="bx bx-reply"></i>
                </button>
                <button class="edit-btn" title="Modifier">
                    <i class="bx bx-edit"></i>
                </button>
                <button class="delete-btn" title="Supprimer">
                    <i class="bx bx-trash"></i>
                </button>
                <button class="forward-btn" title="Transférer">
                    <i class="bx bx-share"></i>
                </button>
            </div>
        `;
    }
    
    messageElement.innerHTML = messageContent;
    
    // Ajouter les écouteurs d'événements pour les actions
    attachMessageEventListeners(messageElement);
    
    return messageElement;
}

// Ajouter un nouveau message à l'interface
function addMessageToUI(message) {
    const chatMessagesContainer = document.querySelector('.chat-messages');
    const messageElement = createMessageElement(message);
    
    chatMessagesContainer.appendChild(messageElement);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    
    // Mettre à jour l'aperçu du dernier message dans la liste des conversations
    updateLastMessagePreview(message.chatId, message.content);
}

// Mettre à jour un message dans l'interface
function updateMessageInUI(messageId, newContent) {
    const messageElement = document.querySelector(`.message[data-id="${messageId}"]`);
    if (!messageElement) return;
    
    const contentElement = messageElement.querySelector('p');
    contentElement.textContent = newContent;
    
    // Ajouter une indication que le message a été modifié
    const timeElement = messageElement.querySelector('.time');
    if (!timeElement.textContent.includes('(modifié)')) {
        timeElement.textContent += ' (modifié)';
    }
}

// Supprimer un message de l'interface
function deleteMessageFromUI(messageId) {
    const messageElement = document.querySelector(`.message[data-id="${messageId}"]`);
    if (messageElement) {
        messageElement.remove();
    }
}

// Mettre à jour le statut de lecture
function updateReadStatus(chatId, messageId, userId) {
    if (chatId !== currentChatId) return;
    
    const messageElements = document.querySelectorAll(`.message.sent[data-id]`);
    
    messageElements.forEach(element => {
        const msgId = element.dataset.id;
        if (parseInt(msgId) <= parseInt(messageId)) {
            const statusIcon = element.querySelector('.message-status i');
            if (statusIcon) {
                statusIcon.className = 'bx bx-check-double';
            }
        }
    });
}

// Afficher l'indicateur de frappe
function showTypingIndicator(chatId, userId, isTyping) {
    if (chatId !== currentChatId) return;
    
    const typingIndicator = document.querySelector('.typing-indicator');
    
    if (isTyping) {
        typingIndicator.style.display = 'inline-block';
    } else {
        typingIndicator.style.display = 'none';
    }
}

// Mettre à jour l'aperçu du dernier message dans la liste de conversations
function updateLastMessagePreview(chatId, content) {
    const chatItem = document.querySelector(`.chat-item[data-id="${chatId}"]`);
    if (!chatItem) return;
    
    const lastMessageElement = chatItem.querySelector('.last-message');
    if (lastMessageElement) {
        lastMessageElement.textContent = content.length > 30 ? content.substr(0, 30) + '...' : content;
    }
}

// Mettre à jour le statut de lecture d'une conversation
function updateConversationReadStatus(chatId) {
    const chatItem = document.querySelector(`.chat-item[data-id="${chatId}"]`);
    if (!chatItem) return;
    
    const unreadCountElement = chatItem.querySelector('.unread-count');
    if (unreadCountElement) {
        unreadCountElement.style.display = 'none';
    }
}

// Afficher une notification pour un nouveau message
function showMessageNotification(chatId, message) {
    // Incrémenter le compteur de messages non lus
    const chatItem = document.querySelector(`.chat-item[data-id="${chatId}"]`);
    if (!chatItem) return;
    
    const unreadCountElement = chatItem.querySelector('.unread-count');
    if (unreadCountElement) {
        let count = parseInt(unreadCountElement.textContent || '0');
        unreadCountElement.textContent = count + 1;
        unreadCountElement.style.display = 'inline-block';
    }
    
    // Mettre à jour l'aperçu du dernier message
    updateLastMessagePreview(chatId, message.content);
    
    // Déplacer la conversation en haut de la liste
    const discussionsList = document.querySelector('.dicusssions');
    discussionsList.prepend(chatItem);
    
    // Notification système si supportée
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Nouveau message', {
            body: `${message.senderName}: ${message.content.substr(0, 50)}${message.content.length > 50 ? '...' : ''}`,
            icon: '/path/to/notification-icon.png'
        });
        
        notification.onclick = function() {
            window.focus();
            openChat(chatId);
        };
    }
}

// Fonctions utilitaires

// Échapper les caractères HTML pour éviter les injections XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Formater l'heure pour l'affichage
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Obtenir l'ID de l'utilisateur actuel (à implémenter selon votre système d'authentification)
function getCurrentUserId() {
    // Cette fonction doit retourner l'ID de l'utilisateur connecté
    // Par exemple, en décodant le JWT stocké dans localStorage
    return JSON.parse(atob(localStorage.getItem('authToken').split('.')[1])).userId;
}

// Attacher les écouteurs d'événements aux boutons d'action des messages
function attachMessageEventListeners(messageElement) {
    // Bouton de réponse
    const replyBtn = messageElement.querySelector('.reply-btn');
    if (replyBtn) {
        replyBtn.addEventListener('click', function() {
            const messageId = messageElement.dataset.id;
            const messageContent = messageElement.querySelector('p').textContent;
            showReplyPreview(messageId, messageContent);
        });
    }
    
    // Bouton de modification
    const editBtn = messageElement.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const messageId = messageElement.dataset.id;
            const messageContent = messageElement.querySelector('p').textContent;
            startEditingMessage(messageId, messageContent);
        });
    }
    
    // Bouton de suppression
    const deleteBtn = messageElement.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const messageId = messageElement.dataset.id;
            confirmDeleteMessage(messageId);
        });
    }
    
    // Bouton de transfert
    const forwardBtn = messageElement.querySelector('.forward-btn');
    if (forwardBtn) {
        forwardBtn.addEventListener('click', function() {
            const messageId = messageElement.dataset.id;
            const messageContent = messageElement.querySelector('p').textContent;
            showForwardDialog(messageId, messageContent);
        });
    }
}

// Afficher la prévisualisation de réponse
function showReplyPreview(messageId, content) {
    const replyPreview = document.querySelector('.reply-preview');
    const replyToText = replyPreview.querySelector('.reply-to-text');
    
    replyPreview.style.display = 'block';
    replyPreview.dataset.replyTo = messageId;
    replyToText.textContent = `En réponse à: ${content.length > 50 ? content.substr(0, 50) + '...' : content}`;
    
    // Focus sur le champ de saisie
    document.querySelector('.chat-input input[type="text"]').focus();
}

// Commencer l'édition d'un message
function startEditingMessage(messageId, content) {
    const inputField = document.querySelector('.chat-input input[type="text"]');
    
    // Sauvegarder l'état actuel si nécessaire
    if (!inputField.dataset.editing && inputField.value) {
        inputField.dataset.savedValue = inputField.value;
    }
    
    inputField.value = content;
    inputField.dataset.editing = messageId;
    inputField.focus();
    
    // Changer l'apparence du bouton d'envoi
    const sendButton = document.querySelector('.send-message-btn');
    sendButton.innerHTML = '<i class="bx bx-check"></i>';
    sendButton.title = 'Enregistrer les modifications';
    
    // Ajouter un bouton d'annulation
    if (!document.querySelector('.cancel-edit-btn')) {
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-edit-btn';
        cancelButton.innerHTML = '<i class="bx bx-x"></i>';
        cancelButton.title = 'Annuler les modifications';
        
        cancelButton.addEventListener('click', function() {
            cancelEditingMessage();
        });
        
        document.querySelector('.chat-input').insertBefore(cancelButton, sendButton);
    }
}

// Annuler l'édition d'un message
function cancelEditingMessage() {
    const inputField = document.querySelector('.chat-input input[type="text"]');
    
    // Restaurer la valeur sauvegardée si elle existe
    if (inputField.dataset.savedValue) {
        inputField.value = inputField.dataset.savedValue;
        delete inputField.dataset.savedValue;
    } else {
        inputField.value = '';
    }
    
    delete inputField.dataset.editing;
    
    // Restaurer l'apparence du bouton d'envoi
    const sendButton = document.querySelector('.send-message-btn');
    sendButton.innerHTML = '<i class="bx bx-send"></i>';
    sendButton.title = 'Envoyer le message';
    
    // Supprimer le bouton d'annulation
    const cancelButton = document.querySelector('.cancel-edit-btn');
    if (cancelButton) {
        cancelButton.remove();
    }
}

// Confirmer la suppression d'un message
function confirmDeleteMessage(messageId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
        deleteMessage(messageId);
    }
}

// Afficher le dialogue de transfert de message
function showForwardDialog(messageId, content) {
    // Créer le dialogue pour sélectionner les destinataires
    // Cette implémentation dépend de votre interface utilisateur
    alert('Fonctionnalité de transfert à implémenter');
}

// Ouvrir une conversation
function openChat(chatId) {
    // Réinitialiser l'état actuel
    currentChatId = null;
    lastMessageTimestamp = 0;
    
    // Charger les messages de la conversation
    loadMessageHistory(chatId);
    
    // Mettre à jour l'interface utilisateur
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const chatItem = document.querySelector(`.chat-item[data-id="${chatId}"]`);
    if (chatItem) {
        chatItem.classList.add('active');
    }
    
    // Afficher le conteneur de discussion
    document.querySelector('.chat-box').style.display = 'flex';
}

// Initialiser le système de messages
function initializeMessageSystem() {
    // Initialiser WebSocket
    initializeWebSocket();
    
    // Gérer le bouton d'envoi de message
    const sendButton = document.querySelector('.send-message-btn');
    const inputField = document.querySelector('.chat-input input[type="text"]');
    
    sendButton.addEventListener('click', () => {
        const message = inputField.value.trim();
        if (!message) return;
        
        if (inputField.dataset.editing) {
            // Mode édition
            editMessage(inputField.dataset.editing, message)
                .then(() => {
                    cancelEditingMessage();
                })
                .catch(error => {
                    alert('Erreur lors de la modification du message: ' + error.message);
                });
        } else {
            // Nouveau message
            const replyPreview = document.querySelector('.reply-preview');
            const replyToId = replyPreview.style.display !== 'none' ? replyPreview.dataset.replyTo : null;
            
            // Récupérer les pièces jointes
            const attachments = Array.from(document.querySelectorAll('.file-preview-list .file-item'))
                .map(item => ({
                    id: item.dataset.id,
                    name: item.dataset.name,
                    type: item.dataset.type,
                    url: item.dataset.url
                }));
            
            sendMessage(currentChatId, message, attachments, replyToId)
                .then(() => {
                    if (replyPreview.style.display !== 'none') {
                        replyPreview.style.display = 'none';
                    }
                })
                .catch(error => {
                    alert('Erreur lors de l\'envoi du message: ' + error.message);
                });
        }
    });
    
    // Gérer la saisie de texte
    inputField.addEventListener('input', () => {
        // Afficher/masquer le bouton d'envoi
        const micButton = document.querySelector('.mic-btn');
        const sendButton = document.querySelector('.send-message-btn');
        
        if (inputField.value.trim()) {
            micButton.style.display = 'none';
            sendButton.style.display = 'block';
            // Envoyer l'indicateur de frappe
            sendTypingIndicator(true);
        } else {
            micButton.style.display = 'block';
            sendButton.style.display = 'none';
            // Arrêter l'indicateur de frappe
            sendTypingIndicator(false);
        }
    });
    
    // Gérer l'envoi avec la touche Entrée
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // Gérer le clic sur une conversation
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            const chatId = item.dataset.id;
            openChat(chatId);
        });
    });
    
    // Charger plus de messages lors du défilement vers le haut
    const chatMessagesContainer = document.querySelector('.chat-messages');
    chatMessagesContainer.addEventListener('scroll', () => {
        if (chatMessagesContainer.scrollTop === 0 && currentChatId) {
            loadMoreMessages();
        }
    });
    
    // Gérer le bouton d'annulation de réponse
    const cancelReplyButton = document.querySelector('.cancel-reply');
    cancelReplyButton.addEventListener('click', () => {
        document.querySelector('.reply-preview').style.display = 'none';
    });
}

// Exporter les fonctions
window.messageSystem = {
    initializeMessageSystem,
    sendMessage,
    loadMessageHistory,
    deleteMessage,
    editMessage,
    markMessagesAsRead,
    openChat
};