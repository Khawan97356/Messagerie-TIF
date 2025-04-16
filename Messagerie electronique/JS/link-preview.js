document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.querySelector('.chat-input input[type="text"]');
    
    // Fonction pour détecter les URLs dans le texte
    function detectURLs(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex);
    }

    // Fonction pour générer la prévisualisation
    async function generateLinkPreview(url) {
        try {
            // Utilisation d'un service de prévisualisation de liens
            const response = await fetch(`https://api.linkpreview.net/?key=VOTRE_CLE_API&q=${url}`);
            const data = await response.json();

            return `
                <div class="link-preview">
                    ${data.image ? `<img src="${data.image}" alt="Aperçu du lien" class="preview-image">` : ''}
                    <div class="preview-content">
                        <h4 class="preview-title">${data.title}</h4>
                        <p class="preview-description">${data.description}</p>
                        <span class="preview-url">${data.url}</span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Erreur lors de la génération de la prévisualisation:', error);
            return '';
        }
    }

    // Écouteur d'événements pour la saisie de message
    messageInput.addEventListener('input', async () => {
        const urls = detectURLs(messageInput.value);
        if (urls) {
            const preview = await generateLinkPreview(urls[0]);
            // Afficher la prévisualisation sous la zone de saisie
            showPreview(preview);
        }
    });

    // Fonction pour afficher la prévisualisation
    function showPreview(previewHTML) {
        let previewContainer = document.querySelector('.link-preview-container');
        
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'link-preview-container';
            messageInput.parentNode.insertBefore(previewContainer, messageInput.nextSibling);
        }

        previewContainer.innerHTML = previewHTML;
    }
});

// Fonction pour envoyer le message avec la prévisualisation
async function sendMessageWithPreview(messageText) {
    const urls = detectURLs(messageText);
    let messageHTML = `
        <div class="message sent">
            <p>${messageText}</p>
            ${urls ? await generateLinkPreview(urls[0]) : ''}
            <div class="message-footer">
                <span class="time">${new Date().toLocaleTimeString()}</span>
                <span class="message-status">
                    <i class="bx bx-check"></i>
                </span>
            </div>
        </div>
    `;
    
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
}