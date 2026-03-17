let player;

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
function onYouTubeIframeAPIReady() {
  // The player will be created when the user clicks the play button
}

// This function is called when the user clicks the play button
document.getElementById('play-button').addEventListener('click', () => {
  const youtubeLink = document.getElementById('youtube-link').value;
  const videoId = extractVideoID(youtubeLink);

  if (videoId) {
    if (player) {
      player.loadVideoById(videoId);
    } else {
      player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'autoplay': 1,
          'loop': 1,
          'playlist': videoId, // Required for loop to work
          'iv_load_policy': 3, // Don't show video annotations
          'modestbranding': 1, // Don't show YouTube logo
          'rel': 0, // Don't show related videos
          'showinfo': 0, // Don't show video title and uploader
        },
        events: {
          'onReady': onPlayerReady
        }
      });
    }
  } else {
    alert('Please enter a valid YouTube link.');
  }
});

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// Helper function to extract the video ID from a YouTube link
function extractVideoID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
