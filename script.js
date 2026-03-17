const fileInput = document.getElementById('file-input');
const audioPlayer = document.getElementById('audio-player');
const bassBoostButton = document.getElementById('bass-boost-button');
const distortionButton = document.getElementById('distortion-button');
const filterButton = document.getElementById('filter-button');

let audioContext, audioSource, bassBoost, distortion, lowPassFilter;
let isBassBoostActive = false;
let isDistortionActive = false;
let isFilterActive = false;

// Create the audio context and nodes only once
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioSource = audioContext.createMediaElementSource(audioPlayer);

        // Bass Booster
        bassBoost = audioContext.createBiquadFilter();
        bassBoost.type = 'lowshelf';
        bassBoost.frequency.value = 100; // Boost frequencies below 100 Hz
        bassBoost.gain.value = 10;     // Boost by 10 dB

        // Distortion
        distortion = audioContext.createWaveShaper();
        distortion.curve = makeDistortionCurve(400);
        distortion.oversample = '4x';

        // Low-Pass Filter
        lowPassFilter = audioContext.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.value = 20000; // Start with a neutral value

        // Connect the nodes in a chain: Source -> Destination
        audioSource.connect(audioContext.destination);
    }
}

// This function creates the distortion effect
function makeDistortionCurve(amount) {
    let k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
}

// Reconnects the audio chain based on which effects are active
function updateAudioChain() {
    let nodes = [audioSource, bassBoost, distortion, lowPassFilter, audioContext.destination];
    let activeNodes = [audioSource];

    if (isBassBoostActive) activeNodes.push(bassBoost);
    if (isDistortionActive) activeNodes.push(distortion);
    if (isFilterActive) {
        lowPassFilter.frequency.value = 350; // Apply the muffled effect
    } else {
        lowPassFilter.frequency.value = 20000; // Neutral (no effect)
    }
    activeNodes.push(lowPassFilter); // Low-pass is always in the chain
    activeNodes.push(audioContext.destination);

    // Disconnect everything to be safe
    nodes.forEach(node => {
        try { node.disconnect(); } catch (e) { /* Already disconnected */ }
    });

    // Connect the active nodes in order
    for (let i = 0; i < activeNodes.length - 1; i++) {
        activeNodes[i].connect(activeNodes[i+1]);
    }
}

fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file);
        audioPlayer.src = objectURL;
        if (!audioContext) initAudio();
        audioPlayer.play();
    }
});

bassBoostButton.addEventListener('click', () => {
    if (!audioContext) return;
    isBassBoostActive = !isBassBoostActive;
    bassBoostButton.classList.toggle('active', isBassBoostActive);
    updateAudioChain();
});

distortionButton.addEventListener('click', () => {
    if (!audioContext) return;
    isDistortionActive = !isDistortionActive;
    distortionButton.classList.toggle('active', isDistortionActive);
    updateAudioChain();
});

filterButton.addEventListener('click', () => {
    if (!audioContext) return;
    isFilterActive = !isFilterActive;
    filterButton.classList.toggle('active', isFilterActive);
    updateAudioChain();
});
