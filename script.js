const fileInput = document.getElementById('file-input');
const audioPlayer = document.getElementById('audio-player');
const filterButton = document.getElementById('filter-button');

let audioContext;
let audioSource;
let lowPassFilter;
let isFilterActive = false;

// Initialize the Web Audio API
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioSource = audioContext.createMediaElementSource(audioPlayer);
        
        // Create the low-pass filter
        lowPassFilter = audioContext.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.value = 350; // Start with a noticeable but not extreme cutoff

        // Initially, connect the source directly to the output
        audioSource.connect(audioContext.destination);
    }
}

fileInput.addEventListener('change', function() {
    const file = this.files[0];

    if (file) {
        const objectURL = URL.createObjectURL(file);
        audioPlayer.src = objectURL;

        // It is crucial to initialize the audio context after a user interaction
        if (!audioContext) {
            initAudio();
        }

        audioPlayer.play(); 
    }
});

filterButton.addEventListener('click', () => {
    if (!audioContext) {
        // In case the user clicks the filter before loading a song
        alert("Please select a song first!");
        return;
    }

    isFilterActive = !isFilterActive;

    if (isFilterActive) {
        // Disconnect the direct path and connect through the filter
        audioSource.disconnect();
        audioSource.connect(lowPassFilter);
        lowPassFilter.connect(audioContext.destination);
        filterButton.classList.add('active');
        filterButton.textContent = 'Filter ON';
    } else {
        // Disconnect the filter path and reconnect directly
        lowPassFilter.disconnect();
        audioSource.disconnect();
        audioSource.connect(audioContext.destination);
        filterButton.classList.remove('active');
        filterButton.textContent = 'Toggle Low-Pass Filter';
    }
});
