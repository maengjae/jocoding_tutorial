document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('meme-canvas');
    const ctx = canvas.getContext('2d');
    const topTextInput = document.getElementById('top-text');
    const bottomTextInput = document.getElementById('bottom-text');
    const generateBtn = document.getElementById('generate-btn');
    const galleryImages = document.querySelectorAll('.gallery-grid img');

    let selectedImage = null;

    // 1. Template Selection
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            const image = new Image();
            image.crossOrigin = "anonymous"; // To avoid CORS issues with placeholder images
            image.src = img.src;
            image.onload = () => {
                selectedImage = image;
                updateCanvas();
            };
        });
    });

    // 2. Real-time Text Update
    topTextInput.addEventListener('input', updateCanvas);
    bottomTextInput.addEventListener('input', updateCanvas);

    // 3. Generate and Download Meme
    generateBtn.addEventListener('click', () => {
        if (selectedImage) {
            const link = document.createElement('a');
            link.download = 'meme.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    });

    function updateCanvas() {
        if (!selectedImage) return;

        // Adjust canvas size to the image
        canvas.width = selectedImage.width;
        canvas.height = selectedImage.height;

        // Clear canvas and draw the image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(selectedImage, 0, 0);

        // Text styling
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.font = '36px Impact'; // Classic meme font

        // Draw top text
        const topText = topTextInput.value.toUpperCase();
        ctx.fillText(topText, canvas.width / 2, 50);
        ctx.strokeText(topText, canvas.width / 2, 50);

        // Draw bottom text
        const bottomText = bottomTextInput.value.toUpperCase();
        ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
        ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
    }
});
