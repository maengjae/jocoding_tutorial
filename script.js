const fileInput = document.getElementById('file-input');
const vocalsVolume = document.getElementById('vocals-volume');
const bassVolume = document.getElementById('bass-volume');
const drumsVolume = document.getElementById('drums-volume');
const otherVolume = document.getElementById('other-volume');
const vocalsAudio = document.getElementById('vocals-audio');
const bassAudio = document.getElementById('bass-audio');
const drumsAudio = document.getElementById('drums-audio');
const otherAudio = document.getElementById('other-audio');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');

const spleeter = new Spleeter();

fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const { vocals, bass, drums, other } = await spleeter.separate(file);
        vocalsAudio.src = URL.createObjectURL(vocals);
        bassAudio.src = URL.createObjectURL(bass);
        drumsAudio.src = URL.createObjectURL(drums);
        otherAudio.src = URL.createObjectURL(other);
    }
});

function setVolume(audio, volume) {
    audio.volume = volume;
}

vocalsVolume.addEventListener('input', (event) => {
    setVolume(vocalsAudio, event.target.value);
});

bassVolume.addEventListener('input', (event) => {
    setVolume(bassAudio, event.target.value);
});

drumsVolume.addEventListener('input', (event) => {
    setVolume(drumsAudio, event.target.value);
});

otherVolume.addEventListener('input', (event) => {
    setVolume(otherAudio, event.target.value);
});

playButton.addEventListener('click', () => {
    vocalsAudio.play();
    bassAudio.play();
    drumsAudio.play();
    otherAudio.play();
});

pauseButton.addEventListener('click', () => {
    vocalsAudio.pause();
    bassAudio.pause();
    drumsAudio.pause();
    otherAudio.pause();
});