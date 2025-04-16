document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.querySelector('.chat-input input[type="text"]');
    const mentionsList = document.querySelector('.mentions-list');

    // Liste exemple des membres du groupe
    const groupMembers = [
        { id: 1, name: 'John Doe', username: 'john' },
        { id: 2, name: 'Jane Smith', username: 'jane' },
        // Ajoutez d'autres membres ici
    ];

    chatInput.addEventListener('input', (e) => {
        const text = e.target.value;
        const lastWord = text.split(' ').pop();

        if (lastWord.startsWith('@')) {
            const search = lastWord.slice(1).toLowerCase();
            showMentionsList(search);
        } else {
            mentionsList.style.display = 'none';
        }
    });

    function showMentionsList(search) {
        const filteredMembers = groupMembers.filter(member => 
            member.name.toLowerCase().includes(search) || 
            member.username.toLowerCase().includes(search)
        );

        if (filteredMembers.length > 0) {
            const ul = mentionsList.querySelector('ul');
            ul.innerHTML = '';
            
            filteredMembers.forEach(member => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>@${member.username}</strong> - ${member.name}`;
                li.addEventListener('click', () => insertMention(member));
                ul.appendChild(li);
            });

            mentionsList.style.display = 'block';
        } else {
            mentionsList.style.display = 'none';
        }
    }

    function insertMention(member) {
        const text = chatInput.value;
        const lastIndex = text.lastIndexOf('@');
        const newText = text.slice(0, lastIndex) + `@${member.username} `;
        chatInput.value = newText;
        mentionsList.style.display = 'none';
        chatInput.focus();
    }
});