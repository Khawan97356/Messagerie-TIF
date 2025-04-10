class AudioVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.animationId = null;
        this.isRecording = false;
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        } catch (error) {
            console.error("Erreur d'initialisation de l'AudioContext:", error);
        }
    }

    async startVisualization(stream) {
        if (!this.audioContext) await this.init();
        
        this.canvas.style.display = 'block';
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);
        
        const draw = () => {
            this.animationId = requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(this.dataArray);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#4CAF50';
            
            const barWidth = this.canvas.width / this.analyser.frequencyBinCount;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
                barHeight = (this.dataArray[i] / 255) * this.canvas.height;
                this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        
        draw();
    }

    stopVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.canvas.style.display = 'none';
        }
    }
}

// Création de l'instance du visualiseur
const visualizer = new AudioVisualizer();

// Export pour utilisation dans voice.js
window.audioVisualizer = visualizer;