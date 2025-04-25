class GroupVideoCall {
    constructor() {
        this.peers = new Map(); // Stock les connexions peer-to-peer
        this.localStream = null;
        this.room = null;
        this.peerConnections = {};
        
        // Configuration STUN/TURN pour WebRTC
        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                // Ajoutez vos serveurs TURN ici
            ]
        };

        this.bindEvents();
    }

    bindEvents() {
        const startCallBtn = document.querySelector('.start-group-call');
        const endCallBtn = document.querySelector('.end-call');
        const videoGrid = document.querySelector('.video-grid');

        startCallBtn?.addEventListener('click', () => this.startCall());
        endCallBtn?.addEventListener('click', () => this.endCall());
    }

    async startCall() {
        try {
            // Obtenir le flux vidéo local
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            // Afficher la vidéo locale
            this.displayVideo(this.localStream, 'local');
            
            // Créer ou rejoindre une salle
            this.joinRoom();

        } catch (error) {
            console.error('Erreur lors du démarrage de l\'appel:', error);
        }
    }

    displayVideo(stream, peerId) {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.id = `video-${peerId}`;
        video.autoplay = true;
        video.playsInline = true;
        if (peerId === 'local') video.muted = true;

        const nameTag = document.createElement('div');
        nameTag.className = 'name-tag';
        nameTag.textContent = peerId === 'local' ? 'Vous' : `Participant ${peerId}`;

        videoContainer.appendChild(video);
        videoContainer.appendChild(nameTag);
        document.querySelector('.video-grid').appendChild(videoContainer);
    }

    async joinRoom() {
        // Implémentez ici la logique de signalement (WebSocket ou autre)
        // pour connecter les participants
    }

    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        // Fermer toutes les connexions peer
        for (let [peerId, pc] of this.peers) {
            pc.close();
            this.peers.delete(peerId);
        }

        // Nettoyer l'interface
        document.querySelector('.video-grid').innerHTML = '';
        document.querySelector('.call-controls').style.display = 'none';
    }
}

// Initialiser
new GroupVideoCall();