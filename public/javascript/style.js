const bannerText = document.querySelector('.banner h1');
if (bannerText) {
    bannerText.addEventListener('mouseenter', () => {
        bannerText.style.animation = 'glow 1.5s ease-in-out infinite alternate';
    });
    bannerText.addEventListener('mouseleave', () => {
        bannerText.style.animation = '';
    });

    // Add the keyframes to the document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes glow {
            from {
                text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
            }
            to {
                text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}