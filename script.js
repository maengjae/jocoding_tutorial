const fileInput = document.getElementById('file-input');
const audioPlayer = document.getElementById('audio-player');

fileInput.addEventListener('change', function() {
    const file = this.files[0];

    if (file) {
        const objectURL = URL.createObjectURL(file);
        audioPlayer.src = objectURL;
        audioPlayer.play(); 
    }
});