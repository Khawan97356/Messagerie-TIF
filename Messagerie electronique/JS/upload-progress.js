function updateProgress(progress) {
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const uploadProgress = document.querySelector('.upload-progress');
    
    uploadProgress.style.display = 'block';
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
    
    if (progress >= 100) {
        setTimeout(() => {
            uploadProgress.style.display = 'none';
            progressBar.style.width = '0%';
        }, 1000);
    }
}

function handleFileUpload(file) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    formData.append('file', file);
    
    xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            updateProgress(progress);
        }
    });
    
    xhr.upload.addEventListener('load', () => {
        updateProgress(100);
    });
    
    // Remplacer l'URL par votre endpoint de téléchargement
    xhr.open('POST', '/upload', true);
    xhr.send(formData);
}

document.getElementById('file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    for (const file of files) {
        handleFileUpload(file);
    }
});