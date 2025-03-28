const container = document.getElementById('container');
const overlayCon = document.getElementById('overlayCon');
const overlayBtn = document.getElementById('overlayBtn');

        overlayBtn.addEventListener('click', () => {
            container.classList.toggle('right-panel-active');
            
            overlayBtn.classList.remove('btnScaled');
            window.requestAnimationFrame(() => {
                overlayBtn.classList.add('btnScaled');
            });
        });

        const form = document.querySelector('form');
const email = document.querySelector('input[name="email"]');
const password = document.querySelector('input[type="password"]');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validation email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        showError(email, 'Email invalide');
        return;
    }
    
    // Validation mot de passe
    if (password.value.length < 8) {
        showError(password, 'Le mot de passe doit contenir au moins 8 caractères');
        return;
    }
});

function showError(input, message) {
    const infield = input.parentElement;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    infield.appendChild(errorDiv);
    
    // Supprimer le message après 3 secondes
    setTimeout(() => errorDiv.remove(), 3000);
}