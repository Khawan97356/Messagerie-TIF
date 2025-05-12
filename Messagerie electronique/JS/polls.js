document.addEventListener('DOMContentLoaded', function() {
    const infoDropdown = document.querySelector('.info-dropdown');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input[type="text"]');
    
    // Ajoutons une option "Créer un sondage" dans le menu déroulant
    const pollOption = document.createElement('li');
    pollOption.innerHTML = '<i class="bx bx-poll"></i> Créer un sondage';
    pollOption.classList.add('create-poll-btn');
    infoDropdown.querySelector('ul').appendChild(pollOption);

    // Ouvrir la modal de création de sondage
    pollOption.addEventListener('click', function() {
        infoDropdown.classList.remove('show' ,'active');
        showPollCreationModal();
    });

    // Ecouter l'evenement personnalisé pour créer un sondage
    document.addEventListener('create-poll', function() {
        showPollCreationModal();
    });

    // Fonction pour afficher la modal de création de sondage
    function showPollCreationModal() {
        // Créer la modal
        const modal = document.createElement('div');
        modal.className = 'poll-modal';
        modal.innerHTML = `
            <div class="poll-modal-content">
                <h3>Créer un sondage</h3>
                <div class="poll-form">
                    <div class="form-group">
                        <label for="poll-question">Question</label>
                        <input type="text" id="poll-question" placeholder="Posez votre question...">
                    </div>
                    <div class="poll-options-container">
                        <div class="form-group poll-option-input">
                            <label>Option 1</label>
                            <input type="text" class="poll-option" placeholder="Option 1">
                        </div>
                        <div class="form-group poll-option-input">
                            <label>Option 2</label>
                            <input type="text" class="poll-option" placeholder="Option 2">
                        </div>
                    </div>
                    <button class="add-option-btn"><i class="bx bx-plus"></i> Ajouter une option</button>
                    <div class="form-group poll-settings">
                        <label>
                            <input type="checkbox" id="multiple-choice">
                            Autoriser plusieurs choix
                        </label>
                    </div>
                    <div class="modal-buttons">
                        <button class="cancel-poll-btn">Annuler</button>
                        <button class="create-poll-btn">Créer</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Gérer les événements de la modal
        const addOptionBtn = modal.querySelector('.add-option-btn');
        const cancelBtn = modal.querySelector('.cancel-poll-btn');
        const createBtn = modal.querySelector('.create-poll-btn');
        const optionsContainer = modal.querySelector('.poll-options-container');
        
        addOptionBtn.addEventListener('click', function() {
            const optionCount = optionsContainer.children.length + 1;
            const newOption = document.createElement('div');
            newOption.className = 'form-group poll-option-input';
            newOption.innerHTML = `
                <label>Option ${optionCount}</label>
                <div class="option-input-container">
                    <input type="text" class="poll-option" placeholder="Option ${optionCount}">
                    <button class="remove-option-btn"><i class="bx bx-trash"></i></button>
                </div>
            `;
            optionsContainer.appendChild(newOption);
            
            // Ajouter la gestion de suppression d'option
            const removeBtn = newOption.querySelector('.remove-option-btn');
            removeBtn.addEventListener('click', function() {
                optionsContainer.removeChild(newOption);
                updateOptionLabels();
            });
        });
        
        // Mettre à jour les labels des options après une suppression
        function updateOptionLabels() {
            const optionInputs = optionsContainer.querySelectorAll('.poll-option-input');
            optionInputs.forEach((option, index) => {
                const label = option.querySelector('label');
                label.textContent = `Option ${index + 1}`;
                const input = option.querySelector('input');
                input.placeholder = `Option ${index + 1}`;
            });
        }
        
        // Fermer la modal
        cancelBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Créer et envoyer le sondage
        createBtn.addEventListener('click', function() {
            const question = modal.querySelector('#poll-question').value.trim();
            const optionInputs = modal.querySelectorAll('.poll-option');
            const options = Array.from(optionInputs).map(input => input.value.trim()).filter(val => val !== '');
            const multipleChoice = modal.querySelector('#multiple-choice').checked;
            
            if (question && options.length >= 2) {
                sendPoll(question, options, multipleChoice);
                document.body.removeChild(modal);
            } else {
                alert('Veuillez saisir une question et au moins deux options.');
            }
        });
    }
    
    // Fonction pour envoyer un sondage
    function sendPoll(question, options, multipleChoice) {
        const pollMessage = document.createElement('div');
        pollMessage.className = 'message sent poll-message';
        
        // Générer le HTML pour les options
        let optionsHTML = '';
        options.forEach((option, index) => {
            const inputType = multipleChoice ? 'checkbox' : 'radio';
            optionsHTML += `
                <div class="poll-option">
                    <div class="option-header">
                        <input type="${inputType}" name="poll-${Date.now()}" id="option-${Date.now()}-${index}">
                        <label for="option-${Date.now()}-${index}">${option}</label>
                        <span class="vote-count">0 votes</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: 0%;"></div>
                    </div>
                </div>
            `;
        });
        
        // Construire le message du sondage
        pollMessage.innerHTML = `
            <div class="poll-container">
                <h4 class="poll-question">${question}</h4>
                <div class="poll-options">
                    ${optionsHTML}
                </div>
                <div class="poll-footer">
                    <span class="total-votes">Total votes: 0</span>
                    <button class="end-poll-btn">Terminer le sondage</button>
                </div>
            </div>
            <div class="message-footer">
                <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div class="message-status">
                    <i class="bx bx-check"></i>
                </div>
            </div>
        `;
        
        // Ajouter le sondage aux messages
        chatMessages.appendChild(pollMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Ajouter les gestionnaires d'événements pour les votes
        setupPollInteractions(pollMessage);
    }
    
    // Configurer les interactions avec le sondage
    function setupPollInteractions(pollMessage) {
        const options = pollMessage.querySelectorAll('.poll-option input');
        const progressBars = pollMessage.querySelectorAll('.progress');
        const voteCounts = pollMessage.querySelectorAll('.vote-count');
        const totalVotesEl = pollMessage.querySelector('.total-votes');
        const endPollBtn = pollMessage.querySelector('.end-poll-btn');
        
        let totalVotes = 0;
        const votes = new Array(options.length).fill(0);
        
        // Gérer les votes
        options.forEach((option, index) => {
            option.addEventListener('change', function() {
                if (this.checked) {
                    votes[index]++;
                    totalVotes++;
                    
                    // Mettre à jour l'affichage
                    voteCounts[index].textContent = `${votes[index]} vote${votes[index] > 1 ? 's' : ''}`;
                    
                    // Mettre à jour les barres de progression
                    votes.forEach((vote, idx) => {
                        const percentage = totalVotes > 0 ? (vote / totalVotes) * 100 : 0;
                        progressBars[idx].style.width = `${percentage}%`;
                    });
                    
                    totalVotesEl.textContent = `Total votes: ${totalVotes}`;
                }
            });
        });
        
        // Terminer le sondage
        endPollBtn.addEventListener('click', function() {
            options.forEach(option => {
                option.disabled = true;
            });
            endPollBtn.textContent = 'Sondage terminé';
            endPollBtn.disabled = true;
            
            // Ajouter une classe pour indiquer que le sondage est terminé
            pollMessage.querySelector('.poll-container').classList.add('poll-ended');
        });
    }
    
    // Initialiser les sondages existants
    document.querySelectorAll('.poll-message').forEach(setupPollInteractions);
});