class SelfDestructMessage {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.self-destruct-btn')) {
                this.showTimerModal(e.target.closest('.message'));
            }
        });
    }

    showTimerModal(message) {
        const modal = this.createModal();
        document.body.appendChild(modal);

        modal.querySelectorAll('.timer-option').forEach(option => {
            option.addEventListener('click', () => {
                const seconds = parseInt(option.dataset.time);
                this.startSelfDestruct(message, seconds);
                modal.remove();
            });
        });

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'self-destruct-modal active';
        modal.innerHTML = `
            <h3>Choisir le délai d'autodestruction</h3>
            <div class="timer-options">
                <div class="timer-option" data-time="5">5 secondes</div>
                <div class="timer-option" data-time="10">10 secondes</div>
                <div class="timer-option" data-time="30">30 secondes</div>
                <div class="timer-option" data-time="60">1 minute</div>
            </div>
            <button class="close-modal">Annuler</button>
        `;
        return modal;
    }

    startSelfDestruct(message, seconds) {
        message.classList.add('self-destruct');
        const timer = document.createElement('div');
        timer.className = 'self-destruct-timer';
        message.appendChild(timer);

        let timeLeft = seconds;
        const interval = setInterval(() => {
            timer.textContent = timeLeft;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(interval);
                message.style.animation = 'fadeOut 0.5s';
                setTimeout(() => {
                    message.remove();
                }, 500);
            }
        }, 1000);
    }
}

// Initialiser la fonctionnalité
new SelfDestructMessage();