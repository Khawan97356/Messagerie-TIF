document.addEventListener('DOMContentLoaded', function() {
    const lockChatBtn = document.querySelector('.lock-chat-btn');
    const chatBox = document.querySelector('.chat-box');
    
    lockChatBtn.addEventListener('click', function() {
        if (!chatBox.classList.contains('locked')) {
            setPassword();
        } else {
            unlockChat();
        }
    });

    function setPassword() {
        const password = prompt('Définissez un mot de passe pour verrouiller la conversation:');
        if (password) {
            localStorage.setItem('chatPassword', password);
            lockChat();
        }
    }

    function lockChat() {
        chatBox.classList.add('locked');
        const messages = document.querySelector('.chat-messages');
        messages.style.filter = 'blur(5px)';
        lockChatBtn.querySelector('i').classList.replace('bx-lock-alt', 'bx-lock');
    }

    function unlockChat() {
        const password = prompt('Entrez le mot de passe pour déverrouiller la conversation:');
        if (password === localStorage.getItem('chatPassword')) {
            chatBox.classList.remove('locked');
            const messages = document.querySelector('.chat-messages');
            messages.style.filter = 'none';
            lockChatBtn.querySelector('i').classList.replace('bx-lock', 'bx-lock-alt');
        } else {
            alert('Mot de passe incorrect!');
        }
    }
});