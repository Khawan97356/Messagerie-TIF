document.addEventListener('DOMContentLoaded', () => {
    const attachmentBtn = document.querySelector('.attachement-btn');
    const fileInput = document.querySelector('#file-input');
    const chatMessages = document.querySelector('.chat-messages');

    attachmentBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            // Vérifier la taille du fichier (limite à 5Go)
            if (file.size > 5 * 1024 * 1024 * 1024) {
                alert('Le fichier est trop volumineux. La taille maximale autorisée est de 5 Go.');
                return;
            }

            // Créer un message avec la pièce jointe
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message sent';

            let content = '';
            
            // Gérer différents types de fichiers
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    content = `
                        <div class="attachment-preview">
                            <img src="${e.target.result}" alt="${file.name}">
                            <span class="file-name">${file.name}</span>
                        </div>
                    `;
                    messageDiv.innerHTML = content + `<span class="time">${new Date().toLocaleTimeString().slice(0, 5)}</span>`;
                };
                reader.readAsDataURL(file);
            } else {
                content = `
                    <div class="attachment-file">
                        <i class="bx bx-file"></i>
                        <span class="file-name">${file.name}</span>
                    </div>
                `;
                messageDiv.innerHTML = content + `<span class="time">${new Date().toLocaleTimeString().slice(0, 5)}</span>`;
            }

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });

        // Réinitialiser l'input file
        fileInput.value = '';
    });
});