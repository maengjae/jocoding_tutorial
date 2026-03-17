
const track1Input = document.getElementById('track1');
const track2Input = document.getElementById('track2');
const mixButton = document.getElementById('mix-button');
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');
const crossfader = document.getElementById('crossfader');
const track1Info = document.getElementById('track1-info');
const track2Info = document.getElementById('track2-info');
const aiTransitionButton = document.getElementById('ai-transition-button');

// Effects controls
const filter1Slider = document.getElementById('filter1');
const filter2Slider = document.getElementById('filter2');
const reverb1Button = document.getElementById('reverb1');
const delay1Button = document.getElementById('delay1');
const reverb2Button = document.getElementById('reverb2');
const delay2Button = document.getElementById('delay2');

let essentia;
let player1, player2, crossfade, filter1, filter2, reverb, delay;

// --- INITIALIZATION ---
// Disable the main button until the AI engine is ready
mixButton.disabled = true;
mixButton.textContent = 'Loading AI Engine...';

new EssentiaWASM().then(function(WasmModule) {
    essentia = new Essentia(WasmModule);
    console.log('Essentia.js WASM module loaded successfully.');
    // Now that Essentia is loaded, enable the main button
    mixButton.disabled = false;
    mixButton.textContent = 'Load & Sync';
}).catch(function(error) {
    console.error('Failed to load Essentia.js WASM module:', error);
    mixButton.textContent = 'AI Engine Failed to Load';
    alert('Critical error: The audio analysis engine could not be loaded. Please refresh the page.');
});

// --- EVENT LISTENERS ---

track1Input.addEventListener('change', () => {
    const track1 = track1Input.files[0];
    if (track1) {
        track1Info.textContent = track1.name;
    }
});

track2Input.addEventListener('change', () => {
    const track2 = track2Input.files[0];
    if (track2) {
        track2Info.textContent = track2.name;
    }
});

mixButton.addEventListener('click', async () => {
    const track1 = track1Input.files[0];
    const track2 = track2Input.files[0];

    if (track1 && track2) {
        track1Info.textContent = `Loading: ${track1.name}...`;
        track2Info.textContent = `Loading: ${track2.name}...`;
        await loadAndSync(track1, track2);
    } else {
        alert('Please select two audio files.');
    }
});

playButton.addEventListener('click', () => {
    if (player1 && player2) {
        Tone.start();
        Tone.Transport.start();
    }
});

stopButton.addEventListener('click', () => {
    if (player1 && player2) {
        Tone.Transport.stop();
    }
});

crossfader.addEventListener('input', () => {
    if (crossfade) {
        crossfade.fade.value = crossfader.value;
    }
});

aiTransitionButton.addEventListener('click', async () => {
    alert("AI Transition coming soon!");
});


// --- EFFECTS LISTENERS ---
filter1Slider.addEventListener('input', () => {
    if(filter1) filter1.frequency.value = filter1Slider.value;
});

filter2Slider.addEventListener('input', () => {
    if(filter2) filter2.frequency.value = filter2Slider.value;
});

reverb1Button.addEventListener('click', () => toggleEffect(reverb, player1, reverb1Button));
delay1Button.addEventListener('click', () => toggleEffect(delay, player1, delay1Button));
reverb2Button.addEventListener('click', () => toggleEffect(reverb, player2, reverb2Button));
delay2Button.addEventListener('click', () => toggleEffect(delay, player2, delay2Button));


// --- CORE FUNCTIONS ---

async function loadAndSync(file1, file2) {
    try {
        console.log("Starting track loading and syncing...");
        if (player1) player1.dispose();
        if (player2) player2.dispose();
        if (crossfade) crossfade.dispose();
        if (filter1) filter1.dispose();
        if (filter2) filter2.dispose();
        if (reverb) reverb.dispose();
        if (delay) delay.dispose();

        const url1 = URL.createObjectURL(file1);
        const url2 = URL.createObjectURL(file2);

        const buffer1 = await new Tone.Buffer(url1);
        const buffer2 = await new Tone.Buffer(url2);
        console.log("Audio buffers created.");

        const [bpm1, onsets1] = await analyzeTrack(buffer1.get());
        const [bpm2, onsets2] = await analyzeTrack(buffer2.get());
        console.log("Tracks analyzed.");

        track1Info.textContent = `${file1.name} | BPM: ${bpm1.toFixed(2)}`;
        track2Info.textContent = `${file2.name} | BPM: ${bpm2.toFixed(2)}`;

        filter1 = new Tone.Filter(10000, "lowpass").toDestination();
        filter2 = new Tone.Filter(10000, "lowpass").toDestination();
        reverb = new Tone.Reverb({ decay: 5, wet: 0.5 }).toDestination();
        delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

        player1 = new Tone.Player(buffer1);
        player2 = new Tone.Player(buffer2);

        crossfade = new Tone.CrossFade().toDestination();
        player1.connect(filter1).connect(crossfade.a);
        player2.connect(filter2).connect(crossfade.b);
        crossfade.fade.value = 0.5;

        const playbackRate = bpm1 / bpm2;
        player2.playbackRate = playbackRate;
        Tone.Transport.bpm.value = bpm1;

        const offset = onsets1[0] - (onsets2[0] * playbackRate);
        const player2StartTime = offset > 0 ? offset : 0;
        const player1StartTime = offset < 0 ? -offset : 0;

        await Tone.loaded();
        console.log("Tone.js loaded.");
        player1.sync().start(player1StartTime);
        player2.sync().start(player2StartTime);

        console.log('Tracks loaded, synced, and phase-aligned with effects!');
    } catch (error) {
        console.error("Error during track loading and syncing:", error);
        track1Info.textContent = `Error loading ${file1.name}`;
        track2Info.textContent = `Error loading ${file2.name}`;
        alert("There was an error loading the tracks. Please check the console for details.");
    }
}

async function analyzeTrack(audioBuffer) {
    try {
        const audioVector = essentia.audioBufferToVector(audioBuffer);
        const bpmResult = essentia.PercivalBpmEstimator(audioVector);
        const onsetsResult = essentia.OnsetDetector(audioVector);
        return [bpmResult.bpm, onsetsResult.onsets];
    } catch (error) {
        console.error("Error during track analysis:", error);
        throw error;
    }
}

function toggleEffect(effectNode, player, button) {
  if (player.fan(effectNode).length > 0) {
    player.disconnect(effectNode);
    button.classList.remove('active');
  } else {
    player.connect(effectNode);
    button.classList.add('active');
  }
}
