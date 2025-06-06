// Toggle sidebar
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const appName = document.querySelector('.app-name');
const navText = document.querySelectorAll('.nav-text');
const navCategory = document.querySelectorAll('.nav-category');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-collapsed');
    
    if (sidebar.classList.contains('sidebar-collapsed')) {
        appName.style.display = 'none';
        navText.forEach(text => text.style.display = 'none');
        navCategory.forEach(category => category.style.display = 'none');
    } else {
        appName.style.display = 'block';
        navText.forEach(text => text.style.display = 'block');
        navCategory.forEach(category => category.style.display = 'block');
    }
});

// Mobile navigation
const backButton = document.querySelector('.back-button');
const conversationsList = document.querySelector('.conversations');
const conversationItems = document.querySelectorAll('.conversation-item');

if (window.innerWidth <= 768) {
    conversationItems.forEach(item => {
        item.addEventListener('click', () => {
            conversationsList.classList.add('hidden');
        });
    });

    backButton.addEventListener('click', () => {
        conversationsList.classList.remove('hidden');
    });
}

// Tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Vérification de la taille de l'écran au chargement
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        backButton.classList.remove('hidden');
    }
});

// Vérification au redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        backButton.classList.remove('hidden');
    } else {
        backButton.classList.add('hidden');
        conversationsList.classList.remove('hidden');
    }
});

// Fonction pour activer/désactiver le mode sombre
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Fonction pour activer le mode édition d'un message
function enableEditMode(messageElement) {
    // Stocker le contenu original du message
    const originalContent = messageElement.childNodes[0].textContent.trim();
    
    // Créer la zone d'édition
    const editContainer = document.createElement('div');
    editContainer.className = 'message-edit-container';
    
    // Créer l'input pour éditer le message
    const editInput = document.createElement('textarea');
    editInput.className = 'message-edit-input';
    editInput.value = originalContent;
    
    // Créer les boutons d'action
    const actionButtons = document.createElement('div');
    actionButtons.className = 'message-edit-actions';
    
    // Bouton Annuler
    const cancelButton = document.createElement('button');
    cancelButton.className = 'message-edit-cancel';
    cancelButton.textContent = 'Annuler';
    
    // Bouton Enregistrer
    const saveButton = document.createElement('button');
    saveButton.className = 'message-edit-save';
    saveButton.textContent = 'Enregistrer';
    
    // Assembler les éléments
    actionButtons.appendChild(cancelButton);
    actionButtons.appendChild(saveButton);
    editContainer.appendChild(editInput);
    editContainer.appendChild(actionButtons);
    
    // Cacher le contenu original et le bouton d'édition
    Array.from(messageElement.childNodes).forEach(node => {
        if (node.nodeType === 1) { // Si c'est un élément
            node.style.display = 'none';
        }
    });
    
    // Ajouter la zone d'édition
    messageElement.appendChild(editContainer);
    
    // Mettre le focus sur l'input et placer le curseur à la fin
    editInput.focus();
    editInput.selectionStart = editInput.value.length;
    
    // Ajuster la hauteur du textarea
    editInput.style.height = 'auto';
    editInput.style.height = editInput.scrollHeight + 'px';
    
    // Gestionnaire pour le bouton Annuler
    cancelButton.addEventListener('click', function() {
        // Supprimer la zone d'édition
        messageElement.removeChild(editContainer);
        
        // Réafficher le contenu original et le bouton d'édition
        Array.from(messageElement.childNodes).forEach(node => {
            if (node.nodeType === 1) { // Si c'est un élément
                node.style.display = '';
            }
        });
    });
    
    // Gestionnaire pour le bouton Enregistrer
    saveButton.addEventListener('click', function() {
        const newContent = editInput.value.trim();
        
        if (newContent !== '' && newContent !== originalContent) {
            // Mettre à jour le contenu du message
            messageElement.childNodes[0].textContent = newContent;
            
            // Ajouter un indicateur d'édition si pas déjà présent
            if (!messageElement.querySelector('.message-edited-indicator')) {
                const editedIndicator = document.createElement('span');
                editedIndicator.className = 'message-edited-indicator';
                editedIndicator.textContent = '(modifié)';
                messageElement.appendChild(editedIndicator);
            }
            
            // Mettre à jour l'horodatage pour indiquer que le message a été modifié
            const messageThread = messageElement.closest('.message-thread');
            const timeElement = messageThread.querySelector('.message-time');
            if (timeElement && !timeElement.textContent.includes('modifié')) {
                const currentTime = new Date();
                const hours = currentTime.getHours().toString().padStart(2, '0');
                const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                timeElement.textContent = `${timeElement.textContent.split('•')[0]} • modifié à ${hours}:${minutes}`;
            }
        }
        
        // Supprimer la zone d'édition
        messageElement.removeChild(editContainer);
        
        // Réafficher le contenu du message et le bouton d'édition
        Array.from(messageElement.childNodes).forEach(node => {
            if (node.nodeType === 1 && !node.classList.contains('message-edited-indicator')) {
                node.style.display = '';
            }
        });
    });
    
    // Permettre de valider avec Entrée (Ctrl+Entrée pour nouvelle ligne)
    editInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            saveButton.click();
        }
        
        // Ajuster dynamiquement la hauteur du textarea
        setTimeout(function() {
            editInput.style.height = 'auto';
            editInput.style.height = editInput.scrollHeight + 'px';
        }, 0);
    });
}

// Ajouter le chevron et le menu d'options aux messages
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer tous les messages (envoyés et reçus)
    const messages = document.querySelectorAll('.message.incoming, .message.outgoing');
    
    // Fermer tous les menus ouverts quand on clique ailleurs
    document.addEventListener('click', function(e) {
        const openMenus = document.querySelectorAll('.message-options-menu.active');
        openMenus.forEach(menu => {
            if (!menu.contains(e.target) && !e.target.classList.contains('message-options-button')) {
                menu.classList.remove('active');
            }
        });
    });
    
    // Ajouter un bouton d'options et un menu à chaque message
    messages.forEach(message => {
        // Ne pas ajouter le bouton d'options aux messages contenant des éléments spéciaux
        if (!message.querySelector('.poll-container') && !message.querySelector('.link-preview') && 
            !message.querySelector('.thread-info') && !message.querySelector('.message-options-button')) {
            
            // Créer le bouton chevron
            const optionsButton = document.createElement('button');
            optionsButton.className = 'message-options-button';
            optionsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
            
            // Créer le menu d'options
            const optionsMenu = document.createElement('div');
            optionsMenu.className = 'message-options-menu';
            
            // Définir les options en fonction du type de message
            const isOutgoing = message.classList.contains('outgoing');
            
            // Structure des options avec icônes
            const options = [
                {
                    text: 'Répondre',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>',
                    action: () => console.log('Répondre au message')
                },
                {
                    text: 'Transférer',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 17 20 12 15 7"></polyline><path d="M4 18v-2a4 4 0 0 1 4-4h12"></path></svg>',
                    action: () => console.log('Transférer le message')
                },
                {
                    text: 'Copier',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
                    action: () => {
                        const text = message.textContent.trim();
                        navigator.clipboard.writeText(text)
                            .then(() => console.log('Texte copié'))
                            .catch(err => console.error('Erreur lors de la copie', err));
                    }
                }
            ];
            
            // Ajouter l'option "Modifier" pour les messages sortants uniquement
            if (isOutgoing) {
                options.unshift({
                    text: 'Modifier',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>',
                    action: () => enableEditMode(message)
                });
            }
            
            // Ajouter l'option "Supprimer" pour les messages sortants uniquement
            if (isOutgoing) {
                options.push({
                    text: 'Supprimer',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
                    action: () => {
                        if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
                            const messageThread = message.closest('.message-thread');
                            if (messageThread) {
                                messageThread.remove();
                            } else {
                                message.remove();
                            }
                        }
                    }
                });
            }
            
            // Ajouter les options au menu
            options.forEach(option => {
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item';
                optionItem.innerHTML = `${option.icon} ${option.text}`;
                
                // Ajouter un gestionnaire d'événement pour chaque option
                optionItem.addEventListener('click', function(e) {
                    e.stopPropagation();
                    option.action();
                    optionsMenu.classList.remove('active');
                });
                
                optionsMenu.appendChild(optionItem);
            });
            
            // Ajouter un gestionnaire d'événement pour le clic sur le bouton chevron
            optionsButton.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Fermer tous les autres menus
                const allMenus = document.querySelectorAll('.message-options-menu');
                allMenus.forEach(menu => {
                    if (menu !== optionsMenu) {
                        menu.classList.remove('active');
                    }
                });
                
                // Basculer l'affichage du menu actuel
                optionsMenu.classList.toggle('active');
            });
            
            // Ajouter le bouton et le menu au message
            message.appendChild(optionsButton);
            message.appendChild(optionsMenu);
        }
    });
    
    // Suppression du code d'ajout des boutons d'édition puisque maintenant
    // l'édition est gérée par le menu d'options pour les messages sortants
});

