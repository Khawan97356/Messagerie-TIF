// Variables globales pour l'enregistrement
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let voiceButton = null;
let audioContext;
let analyser;
let dataArray;
let animationFrame;

document.addEventListener('DOMContentLoaded', () => {
    // Trouver les éléments clés
    const composerInput = document.querySelector('.composer-input');
    const composerActionsRight = document.querySelector('.composer-actions:last-child');
    const sendButton = document.querySelector('.send-button');
    
    if (composerActionsRight && sendButton) {
        // Créer un bouton d'enregistrement vocal
        voiceButton = document.createElement('button');
        voiceButton.className = 'composer-button voice-record-btn';
        voiceButton.id = 'voiceRecordBtn';
        voiceButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
        `;
        
        // Remplacer le bouton d'envoi par le bouton vocal lorsque le champ est vide
        sendButton.parentNode.insertBefore(voiceButton, sendButton);
        
        // Gestion de la visibilité des boutons en fonction du contenu du champ
        updateButtonVisibility(composerInput.value);
        
        // Ajouter l'écouteur d'événement au bouton vocal
        voiceButton.addEventListener('click', toggleRecording);
        
        // Écouter les changements dans le champ de texte
        composerInput.addEventListener('input', () => {
            updateButtonVisibility(composerInput.value);
        });
        
        // Créer le conteneur pour la visualisation audio
        const visualizerContainer = document.createElement('div');
        visualizerContainer.className = 'audio-visualizer-container';
        visualizerContainer.innerHTML = `
            <canvas id="audioVisualizer" width="300" height="60"></canvas>
        `;
        
        // Ajouter le visualiseur à la barre de composition
        const chatComposer = document.querySelector('.chat-composer');
        if (chatComposer) {
            chatComposer.insertBefore(visualizerContainer, chatComposer.firstChild);
        }
        
        // Ajouter le style pour le bouton d'enregistrement et le visualiseur
        const style = document.createElement('style');
        style.textContent = `
            .voice-record-btn.recording {
                background-color: rgba(255, 0, 0, 0.15);
                border-radius: 50%;
                animation: pulse 1.5s infinite;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
            }
            
            .audio-visualizer-container {
                position: absolute;
                bottom: 100%;
                left: 0;
                width: 100%;
                padding: 10px;
                background: rgba(16, 185, 129, 0.1);
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                display: none;
                transition: transform 0.3s ease;
                transform-origin: bottom;
                transform: scaleY(0);
            }
            
            .audio-visualizer-container.active {
                display: block;
                transform: scaleY(1);
            }
            
            #audioVisualizer {
                width: 100%;
                height: 60px;
                display: block;
            }
        `;
        document.head.appendChild(style);
        
        // Configurer le bouton d'envoi pour qu'il envoie aussi les messages vocaux
        sendButton.addEventListener('click', () => {
            if (isRecording) {
                stopRecording();
            }
        });
    }
});

// Fonction pour mettre à jour la visibilité des boutons
function updateButtonVisibility(inputValue) {
    const sendButton = document.querySelector('.send-button');
    
    if (!voiceButton || !sendButton) return;
    
    if (inputValue.trim() === '' && !isRecording) {
        // Champ vide -> afficher le bouton vocal, cacher le bouton d'envoi
        voiceButton.style.display = 'flex';
        sendButton.style.display = 'none';
    } else {
        // Champ avec texte ou enregistrement en cours -> cacher le bouton vocal, afficher le bouton d'envoi
        voiceButton.style.display = 'none';
        sendButton.style.display = 'flex';
    }
}

async function toggleRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Créer le contexte audio pour la visualisation
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        
        // Configurer l'analyser
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Activer la visualisation
        const visualizerContainer = document.querySelector('.audio-visualizer-container');
        if (visualizerContainer) {
            visualizerContainer.classList.add('active');
        }
        
        // Lancer l'animation
        startVisualization();
        
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.start();
        
        isRecording = true;
        
        if (voiceButton) {
            voiceButton.classList.add('recording');
        }
        
        // Forcer l'affichage du bouton d'envoi pendant l'enregistrement
        updateButtonVisibility(' '); // Passer une valeur non vide pour forcer l'affichage du bouton d'envoi
        
        // Modifier le placeholder de l'input
        const composerInput = document.querySelector('.composer-input');
        if (composerInput) {
            composerInput.placeholder = "Enregistrement en cours...";
            // Désactiver l'input pendant l'enregistrement
            composerInput.disabled = true;
        }
        
        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            envoyerMessageVocal(audioBlob);
            audioChunks = [];
        };
        
    } catch (err) {
        console.error("Erreur d'accès au microphone:", err);
        alert("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
    }
}

function startVisualization() {
    const canvas = document.getElementById('audioVisualizer');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    function draw() {
        animationFrame = requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        
        ctx.clearRect(0, 0, width, height);
        
        // Dessiner les ondes
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        
        const barWidth = (width / dataArray.length) * 2.5;
        let x = 0;
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * height;
            
            // Calcul pour une courbe sinusoïdale
            const y = height - barHeight / 2;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            x += barWidth;
        }
        
        ctx.lineTo(width, height);
        ctx.fill();
        ctx.stroke();
        
        // Dessiner les points aux sommets pour un effet ondulant
        ctx.fillStyle = '#10b981';
        x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * height;
            const y = height - barHeight / 2;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            
            x += barWidth;
        }
    }
    
    draw();
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        isRecording = false;
        
        // Arrêter la visualisation
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        
        // Fermer le contexte audio
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close();
        }
        
        // Masquer le visualiseur
        const visualizerContainer = document.querySelector('.audio-visualizer-container');
        if (visualizerContainer) {
            visualizerContainer.classList.remove('active');
        }
        
        if (voiceButton) {
            voiceButton.classList.remove('recording');
        }
        
        // Réactiver l'input et réinitialiser le placeholder
        const composerInput = document.querySelector('.composer-input');
        if (composerInput) {
            composerInput.placeholder = "Écrire un message...";
            composerInput.disabled = false;
            
            // Mettre à jour la visibilité des boutons
            updateButtonVisibility(composerInput.value);
        }
        
        // Arrêter toutes les pistes
        if (mediaRecorder.stream) {
            const tracks = mediaRecorder.stream.getTracks();
            tracks.forEach(track => track.stop());
        }
    }
}

function envoyerMessageVocal(blob) {
    const audioUrl = URL.createObjectURL(blob);
    
    // Créer un message vocal selon la structure de l'application
    const messagesContainer = document.querySelector('.chat-messages');
    
    // Créer le thread de message
    const messageThread = document.createElement('div');
    messageThread.className = 'message-thread outgoing';
    
    // Créer le message lui-même
    const messageElement = document.createElement('div');
    messageElement.className = 'message outgoing';
    
    // Créer un conteneur pour l'audio avec visualisation d'onde
    const audioContainer = document.createElement('div');
    audioContainer.className = 'audio-message-container';
    
    // Créer la visualisation statique de l'onde
    const waveform = document.createElement('div');
    waveform.className = 'audio-waveform';
    
    // Générer une onde visuelle statique aléatoire
    let waveHTML = '';
    for (let i = 0; i < 30; i++) {
        const height = 10 + Math.random() * 20;
        waveHTML += `<div class="wave-bar" style="height: ${height}px"></div>`;
    }
    waveform.innerHTML = waveHTML;
    
    // Créer l'élément audio
    const audioElement = document.createElement('audio');
    audioElement.controls = true;
    audioElement.src = audioUrl;
    
    // Ajouter les éléments au conteneur
    audioContainer.appendChild(waveform);
    audioContainer.appendChild(audioElement);
    
    // Ajouter l'audio au message
    messageElement.appendChild(audioContainer);
    
    // Créer l'élément pour l'heure
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    messageTime.textContent = timeStr;
    
    // Assembler le message complet
    messageThread.appendChild(messageElement);
    messageThread.appendChild(messageTime);
    
    // Ajouter à la conversation
    messagesContainer.appendChild(messageThread);
    
    // Ajouter des styles pour l'onde audio
    const style = document.createElement('style');
    style.textContent = `
        .audio-message-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
        }
        
        .audio-waveform {
            display: flex;
            align-items: center;
            gap: 2px;
            height: 30px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 5px;
            transition: all 0.2s ease;
        }
        
        .wave-bar {
            width: 3px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 3px;
        }
        
        .audio-message-container audio {
            width: 100%;
            height: 30px;
            opacity: 0.8;
            border-radius: 20px;
        }
        
        /* Animation des barres d'onde */
        .wave-bar {
            animation: wave-animation 1.2s ease-in-out infinite;
            animation-delay: calc(var(--i, 0) * 0.1s);
        }
        
        @keyframes wave-animation {
            0%, 100% { height: 10px; }
            50% { height: 25px; }
        }
    `;
    document.head.appendChild(style);
    
    // Animer les barres d'onde
    const waveBars = messageElement.querySelectorAll('.wave-bar');
    waveBars.forEach((bar, index) => {
        bar.style.setProperty('--i', index);
    });
    
    // Faire défiler jusqu'au nouveau message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Faire jouer l'animation sur lecture
    audioElement.addEventListener('play', () => {
        waveform.classList.add('playing');
    });
    
    audioElement.addEventListener('pause', () => {
        waveform.classList.remove('playing');
    });
    
    audioElement.addEventListener('ended', () => {
        waveform.classList.remove('playing');
    });
}

// Trouver le bouton d'envoi
const composerInput = document.querySelector('.composer-input');
const sendButton = document.querySelector('.send-button');

if (composerInput && sendButton) {
        // Conserver le comportement d'envoi original
        const originalSendFunction = function(event) {
            // Ne pas exécuter notre code si l'élément cliqué n'est pas le bouton d'envoi
            if (!event.target.closest('.send-button')) return;
            
            // Vérifier s'il y a du texte à envoyer
            const messageText = composerInput.value.trim();
            
            if (messageText) {
                // Simuler l'envoi du message (ou laisser le code d'envoi d'origine fonctionner)
                // Ici nous n'interférons pas avec la logique d'envoi existante
                
                // Après que le message est envoyé, vider le champ et mettre à jour les boutons
                setTimeout(() => {
                    composerInput.value = '';
                    updateButtonVisibility('');
                }, 100);
            }
            
            // Si un enregistrement vocal est en cours, l'arrêter
            if (isRecording) {
                stopRecording();
            }
        };
        
        // Ajouter notre gestionnaire après tout autre gestionnaire existant
        document.querySelector('.chat-composer').addEventListener('click', originalSendFunction);
        
        // Permettre l'envoi en appuyant sur Entrée
        composerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });
}