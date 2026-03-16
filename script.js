document.addEventListener('DOMContentLoaded', () => {
    const mixBtn = document.getElementById('mix-btn');
    const playerContainer = document.getElementById('player-container');
    const songUrl1 = document.getElementById('song-url-1');

    mixBtn.addEventListener('click', () => {
        const videoUrl = songUrl1.value;
        if (videoUrl) {
            const videoId = getYouTubeVideoId(videoUrl);
            if (videoId) {
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                playerContainer.innerHTML = `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                playerContainer.innerHTML = '<p>Please enter a valid YouTube video URL.</p>';
            }
        } else {
            playerContainer.innerHTML = '<p>Please enter a song URL.</p>';
        }
    });

    function getYouTubeVideoId(url) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
    }
});
