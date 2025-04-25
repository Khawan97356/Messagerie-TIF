document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Gestion du clic sur une discussion
        const chatItems = document.querySelectorAll('.chat-item');
        const discussionsList = document.querySelector('.discussions-list');
        const chatBox = document.querySelector('.chat-box');
        
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                discussionsList.classList.add('show-chat');
                chatBox.classList.add('show-chat');
            });
        });

        // Bouton retour
        const backButton = document.createElement('button');
        backButton.className = 'back-btn';
        backButton.innerHTML = '<i class="bx bx-arrow-back"></i>';
        document.querySelector('.chat-header').prepend(backButton);

        backButton.addEventListener('click', () => {
            discussionsList.classList.remove('show-chat');
            chatBox.classList.remove('show-chat');
        });
    }
});