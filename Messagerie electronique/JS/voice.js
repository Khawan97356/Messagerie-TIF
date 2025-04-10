let mediaRecorder;
let audioChunks = [];
const micButton = document.querySelector('.send-btn');

micButton.addEventListener('click', toggleRecording);

async function toggleRecording() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        await startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Démarrer la visualisation
        await window.audioVisualizer.startVisualization(stream);
        
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        
        micButton.classList.add('recording');
        
        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            envoyerMessageVocal(audioBlob);
            audioChunks = [];
        };
        
    } catch (err) {
        console.error("Erreur d'accès au microphone:", err);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        window.audioVisualizer.stopVisualization();
        micButton.classList.remove('recording');
        
        const tracks = mediaRecorder.stream.getTracks();
        tracks.forEach(track => track.stop());
    }
}

function envoyerMessageVocal(blob) {
    const audioUrl = URL.createObjectURL(blob);
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    messageDiv.innerHTML = `
        <audio controls>
            <source src="${audioUrl}" type="audio/wav">
        </audio>
        <span class="time">${new Date().toLocaleTimeString()}</span>
    `;
    document.querySelector('.chat-messages').appendChild(messageDiv);
}