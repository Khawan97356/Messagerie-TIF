class PollManager {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Créer un nouveau sondage
        document.querySelector('.chat-input').addEventListener('keydown', (e) => {
            if (e.key === '/' && e.target.value === '') {
                this.showPollCreationDialog();
            }
        });

        // Gérer les votes
        document.addEventListener('click', (e) => {
            if (e.target.matches('.poll-option input[type="radio"]')) {
                this.handleVote(e.target);
            }
        });

        // Terminer le sondage
        document.addEventListener('click', (e) => {
            if (e.target.matches('.end-poll-btn')) {
                this.endPoll(e.target.closest('.poll-message'));
            }
        });
    }

    showPollCreationDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'poll-creation-dialog';
        dialog.innerHTML = `
            <h3>Créer un sondage</h3>
            <input type="text" class="poll-question-input" placeholder="Votre question">
            <div class="poll-options-container">
                <input type="text" class="poll-option-input" placeholder="Option 1">
                <input type="text" class="poll-option-input" placeholder="Option 2">
            </div>
            <button class="add-option-btn">+ Ajouter une option</button>
            <div class="dialog-buttons">
                <button class="cancel-btn">Annuler</button>
                <button class="create-btn">Créer</button>
            </div>
        `;

        document.body.appendChild(dialog);
        this.setupDialogEvents(dialog);
    }

    createPollMessage(question, options) {
        const pollHTML = `
            <div class="message sent poll-message">
                <div class="poll-container">
                    <h4 class="poll-question">${question}</h4>
                    <div class="poll-options">
                        ${options.map((option, index) => `
                            <div class="poll-option">
                                <div class="option-header">
                                    <input type="radio" name="poll-${Date.now()}" id="option${index}">
                                    <label for="option${index}">${option}</label>
                                    <span class="vote-count">0 votes</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 0%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="poll-footer">
                        <span class="total-votes">0 votes totaux</span>
                        <button class="end-poll-btn">Terminer le sondage</button>
                    </div>
                </div>
                <div class="message-footer">
                    <span class="time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;

        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.insertAdjacentHTML('beforeend', pollHTML);
    }

    handleVote(radioButton) {
        const pollOption = radioButton.closest('.poll-option');
        const pollMessage = radioButton.closest('.poll-message');
        const allOptions = pollMessage.querySelectorAll('.poll-option');
        
        // Mettre à jour les votes et les pourcentages
        this.updatePollStats(pollMessage);
    }

    updatePollStats(pollMessage) {
        // Calculer et mettre à jour les statistiques du sondage
        const options = pollMessage.querySelectorAll('.poll-option');
        const totalVotes = Array.from(options).reduce((sum, option) => {
            return sum + parseInt(option.querySelector('.vote-count').textContent);
        }, 0);

        options.forEach(option => {
            const votes = parseInt(option.querySelector('.vote-count').textContent);
            const percentage = (votes / totalVotes) * 100 || 0;
            option.querySelector('.progress').style.width = `${percentage}%`;
        });

        pollMessage.querySelector('.total-votes').textContent = `${totalVotes} votes totaux`;
    }

    endPoll(pollMessage) {
        pollMessage.classList.add('ended');
        const inputs = pollMessage.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => input.disabled = true);
        pollMessage.querySelector('.end-poll-btn').remove();
    }
}

// Initialiser le gestionnaire de sondages
document.addEventListener('DOMContentLoaded', () => {
    new PollManager();
});